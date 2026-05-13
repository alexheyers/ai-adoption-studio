"""Webhook-Endpoints für externe Services (ElevenLabs Voice-Events).

ElevenLabs ruft uns am Conversation-End an mit:
  - conversation_id
  - agent_id
  - transcript (vollständig, mit Sprecher-Annotation)
  - duration_seconds

Wir schreiben das in voice_sessions.transcript anhand der elevenlabs_conversation_id.

Webhook-URL für ElevenLabs Dashboard:
  https://<deploy>.example/webhooks/elevenlabs/conversation-end
  (Lokal-Test mit ngrok)
"""
import os
import json
import hashlib
import hmac
import httpx
from fastapi import APIRouter, HTTPException, Request

from agents._supabase import get_client

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_WEBHOOK_SECRET = os.getenv("ELEVENLABS_WEBHOOK_SECRET", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")  # falls vorhanden — bypass RLS für Webhook-Updates
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


def _verify_signature(payload: bytes, signature_header: str | None) -> bool:
    if not ELEVENLABS_WEBHOOK_SECRET:
        return True  # Dev-Mode: keine Signatur erforderlich
    if not signature_header:
        return False
    try:
        expected = hmac.new(ELEVENLABS_WEBHOOK_SECRET.encode(), payload, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature_header)
    except Exception:
        return False


def _update_voice_session_by_conversation(conv_id: str, transcript: str, duration: int | None) -> dict | None:
    """Findet voice_sessions per elevenlabs_conversation_id und updated transcript.

    Nutzt anon-Key + PostgREST direkt (Webhook hat keinen User-JWT). Damit das funktioniert,
    haben wir eine Service-Role-RPC oder eine spezielle RLS-Policy für Webhook-Updates.
    Fallback: wir nutzen einen REST-PATCH mit dem anon-Key — funktioniert nur wenn RLS-Policy
    "webhook_can_update_transcript" existiert.
    """
    if not SUPABASE_URL:
        return None
    key = SUPABASE_SERVICE_ROLE or SUPABASE_ANON_KEY
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    body = {
        "transcript": transcript,
        "status": "completed",
        "completed_at": "now()",
    }
    if duration is not None:
        body["duration_seconds"] = duration

    url = f"{SUPABASE_URL}/rest/v1/voice_sessions?elevenlabs_conversation_id=eq.{conv_id}"
    try:
        with httpx.Client(timeout=10.0) as cx:
            r = cx.patch(url, headers=headers, content=json.dumps(body))
            if r.status_code >= 300:
                print(f"[webhook] Supabase-PATCH fehlgeschlagen: {r.status_code} · {r.text[:200]}")
                return None
            return r.json()
    except Exception as e:
        print(f"[webhook] HTTP-Fehler: {e}")
        return None


@router.post("/elevenlabs/conversation-end")
async def elevenlabs_conversation_end(request: Request):
    """ElevenLabs ruft hier an, sobald eine Conversation beendet ist."""
    raw_body = await request.body()
    sig = request.headers.get("elevenlabs-signature") or request.headers.get("x-elevenlabs-signature")
    if not _verify_signature(raw_body, sig):
        raise HTTPException(status_code=401, detail="Invalid signature")

    try:
        payload = json.loads(raw_body.decode())
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    # Format kann variieren — wir versuchen mehrere bekannte Felder
    conv_id = (
        payload.get("conversation_id")
        or payload.get("data", {}).get("conversation_id")
        or payload.get("conversationId")
    )
    transcript = (
        payload.get("transcript")
        or payload.get("data", {}).get("transcript")
        or _format_transcript_from_messages(payload.get("messages") or payload.get("data", {}).get("messages"))
    )
    duration = (
        payload.get("duration_seconds")
        or payload.get("data", {}).get("duration_seconds")
        or payload.get("call_duration_secs")
    )

    if not conv_id:
        raise HTTPException(status_code=400, detail="conversation_id fehlt")

    result = _update_voice_session_by_conversation(conv_id, transcript or "", duration)
    return {"ok": True, "conversation_id": conv_id, "updated": bool(result)}


def _format_transcript_from_messages(messages: list | None) -> str:
    """Wenn ElevenLabs uns Messages-Array schickt, formatieren wir das als Klartext."""
    if not messages:
        return ""
    lines = []
    for m in messages:
        role = m.get("role") or m.get("speaker") or "?"
        text = m.get("message") or m.get("text") or m.get("content") or ""
        prefix = "ADA" if role.lower() in ("agent", "assistant", "ada") else "USER"
        lines.append(f"{prefix}: {text}")
    return "\n".join(lines)


@router.post("/elevenlabs/fetch-transcript")
async def fetch_transcript(request: Request):
    """Pull-Variante: Frontend ruft das auf wenn 'Jetzt analysieren' geklickt wird —
    wir holen den aktuellen Transcript-Stand von ElevenLabs API."""
    data = await request.json()
    conv_id = data.get("conversation_id")
    session_id = data.get("session_id")
    if not conv_id or not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=400, detail="conversation_id + ELEVENLABS_API_KEY benötigt")

    try:
        with httpx.Client(timeout=15.0) as cx:
            r = cx.get(
                f"https://api.elevenlabs.io/v1/convai/conversations/{conv_id}",
                headers={"xi-api-key": ELEVENLABS_API_KEY},
            )
            if r.status_code >= 300:
                raise HTTPException(status_code=502, detail=f"ElevenLabs-API: {r.status_code} · {r.text[:200]}")
            data = r.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"ElevenLabs unerreichbar: {e}")

    # Format extrahieren
    messages = data.get("transcript") or data.get("messages") or []
    transcript_text = _format_transcript_from_messages(messages) if messages else ""
    duration = data.get("metadata", {}).get("call_duration_secs") or data.get("duration_seconds")

    # In DB schreiben
    if session_id:
        _update_voice_session_by_conversation(conv_id, transcript_text, duration)

    return {
        "transcript": transcript_text,
        "duration_seconds": duration,
        "message_count": len(messages),
    }

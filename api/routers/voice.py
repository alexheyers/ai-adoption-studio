"""Voice-Interview-Endpoints: Session anlegen + Transcript persistieren.

Flow:
  1. Frontend POST /voice/start mit company_id
     → Backend baut Pre-Brief, selektiert Fragen aus Master-Pool, ruft ElevenLabs:
        - erstellt eine Conversation mit Agent "Ada"
        - injiziert Pre-Brief als initial_context
     → returnt {session_id, agent_id, conversation_id, signed_url}
  2. Frontend connectet via ElevenLabs WebRTC SDK direkt zum Agent
  3. Nach Ende: Frontend POST /voice/finish mit transcript
     → Backend speichert + extrahiert KPIs aus Transcript für Briefing-Update
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from api.auth import AuthUser, get_current_user
from api.deps import supabase_for

router = APIRouter(prefix="/voice", tags=["voice"])


class VoiceStartPayload(BaseModel):
    company_id: str


class VoiceStartResponse(BaseModel):
    session_id: str
    agent_id: str
    conversation_id: str | None = None
    signed_url: str | None = None
    pre_brief: dict
    selected_questions: list[dict]


@router.post("/start", response_model=VoiceStartResponse)
def start_voice(payload: VoiceStartPayload, user: AuthUser = Depends(get_current_user)):
    sb = supabase_for(user)

    company = sb.table("companies").select("*").eq("id", payload.company_id).maybe_single().execute()
    if not company or not company.data or company.data["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Company gehört nicht dem User")

    profile = sb.table("profiles").select("*").eq("id", user.id).maybe_single().execute()

    # Web-Research-Output (falls vorhanden) einbinden
    web_res = sb.table("web_research").select("*").eq("company_id", payload.company_id).order("created_at", desc=True).limit(1).execute()
    web_research_data = web_res.data[0] if web_res.data else None

    # Documents-Summary für Pre-Audit (kompakt)
    docs_res = sb.table("documents").select("filename, doc_type, parsed_text, extracted_kpis").eq("company_id", payload.company_id).eq("parser_status", "parsed").execute()
    documents_summary = "\n\n".join(
        f"[{d['doc_type']}] {d['filename']}:\n{(d.get('parsed_text') or '')[:3000]}"
        for d in (docs_res.data or [])
    )

    # Pre-Audit-Analyst: Hypothesen generieren BEVOR Ada spricht
    pre_audit_data: dict | None = None
    try:
        from agents.pre_audit_analyst import run as run_pre_audit
        pre_audit_output = run_pre_audit(
            company=company.data,
            documents_summary=documents_summary,
            web_research=web_research_data,
        )
        pre_audit_data = pre_audit_output.model_dump(mode="json")
    except Exception as e:
        print(f"[voice/start] Pre-Audit fehlgeschlagen: {e}")
        # Nicht fatal — Pre-Brief funktioniert auch ohne

    # Pre-Brief + Hypothesen-Bäume
    from voice.pre_brief import build_pre_brief
    from voice.elevenlabs_client import create_conversation

    pre_brief, selected_questions = build_pre_brief(
        profile=profile.data if profile and profile.data else {},
        company=company.data,
        web_research=web_research_data,
        pre_audit=pre_audit_data,
    )

    agent_id, conversation_id, signed_url = create_conversation(
        pre_brief=pre_brief,
        selected_questions=selected_questions,
        user_name=(profile.data or {}).get("full_name") if profile else None,
    )

    # Pre-Brief inkl Pre-Audit-Daten persistieren
    pre_brief_full = dict(pre_brief)
    if pre_audit_data:
        pre_brief_full["pre_audit"] = pre_audit_data

    res = sb.table("voice_sessions").insert({
        "company_id": payload.company_id,
        "user_id": user.id,
        "elevenlabs_agent_id": agent_id,
        "elevenlabs_conversation_id": conversation_id,
        "pre_brief": pre_brief_full,
        "selected_questions": selected_questions,
        "status": "in_progress",
    }).execute()

    return VoiceStartResponse(
        session_id=res.data[0]["id"],
        agent_id=agent_id,
        conversation_id=conversation_id,
        signed_url=signed_url,
        pre_brief=pre_brief,
        selected_questions=selected_questions,
    )


class VoiceFinishPayload(BaseModel):
    session_id: str
    transcript: str
    transcript_json: list[dict] | None = None
    duration_seconds: int | None = None


@router.post("/finish")
def finish_voice(payload: VoiceFinishPayload, user: AuthUser = Depends(get_current_user)):
    sb = supabase_for(user)

    session = sb.table("voice_sessions").select("*").eq("id", payload.session_id).maybe_single().execute()
    if not session or not session.data or session.data["user_id"] != user.id:
        raise HTTPException(status_code=403, detail="Session gehört nicht dem User")

    sb.table("voice_sessions").update({
        "transcript": payload.transcript,
        "transcript_json": payload.transcript_json,
        "duration_seconds": payload.duration_seconds,
        "status": "completed",
        "completed_at": "now()",
    }).eq("id", payload.session_id).execute()

    return {"status": "ok", "session_id": payload.session_id}

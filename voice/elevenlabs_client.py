"""ElevenLabs Conversational AI Client für Agent "Ada".

Nutzt das ElevenLabs Python-SDK. Wenn ELEVENLABS_AGENT_ID nicht gesetzt ist,
legt der Client beim ersten Aufruf einen Agent an und cacht die ID via .env-Datei
(soft-write, nur Hinweis im Log).

WebRTC-Flow:
  - Backend ruft create_conversation() → erhält signed_url
  - Frontend connectet direkt zu ElevenLabs via signed_url (WebRTC SDK)
  - Audio läuft Browser ↔ ElevenLabs, Backend ist nicht im Audio-Pfad
"""
import os
from typing import Any

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_AGENT_ID = os.getenv("ELEVENLABS_AGENT_ID")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")  # leer → Default

# Default-Voice für Ada: "Rachel"-ähnliche deutsche, weibliche, warme Stimme.
# ElevenLabs hat keine festen "deutsch female warm"-IDs — wir nehmen eine
# bekannte Voice ID, die im Free-Tier verfügbar ist und gut klingt.
# Alex muss ggf. im Dashboard eine Custom-Voice anlegen oder eine andere wählen.
DEFAULT_VOICE_ID = ELEVENLABS_VOICE_ID or "21m00Tcm4TlvDq8ikWAM"  # Rachel — universal


def _client():
    if not ELEVENLABS_API_KEY:
        raise RuntimeError("ELEVENLABS_API_KEY fehlt in .env")
    from elevenlabs.client import ElevenLabs
    return ElevenLabs(api_key=ELEVENLABS_API_KEY)


def _ensure_agent(system_prompt: str) -> str:
    """Stellt sicher, dass ein Agent existiert. Returnt agent_id."""
    if ELEVENLABS_AGENT_ID:
        return ELEVENLABS_AGENT_ID

    el = _client()
    try:
        # SDK-Pfad kann je nach Version variieren — wir versuchen den canonical Path.
        agent = el.conversational_ai.agents.create(
            name="Ada — AI-Adoption-Studio",
            conversation_config={
                "agent": {
                    "prompt": {
                        "prompt": system_prompt,
                        "llm": "claude-sonnet-4-6",
                    },
                    # Phase-0 Beat A als Default-Greeting mit Dynamic-Variable {{first_name}}.
                    # Pro Gespräch kann das Frontend dies via conversation-override + dynamic_variables
                    # (aus pre_brief["first_message"] / pre_brief["dynamic_variables"]) überschreiben.
                    "first_message": (
                        "Hallo und herzlich willkommen, {{first_name}}! Schön, dass du dir die Zeit nimmst. "
                        "Kurz zu mir: Ich bin Ada, die KI-Stimme aus dem AI-Adoption-Studio — also kein Mensch, "
                        "sondern dein digitaler Gesprächspartner. Unser Gespräch wird mitgeschrieben, damit das "
                        "Studio daraus deine Auswertung baut. Ist das für dich in Ordnung?"
                    ),
                    "language": "de",
                },
                "tts": {
                    "voice_id": DEFAULT_VOICE_ID,
                    "model_id": "eleven_turbo_v2_5",
                },
                "asr": {
                    "quality": "high",
                    "user_input_audio_format": "pcm_16000",
                    "language": "de",
                },
            },
        )
        agent_id = getattr(agent, "agent_id", None) or getattr(agent, "id", None)
        if not agent_id:
            raise RuntimeError(f"Konnte agent_id nicht aus Response extrahieren: {agent}")
        print(f"[elevenlabs] Agent angelegt: {agent_id} — bitte in .env als ELEVENLABS_AGENT_ID eintragen.")
        return agent_id
    except Exception as e:
        # Fallback: Wenn SDK-Pfad anders heißt, raisen wir einen klaren Fehler.
        raise RuntimeError(
            f"Agent-Erstellung über SDK fehlgeschlagen: {e}. "
            f"Bitte manuell im ElevenLabs-Dashboard einen Conversational-AI-Agent "
            f"anlegen und ID als ELEVENLABS_AGENT_ID in .env eintragen."
        )


def create_conversation(
    pre_brief: dict,
    selected_questions: list[dict],
    user_name: str | None = None,
) -> tuple[str, str | None, str | None]:
    """Erstellt eine neue Conversation für den Voice-Agent.

    Returnt (agent_id, conversation_id, signed_url).
    Frontend verwendet signed_url, um sich via WebRTC zu connecten.
    """
    if not ELEVENLABS_API_KEY:
        # Mock-Mode für lokales Dev ohne Key
        return ("mock-agent-id", "mock-conv-id", None)

    system_prompt = pre_brief.get("system_prompt", "")
    agent_id = _ensure_agent(system_prompt)

    el = _client()
    try:
        # Signed URL für direkten Browser-Connect holen
        signed = el.conversational_ai.conversations.get_signed_url(agent_id=agent_id)
        signed_url = getattr(signed, "signed_url", None) or signed.get("signed_url") if isinstance(signed, dict) else None
        return (agent_id, None, signed_url)
    except Exception as e:
        print(f"[elevenlabs] get_signed_url fehlgeschlagen ({e}) — Frontend muss Public-Agent-Mode nutzen.")
        return (agent_id, None, None)

"""Supabase-Client + Helper für Run-Persistenz.

KEIN service_role-Key nötig — wir nutzen den User-JWT für alle Operations.
RLS-Policies in Supabase greifen automatisch (User darf nur seine Daten).

Für Background-Tasks wird der User-JWT vom Aufrufer durchgereicht.
"""
import os
from supabase import create_client, Client

from schemas.briefing import Briefing
from schemas.outputs import (
    ProcessAuditOutput,
    UseCaseOutput,
    ToolRecommendationOutput,
    ROIOutput,
    FullReport,
)


def get_client(user_jwt: str | None = None) -> Client:
    """Erzeugt einen Supabase-Client. Wenn ein user_jwt übergeben wird,
    laufen alle DB- und Storage-Operationen im Namen dieses Users —
    RLS greift wie für ihn definiert.

    Ohne user_jwt: anon-Mode (kann nur public-lesbare Resourcen ansprechen).
    """
    url = os.getenv("SUPABASE_URL")
    anon = os.getenv("SUPABASE_ANON_KEY")
    if not url or not anon:
        raise RuntimeError(
            "SUPABASE_URL / SUPABASE_ANON_KEY fehlen in .env"
        )
    client = create_client(url, anon)
    if user_jwt:
        # Authorization-Header setzen, damit PostgREST den JWT als auth.uid() nimmt
        client.postgrest.auth(user_jwt)
        client.storage._client.headers["Authorization"] = f"Bearer {user_jwt}"
    return client


def get_service_client() -> Client:
    """Service-Role-Client für serverseitige Operationen, die NICHT zuverlässig im
    RLS-Kontext eines Users laufen — v.a. der Deliverable-Upload aus dem Background-Task
    (der Storage-Client lässt sich dort nicht stabil als User authentifizieren → RLS-403).
    Umgeht RLS; NUR serverseitig nutzen, Eigentum wird im API-Layer geprüft.
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY fehlen in .env")
    return create_client(url, key)


def create_run(client: Client, company_id: str, briefing: Briefing) -> str:
    """Legt einen neuen Run an und gibt die Run-ID zurück."""
    result = client.table("runs").insert({
        "company_id": company_id,
        "status": "in_progress",
        "current_step": "process_auditor",
        "briefing": briefing.model_dump(mode="json"),
    }).execute()
    return result.data[0]["id"]


def save_agent_output(
    client: Client,
    run_id: str,
    agent_name: str,
    output: dict,
) -> None:
    """Speichert den Output eines Agents als Run-Result."""
    client.table("run_results").insert({
        "run_id": run_id,
        "agent_name": agent_name,
        "output": output,
    }).execute()


def update_run_step(client: Client, run_id: str, step: str) -> None:
    client.table("runs").update({"current_step": step}).eq("id", run_id).execute()


def complete_run(client: Client, run_id: str, full_report: FullReport) -> None:
    save_agent_output(client, run_id, "full_report", full_report.model_dump(mode="json"))
    client.table("runs").update({
        "status": "completed",
        "current_step": "done",
        "completed_at": "now()",
    }).eq("id", run_id).execute()


def fail_run(client: Client, run_id: str, error: str) -> None:
    client.table("runs").update({
        "status": "failed",
        "current_step": f"failed:{error[:100]}",
    }).eq("id", run_id).execute()

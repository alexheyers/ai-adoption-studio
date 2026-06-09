"""SDK-Variante des Pipeline-Runners — feature-flag-gesteuert über USE_SDK_PIPELINE.

Führt dieselbe Multi-Agent-Pipeline aus wie `pipeline_runner.py`, aber über die
wiederverwendbare `agent_patterns`-Library auf dem **Claude Agent SDK** statt über
die alten `agents/*`-Module.

Daten-Laden, Supabase-Storage (`save_agent_output`/`update_run_step`) und die
Deliverables-Erzeugung sind 1:1 kompatibel — `_generate_and_upload_deliverables`
wird direkt aus dem bestehenden Runner wiederverwendet. Der Voice-/Interview-Agent
(ElevenLabs) ist KEIN SDK-Agent und nicht Teil dieser Pipeline.

Aktivierung: Umgebungsvariable `USE_SDK_PIPELINE=true` (siehe api/routers/run.py).
Ohne Flag bleibt der bestehende `pipeline_runner.run_pipeline_async` aktiv.
"""

from __future__ import annotations

import os
from typing import Any

from agents._supabase import get_client, save_agent_output, update_run_step, fail_run
from schemas.briefing import Briefing
from schemas.outputs import FullReport

from agent_patterns.config import DEFAULT_CONFIG_PATH
from agent_patterns.core.orchestrator import Orchestrator, PatternConfig
from agent_patterns.patterns.ai_adoption import REGISTRY

# SDK-Agent-Name -> Supabase-Output-Key (kompatibel zum bestehenden Runner).
_OUTPUT_KEY = {
    "document_analyst": "document_analysis",
    "pre_audit_analyst": "pre_audit",
}


def run_pipeline_async(run_id: str, briefing_dict: dict, user_jwt: str) -> None:
    """Synchron im Background-Task — identische Signatur wie pipeline_runner.run_pipeline_async."""
    client = get_client(user_jwt=user_jwt)
    try:
        client.table("runs").update(
            {"status": "in_progress", "current_step": "document_analyst"}
        ).eq("id", run_id).execute()

        briefing = Briefing(**briefing_dict)

        run_row = (
            client.table("runs")
            .select("company_id, voice_session_id, web_research_id")
            .eq("id", run_id).maybe_single().execute()
        )
        company_id = run_row.data["company_id"]
        company = (
            client.table("companies").select("*").eq("id", company_id).maybe_single().execute()
        ).data

        web_research_data = None
        if run_row.data.get("web_research_id"):
            wr = client.table("web_research").select("*").eq("id", run_row.data["web_research_id"]).maybe_single().execute()
            web_research_data = wr.data if wr else None

        voice_transcript = None
        if run_row.data.get("voice_session_id"):
            vs = client.table("voice_sessions").select("*").eq("id", run_row.data["voice_session_id"]).maybe_single().execute()
            voice_transcript = (vs.data or {}).get("transcript") if vs else None

        docs_res = (
            client.table("documents")
            .select("filename, doc_type, parsed_text, extracted_kpis")
            .eq("company_id", company_id).eq("parser_status", "parsed").execute()
        )
        documents = docs_res.data or []
        documents_summary = "\n\n".join(
            f"[{d['doc_type']}] {d['filename']}:\n{(d.get('parsed_text') or '')[:3000]}"
            for d in documents
        )

        # Kontext für die SDK-Pipeline (Agenten lesen briefing/company/documents/…).
        context: dict[str, Any] = {
            "briefing": briefing,
            "company": company,
            "documents": documents,
            "documents_summary": documents_summary,
            "voice_transcript": voice_transcript,
            "web_research": web_research_data,
        }

        config = PatternConfig.from_yaml(DEFAULT_CONFIG_PATH)
        orchestrator = Orchestrator(registry=REGISTRY, config=config)

        def on_step(phase: str, name: str, idx: int, total: int, result) -> None:
            if phase == "start":
                update_run_step(client, run_id, name)
            elif phase == "done" and result is not None and name != "reporter":
                key = _OUTPUT_KEY.get(name, name)
                try:
                    save_agent_output(client, run_id, key, result.output.model_dump(mode="json"))
                except Exception as exc:  # einzelner Speicherfehler darf den Lauf nicht killen
                    print(f"[pipeline-sdk] save '{name}' fehlgeschlagen: {exc}")

        results = orchestrator.run_sync(context, verbose=False, on_step=on_step)

        report: FullReport = results["reporter"].output
        save_agent_output(client, run_id, "full_report", report.model_dump(mode="json"))

        # Deliverables — Funktion aus dem bestehenden Runner wiederverwenden.
        update_run_step(client, run_id, "deliverables")
        from runs.pipeline_runner import _generate_and_upload_deliverables
        _generate_and_upload_deliverables(client, run_id, report)

        client.table("runs").update(
            {"status": "completed", "current_step": "done", "completed_at": "now()"}
        ).eq("id", run_id).execute()

    except Exception as e:
        fail_run(client, run_id, str(e))
        raise

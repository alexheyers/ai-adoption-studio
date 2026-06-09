"""Async-Wrapper für den Multi-Agent-Pipeline-Run.

Pipeline-Reihenfolge:
  0. Web-Research (optional, läuft eh schon parallel)
  1. Pre-Audit-Analyst (Hypothesen aus Daten — falls noch nicht beim Voice-Start gelaufen)
  2. Document-Analyst (Daten-Analyse separat)
  3. Process-Auditor
  4. Use-Case-Generator
  5. Tool-Recommender
  6. ROI-Calculator
  7. Compliance-Checker
  8. Roadmap-Generator
  9. Reporter

Nach Abschluss: Excel/PPTX/PDF generieren + in Storage hochladen.
"""
import os
import tempfile
import time
from pathlib import Path
from typing import Any

from agents._supabase import get_client, save_agent_output, update_run_step, fail_run
from schemas.briefing import Briefing
from schemas.outputs import FullReport

_PAUSE_SECONDS = float(os.getenv("AGENT_PAUSE_SECONDS", "8"))  # Phase-13-Tiefe → größere Outputs → mehr Pause für Rate-Limit Tier 1


def run_pipeline_async(run_id: str, briefing_dict: dict, user_jwt: str) -> None:
    """Synchron im Background-Task."""
    client = get_client(user_jwt=user_jwt)
    try:
        client.table("runs").update({
            "status": "in_progress",
            "current_step": "pre_audit_analyst",
        }).eq("id", run_id).execute()

        briefing = Briefing(**briefing_dict)

        # Hole Voice-Session + Documents + Web-Research für Pre-Audit + Document-Analyst
        run_row = client.table("runs").select("company_id, voice_session_id, web_research_id").eq("id", run_id).maybe_single().execute()
        company_id = run_row.data["company_id"]
        company_row = client.table("companies").select("*").eq("id", company_id).maybe_single().execute()
        company = company_row.data

        web_research_data = None
        if run_row.data.get("web_research_id"):
            wr = client.table("web_research").select("*").eq("id", run_row.data["web_research_id"]).maybe_single().execute()
            web_research_data = wr.data if wr else None

        voice_session = None
        voice_transcript = None
        if run_row.data.get("voice_session_id"):
            vs = client.table("voice_sessions").select("*").eq("id", run_row.data["voice_session_id"]).maybe_single().execute()
            voice_session = vs.data if vs else None
            voice_transcript = (voice_session or {}).get("transcript")

        docs_res = client.table("documents").select("filename, doc_type, parsed_text, extracted_kpis").eq("company_id", company_id).eq("parser_status", "parsed").execute()
        documents = docs_res.data or []
        documents_summary = "\n\n".join(
            f"[{d['doc_type']}] {d['filename']}:\n{(d.get('parsed_text') or '')[:3000]}"
            for d in documents
        )

        from agents import (
            process_auditor, use_case_generator, tool_recommender, roi_calculator,
            compliance_checker, roadmap_generator, reporter,
            pre_audit_analyst, document_analyst,
        )

        # 1. Pre-Audit (oder nutze cached vom Voice-Start)
        pre_audit_output = None
        if voice_session and voice_session.get("pre_brief", {}).get("pre_audit"):
            from schemas.outputs import PreAuditOutput
            try:
                pre_audit_output = PreAuditOutput.model_validate(voice_session["pre_brief"]["pre_audit"])
            except Exception:
                pre_audit_output = None
        if not pre_audit_output:
            update_run_step(client, run_id, "pre_audit_analyst")
            pre_audit_output = pre_audit_analyst.run(
                company=company,
                documents_summary=documents_summary,
                web_research=web_research_data,
                voice_transcript=voice_transcript,
            )
            time.sleep(_PAUSE_SECONDS)
        save_agent_output(client, run_id, "pre_audit", pre_audit_output.model_dump(mode="json"))

        # 2. Document-Analyst
        update_run_step(client, run_id, "document_analyst")
        doc_analysis_output = None
        if documents:
            try:
                doc_analysis_output = document_analyst.run(
                    company=company,
                    documents=documents,
                    voice_transcript=voice_transcript,
                )
                save_agent_output(client, run_id, "document_analysis", doc_analysis_output.model_dump(mode="json"))
            except Exception as e:
                print(f"[pipeline] document_analyst fehlgeschlagen: {e}")
        time.sleep(_PAUSE_SECONDS)

        # 3. Process-Auditor
        update_run_step(client, run_id, "process_auditor")
        audit = process_auditor.run(briefing)
        save_agent_output(client, run_id, "process_auditor", audit.model_dump(mode="json"))
        time.sleep(_PAUSE_SECONDS)

        # 4. Use-Case-Generator
        update_run_step(client, run_id, "use_case_generator")
        use_cases = use_case_generator.run(briefing, audit)
        save_agent_output(client, run_id, "use_case_generator", use_cases.model_dump(mode="json"))
        time.sleep(_PAUSE_SECONDS)

        # 5. Tool-Recommender
        update_run_step(client, run_id, "tool_recommender")
        tools = tool_recommender.run(briefing, use_cases)
        save_agent_output(client, run_id, "tool_recommender", tools.model_dump(mode="json"))
        time.sleep(_PAUSE_SECONDS)

        # 6. ROI-Calculator
        update_run_step(client, run_id, "roi_calculator")
        roi = roi_calculator.run(briefing, audit, use_cases, tools)
        save_agent_output(client, run_id, "roi_calculator", roi.model_dump(mode="json"))
        time.sleep(_PAUSE_SECONDS)

        # 7. Compliance-Checker
        update_run_step(client, run_id, "compliance_checker")
        compliance = compliance_checker.run(briefing, use_cases, tools)
        save_agent_output(client, run_id, "compliance_checker", compliance.model_dump(mode="json"))
        time.sleep(_PAUSE_SECONDS)

        # 8. Roadmap-Generator
        update_run_step(client, run_id, "roadmap_generator")
        roadmap = roadmap_generator.run(briefing, use_cases, tools, roi)
        save_agent_output(client, run_id, "roadmap_generator", roadmap.model_dump(mode="json"))
        time.sleep(_PAUSE_SECONDS)

        # 9. Reporter
        update_run_step(client, run_id, "reporter")
        report: FullReport = reporter.run(
            briefing, audit, use_cases, tools, roi,
            compliance=compliance, roadmap=roadmap,
            pre_audit=pre_audit_output,
            document_analysis=doc_analysis_output,
        )
        save_agent_output(client, run_id, "full_report", report.model_dump(mode="json"))

        # 10. Deliverables
        update_run_step(client, run_id, "deliverables")
        _generate_and_upload_deliverables(client, run_id, report)

        client.table("runs").update({
            "status": "completed",
            "current_step": "done",
            "completed_at": "now()",
        }).eq("id", run_id).execute()

    except Exception as e:
        fail_run(client, run_id, str(e))
        raise


def _generate_and_upload_deliverables(client, run_id: str, report: "FullReport") -> dict[str, str]:
    """Generiert Excel/PPTX/PDF, lädt in Storage-Bucket "deliverables"."""
    from outputs.excel_generator import generate_excel
    from outputs.pptx_generator import generate_pptx
    from outputs.pdf_generator import generate_pdf

    out_paths: dict[str, str] = {}
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        generators = [
            ("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", generate_excel),
            ("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation", generate_pptx),
            ("pdf",  "application/pdf", generate_pdf),
        ]
        for ext, mime, fn in generators:
            try:
                local = td_path / f"report.{ext}"
                fn(report, local)
                with local.open("rb") as f:
                    content = f.read()
                storage_path = f"{run_id}/report.{ext}"
                client.storage.from_("deliverables").upload(
                    path=storage_path,
                    file=content,
                    file_options={"content-type": mime, "upsert": "true"},
                )
                out_paths[ext] = storage_path
            except Exception as e:
                print(f"[deliverables] {ext} fehlgeschlagen: {e}")
    return out_paths

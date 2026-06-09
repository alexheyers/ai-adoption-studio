"""Baut das Briefing-Objekt aus Company + Voice-Transcript + Web-Research zusammen.

Wird vor dem Multi-Agent-Run aufgerufen.
"""
from typing import Any

from agents._supabase import get_client
from schemas.briefing import Briefing, CompanyContext, HospitalityKPIs, PainPoint


def _kpis_from_company(company: dict) -> HospitalityKPIs:
    raw = company.get("kpis") or {}
    return HospitalityKPIs(
        adr_eur=raw.get("adr_eur"),
        revpar_eur=raw.get("revpar_eur"),
        occupancy_rate=raw.get("occupancy_rate"),
        personal_quote=raw.get("personal_quote"),
        gop_margin=raw.get("gop_margin"),
    )


def _pain_points_from_company(company: dict) -> list[PainPoint]:
    raw = company.get("pain_points") or []
    return [PainPoint(**p) for p in raw if isinstance(p, dict)]


def _documents_summary(client, company_id: str) -> str:  # noqa
    docs = client.table("documents").select("filename, doc_type, parsed_text").eq("company_id", company_id).eq("parser_status", "parsed").execute()
    if not docs.data:
        return "Keine Dokumente hochgeladen."
    parts = []
    for d in docs.data:
        text = (d.get("parsed_text") or "")[:2000]
        parts.append(f"[{d['doc_type']}] {d['filename']}:\n{text}")
    return "\n\n---\n\n".join(parts)


def build_briefing(
    company: dict,
    voice_session_id: str | None = None,
    web_research_id: str | None = None,
    user_jwt: str | None = None,
) -> Briefing:
    client = get_client(user_jwt=user_jwt)

    voice_transcript = None
    if voice_session_id:
        vs = client.table("voice_sessions").select("transcript").eq("id", voice_session_id).maybe_single().execute()
        if vs and vs.data:
            voice_transcript = vs.data.get("transcript")

    web_summary_note = ""
    if web_research_id:
        wr = client.table("web_research").select("company_findings, region_benchmarks").eq("id", web_research_id).maybe_single().execute()
        if wr and wr.data:
            web_summary_note = f"\n\nWeb-Research-Findings: {wr.data}"

    return Briefing(
        company=CompanyContext(
            name=company["name"],
            industry="Hospitality",
            sub_segment=company.get("sub_segment") or "Hotellerie",
            size_class=company.get("size_class") or "M",
            employees=company.get("employees") or 0,
            locations=company.get("locations") or 1,
            annual_revenue_eur=company.get("annual_revenue_eur") or 0,
            region=company.get("region") or "Deutschland",
        ),
        kpis=_kpis_from_company(company),
        pain_points=_pain_points_from_company(company),
        current_tools=list(company.get("current_tools") or []),
        documents_summary=_documents_summary(client, company["id"]) + web_summary_note,
        voice_interview_transcript=voice_transcript,
        notes=company.get("notes"),
    )

"""Reporter — SDK-Migration von agents/reporter.py.

Schreibt die Executive Summary (3-5 Sätze, Senior-Pitch-Tonalität) und
aggregiert alle Sub-Reports aus dem Pipeline-Kontext zum FullReport.

Der LLM-Call liefert NUR `{"executive_summary": "..."}`. Die Aggregation zum
FullReport passiert im Custom-Parse, indem die vorigen Agent-Outputs aus dem
Kontext gezogen werden (analog zum Argument-Durchreichen im Alt-Reporter).

Erwartet im Kontext (vorige Agent-Outputs, jeweils unter ihrem Namen):
    process_auditor   — ProcessAuditOutput        (PFLICHT)
    use_case_generator— UseCaseOutput             (PFLICHT)
    tool_recommender  — ToolRecommendationOutput  (PFLICHT)
    roi_calculator    — ROIOutput                 (PFLICHT)
    compliance_checker— ComplianceOutput          (optional)
    roadmap_generator — RoadmapOutput             (optional)
    web_research      — WebResearchOutput         (optional)
    pre_audit_analyst — PreAuditOutput            (optional)
    document_analyst  — DocumentAnalysisOutput    (optional)
    briefing          — Briefing                  (für company_name)

Bestehendes agents/reporter.py bleibt unverändert.
"""

from __future__ import annotations

from typing import Any

from schemas.outputs import FullReport

from agent_patterns.core.base_agent import AgentSpec

# System-Prompt verbatim aus agents/reporter.py.
SYSTEM_PROMPT = """Du bist Senior Pitch-Writer für Top-Tier-Beratungs-Reports — vergleichbar mit einem McKinsey-Partner oder BCG-Senior-Partner, der die Executive Summary für ein Board-Pitch schreibt.

DER CEO HAT 30 SEKUNDEN. Was muss er wissen?

DEINE AUFGABE — 3-5 Sätze Executive Summary, exakt diese Struktur:
1. Satz: KLARE Empfehlung — "Investieren JA, X EUR Y1, ROI Z%" ODER "Nicht jetzt — folgende drei Bedingungen müssen erst erfüllt sein"
2. Satz: TOP-Use-Case — welcher zuerst, in welchem Zeitrahmen, mit welchem ersten messbaren Outcome
3. Satz: WAS NICHT zu tun — explizit ein Use-Case ausschließen mit Begründung (sonst klingst du wie Marketing)
4-5. Satz: Risk-Register / Critical-Path — der größte Engpass, der die ganze Roadmap kippen kann

REGELN:
- KEINE Lobhudelei
- KEINE Floskeln ("transformiert Ihr Business", "next-level")
- KONKRETE Zahlen
- SPRICH den CEO direkt an
- BEI Diskrepanz zwischen Voice-Aussagen und Daten: das wird im Punkt 4 erwähnt

OUTPUT — strikt JSON:

{
  "executive_summary": "Der Text. 3-5 Sätze. Keine Anführungszeichen, keine Listen-Bullets."
}
"""


def _company_name(context: dict[str, Any]) -> str:
    briefing = context.get("briefing")
    if briefing is not None and getattr(briefing, "company", None) is not None:
        return briefing.company.name
    return context.get("company", {}).get("name", "Unbekannt") if isinstance(
        context.get("company"), dict
    ) else "Unbekannt"


def _build_user_message(context: dict[str, Any]) -> str:
    audit = context["process_auditor"]
    use_cases = context["use_case_generator"]
    tools = context["tool_recommender"]
    roi = context["roi_calculator"]
    compliance = context.get("compliance_checker")
    roadmap = context.get("roadmap_generator")
    pre_audit = context.get("pre_audit_analyst")
    document_analysis = context.get("document_analyst")

    compliance_note = ""
    if compliance:
        flagged = sum(
            1
            for f in compliance.flags
            if f.dsgvo_relevant or f.ai_act_risk_class != "minimal"
        )
        compliance_note = (
            f"\n- Compliance: {flagged} Use-Cases mit DSGVO/AI-Act-Aufmerksamkeitsbedarf. "
            f"{compliance.general_advice[:200]}"
        )

    roadmap_note = ""
    if roadmap and roadmap.phases:
        roadmap_note = (
            f"\n- Roadmap: {roadmap.total_effort_pt} PT über 3 Phasen. "
            f"Critical-Path: {roadmap.critical_path[:200]}"
        )

    pre_audit_note = ""
    if pre_audit:
        pre_audit_note = f"\n- Pre-Audit-Working-Hypothesis: {pre_audit.overall_situation[:300]}"

    doc_analysis_note = ""
    if document_analysis:
        doc_analysis_note = (
            f"\n- Daten-Analyse: {document_analysis.benchmark_assessment[:200]} "
            f"· Cross-Validation: {document_analysis.cross_validation[:200]}"
        )

    return f"""KUNDE: {_company_name(context)}

GESAMT-FINDINGS:
- Audit: {audit.summary}
- Quick Wins: {use_cases.quick_wins_summary}
- Stack: {tools.stack_summary}
- ROI: {roi.summary}{compliance_note}{roadmap_note}{pre_audit_note}{doc_analysis_note}

KERN-ZAHLEN:
- Investment Y1: {roi.total_investment_eur:,} EUR
- Savings Y1: {roi.total_savings_eur_year_1:,} EUR
- 3J-Savings: {roi.total_savings_eur_3_years:,} EUR
- Payback: {roi.total_payback_months} Monate

Schreibe die Executive Summary — exakt die 3-5-Sätze-Struktur."""


def _parse(raw: dict, context: dict[str, Any]) -> FullReport:
    return FullReport(
        company_name=_company_name(context),
        pre_audit=context.get("pre_audit_analyst"),
        document_analysis=context.get("document_analyst"),
        audit=context["process_auditor"],
        use_cases=context["use_case_generator"],
        tools=context["tool_recommender"],
        roi=context["roi_calculator"],
        compliance=context.get("compliance_checker"),
        roadmap=context.get("roadmap_generator"),
        web_research=context.get("web_research"),
        executive_summary=raw["executive_summary"],
    )


def build(context: dict[str, Any]) -> AgentSpec:
    return AgentSpec(
        name="reporter",
        system_prompt=SYSTEM_PROMPT,
        output_model=FullReport,
        build_user_message=_build_user_message,
        parse=_parse,
    )

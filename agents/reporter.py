"""Agent 07 · Reporter — Senior-Consultant-Niveau.

Schreibt Executive Summary mit Senior-Pitch-Tonalität:
- 1. Satz: klare Empfehlung (Investieren oder Nicht-Investieren) mit Zahl
- 2. Satz: WAS zuerst (Top-Use-Case)
- 3. Satz: was NICHT zu tun + Begründung
- 4. Satz: Risk-Register / Critical-Path

Aggregiert alle Sub-Reports zum FullReport.
"""
from schemas.briefing import Briefing
from schemas.outputs import (
    ProcessAuditOutput,
    UseCaseOutput,
    ToolRecommendationOutput,
    ROIOutput,
    ComplianceOutput,
    RoadmapOutput,
    WebResearchOutput,
    PreAuditOutput,
    DocumentAnalysisOutput,
    FullReport,
)
from agents._client import call_agent


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


def run(
    briefing: Briefing,
    audit: ProcessAuditOutput,
    use_cases: UseCaseOutput,
    tools: ToolRecommendationOutput,
    roi: ROIOutput,
    compliance: ComplianceOutput | None = None,
    roadmap: RoadmapOutput | None = None,
    web_research: WebResearchOutput | None = None,
    pre_audit: PreAuditOutput | None = None,
    document_analysis: DocumentAnalysisOutput | None = None,
) -> FullReport:
    compliance_note = ""
    if compliance:
        flagged = sum(1 for f in compliance.flags if f.dsgvo_relevant or f.ai_act_risk_class != "minimal")
        compliance_note = f"\n- Compliance: {flagged} Use-Cases mit DSGVO/AI-Act-Aufmerksamkeitsbedarf. {compliance.general_advice[:200]}"

    roadmap_note = ""
    if roadmap and roadmap.phases:
        roadmap_note = f"\n- Roadmap: {roadmap.total_effort_pt} PT über 3 Phasen. Critical-Path: {roadmap.critical_path[:200]}"

    pre_audit_note = ""
    if pre_audit:
        pre_audit_note = f"\n- Pre-Audit-Working-Hypothesis: {pre_audit.overall_situation[:300]}"

    doc_analysis_note = ""
    if document_analysis:
        doc_analysis_note = f"\n- Daten-Analyse: {document_analysis.benchmark_assessment[:200]} · Cross-Validation: {document_analysis.cross_validation[:200]}"

    user_message = f"""KUNDE: {briefing.company.name}

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

    raw = call_agent(SYSTEM_PROMPT, user_message)

    return FullReport(
        company_name=briefing.company.name,
        pre_audit=pre_audit,
        document_analysis=document_analysis,
        audit=audit,
        use_cases=use_cases,
        tools=tools,
        roi=roi,
        compliance=compliance,
        roadmap=roadmap,
        web_research=web_research,
        executive_summary=raw["executive_summary"],
    )

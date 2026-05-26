"""ROI-Calculator — SDK-Migration von agents/roi_calculator.py.

Business-Case auf CFO-Niveau: pro Use-Case Invest + Savings + Payback mit
transparenten Annahmen. System-Prompt + Output-Schema (ROIOutput) verbatim.

Erwartet im Kontext:
    context["briefing"]            — Briefing
    context["process_auditor"]     — ProcessAuditOutput
    context["use_case_generator"]  — UseCaseOutput
    context["tool_recommender"]    — ToolRecommendationOutput

Bestehendes agents/roi_calculator.py bleibt unverändert.
"""

from __future__ import annotations

from typing import Any

from schemas.outputs import ROIOutput

from agent_patterns.core.base_agent import AgentSpec
from agent_patterns.tools.knowledge_tool import case_study_block

# System-Prompt verbatim aus agents/roi_calculator.py.
SYSTEM_PROMPT_TEMPLATE = """Du bist Senior CFO-Berater für Hospitality-DACH — Niveau Audit-Partner einer Big-4 oder Senior-Director einer Investment-Bank-Hospitality-Praxis. Du rechnest Business-Cases, die einem CEO und einem CFO gleichzeitig standhalten.

ARBEITSWEISE:
- Pro Use-Case: konkrete Invest- + Savings-Schätzung mit transparenten Annahmen
- Annahmen müssen plausibel sein vs Case-Study-Outcomes (siehe unten)
- Personalkosten DACH 2026: 25-42 EUR/h Vollkosten je Rolle
- Personalkosten-Vollzeit-Jahr: 38-58k EUR Vollkosten je Rolle
- OTA-Provisions-Hebel: jeder %-Punkt Direktbuchungs-Shift × annual_revenue × 0.7 × commission_rate
- Wenn Annahme stark unsicher: konservativer schätzen — nie Best-Case verkaufen
- Payback realistisch: typische Quick-Wins 4-9 Monate, mittlere Use-Cases 9-15 Monate

DREI-JAHRES-ROI-FORMEL:
roi_3y_pct = (savings_3y - investment_3y) / investment_3y × 100
investment_3y ≈ investment_y1 × 1.2 (Maintenance + Updates)
savings_3y ≈ savings_y1 × 3.2 (Effekte stabilisieren + leicht wachsen)

WAS DU NIE TUST:
- "Hockey-Stick"-Projektionen (5x Umsatz-Anstieg etc.)
- ROI > 400% verkaufen ohne starke Begründung (typisch realistisch: 80-250%)
- Personalkosten überschätzen (15 h Ersparnis/Woche × 100% Auslastung 52 Wochen ist unrealistisch)
- Payback < 4 Monate bei Tool-basierten Use-Cases (Setup-Zeit muss eingerechnet sein)

OUTPUT — strikt JSON (alle Felder ausfüllen):

{
  "line_items": [
    {
      "use_case_name": "exakt aus Use-Case-Output",
      "target_process": "Prozess-Name aus Audit",
      "investment_eur_year_1": 8400,
      "setup_cost_eur": 2400,
      "license_cost_eur_year": 6000,
      "internal_effort_pt": 8,
      "savings_eur_year_1": 12600,
      "savings_eur_year_2": 14000,
      "savings_eur_year_3": 15000,
      "time_saved_h_week": 8.0,
      "quality_uplift": "Antwortzeit-Reduktion, Conversion-Effekt, Beschwerderate",
      "confidence": "high|medium|low",
      "risks": ["Setup länger als geplant", "Personal-Akzeptanz"],
      "assumptions": ["8 h/Woche Ersparnis", "Personal-Vollkostensatz 32 EUR/h", "100% Adoption nach 3 Monaten"],
      "payback_months": 8,
      "three_year_roi_percent": 145
    }
  ],
  "total_investment_eur": 0,
  "total_setup_cost_eur": 0,
  "total_license_cost_eur_year": 0,
  "total_savings_eur_year_1": 0,
  "total_savings_eur_year_2": 0,
  "total_savings_eur_year_3": 0,
  "total_savings_eur_3_years": 0,
  "total_payback_months": 0,
  "sensitivity_notes": "2-3 Sätze: was kippt das Ergebnis, wenn Annahmen 20% schlechter sind? Welcher Posten ist der größte Hebel im Negativen?",
  "summary": "3-4 Sätze: Cashflow-Story für CFO. Was kostet, was bringt, wie sicher. Bei welchen Annahmen wackelt es am stärksten."
}

────────────────────────────
{case_studies_block}
"""


def _build_system_prompt(context: dict[str, Any]) -> str:
    company = context["briefing"].company
    cases = case_study_block(company.sub_segment, max_items=8)
    return SYSTEM_PROMPT_TEMPLATE.replace("{case_studies_block}", cases)


def _build_user_message(context: dict[str, Any]) -> str:
    briefing = context["briefing"]
    audit = context["process_auditor"]
    use_cases = context["use_case_generator"]
    tools = context["tool_recommender"]
    c = briefing.company
    return f"""BRIEFING:
- Firma: {c.name}
- Größe: {c.size_class} · {c.employees} MA · {c.locations} Standorte
- Jahresumsatz: {c.annual_revenue_eur} EUR
- Pain Points: {[p.description for p in briefing.pain_points]}

AUDIT (Prozesse + Savings-Schätzungen):
{audit.model_dump_json(indent=2)}

USE-CASES:
{use_cases.model_dump_json(indent=2)}

TOOL-EMPFEHLUNGEN (Monatskosten + Setup):
{tools.model_dump_json(indent=2)}

Rechne pro Use-Case. Totals konsistent zur Liste. Begründe Annahmen im Summary."""


def build(context: dict[str, Any]) -> AgentSpec:
    return AgentSpec(
        name="roi_calculator",
        system_prompt=_build_system_prompt(context),
        output_model=ROIOutput,
        build_user_message=_build_user_message,
    )

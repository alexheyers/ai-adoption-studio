"""Agent 06 · Roadmap-Generator — Senior-Consultant-Niveau.

Drei-Phasen-Roadmap über 12 Monate. Critical-Path, Dependencies, Kill-Criteria,
Ressourcen-realistische Aufwands-Schätzungen pro Phase.
"""
import json

from agents._client import call_agent
from schemas.briefing import Briefing
from schemas.outputs import (
    RoadmapOutput,
    RoadmapPhase,
    UseCaseOutput,
    ToolRecommendationOutput,
    ROIOutput,
)
from knowledge import case_studies_summary_text


SYSTEM_PROMPT_TEMPLATE = """Du bist Senior Implementation-Director — vergleichbar mit einem Senior-Partner einer Digital-Transformation-Beratung (Capgemini Invent, Accenture Digital, BCG Digital Ventures). Du baust Roadmaps, die operativ umgesetzt werden — nicht Wunschlisten.

ARBEITSWEISE:
- 3 Phasen: P1 Quick-Wins (0-3 Mo), P2 Foundation (3-6 Mo), P3 Scale (6-12 Mo)
- Quick-Wins gehören in P1 — niedrige Komplexität, schneller Payback, Vertrauensbildner
- Use-Cases mit complexity=high gehören in P2 oder P3
- Dependencies explizit: was muss vorher fertig sein
- Ressourcen-realistisch: Personentage = Setup + Konfiguration + Testing + Schulung + Rollout
- Critical Path: ein 1-Satz-Statement, welcher Use-Case der Engpass ist

REGELN PRO PHASE:
- name: prägnant (max 3 Wörter)
- duration_months: realistischer Bereich (z.B. "0-3 Monate")
- use_cases: Liste der Use-Case-Namen aus UseCaseOutput
- required_tools: Liste der Tools aus ToolRecommendationOutput
- estimated_effort_pt: Personentage gesamt (realistisch: Quick-Wins 12-25 PT, Foundation 20-40 PT, Scale 15-30 PT)
- dependencies: ["X muss fertig sein", ...] — leere Liste wenn keine
- expected_outcomes: 2-3 Sätze KONKRET — welche Metrik bewegt sich von wo nach wo

WAS DU NIE TUST:
- "Big-Bang-Implementierung" — alles am Tag 1 live
- Quick-Wins die >4 Wochen brauchen
- Phasen ohne klare Dependencies-Logik
- Personentage in Monatsbereich (Setup-Tage zählen, nicht "circa 2 Monate Aufwand")

OUTPUT — strikt JSON (auch Milestones, Success-Metrics, Kill-Kriterien pro Phase):

{
  "phases": [
    {
      "phase_number": 1,
      "name": "Quick-Wins",
      "duration_months": "0-3 Monate",
      "use_cases": ["..."],
      "required_tools": ["..."],
      "estimated_effort_pt": 18,
      "dependencies": [],
      "expected_outcomes": "2-3 Sätze konkret",
      "milestones": [
        {"week": 2, "title": "Onboarding abgeschlossen", "success_criterion": "..."},
        {"week": 6, "title": "Erster Live-Test mit Real-Daten", "success_criterion": "..."},
        {"week": 10, "title": "Voll im Tagesbetrieb", "success_criterion": "..."}
      ],
      "success_metrics": ["z.B. Antwortzeit Reservierungen < 2h", "Personalstunden -X h/Wo"],
      "kill_criteria": ["Wenn nach 6 Wochen Adoption < 50% → Phase pausieren"],
      "decision_makers": ["GF", "Reservierungs-Lead"]
    },
    { "phase_number": 2, ... },
    { "phase_number": 3, ... }
  ],
  "critical_path": "1 Satz: welcher Use-Case ist Engpass und warum",
  "critical_path_risks": ["Personalmangel im Onboarding-Zeitraum", "PMS-API-Reife"],
  "total_effort_pt": 65
}

────────────────────────────
{case_studies_block}
"""


def run(
    briefing: Briefing,
    use_cases: UseCaseOutput,
    tools: ToolRecommendationOutput,
    roi: ROIOutput,
) -> RoadmapOutput:
    sub_segment_raw = (briefing.company.sub_segment or "boutique").lower()
    sub_segment_map = {
        "boutique-hotel": "boutique", "boutique": "boutique", "stadthotel": "stadthotel",
        "ferienhotel": "ferienhotel", "tagungshotel": "tagungshotel", "resort": "resort",
        "familienbetrieb": "familienbetrieb",
    }
    sub_segment = sub_segment_map.get(sub_segment_raw, "boutique")
    cs_text = case_studies_summary_text(filter_segment=sub_segment, max_items=8)

    system = SYSTEM_PROMPT_TEMPLATE
    system = system.replace("{case_studies_block}", cs_text)

    user_message = json.dumps({
        "company": {
            "name": briefing.company.name,
            "size_class": briefing.company.size_class,
            "employees": briefing.company.employees,
        },
        "use_cases": [u.model_dump() for u in use_cases.use_cases],
        "tools": [t.model_dump() for t in tools.recommendations],
        "roi_line_items": [r.model_dump() for r in roi.line_items],
    }, ensure_ascii=False)

    raw = call_agent(system, user_message)

    phases = [RoadmapPhase(**p) for p in raw.get("phases", [])]
    return RoadmapOutput(
        phases=phases,
        critical_path=raw.get("critical_path", ""),
        total_effort_pt=raw.get("total_effort_pt", sum(p.estimated_effort_pt for p in phases)),
    )

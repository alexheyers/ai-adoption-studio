"""Agent 05 · Compliance-Checker — Senior-Consultant-Niveau.

DSGVO + EU AI-Act + Branchen-spezifische Compliance-Hinweise.
Konkrete Mitigationen mit AVV-Klausel-Pointer + Risiko-Klassifikation.
KEINE Rechtsberatung — strukturierte Hinweise mit Disclaimer.
"""
import json

from agents._client import call_agent
from schemas.briefing import Briefing
from schemas.outputs import (
    ComplianceFlag,
    ComplianceOutput,
    UseCaseOutput,
    ToolRecommendationOutput,
)
from knowledge import compliance


SYSTEM_PROMPT_TEMPLATE = """Du bist Senior Compliance-Director mit Schwerpunkt EU-Datenschutz (DSGVO), EU-AI-Act und deutsches Hospitality-Recht — vergleichbar mit einem Senior-Partner einer Wirtschaftsprüfer-Kanzlei mit Tech-Compliance-Praxis (z.B. Taylor Wessing, CMS, Hengeler Mueller).

Du bekommst KI-Use-Cases + Tool-Empfehlungen. Pro Use-Case prüfst du:

1. DSGVO-Relevanz: ja/nein. Welche Rechtsgrundlage (Art. 6 DSGVO)? Auslandstransfer?
2. EU AI-Act Risikoklasse: minimal | limited | high | unacceptable
3. Branchen-spezifische Hinweise (Meldescheinpflicht, Kassen-TSE, HACCP, GwG, Arbeitsrecht)
4. Konkrete Mitigationen (AVV-Klauseln, Transparenz-Hinweise, Mensch-in-der-Loop-Vorgaben, DSFA-Pflicht)

DEINE INFO-BASIS (verwende strikt diese, nicht halluzinieren):

DSGVO-Regelwerk:
{dsgvo_block}

AI-Act-Klassifikation:
{ai_act_block}

Branchen-spezifische Pflichten:
{hospitality_block}

REGELN:
- LÄNGE: dsgvo_reason max 2 Sätze. industry_specific max 3 Bullet-Points, je max 1 Satz. mitigations max 4 Bullet-Points, je max 1 Satz. general_advice max 3 Sätze.
- KEINE Rechtsberatung — strukturierte Hinweise mit Disclaimer.
- Bei Auslandstransfer (US-Cloud): SCC + TIA erwähnen.
- Bei Recruiting-/HR-KI: AI-Act-Hochrisiko warning + Mensch-in-Loop-Pflicht.
- Bei generativen Chatbots: Transparenz-Pflicht (Art. 50 AI-Act).
- Bei Mitarbeiter-Daten: Betriebsrat-Themen erwähnen wenn relevant.

OUTPUT — strikt JSON:

{
  "flags": [
    {
      "use_case_name": "exakt aus Use-Case-Output",
      "dsgvo_relevant": true|false,
      "dsgvo_reason": "max 2 Sätze",
      "ai_act_risk_class": "minimal|limited|high|unacceptable",
      "industry_specific": ["max 3 Bullets je 1 Satz"],
      "mitigations": ["max 4 Bullets je 1 Satz"]
    }
  ],
  "general_advice": "max 3 Sätze: was generell für DIESES Haus gilt — DSGVO-Beauftragter, AVVs mit Anbietern, Transparenz-Hinweise im Online-Flow."
}
"""


def run(
    briefing: Briefing,
    use_cases: UseCaseOutput,
    tools: ToolRecommendationOutput,
) -> ComplianceOutput:
    cp = compliance()
    dsgvo_block = json.dumps(cp.get("dsgvo", {}).get("general", {}), ensure_ascii=False)[:1800]
    ai_act_block = json.dumps(cp.get("ai_act", {}).get("risikoklassen_hospitality", {}), ensure_ascii=False)[:2000]
    hospitality_block = json.dumps({
        "hospitality_dsgvo": cp.get("dsgvo", {}).get("hospitality_specific", {}),
        "gwg": cp.get("gwg_geldwäsche", {}),
        "steuer": cp.get("steuer_compliance", {}),
        "anti_patterns": cp.get("ai_act", {}).get("hospitality_specific_anti_patterns", []),
    }, ensure_ascii=False)[:1500]

    system = SYSTEM_PROMPT_TEMPLATE
    system = system.replace("{dsgvo_block}", dsgvo_block)
    system = system.replace("{ai_act_block}", ai_act_block)
    system = system.replace("{hospitality_block}", hospitality_block)

    user_message = json.dumps({
        "company": {
            "name": briefing.company.name,
            "sub_segment": briefing.company.sub_segment,
            "size_class": briefing.company.size_class,
            "region": briefing.company.region,
        },
        "use_cases": [u.model_dump() for u in use_cases.use_cases],
        "tools": [t.model_dump() for t in tools.recommendations],
    }, ensure_ascii=False)

    raw = call_agent(system, user_message)

    flags = [ComplianceFlag(**f) for f in raw.get("flags", [])]
    general_advice = raw.get("general_advice", "")

    return ComplianceOutput(
        flags=flags,
        general_advice=general_advice,
    )

"""Compliance-Checker — SDK-Migration von agents/compliance_checker.py.

DSGVO + EU-AI-Act + Branchen-Compliance pro Use-Case. KEINE Rechtsberatung —
strukturierte Hinweise mit Disclaimer. System-Prompt + Output-Schema
(ComplianceOutput) verbatim; Custom-Parse baut ComplianceFlag-Liste.

Erwartet im Kontext:
    context["briefing"]            — Briefing
    context["use_case_generator"]  — UseCaseOutput
    context["tool_recommender"]    — ToolRecommendationOutput

Bestehendes agents/compliance_checker.py bleibt unverändert.
"""

from __future__ import annotations

import json
from typing import Any

from schemas.outputs import ComplianceFlag, ComplianceOutput

from agent_patterns.core.base_agent import AgentSpec
from agent_patterns.tools.knowledge_extras import compliance_blocks

# System-Prompt verbatim aus agents/compliance_checker.py.
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


def _build_system_prompt(context: dict[str, Any]) -> str:
    blocks = compliance_blocks()
    return (
        SYSTEM_PROMPT_TEMPLATE
        .replace("{dsgvo_block}", blocks["dsgvo"])
        .replace("{ai_act_block}", blocks["ai_act"])
        .replace("{hospitality_block}", blocks["hospitality"])
    )


def _build_user_message(context: dict[str, Any]) -> str:
    briefing = context["briefing"]
    use_cases = context["use_case_generator"]
    tools = context["tool_recommender"]
    c = briefing.company
    return json.dumps(
        {
            "company": {
                "name": c.name,
                "sub_segment": c.sub_segment,
                "size_class": c.size_class,
                "region": c.region,
            },
            "use_cases": [u.model_dump() for u in use_cases.use_cases],
            "tools": [t.model_dump() for t in tools.recommendations],
        },
        ensure_ascii=False,
    )


def _parse(raw: dict, context: dict[str, Any]) -> ComplianceOutput:
    flags = [ComplianceFlag(**f) for f in raw.get("flags", [])]
    return ComplianceOutput(flags=flags, general_advice=raw.get("general_advice", ""))


def build(context: dict[str, Any]) -> AgentSpec:
    return AgentSpec(
        name="compliance_checker",
        system_prompt=_build_system_prompt(context),
        output_model=ComplianceOutput,
        build_user_message=_build_user_message,
        parse=_parse,
    )

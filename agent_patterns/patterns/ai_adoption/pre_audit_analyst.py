"""Pre-Audit-Analyst — SDK-Migration von agents/pre_audit_analyst.py.

Generiert 5-7 datengetriebene Hypothesen VOR dem Voice-Interview (mit Confidence,
Evidenz, Benchmark-Vergleich, Push-Back-Frage, Quantifizierung). System-Prompt +
Output-Schema (PreAuditOutput) verbatim; Custom-Parse baut Hypothesis-Liste.

Erwartet im Kontext:
    context["company"]            — dict (name/sub_segment/size_class/employees/…)
    context["documents_summary"]  — optional str
    context["web_research"]       — optional WebResearchOutput | dict
    context["voice_transcript"]   — optional str

Hinweis: der Voice-/Interview-Agent selbst (ElevenLabs) ist KEIN SDK-Agent und
bleibt außen vor — dieser Agent liefert nur die Hypothesen-Basis dafür.

Bestehendes agents/pre_audit_analyst.py bleibt unverändert.
"""

from __future__ import annotations

import json
from typing import Any

from schemas.outputs import Hypothesis, PreAuditOutput

from agent_patterns.core.base_agent import AgentSpec
from agent_patterns.tools.knowledge_extras import pulse_block, trends_block
from agent_patterns.tools.knowledge_tool import (
    benchmark_block,
    case_study_block,
    normalize_sub_segment,
)

# System-Prompt verbatim aus agents/pre_audit_analyst.py.
SYSTEM_PROMPT_TEMPLATE = """Du bist Senior Hospitality Consultant mit 15+ Jahren Erfahrung — vergleichbar mit einem McKinsey-Hospitality-Director oder Horwath-HTL-Partner. Deine Aufgabe: aus den vorliegenden Daten (Onboarding-Form, Web-Research, hochgeladene Dokumente) 5-7 prägnante, datengetriebene Hypothesen formulieren, die ein erfahrener Berater bilden würde BEVOR er das Gespräch mit dem Geschäftsführer führt.

ARBEITSWEISE:
1. Lies alle vorliegenden Daten gründlich
2. Vergleiche jede Kennzahl mit den Branchen-Benchmarks (siehe unten)
3. Identifiziere die 5-7 STÄRKSTEN Hypothesen, die das Haus charakterisieren — keine generischen, sondern spezifisch zu DIESEM Haus
4. Pro Hypothese: Confidence, Evidenz, Benchmark-Vergleich, Push-Back-Frage, Quantifizierung

WAS EINE GUTE HYPOTHESE AUSMACHT:
- Sie ist FALSIFIZIERBAR (nicht "es könnte sein dass...")
- Sie hat konkrete Evidenz aus den Daten (Zahlen, Zitate, Trends)
- Sie vergleicht mit Branchen-Norm (Benchmark p25/p50/p75)
- Sie führt zu einer KONKRETEN Push-Back-Frage für den GF ("Sie sagen X, die Daten sagen Y — was übersehen wir?")
- Sie ist quantifizierbar (Hebel in EUR/Jahr oder Zeit/Woche)

WAS DU NICHT MACHST:
- Generische Beobachtungen ("Personal ist teuer")
- Lobhudelei ("schönes Konzept")
- Use-Case-Vorschläge — das macht der spätere Agent

OUTPUT — antworte AUSSCHLIESSLICH mit JSON in folgender Struktur (keine Markdown-Fence, kein Vortext, KEIN Nachtrag):

{
  "overall_situation": "2-3 Sätze: wie steht das Haus da im Vergleich zur Branche — wirtschaftlich, operativ, strategisch",
  "suggested_focus_topics": ["3 Themen die Ada im Voice tief untersuchen soll"],
  "data_gaps": ["Was du aus den vorliegenden Daten NICHT beantworten kannst — Ada muss im Gespräch nachfragen"],
  "data_recap_for_voice": "Gesprochener Eröffnungs-Monolog für Ada (in 3-5 Absätzen, ~250-400 Wörter, deutsch, in natürlicher Sprech-Sprache, KEIN Behörden-Deutsch). Inhalt: (a) Was Ada aus den hochgeladenen Dokumenten gelesen hat — konkret mit Zahlen, (b) erster Eindruck wo das Haus im Branchen-Vergleich steht, (c) welche 2-3 Aspekte ihr besonders auffallen und wo sie nachfragen will, (d) Überleitung zur ersten Frage. Schreib es so, dass Ada es vorlesen kann.",
  "hypotheses": [
    {
      "id": "HYP-01",
      "title": "Kurzer Titel (max 60 Zeichen)",
      "confidence": "high|medium|low",
      "statement": "Die Hypothese in 1-2 prägnanten Sätzen",
      "evidence": ["Konkreter Datenpunkt 1", "Konkreter Datenpunkt 2"],
      "benchmark_comparison": "Wie weicht das Haus vom p50-Benchmark ab + in welche Richtung",
      "push_back_question": "Die Frage die Ada im Gespräch stellt um zu validieren",
      "quantification_formula": "Hebel quantifiziert (z.B. 'X EUR pro Jahr wenn Y um Z verbessert wird')"
    }
  ]
}

{benchmarks_block}

{trends_block}

{pulse_block}

{case_studies_block}
"""


def _build_system_prompt(context: dict[str, Any]) -> str:
    company = context["company"]
    sub_segment = normalize_sub_segment(company.get("sub_segment"))
    size_class = company.get("size_class") or "M"
    return (
        SYSTEM_PROMPT_TEMPLATE
        .replace("{benchmarks_block}", benchmark_block(company.get("sub_segment"), size_class))
        .replace("{trends_block}", trends_block(max_items=8))
        .replace("{pulse_block}", pulse_block(max_items_per_bucket=2))
        .replace("{case_studies_block}", case_study_block(sub_segment, max_items=6))
    )


def _web_research_payload(context: dict[str, Any]) -> dict:
    """Holt Web-Research aus dem Kontext — egal ob WebResearchOutput oder dict."""
    wr = context.get("web_research")
    if wr is None:
        return {}
    if hasattr(wr, "model_dump"):
        return wr.model_dump()
    if isinstance(wr, dict):
        return wr
    return {}


def _build_user_message(context: dict[str, Any]) -> str:
    company = context["company"]
    documents_summary = context.get("documents_summary") or ""
    voice_transcript = context.get("voice_transcript")
    size_class = company.get("size_class") or "M"

    return json.dumps(
        {
            "company": {
                "name": company.get("name"),
                "sub_segment": company.get("sub_segment"),
                "size_class": size_class,
                "employees": company.get("employees"),
                "locations": company.get("locations"),
                "annual_revenue_eur": company.get("annual_revenue_eur"),
                "region": company.get("region"),
                "website": company.get("website"),
                "current_tools": company.get("current_tools") or [],
                "pain_points": company.get("pain_points") or [],
                "kpis_eingegeben": company.get("kpis") or {},
            },
            "documents_summary": documents_summary[:8000] if documents_summary else "",
            "web_research": _web_research_payload(context),
            "voice_transcript_if_available": (voice_transcript or "")[:2000],
        },
        ensure_ascii=False,
    )


def _parse(raw: dict, context: dict[str, Any]) -> PreAuditOutput:
    hyps = [Hypothesis(**h) for h in raw.get("hypotheses", [])]
    return PreAuditOutput(
        hypotheses=hyps,
        overall_situation=raw.get("overall_situation", ""),
        suggested_focus_topics=raw.get("suggested_focus_topics", []),
        data_gaps=raw.get("data_gaps", []),
        data_recap_for_voice=raw.get("data_recap_for_voice", ""),
    )


def build(context: dict[str, Any]) -> AgentSpec:
    return AgentSpec(
        name="pre_audit_analyst",
        system_prompt=_build_system_prompt(context),
        output_model=PreAuditOutput,
        build_user_message=_build_user_message,
        parse=_parse,
    )

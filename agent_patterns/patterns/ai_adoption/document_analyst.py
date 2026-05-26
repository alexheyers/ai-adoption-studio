"""Document-Analyst — SDK-Migration von agents/document_analyst.py.

PROOF-OF-CONCEPT Nr. 2: zeigt, dass auch ein Agent mit eigenem Input-Shape
(documents-Liste statt Briefing) und eigener Parse-Logik (DocumentInsight-Liste
manuell bauen) sauber als AgentSpec auf dem SDK abbildbar ist.

Erwartet im Kontext:
    context["documents"]        — Liste[{filename, doc_type, parsed_text, extracted_kpis}]
    context["company"]          — dict mit name/sub_segment/size_class/annual_revenue_eur
    context["voice_transcript"] — optional str

Bestehendes agents/document_analyst.py bleibt unverändert.
"""

from __future__ import annotations

import json
from typing import Any

from schemas.outputs import DocumentAnalysisOutput, DocumentInsight

from agent_patterns.core.base_agent import AgentSpec
from agent_patterns.tools.knowledge_tool import benchmark_block

# System-Prompt verbatim aus agents/document_analyst.py.
SYSTEM_PROMPT_TEMPLATE = """Du bist Senior Hospitality-Analyst. Du bekommst:
1. Alle vom System hochgeladenen Dokumente (parsed_text + extracted_kpis pro Dokument)
2. Branchen-Benchmarks für das passende Sub-Segment + die Größenklasse
3. Den Voice-Interview-Transcript (zur Cross-Validation)
4. Das Onboarding-Profil zur Einordnung

DEINE AUFGABE:
Schreibe eine Senior-Analyst-Daten-Analyse — wie ein Director einer Beratung,
der die Datenpakete des Klienten durchgelesen hat und nun zusammenfasst,
was tatsächlich in den Daten steht (nicht nur was der GF gesagt hat).

PRO DOKUMENT:
- 3-7 key_findings (echte Zahlen + ihre Bedeutung, nicht Generisches)
- anomalies (Werte die vom Benchmark p50 mehr als 20% abweichen — in beide Richtungen)
- confidence (high/medium/low — wie verlässlich ist das Dokument?)

KONSOLIDIERT:
- consolidated_kpis: alle wichtigen KPIs aus allen Docs zusammengeführt
- benchmark_assessment: wo steht das Haus laut Daten vs Branche (1-2 prägnante Absätze)
- data_quality_score: 0.0-1.0
- data_gaps: was du aus den Docs NICHT beantworten kannst (für den Reporter)
- cross_validation: stimmen die Aussagen aus dem Voice-Gespräch mit den Doc-Daten überein? Wenn Diskrepanz: nenne sie konkret.

KEINE LOBHUDELEI. KEINE GENERISCHEN AUSSAGEN. NUR WAS IN DEN DATEN STEHT.

OUTPUT — ausschließlich JSON in folgender Struktur:

{
  "insights": [
    {
      "document_name": "...",
      "doc_type": "...",
      "key_findings": ["Finding 1 mit Zahlen", "Finding 2 mit Zahlen", ...],
      "anomalies": ["Anomalie 1 vs Benchmark", "..."],
      "confidence": "high|medium|low"
    }
  ],
  "consolidated_kpis": {
    "adr_eur": 285,
    "occupancy_rate": 0.68,
    "...": "..."
  },
  "benchmark_assessment": "Das Haus liegt in Position X bei KPI Y, im oberen Quartil bei Z, deutlich unter Benchmark bei W.",
  "data_quality_score": 0.75,
  "data_gaps": ["Was fehlt"],
  "cross_validation": "Die Aussage vom GF zur Fluktuation (51%) bestätigt sich in der Excel-Personalstatistik. Discrepanz: GF sagt Direktbuchung 31%, Excel zeigt 35%."
}

{benchmarks_block}
"""


def _build_system_prompt(context: dict[str, Any]) -> str:
    company = context["company"]
    bench = benchmark_block(company.get("sub_segment"), company.get("size_class") or "M")
    return SYSTEM_PROMPT_TEMPLATE.replace("{benchmarks_block}", bench)


def _build_user_message(context: dict[str, Any]) -> str:
    company = context["company"]
    documents = context.get("documents", [])
    voice_transcript = context.get("voice_transcript")

    # Documents kompakt halten — nur das Wichtigste (sonst Token-Bomb).
    doc_payload = [
        {
            "filename": d.get("filename"),
            "doc_type": d.get("doc_type"),
            "parsed_text_excerpt": (d.get("parsed_text") or "")[:6000],
            "extracted_kpis": d.get("extracted_kpis") or {},
        }
        for d in documents
    ]

    return json.dumps(
        {
            "company": {
                "name": company.get("name"),
                "sub_segment": company.get("sub_segment"),
                "size_class": company.get("size_class") or "M",
                "annual_revenue_eur": company.get("annual_revenue_eur"),
            },
            "documents": doc_payload,
            "voice_transcript": (voice_transcript or "")[:4000],
        },
        ensure_ascii=False,
    )


def _parse(raw: dict, context: dict[str, Any]) -> DocumentAnalysisOutput:
    insights = [DocumentInsight(**i) for i in raw.get("insights", [])]
    return DocumentAnalysisOutput(
        insights=insights,
        consolidated_kpis=raw.get("consolidated_kpis", {}),
        benchmark_assessment=raw.get("benchmark_assessment", ""),
        data_quality_score=raw.get("data_quality_score", 0.5),
        data_gaps=raw.get("data_gaps", []),
        cross_validation=raw.get("cross_validation", ""),
    )


def build(context: dict[str, Any]) -> AgentSpec:
    return AgentSpec(
        name="document_analyst",
        system_prompt=_build_system_prompt(context),
        output_model=DocumentAnalysisOutput,
        build_user_message=_build_user_message,
        parse=_parse,
    )

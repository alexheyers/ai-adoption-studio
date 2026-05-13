"""Document-Analyst · läuft NACH dem Voice-Interview.

Aufgabe: Eigene strukturierte Analyse der hochgeladenen Dokumente — separat
von der Multi-Agent-Pipeline. Kunde sieht damit explizit, wie die KI seine
Daten interpretiert hat.

Output: pro Dokument key_findings + anomalies (vs Benchmark), konsolidierte
KPIs, Daten-Qualitäts-Score, Datenlücken, Cross-Validation gegen Voice-Aussagen.

Dieser Agent gibt dem Bericht einen "Senior-Analyst-Layer" — was hat der
Senior aus den Zahlen rausgelesen, bevor er empfiehlt.
"""
import json

from agents._client import call_agent
from schemas.outputs import DocumentAnalysisOutput, DocumentInsight
from knowledge import benchmarks_summary_text


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


def run(
    company: dict,
    documents: list[dict],
    voice_transcript: str | None = None,
) -> DocumentAnalysisOutput:
    """documents: Liste mit {filename, doc_type, parsed_text, extracted_kpis}"""

    sub_segment_raw = (company.get("sub_segment") or "boutique").lower()
    sub_segment_map = {
        "boutique-hotel": "boutique", "boutique": "boutique",
        "stadthotel": "stadthotel", "ferienhotel": "ferienhotel",
        "tagungshotel": "tagungshotel", "resort": "resort",
        "familienbetrieb": "familienbetrieb",
    }
    sub_segment = sub_segment_map.get(sub_segment_raw, "boutique")
    size_class = company.get("size_class") or "M"
    bench_text = benchmarks_summary_text(sub_segment, size_class)

    system = SYSTEM_PROMPT_TEMPLATE
    system = system.replace("{benchmarks_block}", bench_text)

    # Documents kompakt — nur das Wichtigste, sonst Token-Bomb
    doc_payload = []
    for d in documents:
        doc_payload.append({
            "filename": d.get("filename"),
            "doc_type": d.get("doc_type"),
            "parsed_text_excerpt": (d.get("parsed_text") or "")[:6000],
            "extracted_kpis": d.get("extracted_kpis") or {},
        })

    user_message = json.dumps({
        "company": {
            "name": company.get("name"),
            "sub_segment": company.get("sub_segment"),
            "size_class": size_class,
            "annual_revenue_eur": company.get("annual_revenue_eur"),
        },
        "documents": doc_payload,
        "voice_transcript": (voice_transcript or "")[:4000],
    }, ensure_ascii=False)

    raw = call_agent(system, user_message)

    insights = [DocumentInsight(**i) for i in raw.get("insights", [])]
    return DocumentAnalysisOutput(
        insights=insights,
        consolidated_kpis=raw.get("consolidated_kpis", {}),
        benchmark_assessment=raw.get("benchmark_assessment", ""),
        data_quality_score=raw.get("data_quality_score", 0.5),
        data_gaps=raw.get("data_gaps", []),
        cross_validation=raw.get("cross_validation", ""),
    )

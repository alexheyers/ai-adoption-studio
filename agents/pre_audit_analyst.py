"""Pre-Audit-Analyst · läuft VOR dem Voice-Interview.

Aufgabe: aus Onboarding-Daten + Web-Research + parsed Documents
5-7 datengetriebene Hypothesen generieren — mit Confidence, Evidenz,
Benchmark-Vergleich, Push-Back-Frage für Ada, Quantifizierungs-Formel.

Diese Hypothesen werden zum KERN des Voice-Interviews — Ada arbeitet sie
strukturiert ab statt generische Fragen abzuhaken.

Senior-Consultant-Niveau: nicht oberflächlich nach Datenpunkten suchen,
sondern Working-Hypothesis-Ketten bauen wie ein McKinsey-Hospitality-Senior.
"""
import json

from agents._client import call_agent
from schemas.outputs import PreAuditOutput, Hypothesis
from knowledge import benchmarks_for, benchmarks_summary_text, case_studies_summary_text, trends_summary_text
from agents.knowledge_refresher import pulse_summary_text


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


def run(
    company: dict,
    documents_summary: str = "",
    web_research: dict | None = None,
    voice_transcript: str | None = None,
) -> PreAuditOutput:
    """Generiert datengetriebene Hypothesen. voice_transcript optional — auch ohne Voice nutzbar."""

    sub_segment_raw = (company.get("sub_segment") or "boutique").lower()
    # Mapping auf Knowledge-Pack-Keys
    sub_segment_map = {
        "boutique-hotel": "boutique",
        "boutique": "boutique",
        "stadthotel": "stadthotel",
        "ferienhotel": "ferienhotel",
        "tagungshotel": "tagungshotel",
        "resort": "resort",
        "hotelgruppe": "boutique",
        "familienbetrieb": "familienbetrieb",
        "gastronomie": "gastronomie_voll",
    }
    sub_segment = sub_segment_map.get(sub_segment_raw, "boutique")
    size_class = company.get("size_class") or "M"

    bench_text = benchmarks_summary_text(sub_segment, size_class)
    trends_text = trends_summary_text(max_items=8)
    cs_text = case_studies_summary_text(filter_segment=sub_segment, max_items=6)
    pulse_text = pulse_summary_text(max_items_per_bucket=2)

    system = SYSTEM_PROMPT_TEMPLATE
    system = system.replace("{benchmarks_block}", bench_text)
    system = system.replace("{trends_block}", trends_text)
    system = system.replace("{pulse_block}", pulse_text)
    system = system.replace("{case_studies_block}", cs_text)

    user_message = json.dumps({
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
        "web_research": web_research or {},
        "voice_transcript_if_available": (voice_transcript or "")[:2000],
    }, ensure_ascii=False)

    raw = call_agent(system, user_message)

    hyps = [Hypothesis(**h) for h in raw.get("hypotheses", [])]
    return PreAuditOutput(
        hypotheses=hyps,
        overall_situation=raw.get("overall_situation", ""),
        suggested_focus_topics=raw.get("suggested_focus_topics", []),
        data_gaps=raw.get("data_gaps", []),
        data_recap_for_voice=raw.get("data_recap_for_voice", ""),
    )

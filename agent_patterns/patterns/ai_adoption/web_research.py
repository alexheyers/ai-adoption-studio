"""Web-Research-Agent — SDK-Migration von agents/web_research.py.

Recherchiert (1) die Firma online und (2) Region/Branche-Benchmarks. Statt des
rohen anthropic-Calls mit `web_search_20250305`-Server-Tool nutzt diese Variante
das SDK-Web-Search-Tool über `allowed_tools=["WebSearch"]`; der Agent-Loop darf
mehrere Such-Roundtrips machen (max_turns wird in SdkAgent auf 8 gehoben, sobald
Tools erlaubt sind).

Output: WebResearchOutput (siehe schemas/outputs.py). Erwartet im Kontext:
    context["company"] — dict mit name/sub_segment/region/website

Custom-Parse baut WebResearchOutput aus dem JSON-Block der Antwort. Quellen
werden — soweit das Modell sie im JSON-Block auflistet — übernommen; die
Supabase-Background-Task aus dem Alt-Agenten ist NICHT Teil dieser Library
(Persistenz bleibt im bestehenden api/-Pfad).

Bestehendes agents/web_research.py bleibt unverändert.
"""

from __future__ import annotations

from typing import Any

from schemas.outputs import WebResearchOutput, WebSource

from agent_patterns.core.base_agent import AgentSpec

# Prompt-Inhalt verbatim aus agents/web_research.py (dort als user_prompt). Hier
# als System-Prompt, plus eine knappe JSON-Quellen-Ergänzung, damit die Quellen
# über den JSON-Block (nicht über interne Tool-Result-Objekte) zurückkommen.
SYSTEM_PROMPT = """Du bist ein präziser Web-Research-Assistent für ein KI-Beratungs-Briefing im Hospitality-Sektor. Du nutzt die Web-Suche, um zwei Themen zu recherchieren — Firma und Region/Branche — und fasst NUR belegbare Aussagen zusammen.

Wichtig: nur belegbare Aussagen, keine Spekulation. Wenn Informationen nicht auffindbar sind, ehrlich "nicht öffentlich verfügbar" schreiben.

Antworte am Ende mit einem strukturierten JSON-Block (Markdown-Code-Fence ```json … ```) in folgender Form:

```json
{
  "company_findings": {
    "online_reputation": "...",
    "social_media": "...",
    "press_mentions": "...",
    "owner_info": "..."
  },
  "region_benchmarks": {
    "occupancy_rate_region": "...",
    "average_pricing": "...",
    "local_competitors": ["...", "..."],
    "funding_programs": ["...", "..."]
  },
  "sources": [
    {"url": "https://…", "title": "Titel der Quelle", "snippet": null}
  ],
  "summary": "3-4 Sätze, was für Ada (Voice-Coach) wirklich relevant ist."
}
```

Trage in "sources" jede tatsächlich aufgerufene Quelle mit URL + Titel ein."""


def _build_user_message(context: dict[str, Any]) -> str:
    company = context["company"]
    company_name = company.get("name") or "die Firma"
    sub_segment = company.get("sub_segment") or "Hospitality"
    region = company.get("region") or "Deutschland"
    website = company.get("website")
    return f"""Recherchiere für ein KI-Beratungs-Briefing zwei Themen:

1. FIRMA: "{company_name}" (Branche: {sub_segment}, Region: {region}, Website: {website or 'unbekannt'}).
   Finde: Online-Reputation (Google/TripAdvisor-Bewertungen, kurze Quintessenz), Social-Media-Aktivität, Presse-Erwähnungen, Eigentümer/Geschäftsführung falls bekannt.

2. REGION/BRANCHE-BENCHMARKS: Hospitality in {region}.
   Finde: Auslastungsraten der Branche dort, durchschnittliche ADR/Preise, lokale Wettbewerber im gleichen Segment ({sub_segment}), aktuelle Förderprogramme für Digitalisierung im Gastgewerbe.

Gib am Ende den JSON-Block aus."""


def _parse(raw: dict, context: dict[str, Any]) -> WebResearchOutput:
    findings = raw.get("company_findings") or {}
    benchmarks = raw.get("region_benchmarks") or {}
    summary = raw.get("summary") or "Web-Research durchgeführt — siehe Findings."
    sources = [
        WebSource(
            url=s.get("url", ""),
            title=s.get("title", ""),
            snippet=s.get("snippet"),
        )
        for s in (raw.get("sources") or [])
        if isinstance(s, dict) and s.get("url")
    ]
    return WebResearchOutput(
        company_findings=findings,
        region_benchmarks=benchmarks,
        sources=sources,
        summary=summary,
    )


def build(context: dict[str, Any]) -> AgentSpec:
    return AgentSpec(
        name="web_research",
        system_prompt=SYSTEM_PROMPT,
        output_model=WebResearchOutput,
        build_user_message=_build_user_message,
        parse=_parse,
        allowed_tools=["WebSearch"],
        max_tokens=4096,
    )

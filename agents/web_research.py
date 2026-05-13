"""Web-Research-Agent (Architektur 2.1).

Nutzt das Anthropic-Server-Side Web-Search-Tool, um:
  1. Die Firma online zu finden (Website, Bewertungen, Presse, LinkedIn)
  2. Region/Stadt-Benchmarks für Hospitality zu sammeln
  3. Quellen sauber zu dokumentieren

Output: WebResearchOutput (siehe schemas/outputs.py).
"""
import json
import time

from anthropic import Anthropic

from config import ANTHROPIC_API_KEY
from schemas.outputs import WebResearchOutput, WebSource
from agents._supabase import get_client

_anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)
MODEL = "claude-sonnet-4-6"


def _research_with_web_search(company: dict) -> tuple[dict, list[dict], str]:
    """Macht zwei Suchen: Firma + Region/Branche-Benchmarks.

    Returnt (combined_findings, sources_list, summary_text).
    """
    company_name = company.get("name") or "die Firma"
    sub_segment = company.get("sub_segment") or "Hospitality"
    region = company.get("region") or "Deutschland"
    website = company.get("website")

    user_prompt = f"""Recherchiere für ein KI-Beratungs-Briefing zwei Themen:

1. FIRMA: "{company_name}" (Branche: {sub_segment}, Region: {region}, Website: {website or 'unbekannt'}).
   Finde: Online-Reputation (Google/TripAdvisor-Bewertungen, kurze Quintessenz), Social-Media-Aktivität, Presse-Erwähnungen, Eigentümer/Geschäftsführung falls bekannt.

2. REGION/BRANCHE-BENCHMARKS: Hospitality in {region}.
   Finde: Auslastungsraten der Branche dort, durchschnittliche ADR/Preise, lokale Wettbewerber im gleichen Segment ({sub_segment}), aktuelle Förderprogramme für Digitalisierung im Gastgewerbe.

Antworte am Ende mit einem strukturierten JSON-Block in folgender Form (Markdown-Code-Fence):

```json
{{
  "company_findings": {{
    "online_reputation": "...",
    "social_media": "...",
    "press_mentions": "...",
    "owner_info": "..."
  }},
  "region_benchmarks": {{
    "occupancy_rate_region": "...",
    "average_pricing": "...",
    "local_competitors": ["...", "..."],
    "funding_programs": ["...", "..."]
  }},
  "summary": "3-4 Sätze, was für Ada (Voice-Coach) wirklich relevant ist."
}}
```

Wichtig: nur belegbare Aussagen, keine Spekulation. Wenn Informationen nicht auffindbar sind, ehrlich "nicht öffentlich verfügbar" schreiben."""

    try:
        response = _anthropic.messages.create(
            model=MODEL,
            max_tokens=4096,
            tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 6}],
            messages=[{"role": "user", "content": user_prompt}],
        )
    except Exception as e:
        return (
            {"error": f"Web-Search nicht verfügbar: {e}"},
            [],
            f"Web-Research fehlgeschlagen: {e}. Mögliche Ursache: API-Tier hat web_search nicht freigeschaltet, oder Modell-Name nicht aktuell.",
        )

    sources: list[dict] = []
    json_payload: dict = {}

    for block in response.content:
        block_type = getattr(block, "type", "")
        if block_type == "text":
            text = block.text
            # Suche JSON-Block
            try:
                fence_start = text.find("```json")
                if fence_start != -1:
                    fence_end = text.find("```", fence_start + 7)
                    if fence_end != -1:
                        json_text = text[fence_start + 7:fence_end].strip()
                        json_payload = json.loads(json_text)
            except Exception:
                pass
        elif block_type == "web_search_tool_result":
            for item in getattr(block, "content", []) or []:
                if isinstance(item, dict) and item.get("type") == "web_search_result":
                    sources.append({
                        "url": item.get("url", ""),
                        "title": item.get("title", ""),
                        "snippet": (item.get("encrypted_content") or "")[:200] if False else None,
                    })
                else:
                    url = getattr(item, "url", None)
                    title = getattr(item, "title", None)
                    if url:
                        sources.append({"url": url, "title": title or "", "snippet": None})

    findings = json_payload.get("company_findings") or {}
    benchmarks = json_payload.get("region_benchmarks") or {}
    summary = json_payload.get("summary") or "Web-Research durchgeführt — siehe Findings."

    return (
        {"company": findings, "region": benchmarks},
        sources,
        summary,
    )


def run(company: dict) -> WebResearchOutput:
    """Synchroner Run — wird für Smoke-Tests + direktes CLI-Aufruf genutzt."""
    combined, sources, summary = _research_with_web_search(company)
    return WebResearchOutput(
        company_findings=combined.get("company") or {},
        region_benchmarks=combined.get("region") or {},
        sources=[WebSource(**s) for s in sources if s.get("url")],
        summary=summary,
    )


def run_research_async(research_id: str, company: dict, user_jwt: str) -> None:
    """Background-Task — wird von api/routers/research.py aufgerufen."""
    sb = get_client(user_jwt=user_jwt)
    started = time.time()
    try:
        sb.table("web_research").update({"status": "in_progress"}).eq("id", research_id).execute()

        output = run(company)

        sb.table("web_research").update({
            "company_findings": output.company_findings,
            "region_benchmarks": output.region_benchmarks,
            "sources": [s.model_dump() for s in output.sources],
            "status": "completed",
            "completed_at": "now()",
        }).eq("id", research_id).execute()

        print(f"[web_research] {research_id} fertig in {time.time()-started:.1f}s — {len(output.sources)} Quellen")
    except Exception as e:
        sb.table("web_research").update({
            "status": "failed",
            "company_findings": {"error": str(e)[:500]},
        }).eq("id", research_id).execute()
        raise

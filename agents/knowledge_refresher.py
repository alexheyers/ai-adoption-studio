"""Knowledge-Refresher · holt aktuelle Branchen-Daten via Web-Search.

Aufgabe: Knowledge-Pack frisch halten. Läuft entweder:
- wöchentlich via Cron auf dem VPS (deep_refresh: alle 5 YAMLs)
- vor jedem Pipeline-Run (light_pulse: nur die akut-wichtigsten Trends)

Ergebnis wird in `knowledge/pulse_{date}.yaml` geschrieben + CHANGELOG.md gepflegt.
Pre-Audit-Analyst lädt den jüngsten Pulse zusätzlich zum statischen Knowledge-Pack.
"""
import os
import json
import yaml
from datetime import datetime, timedelta
from pathlib import Path

from anthropic import Anthropic
from config import ANTHROPIC_API_KEY


KNOWLEDGE_DIR = Path(__file__).parent.parent / "knowledge"
PULSE_DIR = KNOWLEDGE_DIR / "pulse"
CHANGELOG = KNOWLEDGE_DIR / "CHANGELOG.md"

_anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)


PULSE_PROMPT = """Du bist Senior-Researcher für Hospitality-Branchen-Daten DACH. Deine Aufgabe: hole die WICHTIGSTEN Markt-Updates aus den letzten 7-14 Tagen via Web-Search.

FOKUS-BEREICHE (in dieser Reihenfolge):
1. OTA-Markt-Updates (Booking.com, Expedia, HRS — Provisions-Änderungen, neue Features, Mega-Deals)
2. Personal-Markt Hospitality DACH (DEHOGA-Statistiken, Tarif-Anpassungen, Recruiting-Trends)
3. KI-Adoption Hospitality (neue Tools live, große Vendor-Releases, Markt-Studien)
4. Regulatorik (EU AI-Act-Updates, DSGVO-Urteile mit Hospitality-Bezug, neue HACCP/TSE-Anforderungen)
5. Vendor-Pricing-Bewegungen (PMS, Channel-Manager, Chatbot — wer hat Preise geändert)
6. Förder-Programme DACH (neue Bewilligungs-Runden, geänderte Kriterien)

ARBEITSWEISE:
- Nutze Web-Search für 4-6 gezielte Anfragen (max 6 Tool-Calls)
- Pro Bereich 2-4 konkrete Fakten mit Datum + Quelle
- Keine generische Beobachtungen ("KI wird wichtiger") — nur HARTE Updates
- Wenn nichts Neues in einem Bereich: das auch sagen ("keine Updates KW XX")

OUTPUT — strikt JSON in folgender Struktur:

{
  "pulse_date": "2026-05-11",
  "calendar_week": 19,
  "summary": "2-3 Sätze: was sind die 2-3 wichtigsten Updates dieser Woche für Hospitality-KI-Berater",
  "ota_updates": [{"finding": "...", "date": "2026-05-08", "source_url": "..."}],
  "labor_market_updates": [...],
  "ai_adoption_updates": [...],
  "regulatory_updates": [...],
  "vendor_pricing_updates": [...],
  "funding_updates": [...],
  "implications_for_advisory": "2-3 Sätze: was bedeutet das für unsere Beratungs-Empfehlungen — welche Use-Cases haben jetzt mehr/weniger Priorität, welche Vendoren ändern sich"
}
"""


def refresh_pulse() -> dict:
    """Holt aktuelle Branchen-Daten + schreibt nach knowledge/pulse/."""
    PULSE_DIR.mkdir(parents=True, exist_ok=True)

    today = datetime.utcnow().strftime("%Y-%m-%d")
    print(f"[refresher] Pulse-Refresh für {today} …")

    try:
        response = _anthropic.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=12000,
            tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 6}],
            messages=[{"role": "user", "content": PULSE_PROMPT}],
        )
    except Exception as e:
        print(f"[refresher] Web-Search-Call fehlgeschlagen: {e}")
        return {"error": str(e)}

    payload = {}
    sources_collected = []
    for block in response.content:
        block_type = getattr(block, "type", "")
        if block_type == "text":
            text = block.text
            fence_start = text.find("```json")
            if fence_start != -1:
                fence_end = text.find("```", fence_start + 7)
                if fence_end != -1:
                    try:
                        payload = json.loads(text[fence_start + 7:fence_end].strip())
                    except json.JSONDecodeError:
                        pass
            if not payload:
                # Fallback: erste/letzte braces
                first = text.find("{")
                last = text.rfind("}")
                if first != -1 and last != -1:
                    try:
                        payload = json.loads(text[first:last + 1])
                    except json.JSONDecodeError:
                        pass
        elif block_type == "web_search_tool_result":
            for item in getattr(block, "content", []) or []:
                url = getattr(item, "url", None)
                title = getattr(item, "title", None)
                if url:
                    sources_collected.append({"url": url, "title": title})

    payload["_collected_sources"] = sources_collected
    payload["_refreshed_at"] = today

    out_path = PULSE_DIR / f"pulse_{today}.yaml"
    out_path.write_text(yaml.safe_dump(payload, allow_unicode=True, sort_keys=False), encoding="utf-8")
    print(f"[refresher] Geschrieben: {out_path.name} · {len(sources_collected)} Quellen")

    # CHANGELOG pflegen
    cl_entry = (
        f"\n## {today} · Pulse-Refresh\n"
        f"- {payload.get('summary', 'kein summary')}\n"
        f"- Quellen: {len(sources_collected)}\n"
        f"- File: pulse/pulse_{today}.yaml\n"
    )
    if CHANGELOG.exists():
        CHANGELOG.write_text(cl_entry + CHANGELOG.read_text(encoding="utf-8"), encoding="utf-8")
    else:
        CHANGELOG.write_text("# Knowledge-Pack Changelog\n" + cl_entry, encoding="utf-8")

    return payload


def latest_pulse(max_age_days: int = 14) -> dict | None:
    """Lädt den jüngsten Pulse, wenn er nicht zu alt ist. None sonst → caller kann refresh_pulse() auslösen."""
    if not PULSE_DIR.exists():
        return None
    files = sorted(PULSE_DIR.glob("pulse_*.yaml"), reverse=True)
    if not files:
        return None
    latest = files[0]
    try:
        date_str = latest.stem.replace("pulse_", "")
        date = datetime.strptime(date_str, "%Y-%m-%d")
        if datetime.utcnow() - date > timedelta(days=max_age_days):
            return None
        return yaml.safe_load(latest.read_text(encoding="utf-8"))
    except Exception:
        return None


def pulse_summary_text(max_items_per_bucket: int = 2) -> str:
    """Kompakte Pulse-Zusammenfassung für Agent-Prompts."""
    p = latest_pulse()
    if not p:
        return "PULSE: kein aktueller Branchen-Pulse verfügbar (Refresher nicht gelaufen oder älter als 14 Tage)."
    lines = [f"BRANCHEN-PULSE · Stand {p.get('_refreshed_at', '?')} · KW {p.get('calendar_week', '?')}:"]
    lines.append(f"Summary: {p.get('summary', '')}")
    for bucket in ["ota_updates", "labor_market_updates", "ai_adoption_updates",
                   "regulatory_updates", "vendor_pricing_updates", "funding_updates"]:
        items = p.get(bucket, [])
        if items:
            lines.append(f"\n{bucket}:")
            for it in items[:max_items_per_bucket]:
                if isinstance(it, dict):
                    f = it.get("finding", "")
                    d = it.get("date", "")
                    lines.append(f"  · ({d}) {f}")
                else:
                    lines.append(f"  · {it}")
    impl = p.get("implications_for_advisory", "")
    if impl:
        lines.append(f"\nImplikationen für Beratung: {impl}")
    return "\n".join(lines)


if __name__ == "__main__":
    import sys
    if "--check" in sys.argv:
        p = latest_pulse()
        if p:
            print(f"Letzter Pulse: {p.get('_refreshed_at')}")
            print(pulse_summary_text())
        else:
            print("Kein aktueller Pulse — refresh_pulse() laufen lassen.")
    else:
        refresh_pulse()
        print("\n--- SUMMARY ---")
        print(pulse_summary_text())

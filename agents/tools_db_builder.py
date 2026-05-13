"""Tools-DB-Builder · tagesaktuelle Hospitality-Tools-Recherche.

Baut/refresht knowledge/hospitality_tools_db.yaml — eine umfassende, durch
Web-Search aktuell gehaltene Vendor-Datenbank für Hospitality DACH 2026.

Pro Tool 20+ Felder inkl. COMPLIANCE-BLOCK (EU-Hosting, AVV, AI-Act-Klassifikation,
TSE-Konformität, DSGVO-Verarbeitungsverzeichnis, Datenstandort, Audit-Trails).

Run-Modi:
  python -m agents.tools_db_builder            # Voll-Refresh (alle Kategorien, ~30 Min, hoher Token-Verbrauch)
  python -m agents.tools_db_builder --partial  # Nur die ältesten 3 Kategorien
  python -m agents.tools_db_builder --check    # Status der DB anzeigen
"""
import json
import sys
import time
from datetime import datetime
from pathlib import Path

import yaml
from anthropic import Anthropic

from config import ANTHROPIC_API_KEY


KNOWLEDGE_DIR = Path(__file__).parent.parent / "knowledge"
TOOLS_DB_PATH = KNOWLEDGE_DIR / "hospitality_tools_db.yaml"

_anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)


# 18 Tool-Kategorien für Hospitality DACH — vollständige Abdeckung
CATEGORIES = [
    ("pms", "Property Management System", "Apaleo · Mews · protel/Planet · Oracle Opera Cloud · HS/3 · Cloudbeds · ASA · Sihot · ibelsa"),
    ("channel_manager", "Channel Manager", "SiteMinder · Cubilis/Stardekk · DerbySoft · myallocator · Hotel-Spider"),
    ("booking_engine", "Booking Engine", "DIRS21 · Bookassist · ibelsa.bookingengine · Hotel.de · TrustYou-Booking · GauVendi"),
    ("crm_guest", "Guest CRM + Marketing-Automation", "Revinate · Re:Guest/ReGuest · Brevo · Mailchimp · CodeYourself · Bookboost"),
    ("reputation", "Bewertungs-Management", "Customer Alliance · TrustYou · ReviewPro · Olery · Trustpilot · Hotelpartner"),
    ("chatbot_messaging", "Chatbots + Messaging (Web + WhatsApp)", "Chatlyn · Asksuite · HiJiffy · Quicktext · Easy WhatsApp · Bookboost"),
    ("voice_ai", "Voice-AI + Telefon-Bots", "ElevenLabs Convai · Vapi · Annette · Bland · Synthflow"),
    ("hr_scheduling", "Personal/Dienstplan/HR", "Hotelkit Operations · Planday · Papershift · Crewmeister · Personio · Sage-HR · SmartRecruiters"),
    ("pos_cash", "Kassensysteme F&B + Handhelds", "Vectron · Lightspeed · Gastronovi · enfore · Hypersoft · MICROS Simphony · orderbird · NCR Aloha · Quorion · Helios + HANDHELDS: Sunmi · iPad/iOS-POS · Vectron Mobile · Resy Server"),
    ("accounting_steuerberater", "Buchhaltung + Steuerberater-Anbindung", "DATEV Unternehmen Online · lexoffice · Buchhaltungsbutler · sevDesk · BMD · Addison · scopevisio · Candis (Belegerkennung)"),
    ("telephony", "Telefonanlagen / Cloud-Telefonie", "3CX · sipgate · NFON · Placetel · Easybell · CallOne · Swyx · Mitel"),
    ("inhouse_communication", "Inhouse-Kommunikation + Schicht-Übergabe", "Hotelkit · Optii · Beekeeper · Quinyx · Crewmeister-Chat · Slack/Teams (generisch) · WhatsApp Business"),
    ("procurement", "Beschaffung + Lieferanten-Mgmt", "POS-Pilot · Foodnotify · KostenfreiBestellen · Apicbase · Choco · Marketman · Otto Office Hotel · Hospitality-Cloud"),
    ("energy_facility", "Energie-Monitoring + Smart-Building", "EBP-Hotel · Caverion · Innogy SmartHome · Hotelpartner-Energy · Loxone · KNX-Systeme · Ecogator · Belimo · Smappee"),
    ("maintenance_tickets", "Wartung + Ticketing", "Hotelkit Wartung · Optii · MaintainX · UpKeep · Limble · Snapfix · QM-Hotel"),
    ("revenue_mgmt", "Revenue-Management-Systeme", "IdeaS · Atomize · Duetto · BEONx · Pace Revenue · OTA Insight · RateGain · Rate-Highway"),
    ("marketing_automation", "Marketing-Automation + Newsletter", "Brevo · Mailchimp · Klaviyo · GetResponse · ActiveCampaign · CleverReach · Revinate"),
    ("it_security", "IT-Security + Backup", "Acronis · Veeam · Dropbox-Business · OneDrive-Business · Cyberprotection · Trend Micro · NordLayer · 1Password Business"),
]


CATEGORY_RESEARCH_PROMPT = """Du bist Senior Hospitality-Tech-Researcher mit Schwerpunkt DACH-Mittelstand. Deine Aufgabe: aktuelle, fundierte Recherche zur Kategorie:

**{category_name}**
Bekannte Marktteilnehmer: {known_vendors}

Recherchiere via Web-Search (max 6 Suchen). Erfasse pro Vendor folgende Felder:

ALLGEMEIN:
- name, website, country_of_origin, founded_year
- tier (enterprise / smb / bootstrap)
- monthly_cost_eur: pro Hausgröße (S/M/L) — Schätzung wenn nicht öffentlich

FUNKTION:
- core_features (3-7 Bullets, was es wirklich macht)
- target_segment (welche Hotel-Typen passen — boutique/stadt/resort/familien etc)
- strengths (2-3 Bullets)
- watch_outs (2-3 Bullets, was zu beachten ist)

INTEGRATION:
- native_integrations (welche PMS/Channel/Booking-Engine sind nativ angebunden)
- has_api (true/false, REST/GraphQL/SOAP)
- api_docs_url (wenn öffentlich)
- export_formats (CSV / DATEV / Excel etc)

COMPLIANCE-BLOCK (PFLICHT):
- eu_hosting (true/false — Server in EU/EWR?)
- data_residency_country (DE/AT/IE/US etc)
- avv_available (true/false — AVV nach Art. 28 DSGVO verfügbar?)
- gdpr_status (DPA-Verarbeitungsverzeichnis-Vorlage vorhanden?)
- ai_act_classification (minimal/limited/high/n_a — falls KI-Komponenten enthalten)
- audit_trails (true/false — sind Aktionen revisionssicher loggbar?)
- iso_certifications (ISO 27001 etc — wenn vorhanden)
- tse_konform (für POS: TSE-Konformität gemäß KassenSichV — true/false)
- gobd_konform (für Buchhaltung — true/false)
- pen_test_disclosed (führt Vendor öffentliche Pen-Tests durch?)

MARKT (DACH):
- market_share_dach_estimate (low/medium/high oder Prozent wenn bekannt)
- recent_news_2025_2026 (1-3 wichtige Releases/Änderungen der letzten 12 Monate)
- typical_replacement_for (welche älteren Tools werden dadurch oft abgelöst)
- switching_complexity (low/medium/high — Aufwand bei Migration)

KEINE Halluzination: Wenn ein Feld nicht recherchierbar ist, schreibe "unbekannt" — niemals raten.

OUTPUT — strikt JSON in dieser Struktur:

{{
  "category": "{category_id}",
  "category_label": "{category_name}",
  "researched_at": "{today}",
  "vendors": [
    {{
      "name": "...", "website": "...", "country_of_origin": "...", "founded_year": 2014,
      "tier": "smb", "monthly_cost_eur": {{"S": 95, "M": 220, "L": 480}},
      "core_features": ["..."], "target_segment": ["boutique", "stadthotel"],
      "strengths": ["..."], "watch_outs": ["..."],
      "native_integrations": {{"pms": ["Mews"], "channel_manager": ["SiteMinder"]}},
      "has_api": true, "api_docs_url": "...", "export_formats": ["DATEV"],
      "compliance": {{
        "eu_hosting": true, "data_residency_country": "DE", "avv_available": true,
        "gdpr_status": "DPA verfügbar", "ai_act_classification": "n_a",
        "audit_trails": true, "iso_certifications": ["ISO 27001"],
        "tse_konform": "n_a", "gobd_konform": "n_a", "pen_test_disclosed": "unbekannt"
      }},
      "market_share_dach_estimate": "high", "recent_news_2025_2026": ["..."],
      "typical_replacement_for": ["..."], "switching_complexity": "medium"
    }}
  ],
  "category_summary": "2-3 Sätze: was zeichnet diese Kategorie 2026 aus, wer dominiert DACH, welche Trends"
}}
"""


def research_category(cat_id: str, cat_label: str, known: str) -> dict:
    today = datetime.now().strftime("%Y-%m-%d")
    prompt = CATEGORY_RESEARCH_PROMPT.format(
        category_id=cat_id, category_name=cat_label, known_vendors=known, today=today,
    )
    try:
        # Streaming, weil Web-Search-Calls länger als 10 Min dauern können
        with _anthropic.messages.stream(
            model="claude-sonnet-4-6",
            max_tokens=24000,
            tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}],
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            response = stream.get_final_message()
    except Exception as e:
        return {"category": cat_id, "error": f"web_search call failed: {e}"}

    payload = {}
    raw_snippet = ""
    for block in response.content:
        bt = getattr(block, "type", "")
        if bt == "text":
            text = block.text
            raw_snippet = text[:600]
            # Versuch 1: ```json fenced
            fence_start = text.find("```json")
            if fence_start != -1:
                fence_end = text.find("```", fence_start + 7)
                if fence_end != -1:
                    payload = _try_parse(text[fence_start + 7:fence_end].strip())
            # Versuch 2: erste { bis letzte }
            if not payload:
                first = text.find("{")
                last = text.rfind("}")
                if first != -1 and last != -1:
                    payload = _try_parse(text[first:last + 1])
            if payload:
                break

    if not payload:
        return {"category": cat_id, "error": f"no parseable JSON · raw: {raw_snippet[:300]}"}
    return payload


def _try_parse(s: str) -> dict | None:
    """Robuster Parser: tolerant gegen trailing-commas, unescaped newlines in strings,
    abgeschnittene Tail-Bytes (max_tokens-Truncation)."""
    import re
    # Versuch 1: pur
    try:
        return json.loads(s)
    except json.JSONDecodeError:
        pass
    # Versuch 2: trailing-commas killen
    cleaned = re.sub(r",(\s*[}\]])", r"\1", s)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass
    # Versuch 3: am letzten kompletten ``"<key>": <value>``-Eintrag abschneiden
    # (Truncation-Recovery — schneidet vorletzte Klammer-Tiefe ab)
    depth = 0
    last_safe = -1
    for i, ch in enumerate(cleaned):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                last_safe = i + 1
    if last_safe > 0:
        try:
            return json.loads(cleaned[:last_safe])
        except json.JSONDecodeError:
            pass
    return None


def load_existing_db() -> dict:
    if TOOLS_DB_PATH.exists():
        return yaml.safe_load(TOOLS_DB_PATH.read_text(encoding="utf-8")) or {}
    return {}


def save_db(db: dict) -> None:
    TOOLS_DB_PATH.write_text(
        yaml.safe_dump(db, allow_unicode=True, sort_keys=False),
        encoding="utf-8",
    )


def get_oldest_categories(db: dict, n: int = 3) -> list[str]:
    """Findet die n ältesten Kategorien (für inkrementellen Refresh)."""
    cats = db.get("categories", {})
    if not cats:
        return [c[0] for c in CATEGORIES[:n]]
    sorted_cats = sorted(cats.items(), key=lambda x: x[1].get("researched_at", "0000-01-01"))
    return [c[0] for c in sorted_cats[:n]]


def refresh_categories(category_ids: list[str]) -> dict:
    """Recherchiert die genannten Kategorien."""
    db = load_existing_db()
    if "categories" not in db:
        db["categories"] = {}

    cat_map = {c[0]: c for c in CATEGORIES}

    for cid in category_ids:
        if cid not in cat_map:
            print(f"[tools_db] Unbekannte Kategorie: {cid}")
            continue
        _, label, known = cat_map[cid]
        print(f"[tools_db] Researching {cid} · {label} …")
        result = research_category(cid, label, known)
        if "error" in result:
            print(f"  ✗ {result['error']}")
        else:
            db["categories"][cid] = result
            v = len(result.get("vendors", []))
            print(f"  ✓ {v} Vendoren erfasst")
        time.sleep(65)  # Anthropic-Rate-Limit-Schutz (Tier 1: 30k Input-Token/Min; bei Web-Search-Tool kann Input-Last hoch sein → 65s sicher)

    db["last_refresh"] = datetime.now().isoformat()
    db["category_count"] = len(db["categories"])
    db["total_vendor_count"] = sum(
        len(c.get("vendors", [])) for c in db["categories"].values()
    )
    save_db(db)
    print(f"\n[tools_db] Gespeichert · {db['category_count']} Kategorien · {db['total_vendor_count']} Vendoren")
    return db


def full_refresh() -> dict:
    """Voll-Refresh aller 18 Kategorien."""
    return refresh_categories([c[0] for c in CATEGORIES])


def partial_refresh(n: int = 3) -> dict:
    """Nur die n ältesten Kategorien refreshen."""
    db = load_existing_db()
    oldest = get_oldest_categories(db, n)
    print(f"[tools_db] Inkrementeller Refresh: {oldest}")
    return refresh_categories(oldest)


def tools_db_summary_text(category_filter: str | None = None, max_vendors_per_cat: int = 5) -> str:
    """Kompakte Repräsentation der Tools-DB für Agent-Prompts."""
    db = load_existing_db()
    if not db.get("categories"):
        return "TOOLS-DB: noch nicht aufgebaut · python -m agents.tools_db_builder ausführen."
    lines = [f"HOSPITALITY-TOOLS-DB · Stand {db.get('last_refresh', '?')[:10]} · {db.get('total_vendor_count', 0)} Vendoren in {db.get('category_count', 0)} Kategorien"]
    for cid, cdata in db["categories"].items():
        if category_filter and cid != category_filter:
            continue
        lines.append(f"\n[{cid}] {cdata.get('category_label', '')}")
        for v in (cdata.get("vendors") or [])[:max_vendors_per_cat]:
            comp = v.get("compliance", {})
            eu = "EU" if comp.get("eu_hosting") else "non-EU"
            tse = " · TSE" if comp.get("tse_konform") is True else ""
            cost = v.get("monthly_cost_eur", {})
            cost_str = ",".join(f"{k}:{v}" for k, v in cost.items() if isinstance(v, (int, float)))
            lines.append(f"  · {v.get('name', '?')} · {v.get('tier', '?')} · {eu}{tse} · {cost_str}€/Mo · {v.get('market_share_dach_estimate', '?')}-Marktanteil")
    return "\n".join(lines)


if __name__ == "__main__":
    if "--check" in sys.argv:
        db = load_existing_db()
        print(f"DB-Stand: {TOOLS_DB_PATH}")
        print(f"  last_refresh: {db.get('last_refresh', 'nie')}")
        print(f"  categories: {db.get('category_count', 0)} / {len(CATEGORIES)}")
        print(f"  vendors: {db.get('total_vendor_count', 0)}")
        print(f"  cat-list: {list(db.get('categories', {}).keys())}")
    elif "--partial" in sys.argv:
        n = 3
        for arg in sys.argv:
            if arg.startswith("--n="):
                n = int(arg.split("=")[1])
        partial_refresh(n)
    elif "--category" in sys.argv:
        idx = sys.argv.index("--category")
        cid = sys.argv[idx + 1]
        refresh_categories([cid])
    else:
        full_refresh()

"""Knowledge-Extras — read-only Zugriff auf weitere Teile des `knowledge`-Packs.

Ergänzt `knowledge_tool.py` um die Blöcke, die die zusätzlich migrierten Agenten
brauchen (Trends, Vendor-Landschaft, Compliance-Regelwerk, Knowledge-Pulse).

Wie `knowledge_tool.py` ist auch dieses Modul rein lesend und defensiv: ist ein
Baustein nicht importierbar (isolierter Lauf der Library ohne den Rest des
Repos), liefert es einen neutralen Platzhalter-Text statt zu crashen — so bleibt
die Library eigenständig testbar. Es VERÄNDERT den `knowledge`-Bestand nicht.
"""

from __future__ import annotations

import json


def trends_block(max_items: int = 8) -> str:
    """Branchen-Trend-Block (Knowledge-Pack)."""
    try:
        from knowledge import trends_summary_text
    except Exception:
        return "(Knowledge-Pack nicht verfügbar — ohne Branchen-Trends.)"
    return trends_summary_text(max_items=max_items)


def pulse_block(max_items_per_bucket: int = 2) -> str:
    """Knowledge-Pulse-Block (aus dem Knowledge-Refresher).

    Liegt im bestehenden `agents`-Paket. Wird rein lesend importiert; ist es
    nicht verfügbar, liefern wir einen neutralen Platzhalter.
    """
    try:
        from agents.knowledge_refresher import pulse_summary_text
    except Exception:
        return "(Knowledge-Pulse nicht verfügbar.)"
    try:
        return pulse_summary_text(max_items_per_bucket=max_items_per_bucket)
    except Exception:
        return "(Knowledge-Pulse nicht verfügbar.)"


def vendor_blocks(categories: list[str], sub_segment: str | None) -> str:
    """Vendor-Landschaft für die genannten Kategorien (Knowledge-Pack)."""
    try:
        from knowledge import vendor_options_text
    except Exception:
        return "(Knowledge-Pack nicht verfügbar — ohne Vendor-Landschaft.)"
    return "\n\n".join(vendor_options_text(c, sub_segment) for c in categories)


def compliance_blocks() -> dict[str, str]:
    """Liefert die drei Compliance-Textblöcke (dsgvo / ai_act / hospitality).

    Identische Zuschnitte wie im bestehenden agents/compliance_checker.py, damit
    die Output-Tiefe gleich bleibt.
    """
    try:
        from knowledge import compliance
    except Exception:
        return {
            "dsgvo": "(Knowledge-Pack nicht verfügbar.)",
            "ai_act": "(Knowledge-Pack nicht verfügbar.)",
            "hospitality": "(Knowledge-Pack nicht verfügbar.)",
        }

    cp = compliance()
    dsgvo = json.dumps(cp.get("dsgvo", {}).get("general", {}), ensure_ascii=False)[:1800]
    ai_act = json.dumps(
        cp.get("ai_act", {}).get("risikoklassen_hospitality", {}), ensure_ascii=False
    )[:2000]
    hospitality = json.dumps(
        {
            "hospitality_dsgvo": cp.get("dsgvo", {}).get("hospitality_specific", {}),
            "gwg": cp.get("gwg_geldwäsche", {}),
            "steuer": cp.get("steuer_compliance", {}),
            "anti_patterns": cp.get("ai_act", {}).get(
                "hospitality_specific_anti_patterns", []
            ),
        },
        ensure_ascii=False,
    )[:1500]
    return {"dsgvo": dsgvo, "ai_act": ai_act, "hospitality": hospitality}

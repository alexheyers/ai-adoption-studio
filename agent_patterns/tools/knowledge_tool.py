"""Knowledge-Tool — wiederverwendbarer Zugriff auf das bestehende `knowledge`-Pack.

Dieses Tool kapselt den Zugriff auf den vorhandenen `knowledge/`-Datenbestand
(Benchmarks, Case-Studies). Es VERÄNDERT diesen Bestand nicht — es liest nur.

Es ist defensiv: ist das `knowledge`-Paket nicht importierbar (z.B. isolierter
Lauf der Library ohne den Rest des Repos), liefert es leere Blöcke statt zu
crashen — so bleibt die Library eigenständig testbar.
"""

from __future__ import annotations


def knowledge_available() -> bool:
    try:
        import knowledge  # noqa: F401

        return True
    except Exception:
        return False


# Mapping roher Sub-Segment-Bezeichnungen → Knowledge-Pack-Keys.
# Identisch zur Logik in den bestehenden Agenten, damit Benchmarks matchen.
_SUB_SEGMENT_MAP = {
    "boutique-hotel": "boutique",
    "boutique": "boutique",
    "stadthotel": "stadthotel",
    "ferienhotel": "ferienhotel",
    "tagungshotel": "tagungshotel",
    "resort": "resort",
    "familienbetrieb": "familienbetrieb",
    "hotelgruppe": "boutique",
}


def normalize_sub_segment(raw: str | None) -> str:
    return _SUB_SEGMENT_MAP.get((raw or "boutique").lower(), "boutique")


def benchmark_block(sub_segment: str | None, size_class: str | None) -> str:
    """Liefert den Benchmark-Textblock fürs Sub-Segment + Größenklasse."""
    if not knowledge_available():
        return "(Knowledge-Pack nicht verfügbar — ohne Branchen-Benchmarks.)"
    from knowledge import benchmarks_summary_text

    return benchmarks_summary_text(normalize_sub_segment(sub_segment), size_class or "M")


def case_study_block(sub_segment: str | None, max_items: int = 6) -> str:
    """Liefert den Case-Study-Textblock fürs Sub-Segment."""
    if not knowledge_available():
        return "(Knowledge-Pack nicht verfügbar — ohne Case-Studies.)"
    from knowledge import case_studies_summary_text

    return case_studies_summary_text(
        filter_segment=normalize_sub_segment(sub_segment), max_items=max_items
    )

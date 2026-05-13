"""Lädt master_pool.yaml und filtert nach Trigger-Bedingungen."""
from pathlib import Path
import yaml

POOL_PATH = Path(__file__).parent / "master_pool.yaml"


def load_pool() -> list[dict]:
    with POOL_PATH.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("questions", [])


def _trigger_matches(trigger: str, ctx: dict) -> bool:
    """Trigger-Syntax:
       - 'always'                       → immer aktiv
       - 'sub_segment:Hotellerie'       → ctx['sub_segment'] == 'Hotellerie'
       - 'size_class:S'                 → ctx['size_class'] == 'S'
       - 'region:DACH'                  → ctx['region'] enthält 'DACH'
       - 'current_tools:contains:Kasse' → 'Kasse' in ctx['current_tools']
       - 'pain:contains:Personal'       → 'Personal' im pain_text
    """
    if trigger == "always":
        return True

    parts = trigger.split(":")
    if len(parts) == 2:
        key, value = parts
        actual = ctx.get(key)
        if isinstance(actual, str):
            return actual == value or value.lower() in actual.lower()
        return False
    if len(parts) == 3:
        key, op, value = parts
        actual = ctx.get(key)
        if op == "contains":
            if isinstance(actual, list):
                return any(value.lower() in str(x).lower() for x in actual)
            if isinstance(actual, str):
                return value.lower() in actual.lower()
        return False
    return False


def select_questions(
    company: dict,
    profile: dict | None = None,
    target_count: int = 13,
) -> list[dict]:
    """Wählt 12-15 Fragen aus dem Pool. Strategie:
       1. Alle priority=1-Fragen aufnehmen, deren Trigger matchen.
       2. Mit priority=2 auffüllen bis target_count erreicht.
       3. Pro Kategorie max. 3 Fragen, sonst zu eintönig.
    """
    pool = load_pool()
    pain_text = " ".join(p.get("description", "") for p in (company.get("pain_points") or [])).lower()

    ctx = {
        "sub_segment": company.get("sub_segment") or "",
        "size_class": company.get("size_class") or "",
        "region": company.get("region") or "",
        "current_tools": company.get("current_tools") or [],
        "pain": pain_text,
    }

    def matches(q: dict) -> bool:
        triggers = q.get("trigger_on") or ["always"]
        return any(_trigger_matches(t, ctx) for t in triggers)

    selected: list[dict] = []
    counts_by_cat: dict[str, int] = {}

    def can_add(q: dict) -> bool:
        cat = q.get("category", "")
        return counts_by_cat.get(cat, 0) < 3

    # Phase 1: Priority 1 mit Trigger-Match
    for q in pool:
        if q.get("priority") == 1 and matches(q) and can_add(q):
            selected.append(q)
            counts_by_cat[q["category"]] = counts_by_cat.get(q["category"], 0) + 1
            if len(selected) >= target_count:
                return selected

    # Phase 2: Priority 2
    for q in pool:
        if q.get("priority") == 2 and matches(q) and can_add(q) and q not in selected:
            selected.append(q)
            counts_by_cat[q["category"]] = counts_by_cat.get(q["category"], 0) + 1
            if len(selected) >= target_count:
                return selected

    # Phase 3: Priority 3 als Auffüller
    for q in pool:
        if q.get("priority") == 3 and matches(q) and can_add(q) and q not in selected:
            selected.append(q)
            counts_by_cat[q["category"]] = counts_by_cat.get(q["category"], 0) + 1
            if len(selected) >= target_count:
                return selected

    return selected

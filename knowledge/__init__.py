"""Knowledge-Pack-Loader für Agents.

Stellt strukturierte Hospitality-Daten (Benchmarks, Vendor-Landschaft, Case-Studies,
Compliance-Regelwerke, Markt-Trends) als Python-Dicts/Strings zur Verfügung,
sodass Agent-Prompts darauf referenzieren können.
"""
from functools import lru_cache
from pathlib import Path
import yaml

ROOT = Path(__file__).parent


@lru_cache(maxsize=1)
def benchmarks() -> dict:
    return yaml.safe_load((ROOT / "benchmarks_2026.yaml").read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def vendors() -> dict:
    return yaml.safe_load((ROOT / "vendor_landscape.yaml").read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def case_studies() -> dict:
    return yaml.safe_load((ROOT / "case_studies.yaml").read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def compliance() -> dict:
    return yaml.safe_load((ROOT / "compliance_pack_de.yaml").read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def trends() -> dict:
    return yaml.safe_load((ROOT / "industry_trends_2026.yaml").read_text(encoding="utf-8"))


def benchmarks_for(sub_segment: str, size_class: str) -> dict | None:
    """Findet den passenden Benchmark-Block. Fallback: gleicher Sub-Segment, andere Größe.
    Wenn nichts passt → None."""
    bench = benchmarks().get("benchmarks", [])
    for b in bench:
        if b.get("segment") == sub_segment and b.get("size_class") == size_class:
            return b
    for b in bench:
        if b.get("segment") == sub_segment:
            return b
    return None


def benchmarks_summary_text(sub_segment: str, size_class: str) -> str:
    """Kompakte Text-Repräsentation der Benchmarks für System-Prompts (~500-1000 Zeichen)."""
    b = benchmarks_for(sub_segment, size_class)
    if not b:
        return "Keine spezifischen Benchmarks verfügbar — generischer Hospitality-Kontext."
    lines = [f"BENCHMARKS · {b.get('label', '')}:"]
    for key, val in b.items():
        if key in ("segment", "size_class", "label", "note"):
            continue
        if isinstance(val, dict) and "p50" in val:
            lines.append(f"  · {key}: p25={val['p25']} · p50={val['p50']} · p75={val['p75']}")
    return "\n".join(lines)


def case_studies_summary_text(filter_segment: str | None = None, max_items: int = 6) -> str:
    """Kompakte Übersicht der Top-Case-Studies."""
    cs = case_studies().get("case_studies", [])
    if filter_segment:
        cs = [c for c in cs if filter_segment in (c.get("fits_segments") or []) or c.get("fits_segments") == "all"]
    lines = ["CASE-STUDIES (REFERENZ-OUTCOMES):"]
    for c in cs[:max_items]:
        out = c.get("typical_outcome", {})
        kpi_lines = []
        for k, v in list(out.items())[:3]:
            kpi_lines.append(f"{k}={v}")
        lines.append(f"  · {c['id']} · {c['use_case']} · {' · '.join(kpi_lines)} · Aufwand {c.get('implementation_effort_pt')}PT · {c.get('monthly_run_cost_eur')}€/Mo")
    return "\n".join(lines)


def vendor_options_text(category: str, sub_segment: str | None = None) -> str:
    """Vendor-Optionen für eine Kategorie als Prompt-Text."""
    vmap = vendors().get(category, [])
    lines = [f"VENDOREN · {category}:"]
    for v in vmap:
        fit_ok = sub_segment is None or sub_segment in (v.get("fit") or []) or "all" in (v.get("fit") or [])
        if not fit_ok:
            continue
        cost = v.get("monthly_cost_eur", {})
        cost_str = ", ".join(f"{k}={v}€" for k, v in cost.items() if isinstance(v, (int, float)))
        eu = "EU-Hosting" if v.get("eu_hosting") else "Non-EU"
        lines.append(f"  · {v['vendor']} · {v.get('tier', '?')} · {eu} · {cost_str} · {v.get('use_when', '')[:80]}")
    return "\n".join(lines)


def compliance_decision_text(use_case_summary: str) -> str:
    """Kompakte Compliance-Entscheidungs-Hilfe."""
    cp = compliance()
    dm = cp.get("decision_matrix", [])
    lines = ["COMPLIANCE-DECISION-MATRIX:"]
    for d in dm:
        lines.append(f"  · {d['frage']}")
    return "\n".join(lines)


def trends_summary_text(max_items: int = 6) -> str:
    """Markt-Trend-Übersicht für Pre-Audit-Kontext."""
    t = trends().get("trends", [])
    lines = ["MARKT-TRENDS 2026 (DACH HOSPITALITY):"]
    for tr in t[:max_items]:
        lines.append(f"  · {tr['title']}: {tr.get('implication', '')[:140]}")
    return "\n".join(lines)

"""SystemLandscape → 3D-Galaxie-Datenformat (BM-S2-13 · Stufe 2).

Wandelt eine `SystemLandscape` (system_architect-Output) in das Datenformat um, das die
3D-System-Galaxie (`System-Map/claude-system-galaxie.html`) konsumiert — damit dieselbe
Galaxie **datengetrieben** die Ist→Ziel-Systemlandschaft eines Kunden zeigt (Pflicht-Sektion
der Landingpage, BM-S2-14 / EPIC-14).

Galaxie-Schema (Ziel):
  CLUSTERS = { key: {pos:[x,y,z], label, r} }
  NODES    = [ {id, l, cat, cl, icon, sz, d, state} ]   # state ist eine additive Zusatz-Info (Ist/Ziel-Färbung)
  EDGES    = [ [sourceId, targetId, label] ]

Rein deterministisch, keine Netzwerk-/LLM-Calls — offline testbar.
"""
from __future__ import annotations

import math
from typing import Any

from schemas.system_landscape import SystemLandscape, NodeCategory

# NodeCategory -> (cluster-key, cluster-label) — fasst die ~18 Kategorien zu lesbaren Galaxie-Clustern zusammen.
_CLUSTER_FOR: dict[str, tuple[str, str]] = {
    "pms": ("betrieb", "Betrieb · Front/F&B"),
    "pos": ("betrieb", "Betrieb · Front/F&B"),
    "channel-manager": ("betrieb", "Betrieb · Front/F&B"),
    "booking-engine": ("betrieb", "Betrieb · Front/F&B"),
    "housekeeping": ("betrieb", "Betrieb · Front/F&B"),
    "buchhaltung": ("verwaltung", "Verwaltung & Finanzen"),
    "kassensystem": ("verwaltung", "Verwaltung & Finanzen"),
    "payment": ("verwaltung", "Verwaltung & Finanzen"),
    "dms-dokumente": ("verwaltung", "Verwaltung & Finanzen"),
    "crm": ("gaeste-team", "Gäste · Team · Komm."),
    "marketing": ("gaeste-team", "Gäste · Team · Komm."),
    "telefonie": ("gaeste-team", "Gäste · Team · Komm."),
    "kommunikation": ("gaeste-team", "Gäste · Team · Komm."),
    "personal-hr": ("gaeste-team", "Gäste · Team · Komm."),
    "bi-reporting": ("daten-ki", "Daten & KI"),
    "ki-agent": ("daten-ki", "Daten & KI"),
    "ipaas-orchestrierung": ("orchestrierung", "Orchestrierung"),
    "sonstiges": ("sonstiges", "Sonstiges"),
}

# Optionale simple-icons-Slugs nach Vendor-Stichwort (best effort; sonst kein Icon).
_ICON_HINTS: list[tuple[str, str]] = [
    ("hubspot", "hubspot"), ("salesforce", "salesforce"), ("datev", "datev"),
    ("n8n", "n8n"), ("stripe", "stripe"), ("slack", "slack"), ("apaleo", "apaleo"),
    ("sap", "sap"), ("lexoffice", "lexoffice"), ("mews", "mews"), ("sevdesk", "sevdesk"),
]

# Knoten-Größe nach Rolle (Hub fällt auf, Quelle/Senke mittel).
_SIZE_FOR_ROLE = {"hub": 1.6, "trigger": 1.2, "speicher": 1.1, "quelle": 1.0, "senke": 1.0, "schnittstelle": 0.95}


def _cluster(cat: NodeCategory) -> tuple[str, str]:
    return _CLUSTER_FOR.get(cat, ("sonstiges", "Sonstiges"))


def _icon_for(name: str, vendor: str | None) -> str | None:
    hay = f"{name} {vendor or ''}".lower()
    for kw, slug in _ICON_HINTS:
        if kw in hay:
            return slug
    return None


def _ring_positions(keys: list[str], radius: float = 52.0) -> dict[str, list[float]]:
    """Deterministische Kreis-Anordnung der vorhandenen Cluster (Renderer kann überschreiben)."""
    n = max(1, len(keys))
    out: dict[str, list[float]] = {}
    for i, k in enumerate(keys):
        ang = 2 * math.pi * i / n
        out[k] = [round(radius * math.cos(ang), 2), 0.0, round(radius * math.sin(ang), 2)]
    return out


def to_galaxy(landscape: SystemLandscape) -> dict[str, Any]:
    """Erzeugt das Galaxie-Datenobjekt (CLUSTERS/NODES/EDGES) aus einer SystemLandscape."""
    # 1) Cluster sammeln (nur tatsächlich vorkommende)
    present: dict[str, str] = {}  # key -> label, Reihenfolge = Auftreten
    node_cluster: dict[str, str] = {}
    for node in landscape.nodes:
        key, label = _cluster(node.category)
        present.setdefault(key, label)
        node_cluster[node.id] = key
    positions = _ring_positions(list(present.keys()))
    clusters = {
        key: {"pos": positions[key], "label": label, "r": 14}
        for key, label in present.items()
    }

    # 2) Knoten
    nodes: list[dict[str, Any]] = []
    for node in landscape.nodes:
        entry: dict[str, Any] = {
            "id": node.id,
            "l": node.name,
            "cat": node.category,
            "cl": node_cluster[node.id],
            "sz": _SIZE_FOR_ROLE.get(node.role, 1.0),
            "d": node.rationale or "",
            "state": node.state,  # 'ist' | 'ziel' | 'ist-und-ziel' → Renderer färbt Ist vs. Ziel
        }
        icon = _icon_for(node.name, node.vendor)
        if icon:
            entry["icon"] = icon
        nodes.append(entry)

    # 3) Kanten als [source, target, label] — referenziell sicher (Integritäts-Pass garantiert valide IDs)
    edges: list[list[str]] = [
        [c.source, c.target, (c.data or "").strip()[:40]]
        for c in landscape.connections
    ]

    return {
        "company": landscape.company_name,
        "summary": landscape.summary,
        "clusters": clusters,
        "nodes": nodes,
        "edges": edges,
        "gaps": list(landscape.gaps),
    }

"""Agent · System-Architect (EPIC-5 · Stufe 2 „DESIGNEN").

Verdichtet den FullReport aus Stufe 1 zu einer kohärenten, verbundenen Ziel-Systemlandschaft
(`SystemLandscape`). Der Sprung von „Tool-Liste empfehlen" zu „Gesamtarchitektur designen".

Aufbau wie die übrigen Agenten: deterministischer Kern (garantiert eine valide, referenziell
integre Landschaft allein aus briefing + report) + optionale LLM-Anreicherung über call_agent.
Fällt die LLM-Schicht aus oder liefert sie Unvalides, bleibt der deterministische Output bestehen.

run(briefing, report, use_llm=True) -> SystemLandscape
"""
from __future__ import annotations

import re

from schemas.briefing import Briefing
from schemas.outputs import FullReport
from schemas.system_landscape import (
    SystemLandscape, SystemNode, DataFlow, Automation, NodeCategory,
)
# Hinweis: agents._client (instanziiert den Anthropic-Client beim Import) wird bewusst
# LAZY in run() importiert, damit der deterministische Kern offline/ohne API-Key nutzbar ist.


# ---- Kategorie-Heuristik (Keyword -> NodeCategory) ----
_CATEGORY_KEYWORDS: list[tuple[str, NodeCategory]] = [
    ("pms", "pms"), ("property management", "pms"), ("apaleo", "pms"), ("opera", "pms"),
    ("pos", "pos"), ("kasse", "kassensystem"), ("vectron", "pos"), ("tse", "kassensystem"),
    ("channel", "channel-manager"), ("siteminder", "channel-manager"),
    ("booking", "booking-engine"), ("ibe", "booking-engine"),
    ("crm", "crm"), ("hubspot", "crm"), ("salesforce", "crm"),
    ("datev", "buchhaltung"), ("buchhalt", "buchhaltung"), ("lexoffice", "buchhaltung"),
    ("telefon", "telefonie"), ("voice", "telefonie"), ("3cx", "telefonie"),
    ("mail", "kommunikation"), ("inbox", "kommunikation"), ("slack", "kommunikation"),
    ("hotelkit", "kommunikation"), ("teams", "kommunikation"),
    ("housekeep", "housekeeping"), ("reinig", "housekeeping"),
    ("personal", "personal-hr"), ("hr", "personal-hr"), ("dienstplan", "personal-hr"),
    ("marketing", "marketing"), ("newsletter", "marketing"), ("mailchimp", "marketing"),
    ("report", "bi-reporting"), ("bi", "bi-reporting"), ("dashboard", "bi-reporting"),
    ("payment", "payment"), ("stripe", "payment"), ("zahlung", "payment"),
    ("dms", "dms-dokumente"), ("dokument", "dms-dokumente"),
    ("n8n", "ipaas-orchestrierung"), ("make", "ipaas-orchestrierung"), ("zapier", "ipaas-orchestrierung"),
    ("agent", "ki-agent"), ("ki", "ki-agent"), ("ai", "ki-agent"), ("chatbot", "ki-agent"),
]

_HUB_ID = "ipaas-orchestrierung"


def _slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s or "node"


def _guess_category(name: str) -> NodeCategory:
    low = name.lower()
    for kw, cat in _CATEGORY_KEYWORDS:
        if kw in low:
            return cat
    return "sonstiges"


def _deterministic_landscape(briefing: Briefing, report: FullReport) -> SystemLandscape:
    """Baut allein aus briefing + report eine valide, referenziell integre Landschaft."""
    nodes: dict[str, SystemNode] = {}

    def add_node(name: str, state: str, role: str = "schnittstelle", rationale: str = "",
                 vendor: str | None = None) -> str:
        nid = _slug(name)
        if nid not in nodes:
            nodes[nid] = SystemNode(id=nid, name=name, category=_guess_category(name),
                                    state=state, role=role, rationale=rationale, vendor=vendor)
        elif state == "ziel" and nodes[nid].state == "ist":
            nodes[nid].state = "ist-und-ziel"  # Tool existiert und wird (neu) angebunden
        return nid

    # Ist-Knoten aus dem bestehenden Stack
    for tool in (briefing.current_tools or []):
        add_node(tool, state="ist", role="quelle")

    # Ziel-Knoten aus den Tool-Empfehlungen
    rec_node_ids: list[str] = []
    recs = report.tools.recommendations if report.tools else []
    for rec in recs:
        nid = add_node(rec.primary_tool, state="ziel", role="schnittstelle",
                       rationale=(rec.why_this_tool or "")[:160],
                       vendor=rec.primary_tool_vendor_country or None)
        rec_node_ids.append(nid)

    # Orchestrierungs-Hub, sobald es überhaupt etwas zu verbinden gibt
    have_hub = bool(nodes)
    if have_hub:
        add_node("n8n (Orchestrierung)", state="ziel", role="hub",
                 rationale="Verbindet die Systeme (Stufe 3).")

    # Verbindungen: jede Empfehlung an passende Ist-Knoten (Keyword-Match) sonst an den Hub
    connections: list[DataFlow] = []
    fid = 0
    ist_ids = [nid for nid, n in nodes.items() if n.state == "ist"]
    for rec, src in zip(recs, rec_node_ids):
        targets: list[str] = []
        for integ in (rec.required_integrations or []):
            il = integ.lower()
            for nid in ist_ids:
                if any(tok and tok in nodes[nid].name.lower() for tok in re.split(r"[^a-z0-9]+", il) if len(tok) > 2):
                    targets.append(nid)
        if not targets and have_hub:
            targets = [_HUB_ID if _HUB_ID in nodes else _slug("n8n (Orchestrierung)")]
        for tgt in dict.fromkeys(targets):  # dedupe, Reihenfolge erhalten
            if tgt == src:
                continue
            fid += 1
            connections.append(DataFlow(
                id=f"flow-{fid}", source=src, target=tgt,
                data=(rec.data_flow or rec.use_case_name or "Daten")[:80],
                direction="einweg", integration_type="api", automation_level="teilautomatisiert",
                state="ziel", notes=(rec.integration_with_existing or "")[:120]))

    # Automationen aus automatisierungsstarken Use-Cases
    automations: list[Automation] = []
    ucs = report.use_cases.use_cases if report.use_cases else []
    for i, uc in enumerate(ucs):
        if uc.ai_pattern not in ("automation", "agent", "classification", "generation"):
            continue
        involved = [n for n in (rec_node_ids[:2] + ([_slug("n8n (Orchestrierung)")] if have_hub else []))
                    if n in nodes]
        automations.append(Automation(
            id=f"auto-{i+1}", name=uc.name, description=(uc.description or uc.name)[:240],
            involved_nodes=list(dict.fromkeys(involved)),
            pattern="agent" if uc.ai_pattern == "agent" else "synchronisation",
            expected_benefit=(uc.expected_impact or "")[:160],
            buildable_now=bool(uc.quick_win and uc.complexity == "low")))

    return SystemLandscape(
        company_name=briefing.company.name,
        generated_from="FullReport (deterministisch)",
        nodes=list(nodes.values()),
        connections=connections,
        automations=automations,
        summary=(f"Aus {len(recs)} Tool-Empfehlungen abgeleitete Ziel-Systemlandschaft: "
                 f"{len(nodes)} Komponenten, {len(connections)} Datenflüsse, {len(automations)} Automationen."),
        gaps=[g for g in [report.tools.integration_complexity_summary if report.tools else ""] if g][:3],
        assumptions=["Empfohlene Tools bieten offene Schnittstellen (API/Webhook).",
                     "Orchestrierung über n8n (bestehende Kompetenz)."],
    )


SYSTEM_PROMPT = """Du bist Senior Solution-Architect. Du verdichtest eine Tool-Empfehlung + Prozess-Audit zu EINER kohärenten, VERBUNDENEN Ziel-Systemlandschaft.

Antworte NUR mit JSON in genau dieser Struktur (alle IDs kebab-case, jede Verbindung/Automation referenziert nur existierende Knoten-IDs):
{
  "nodes": [{"id": "...", "name": "...", "category": "pms|pos|channel-manager|booking-engine|crm|marketing|buchhaltung|kassensystem|telefonie|kommunikation|housekeeping|personal-hr|bi-reporting|payment|dms-dokumente|ipaas-orchestrierung|ki-agent|sonstiges", "state": "ist|ziel|ist-und-ziel", "role": "quelle|senke|hub|trigger|speicher|schnittstelle", "vendor": "...", "rationale": "1 Satz"}],
  "connections": [{"id": "...", "source": "node-id", "target": "node-id", "data": "was fliesst", "direction": "einweg|bidirektional", "integration_type": "api|webhook|datei-export|ipaas|manuell", "automation_level": "manuell|teilautomatisiert|vollautomatisiert", "state": "ist|ziel", "trigger": "..."}],
  "automations": [{"id": "...", "name": "...", "description": "...", "involved_nodes": ["node-id"], "pattern": "routing|anreicherung|synchronisation|benachrichtigung|klassifikation|generierung|agent|rpa", "trigger": "...", "frequency": "echtzeit|stündlich|täglich|wöchentlich|ad-hoc", "expected_benefit": "...", "buildable_now": true},
  "summary": "2-4 Sätze: das Ziel-Bild in Worten",
  "gaps": ["..."],
  "assumptions": ["..."]
}
REGELN: Tools, die heute schon da sind -> state "ist"; neu empfohlene -> "ziel". Verbinde die Systeme sinnvoll (keine isolierten Knoten). Markiere genau einen quick-win-tauglichen, einfachen Automatisierungs-Kandidaten mit buildable_now=true (für den Stufe-3-Teaser). KEINE erfundenen Tools — nur aus den Inputs. Umlaute echt."""


def run(briefing: Briefing, report: FullReport, use_llm: bool = True) -> SystemLandscape:
    """Erzeugt die Ziel-Systemlandschaft. Deterministischer Kern ist immer valide;
    use_llm=True reichert über Claude an, fällt bei Fehler auf den Kern zurück."""
    base = _deterministic_landscape(briefing, report)
    if not use_llm:
        return base

    try:
        from agents._client import call_agent  # lazy: erst hier wird der Anthropic-Client gebraucht
        recs = report.tools.recommendations if report.tools else []
        ucs = report.use_cases.use_cases if report.use_cases else []
        user_message = (
            f"UNTERNEHMEN: {briefing.company.name} ({briefing.company.sub_segment}, "
            f"{briefing.company.size_class}, {briefing.company.employees} MA)\n"
            f"BESTEHENDER STACK: {', '.join(briefing.current_tools or []) or 'unbekannt'}\n\n"
            f"TOOL-EMPFEHLUNGEN:\n" +
            "\n".join(f"- {r.primary_tool} (für {r.target_process or r.use_case_name}); "
                      f"Integrationen: {', '.join(r.required_integrations or []) or '—'}; "
                      f"Datenfluss: {r.data_flow or '—'}" for r in recs) +
            f"\n\nUSE-CASES (Automatisierungs-Kandidaten):\n" +
            "\n".join(f"- {u.name} [{u.ai_pattern}, {u.complexity}, quick_win={u.quick_win}]" for u in ucs) +
            "\n\nLeite daraus die verbundene Ziel-Systemlandschaft ab."
        )
        raw = call_agent(SYSTEM_PROMPT, user_message)
        enriched = SystemLandscape(company_name=briefing.company.name,
                                   generated_from="FullReport (LLM)", **{
            k: raw[k] for k in ("nodes", "connections", "automations", "summary", "gaps", "assumptions")
            if k in raw})
        # Qualitäts-Gate: LLM-Ergebnis muss mindestens so reichhaltig sein wie der Kern
        if len(enriched.nodes) >= max(1, len(base.nodes) // 2) and enriched.connections:
            return enriched
    except Exception:
        pass  # jede Störung -> deterministischer, garantiert valider Kern
    return base

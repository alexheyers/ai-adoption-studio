"""SystemLandscape-Schema (EPIC-4 · Stufe 2 „DESIGNEN").

Maschinenlesbares Architektur-Artefakt: die komplette Ziel-Systemlandschaft eines
Unternehmens — Komponenten (Tools/Systeme), Verbindungen (Datenflüsse) und Automationen.
Eingangs-Datensatz: der FullReport aus Stufe 1 (insb. ToolRecommendation.required_integrations,
data_flow, integration_with_existing). Wird vom `system_architect`-Agent (EPIC-5) erzeugt und
von der Ist→Ziel-Systemkarte (EPIC-6) visualisiert.

Enthält einen Integritäts-Pass: referenzielle Konsistenz wird bei der Konstruktion erzwungen
(unbekannte Knoten-Referenzen + doppelte IDs -> ValueError); weichere Hinweise (z.B. isolierte
Knoten, fehlende Ist→Ziel-Brücke) liefert `integrity_report()`.
"""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, model_validator


NodeCategory = Literal[
    "pms", "pos", "channel-manager", "booking-engine", "crm", "marketing",
    "buchhaltung", "kassensystem", "telefonie", "kommunikation", "housekeeping",
    "personal-hr", "bi-reporting", "payment", "dms-dokumente", "ipaas-orchestrierung",
    "ki-agent", "sonstiges",
]

NodeState = Literal["ist", "ziel", "ist-und-ziel"]
"""ist = existiert heute · ziel = neu/zu beschaffen · ist-und-ziel = bleibt, wird angebunden."""

NodeRole = Literal["quelle", "senke", "hub", "trigger", "speicher", "schnittstelle"]

IntegrationType = Literal["api", "webhook", "datei-export", "ipaas", "manuell", "unbekannt"]

FlowDirection = Literal["einweg", "bidirektional"]

AutomationLevel = Literal["manuell", "teilautomatisiert", "vollautomatisiert"]

IssueSeverity = Literal["fehler", "warnung", "hinweis"]


class SystemNode(BaseModel):
    """Eine Komponente der Systemlandschaft — ein Tool, System oder Dienst."""
    id: str = Field(description="Eindeutige, stabile ID (kebab-case), z.B. 'pms-apaleo'")
    name: str = Field(description="Anzeigename, z.B. 'Apaleo PMS'")
    category: NodeCategory
    state: NodeState = Field(default="ist", description="Ist/Ziel/Brücke im Ziel-Bild")
    role: NodeRole = Field(default="schnittstelle")
    vendor: str | None = Field(default=None, description="Hersteller/Marke, falls bekannt")
    replaces: str | None = Field(default=None, description="ID eines Ist-Knotens, den dieser Ziel-Knoten ablöst")
    rationale: str = Field(default="", description="Warum dieser Knoten im Ziel-Bild ist (1 Satz)")
    monthly_cost_eur: int | None = Field(default=None)


class DataFlow(BaseModel):
    """Eine gerichtete Verbindung zwischen zwei Knoten — der eigentliche 'Klebstoff'."""
    id: str = Field(description="Eindeutige ID der Verbindung, z.B. 'flow-pms-buha'")
    source: str = Field(description="ID des Quell-Knotens (muss in nodes existieren)")
    target: str = Field(description="ID des Ziel-Knotens (muss in nodes existieren)")
    data: str = Field(description="Was fliesst, z.B. 'Reservierungen', 'Tages-Umsätze', 'Rechnungen'")
    direction: FlowDirection = Field(default="einweg")
    integration_type: IntegrationType = Field(default="unbekannt")
    automation_level: AutomationLevel = Field(default="manuell")
    state: NodeState = Field(default="ziel", description="Besteht die Verbindung heute (ist) oder ist sie Teil des Ziel-Designs (ziel)?")
    trigger: str = Field(default="", description="Was löst den Fluss aus, z.B. 'neue Buchung', 'nächtlich 02:00'")
    notes: str = Field(default="")


class Automation(BaseModel):
    """Eine konkrete Automatisierung, die mehrere Knoten/Flüsse orchestriert (Stufe-3-Kandidat)."""
    id: str = Field(description="Eindeutige ID, z.B. 'auto-reservierungs-inbox'")
    name: str
    description: str = Field(description="Was die Automatisierung tut, 1-2 Sätze")
    involved_nodes: list[str] = Field(default_factory=list, description="IDs beteiligter Knoten (müssen existieren)")
    pattern: Literal["routing", "anreicherung", "synchronisation", "benachrichtigung",
                     "klassifikation", "generierung", "agent", "rpa"] = Field(default="synchronisation")
    trigger: str = Field(default="")
    frequency: Literal["echtzeit", "stündlich", "täglich", "wöchentlich", "ad-hoc"] = Field(default="täglich")
    expected_benefit: str = Field(default="", description="Erwarteter Nutzen (Zeit/Qualität)")
    buildable_now: bool = Field(default=False, description="Für den Stufe-3-Teaser (EPIC-7) als erstes baubar?")


class IntegrityIssue(BaseModel):
    """Ein Befund des Integritäts-Passes."""
    severity: IssueSeverity
    code: str
    message: str
    ref: str | None = Field(default=None, description="Betroffene ID (Knoten/Fluss/Automation)")


class SystemLandscape(BaseModel):
    """Die vollständige Ziel-Systemlandschaft eines Unternehmens.

    Referenzielle Integrität (unbekannte Refs, doppelte IDs) wird bei der Konstruktion
    erzwungen. `integrity_report()` liefert zusätzlich weiche Hinweise.
    """
    company_name: str
    generated_from: str = Field(default="FullReport", description="Quelle der Ableitung (z.B. Run-ID)")
    nodes: list[SystemNode] = Field(default_factory=list)
    connections: list[DataFlow] = Field(default_factory=list)
    automations: list[Automation] = Field(default_factory=list)
    summary: str = Field(default="", description="2-4 Sätze: das Ziel-Bild in Worten")
    gaps: list[str] = Field(default_factory=list, description="Was vor Umsetzung noch geklärt werden muss")
    assumptions: list[str] = Field(default_factory=list, description="Annahmen hinter dem Design")

    # ---- Integritäts-Pass (hart, bei Konstruktion) ----
    @model_validator(mode="after")
    def _enforce_referential_integrity(self) -> "SystemLandscape":
        node_ids = [n.id for n in self.nodes]
        seen: set[str] = set()
        dupes = {nid for nid in node_ids if nid in seen or seen.add(nid)}
        if dupes:
            raise ValueError(f"Doppelte Knoten-IDs: {sorted(dupes)}")
        idset = set(node_ids)

        flow_ids: set[str] = set()
        for f in self.connections:
            if f.id in flow_ids:
                raise ValueError(f"Doppelte Fluss-ID: {f.id}")
            flow_ids.add(f.id)
            for ref, kind in ((f.source, "source"), (f.target, "target")):
                if ref not in idset:
                    raise ValueError(f"Fluss '{f.id}' referenziert unbekannten {kind}-Knoten '{ref}'")
        for a in self.automations:
            for ref in a.involved_nodes:
                if ref not in idset:
                    raise ValueError(f"Automation '{a.id}' referenziert unbekannten Knoten '{ref}'")
        for n in self.nodes:
            if n.replaces is not None and n.replaces not in idset:
                raise ValueError(f"Knoten '{n.id}' soll unbekannten Knoten '{n.replaces}' ersetzen")
        return self

    # ---- Integritäts-Pass (weich, on demand) ----
    def integrity_report(self) -> list[IntegrityIssue]:
        """Weiche Konsistenz-Hinweise — blockiert nicht, sondern berät den system_architect."""
        issues: list[IntegrityIssue] = []
        idset = {n.id for n in self.nodes}
        connected = {f.source for f in self.connections} | {f.target for f in self.connections}

        for n in self.nodes:
            if n.id not in connected and not any(n.id in a.involved_nodes for a in self.automations):
                issues.append(IntegrityIssue(severity="warnung", code="isolierter-knoten",
                    message=f"Knoten '{n.name}' hat keine Verbindung und keine Automation — verwaist?", ref=n.id))
        if not any(n.state in ("ziel", "ist-und-ziel") for n in self.nodes):
            issues.append(IntegrityIssue(severity="hinweis", code="kein-ziel-knoten",
                message="Landschaft enthält keinen Ziel-Knoten — beschreibt sie nur den Ist-Zustand?"))
        if self.nodes and not self.connections:
            issues.append(IntegrityIssue(severity="warnung", code="keine-verbindungen",
                message="Knoten vorhanden, aber keine Datenflüsse — die Tools sind nicht verbunden."))
        for f in self.connections:
            if f.integration_type == "manuell" and f.automation_level == "vollautomatisiert":
                issues.append(IntegrityIssue(severity="hinweis", code="widerspruch-integration",
                    message=f"Fluss '{f.id}': manuell + vollautomatisiert ist widersprüchlich.", ref=f.id))
        if not any(a.buildable_now for a in self.automations):
            issues.append(IntegrityIssue(severity="hinweis", code="kein-teaser-kandidat",
                message="Keine Automation als 'buildable_now' markiert — fehlt der Stufe-3-Teaser (EPIC-7)?"))
        return issues

    def is_valid(self) -> bool:
        """True, wenn der weiche Pass keine 'fehler'/'warnung' meldet."""
        return not any(i.severity in ("fehler", "warnung") for i in self.integrity_report())


def example_landscape() -> "SystemLandscape":
    """Beispiel-Ziel-Systemlandschaft für ein Mock-Hotel (Boutique, ~40 Zimmer).

    Dient als Referenz-Artefakt (EPIC-4) und als Test-Fixture. Keine echten Kundendaten.
    """
    return SystemLandscape(
        company_name="Hotel Mustertal (Mock)",
        generated_from="mock-run-0001",
        summary=("Ziel-Bild: das isolierte PMS wird zum Hub — Reservierungen fliessen automatisch "
                 "in Buchhaltung und CRM, die Reservierungs-Inbox wird per KI-Agent vorqualifiziert."),
        nodes=[
            SystemNode(id="pms-apaleo", name="Apaleo PMS", category="pms", state="ist-und-ziel",
                       role="hub", vendor="Apaleo", rationale="Zentrale Wahrheit für Buchungen, bleibt Kern."),
            SystemNode(id="pos-vectron", name="Vectron POS", category="pos", state="ist",
                       role="quelle", vendor="Vectron", rationale="Kassendaten F&B."),
            SystemNode(id="buha-datev", name="DATEV (über Steuerberater)", category="buchhaltung",
                       state="ist-und-ziel", role="senke", vendor="DATEV", rationale="Rechnungs-/Umsatzziel."),
            SystemNode(id="crm-hubspot", name="HubSpot CRM", category="crm", state="ziel",
                       role="senke", vendor="HubSpot", rationale="Gäste-Kommunikation bündeln."),
            SystemNode(id="inbox-mail", name="Reservierungs-Inbox (Mail)", category="kommunikation",
                       state="ist", role="quelle", rationale="~200 Anfragen/Woche, heute manuell."),
            SystemNode(id="agent-triage", name="KI-Triage-Agent", category="ki-agent", state="ziel",
                       role="trigger", rationale="Klassifiziert/qualifiziert Anfragen vor."),
            SystemNode(id="ipaas-n8n", name="n8n (Orchestrierung)", category="ipaas-orchestrierung",
                       state="ziel", role="hub", vendor="n8n", rationale="Verbindet die Systeme (Stufe 3)."),
        ],
        connections=[
            DataFlow(id="flow-pms-buha", source="pms-apaleo", target="buha-datev",
                     data="Tages-Umsätze + Rechnungen", direction="einweg", integration_type="api",
                     automation_level="vollautomatisiert", state="ziel", trigger="nächtlich 02:00"),
            DataFlow(id="flow-pos-pms", source="pos-vectron", target="pms-apaleo",
                     data="F&B-Umsätze pro Zimmer", direction="einweg", integration_type="api",
                     automation_level="teilautomatisiert", state="ist"),
            DataFlow(id="flow-inbox-agent", source="inbox-mail", target="agent-triage",
                     data="eingehende Anfragen", direction="einweg", integration_type="webhook",
                     automation_level="vollautomatisiert", state="ziel", trigger="neue Mail"),
            DataFlow(id="flow-agent-pms", source="agent-triage", target="pms-apaleo",
                     data="strukturierte Reservierungs-Vorschläge", direction="einweg",
                     integration_type="api", automation_level="teilautomatisiert", state="ziel"),
            DataFlow(id="flow-pms-crm", source="pms-apaleo", target="crm-hubspot",
                     data="Gäste-Stammdaten + Aufenthalte", direction="bidirektional",
                     integration_type="ipaas", automation_level="vollautomatisiert", state="ziel"),
        ],
        automations=[
            Automation(id="auto-buha-sync", name="Nächtlicher Buchhaltungs-Sync",
                       description="PMS-Umsätze + Rechnungen werden nachts automatisch nach DATEV exportiert.",
                       involved_nodes=["pms-apaleo", "buha-datev", "ipaas-n8n"], pattern="synchronisation",
                       trigger="nächtlich 02:00", frequency="täglich",
                       expected_benefit="spart ~6 h/Woche manuelle Buchungsabtipperei", buildable_now=True),
            Automation(id="auto-reservierungs-inbox", name="KI-Reservierungs-Inbox",
                       description="Eingehende Anfragen werden klassifiziert, beantwortet oder als Vorschlag ins PMS gelegt.",
                       involved_nodes=["inbox-mail", "agent-triage", "pms-apaleo", "ipaas-n8n"],
                       pattern="agent", trigger="neue Mail", frequency="echtzeit",
                       expected_benefit="Antwortzeit von Stunden auf Minuten", buildable_now=False),
        ],
        gaps=["DATEV-Schnittstelle: Freigabe des Steuerberaters nötig",
              "HubSpot: DSGVO-AVV + EU-Hosting prüfen"],
        assumptions=["Apaleo bietet offene API (Cloud-PMS)",
                     "Mail-Volumen rechtfertigt KI-Triage (~200/Woche)"],
    )

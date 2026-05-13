"""Output-Schemas pro Agent — strukturierte JSON-Antworten."""
from typing import Literal
from pydantic import BaseModel, Field


class ProcessTouchpoint(BaseModel):
    """Ein einzelner System-Berührungspunkt (PMS, POS, Channel-Manager etc.)."""
    system: str = Field(description="System-Name oder Kategorie, z.B. 'PMS · Apaleo', 'POS · Vectron', 'Channel-Manager · SiteMinder'")
    role: str = Field(description="Rolle im Prozess: 'Quelle', 'Senke', 'Trigger', 'Output'")
    integration_status: Literal["isolated", "manual-sync", "api-integrated", "unknown"] = Field(default="unknown")


class ProcessStakeholder(BaseModel):
    role: str = Field(description="z.B. 'Reservierungs-Team', 'GF', 'Buchhaltung', 'Hausdame'")
    fte_share: float | None = Field(default=None, description="Anteil eines Vollzeit-Äquivalents im Prozess (0.0-1.0)")
    approval_required: bool = Field(default=False)


class CurrentToolInUse(BaseModel):
    """Was wird HEUTE für diesen Prozess eingesetzt — Marke wenn möglich, sonst Kategorie."""
    category: str = Field(description="z.B. 'Telefonanlage', 'PMS', 'POS', 'Kommunikation Inhouse', 'Buchhaltung'")
    vendor_or_brand: str | None = Field(default=None, description="Konkrete Marke wenn bekannt, sonst 'unbekannt'")
    is_paper_or_excel: bool = Field(default=False, description="Aktuell noch analog / Excel")
    monthly_cost_eur: int | None = Field(default=None)
    notes: str | None = Field(default=None)


class ProcessCompliance(BaseModel):
    dsgvo_relevant: bool = Field(default=False)
    tse_kasse_relevant: bool = Field(default=False, description="Kassengesetz / TSE-Pflicht (GoBD/KassenSichV)")
    gobd_relevant: bool = Field(default=False, description="Archivierungspflicht / unveränderbarkeit")
    avv_needed: bool = Field(default=False, description="Auftragsverarbeitungs-Vertrag nötig?")
    ai_act_risk_class: Literal["minimal", "limited", "high", "unacceptable"] = Field(default="minimal")
    notes: str = Field(default="")


class Process(BaseModel):
    """Detaillierter Prozess-Eintrag mit Senior-Consultant-Tiefe."""

    # — Identität —
    name: str
    domain: Literal[
        "front-office", "housekeeping", "fnb-service", "fnb-kueche", "wellness-spa",
        "mice", "marketing", "crm-gaeste", "beschaffung", "buchhaltung", "gebaeude",
        "personal", "it", "compliance", "strategie-kpi",
    ] = Field(description="Hotel-Domain dieses Prozesses")
    sub_domain: str = Field(default="", description="z.B. 'Reservierungs-Inbox', 'Energy-Monitoring', 'Inventur'")
    description: str = Field(description="2-3 Sätze WAS der Prozess konkret ist, mit Bezug auf vorliegende Daten")

    # — Aktuelle Ist-Situation —
    primary_pain: str = Field(description="Konkreter heute spürbarer Schmerz")
    workaround_today: str = Field(default="", description="Wie behilft sich das Haus heute? (Excel, Whiteboard, Anrufe, etc.)")
    current_time_hours_per_week: float | None = Field(default=None)
    frequency: Literal["daily", "weekly", "monthly", "ad-hoc", "seasonal"] = Field(default="weekly")
    volume_per_period: str = Field(default="", description="z.B. '~200 Mails/Woche', '~120 Rechnungen/Monat', '~30 Reservierungen/Tag'")

    # — Beteiligte —
    stakeholders: list[ProcessStakeholder] = Field(default_factory=list, description="Wer ist heute im Prozess involviert + FTE-Anteil")

    # — Eingesetzte Systeme —
    touchpoints: list[ProcessTouchpoint] = Field(default_factory=list, description="Beteiligte Systeme/Schnittstellen")
    current_tools: list[CurrentToolInUse] = Field(default_factory=list, description="Konkrete Tools heute in Verwendung (Telefonie, PMS, POS, Handhelds, Stb-Schnittstelle)")

    # — Compliance —
    compliance: ProcessCompliance = Field(default_factory=ProcessCompliance)

    # — Hebel und Effekt —
    automation_potential: Literal["high", "medium", "low"]
    quick_win_eligible: bool = Field(default=False, description="Quick Win = unter 4 Wochen umsetzbar mit erkennbarem ROI")
    estimated_savings_eur_year: int | None = Field(default=None)
    estimated_time_saved_h_week: float | None = Field(default=None)
    expected_quality_uplift: str = Field(default="", description="Qualitäts-/Service-Nutzen jenseits von Zeit/Geld")

    # — Umsetzung —
    confidence: Literal["high", "medium", "low"] = Field(default="medium")
    data_gaps: list[str] = Field(default_factory=list, description="Was bräuchte es vor Umsetzung an weiteren Daten/Klärung")
    risks_if_done_wrong: list[str] = Field(default_factory=list, description="Was kann schiefgehen — operativ, Gäste-erlebnis, finanziell")
    implementation_owner: str = Field(default="", description="Verantwortliche Rolle für Umsetzung — z.B. 'GF + IT-Partner'")
    benchmark_ref: str | None = Field(default=None, description="Branchen-Benchmark gegen den der Prozess gespiegelt wird")


class ProcessAuditOutput(BaseModel):
    processes: list[Process]
    summary: str
    domains_unchecked: list[str] = Field(default_factory=list, description="Domains die mangels Daten nicht beurteilt werden konnten")


class VUFVECheck(BaseModel):
    """VUFVE-Reality-Check pro Use-Case (Valuable/Usable/Feasible/Viable/Ethical).
    Wenn 2+ Felder false sind, gehört der Use-Case in die Anti-Liste."""
    valuable: bool = Field(description="Schafft konkreten Wert für den Hotelier (Zeit/Geld/Conversion)?")
    valuable_reason: str = Field(default="", description="1 Satz: warum (oder warum nicht)")
    usable: bool = Field(description="Vom (nicht-tech-affinen) Team in der Praxis bedienbar?")
    usable_reason: str = Field(default="")
    feasible: bool = Field(description="Technisch + mit bestehendem Stack umsetzbar (PMS/Channel/etc)?")
    feasible_reason: str = Field(default="")
    viable: bool = Field(description="Im Budget des Hauses + positiver Business-Case in 12-18 Mo?")
    viable_reason: str = Field(default="")
    ethical: bool = Field(description="DSGVO + AI-Act-konform + kein Marken-Schaden-Risiko?")
    ethical_reason: str = Field(default="")


class UseCase(BaseModel):
    name: str
    description: str
    target_process: str
    ai_pattern: Literal["chatbot", "voice-agent", "rag", "classification", "generation", "agent", "automation", "vision", "prediction"]
    expected_impact: str
    complexity: Literal["low", "medium", "high"]
    quick_win: bool = Field(description="Quick Win = unter 4 Wochen umsetzbar")
    vufve: VUFVECheck | None = Field(default=None, description="VUFVE-Reality-Check (5 Felder)")


class UseCaseOutput(BaseModel):
    use_cases: list[UseCase]
    quick_wins_summary: str


class VendorComplianceBlock(BaseModel):
    eu_hosting: bool | None = Field(default=None, description="Hosting in der EU verfügbar?")
    avv_available: bool = Field(default=False, description="Auftragsverarbeitungs-Vertrag (AVV) verfügbar")
    iso_27001: bool = Field(default=False)
    soc2: bool = Field(default=False)
    tse_zertifiziert: bool = Field(default=False, description="Für Kassen / POS: TSE-Zertifizierung nach KassenSichV")
    gobd_konform: bool = Field(default=False)
    ai_act_class: Literal["minimal", "limited", "high", "unacceptable"] = Field(default="minimal")


class ToolRecommendation(BaseModel):
    use_case_name: str
    target_process: str = Field(default="", description="Welcher Prozess-Name aus dem Audit wird hier adressiert")

    primary_tool: str = Field(description="Konkrete Vendor-Empfehlung (Marke + Produkt)")
    primary_tool_vendor_country: str = Field(default="", description="Herkunftsland des Vendors")
    primary_tool_pricing_model: str = Field(default="", description="z.B. 'pro Zimmer/Monat', 'pro Nutzer', 'Setup + Flat'")
    monthly_cost_eur: int
    setup_cost_eur: int = Field(default=0)
    setup_complexity: Literal["low", "medium", "high"]
    time_to_value_weeks: int = Field(default=4)

    alternative_tools: list[str] = Field(default_factory=list)
    why_this_tool: str
    why_not_alternatives: str = Field(default="", description="Warum die Alternativen NICHT die Erstwahl sind")

    integration_with_existing: str = Field(description="Wie integriert sich das in bestehenden Stack (PMS/POS/Channel/Stb)")
    required_integrations: list[str] = Field(default_factory=list, description="Konkrete Schnittstellen: 'PMS-API', 'DATEV-Export', 'Channel-Manager-Webhook'")
    data_flow: str = Field(default="", description="Wie fließen die Daten ein/aus dem Tool")

    compliance: VendorComplianceBlock = Field(default_factory=VendorComplianceBlock)

    decision_makers_needed: list[str] = Field(default_factory=list, description="Wer im Haus muss zustimmen — GF, Buchhaltung, Stb, DSB")
    risks: list[str] = Field(default_factory=list, description="Lock-in, Vendor-Risk, Datenexport, Outage-Risiken")
    exit_strategy: str = Field(default="", description="Wie kommt das Haus wieder raus aus dem Tool")


class ToolRecommendationOutput(BaseModel):
    recommendations: list[ToolRecommendation]
    stack_summary: str
    total_monthly_cost_eur: int = Field(default=0)
    total_setup_cost_eur: int = Field(default=0)
    integration_complexity_summary: str = Field(default="")


class ROILineItem(BaseModel):
    use_case_name: str
    target_process: str = Field(default="")

    # Investment-Details
    investment_eur_year_1: int
    setup_cost_eur: int = Field(default=0)
    license_cost_eur_year: int = Field(default=0)
    internal_effort_pt: int = Field(default=0, description="Personentage internal effort")

    # Effekt-Details
    savings_eur_year_1: int
    savings_eur_year_2: int = Field(default=0)
    savings_eur_year_3: int = Field(default=0)
    time_saved_h_week: float = Field(default=0.0)
    quality_uplift: str = Field(default="", description="Qualitäts-/Service-Nutzen jenseits direkter € (z.B. Antwortzeit, Conversion)")

    # Risiken
    confidence: Literal["high", "medium", "low"] = Field(default="medium")
    risks: list[str] = Field(default_factory=list)
    assumptions: list[str] = Field(default_factory=list, description="Annahmen die hinter dem ROI stehen")

    payback_months: int
    three_year_roi_percent: int


class ROIOutput(BaseModel):
    line_items: list[ROILineItem]
    total_investment_eur: int
    total_setup_cost_eur: int = Field(default=0)
    total_license_cost_eur_year: int = Field(default=0)
    total_savings_eur_year_1: int
    total_savings_eur_year_2: int = Field(default=0)
    total_savings_eur_year_3: int = Field(default=0)
    total_savings_eur_3_years: int
    total_payback_months: float
    sensitivity_notes: str = Field(default="", description="Was kippt das Ergebnis, wenn Annahmen 20% schlechter sind?")
    summary: str


class WebSource(BaseModel):
    url: str
    title: str
    snippet: str | None = None


class WebResearchOutput(BaseModel):
    company_findings: dict = Field(default_factory=dict, description="Website, Reviews, LinkedIn, Presse, Eigentümer-Struktur")
    region_benchmarks: dict = Field(default_factory=dict, description="Stadt/Region-KPIs für Hospitality, Wettbewerber, Förderprogramme")
    sources: list[WebSource] = Field(default_factory=list)
    summary: str


class ComplianceFlag(BaseModel):
    use_case_name: str
    dsgvo_relevant: bool
    dsgvo_reason: str | None = None
    ai_act_risk_class: Literal["minimal", "limited", "high", "unacceptable"] = "minimal"
    industry_specific: list[str] = Field(default_factory=list, description="z.B. 'Gastrecht', 'Hygienepflichten'")
    mitigations: list[str] = Field(default_factory=list)


class ComplianceOutput(BaseModel):
    flags: list[ComplianceFlag]
    general_advice: str
    disclaimer: str = "Diese Hinweise ersetzen keine Rechtsberatung. Vor Umsetzung mit DSGVO-Beauftragten und Anwalt prüfen."


class RoadmapMilestone(BaseModel):
    week: int = Field(description="Wochen nach Phase-Start")
    title: str
    success_criterion: str = Field(description="Wie wird das Erreichen gemessen")


class RoadmapPhase(BaseModel):
    phase_number: Literal[1, 2, 3]
    name: str
    duration_months: str = Field(description="z.B. '0-3 Monate'")
    use_cases: list[str]
    required_tools: list[str]
    estimated_effort_pt: int = Field(description="Personentage Schätzung")
    dependencies: list[str] = Field(default_factory=list)
    expected_outcomes: str
    milestones: list[RoadmapMilestone] = Field(default_factory=list, description="Konkrete Meilensteine innerhalb der Phase")
    success_metrics: list[str] = Field(default_factory=list, description="KPIs gegen die der Phasen-Erfolg gemessen wird")
    kill_criteria: list[str] = Field(default_factory=list, description="Wann die Phase abgebrochen werden sollte")
    decision_makers: list[str] = Field(default_factory=list, description="Wer muss die Phase freigeben")


class RoadmapOutput(BaseModel):
    phases: list[RoadmapPhase]
    critical_path: str
    critical_path_risks: list[str] = Field(default_factory=list, description="Was kann den Critical Path kippen")
    total_effort_pt: int


class Hypothesis(BaseModel):
    id: str
    confidence: Literal["high", "medium", "low"]
    title: str
    statement: str = Field(description="Die Hypothese in 1-2 Sätzen")
    evidence: list[str] = Field(description="Datenpunkte die die Hypothese stützen")
    benchmark_comparison: str | None = Field(default=None, description="Wie weicht die Firma vom Branchen-Benchmark ab")
    push_back_question: str = Field(description="Frage die Ada im Voice-Interview stellt, um Hypothese zu validieren")
    quantification_formula: str | None = Field(default=None, description="Wie groß ist der finanzielle Hebel quantifiziert")


class PreAuditOutput(BaseModel):
    """Output des Pre-Audit-Analyst — VOR dem Voice-Interview."""
    hypotheses: list[Hypothesis]
    overall_situation: str = Field(description="2-3 Sätze: wie steht das Haus da im Vergleich zur Branche")
    suggested_focus_topics: list[str] = Field(description="Top-3 Themen die Ada im Gespräch tief untersuchen sollte")
    data_gaps: list[str] = Field(description="Was wir VOR dem Gespräch nicht aus den Daten beantworten können")
    data_recap_for_voice: str = Field(default="", description="Daten-Recap-Eröffnungs-Monolog für Ada (2-3 Absätze, gesprochener Stil): Was wurde aus Dokumenten gelesen, welcher erster Eindruck, welche Fragen daraus folgen — für die ersten 3-5 Min des Voice-Gesprächs.")


class DocumentInsight(BaseModel):
    document_name: str
    doc_type: str
    key_findings: list[str] = Field(description="3-7 wichtigste Erkenntnisse aus dem Dokument")
    anomalies: list[str] = Field(description="Werte die vom Branchen-Benchmark abweichen (in beide Richtungen)")
    confidence: Literal["high", "medium", "low"] = Field(description="Datenqualität / Plausibilität")


class DocumentAnalysisOutput(BaseModel):
    """Output des Document-Analyst — Strukturierte Daten-Interpretation NACH dem Voice-Interview."""
    insights: list[DocumentInsight]
    consolidated_kpis: dict = Field(default_factory=dict, description="Aus allen Docs zusammengeführte KPIs")
    benchmark_assessment: str = Field(description="Wo steht das Haus laut Daten vs Branchen-Benchmark")
    data_quality_score: float = Field(ge=0.0, le=1.0, description="Wie verlässlich ist die Datenbasis (0-1)")
    data_gaps: list[str] = Field(description="Was fehlt für ein vollständiges Bild")
    cross_validation: str = Field(description="Stimmen Voice-Aussagen mit Doc-Daten überein?")


class FullReport(BaseModel):
    company_name: str
    pre_audit: PreAuditOutput | None = None
    document_analysis: DocumentAnalysisOutput | None = None
    audit: ProcessAuditOutput
    use_cases: UseCaseOutput
    tools: ToolRecommendationOutput
    roi: ROIOutput
    compliance: ComplianceOutput | None = None
    roadmap: RoadmapOutput | None = None
    web_research: WebResearchOutput | None = None
    executive_summary: str = Field(description="3-4 Sätze Top-Empfehlung für CEO")

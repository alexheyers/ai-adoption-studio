# PRD — AI-Adoption-Studio

> **Dokument-Typ:** BMAD Product Requirements Document (Phase 1 — Anforderungen)
> **Projekt:** AI-Adoption-Studio
> **Stand:** 09.06.2026
> **Autor-Kontext:** Alex Heyers · Vibe Coding Bootcamp (Digitale Leute School, Kohorte 05/26)
> **Horizonte:** **H1** = Portfolio-Demo bis Final-Pitch 21.07.2026 · **H2** = BIZ26-SaaS danach
> **Vorgelagert:** `docs/plan/01-product-brief.md` (Vision & Scope, 3-Stufen-Modell)
> **Quellen (real gelesen):** `schemas/outputs.py`, `schemas/briefing.py`, `agents/orchestrator.py`, `docs/sdk-architecture.md`, `supabase/migrations/20260509_001_init.sql`, `api/routers/run.py`, `knowledge/vendor_landscape.yaml`, `AI-ADOPTION-STUDIO.md`

---

## Lese-Konventionen

- Jede funktionale Anforderung hat eine **ID** (`FR-n`) und einen **Horizont-Tag** `[H1]` oder `[H2]`.
- Nicht-funktionale Anforderungen heissen `NFR-n`.
- Jede Anforderung ist genau **einer der 3 Stufen** zugeordnet (Verstehen / Designen / Bauen) bzw. den Querschnitts-Themen.
- **Abgrenzungs-Pflicht:** Wo "Orchestrierung" auftaucht, ist immer das **Produkt-Feature Stufe 3** (Kunden-Systeme verbinden) gemeint — **niemals** die interne Meta-Delivery-Plattform (Studio baut sich selbst, Linear ALE-44/49/50). Das ist out of scope für dieses Dokument.

---

## Ziele & Kontext

### Produktziel

Das AI-Adoption-Studio soll ein mittelständisches Unternehmen (Erstfall: Hotel DACH, konzeptionell branchenagnostisch) durch drei Stufen führen: es **versteht** den Betrieb vollständig (Stufe 1), **designt** daraus die komplette Ziel-Systemlandschaft (Stufe 2) und **baut/orchestriert** diese Systeme real (Stufe 3). Heute existiert produktiv nur Stufe 1; Stufe 2 und 3 sind im Plan noch nicht modelliert. Dieses PRD schliesst die Anforderungslücke.

### Doppelter Zweck (Priorität fest)

1. **Primär — Karriere-Asset (H1):** lauffähige, beeindruckende Demo, die Alex als Vibe Coder / Solutions Engineer beweist. Erfolg = ein Hiring-Manager lädt nach der Demo zum Gespräch ein.
2. **Sekundär — BIZ26-SaaS (H2):** echtes Multi-Tenant-Produkt mit zahlenden Kunden danach.

### Belegter Ist-Stand (Anker für die Anforderungen)

- **Stufe 1 ist gebaut:** 7 Analyse-Agenten laufen seriell (`agents/orchestrator.py`), jeder liefert ein Pydantic-typisiertes Output (`schemas/outputs.py`), der `Reporter` aggregiert zu `FullReport`. Voice-Agent Ada (ElevenLabs) ist ausgereift, aber NICHT als Claude-SDK-Agent migriert (`docs/sdk-architecture.md` §7).
- **Stufe-2-Bausteine embryonal vorhanden:** `ToolRecommendation` trägt `required_integrations`, `data_flow`, `integration_with_existing` (Z. 145–147); `ProcessTouchpoint.integration_status` (`isolated | manual-sync | api-integrated | unknown`) erfasst die heutige Ist-Landschaft. Es fehlt ein verdichtendes `SystemLandscape`-Schema und ein Generator-Agent.
- **Stufe 3 fehlt vollständig:** kein Schema, kein Agent, keine Tabelle. `vendor_landscape.yaml` kennt aber bereits n8n/Make/Zapier (Z. 238–250) und "Selbstbau · n8n + Claude API"-Patterns — der Hebel ist da.
- **Datenmodell heute:** `profiles`, `companies`, `documents`, `web_research`, `voice_sessions`, `runs`, `run_results` (alle RLS-an, owner-scoped via `auth.uid()`). Keine Tabelle für Landschaften, Knoten, Kanten oder Orchestrierungen.
- **Erweiterbarkeit gesichert:** `agent_patterns/`-SDK erlaubt additives Einhängen eines neuen Agenten in 3 Schritten ohne Core-Eingriff (`docs/sdk-architecture.md` §5).

### Annahmen (zu verifizieren, nicht halluziniert)

- **A1:** Der `system_architect`-Agent lässt sich additiv via `agent_patterns` einhängen (3-Schritt-Registrierung). → Vor Stufe-2-Start verifizieren.
- **A2:** n8n-MCP (`n8n_create_workflow` / `n8n_validate_workflow` / `n8n_deploy_template`) ist gegen die VPS-n8n-Instanz aus dieser Umgebung end-to-end nutzbar. → Vor dem Stufe-3-Teaser smoke-testen.
- **A3:** Für H1 läuft die Demo gegen ein **Mock-/Sandbox-PMS**, nicht gegen Produktiv-Credentials — bewusster Scope-Cut, im Pitch ehrlich als "gegen echte API live schaltbar" gerahmt.

---

## User-Journeys über alle 3 Stufen

### Journey J1 — H1-Demo-Journey (Mock-Hotel, end-to-end für den Pitch)

Hauptdarsteller: Alex (Operator) führt die Demo vor; das Mock-Hotel (`mock_data/demo_hotel.json`) ist das Subjekt; der Hiring-Manager ist das Publikum.

1. **Onboarding & Upload (Stufe 1):** Mock-Hotel wird angelegt, Beispiel-Dokumente (GuV, Personal, KPI) hochgeladen. Web-Research-Agent zieht Kontext. Pre-Audit-Analyst bildet Hypothesen.
2. **Voice-Interview mit Ada (Stufe 1):** kontextbewusstes Gespräch, dynamische Fragen aus dem Master-Pool; Transcript landet im Briefing.
3. **Multi-Agent-Run (Stufe 1):** 7 Agenten erzeugen Audit → Use-Cases → Tool-Empfehlungen → ROI → Compliance → Roadmap; `Reporter` baut `FullReport`; PPTX/Excel werden erzeugt.
4. **System-Design generieren (Stufe 2):** der neue `system_architect`-Agent verdichtet `ProcessAuditOutput` (Ist) + `ToolRecommendationOutput` (Ziel) zu einem `SystemLandscape`-Graphen; ein Validierungspass prüft jede Kante.
5. **Ist→Ziel-Visualisierung (Stufe 2):** interaktiver Graph zeigt links die heutigen isolierten Inseln, rechts die verbundene Ziel-Landschaft mit n8n als Hub. Neue Report-/Web-Sektion "Eure Ziel-Systemlandschaft".
6. **Bauen-Teaser (Stufe 3):** **genau eine** Automation (z.B. "Reservierungs-Mail → PMS-Eintrag") wird live als valides n8n-Workflow-JSON generiert, validiert und gegen das Sandbox-PMS deployt — der "BAUEN"-Beweis.
7. **Pitch-Abschluss:** Story "verstehen → designen → bauen" ist in einer Sitzung lauffähig vorgeführt, ohne erfundene Zahlen.

### Journey J2 — H2-Self-Service-Journey (zahlender KMU-Kunde)

1. **Tenant-Onboarding (Querschnitt):** Kunde registriert sich, Tenant wird isoliert provisioniert, Plan/Billing aktiv.
2. **Verstehen (Stufe 1):** Upload + Ada-Interview + Multi-Agent-Run, wie H1 aber für echte Firmendaten, mehrfach wiederholbar (Re-Run/Versionierung).
3. **Designen (Stufe 2):** vollständige, versionierte Ziel-Landschaft pro Run; Re-Design-Loop, wenn sich Bedürfnisse ändern.
4. **Bauen/Orchestrieren (Stufe 3):** Konnektoren werden über einen verschlüsselten Credential-Vault verbunden; **ganze** Landschaft wird als Bündel von n8n-Workflows deployt; Monitoring zeigt Status laufender Orchestrierungen.
5. **Betrieb & ROI-Nachweis (Querschnitt):** Kunde betreibt mindestens eine produktive Orchestrierung; messbare Einsparung wird gegen die ROI-Prognose nachgehalten.

### Journey J3 — H2-Operator-Journey (Alex als Berater)

Alex nutzt das Studio als Beratungs-Werkzeug bei eigenen Kunden: vom Erst-Gespräch über die designte Landschaft bis zur teil-gebauten Umsetzung — in Senior-Qualität, ohne manuellen Workshop-Aufwand. Nutzt dieselben Stufen wie J2, aber mit Operator-Rechten über mehrere Mandanten.

---

## Funktionale Anforderungen — Stufe 1: VERSTEHEN

| ID | Anforderung | Horizont |
|---|---|---|
| **FR-1** | Das System MUSS ein Unternehmen anlegen können (`companies`) mit Stammdaten, KPIs, Pain Points und bestehendem Tool-Stack (`schemas/briefing.py · CompanyContext`, `HospitalityKPIs`, `PainPoint`). | [H1] |
| **FR-2** | Das System MUSS Dokumente (PDF/Excel/CSV/DOCX) entgegennehmen, in Storage ablegen und parsen (`documents.parsed_text`, `parser_status`), inkl. KPI-Extraktion (`extracted_kpis`). | [H1] |
| **FR-3** | Ein Web-Research-Agent MUSS firmen- und regionsbezogene Kontextdaten liefern (`WebResearchOutput`: `company_findings`, `region_benchmarks`, `sources`). | [H1] |
| **FR-4** | Ein Pre-Audit-Analyst MUSS VOR dem Voice-Interview Hypothesen mit Evidenz, Benchmark-Abgleich und Push-Back-Fragen erzeugen (`PreAuditOutput`, `Hypothesis`). | [H1] |
| **FR-5** | Das System MUSS ein kontextbewusstes Voice-Interview mit Ada führen (ElevenLabs), das aus einem Master-Fragepool dynamisch 10–15 Fragen selektiert und ein Transcript persistiert (`voice_sessions.transcript`, `transcript_json`). | [H1] |
| **FR-6** | Ein Process-Auditor MUSS pro Prozess Ist-Situation, Stakeholder, Touchpoints (inkl. `integration_status`), eingesetzte Tools, Compliance-Flags und Automatisierungs-Potenzial liefern (`ProcessAuditOutput`). | [H1] |
| **FR-7** | Ein Use-Case-Generator MUSS Use-Cases mit AI-Pattern, Impact, Komplexität, Quick-Win-Flag und VUFVE-Reality-Check erzeugen (`UseCaseOutput`, `VUFVECheck`). | [H1] |
| **FR-8** | Ein Tool-Recommender MUSS pro Use-Case eine Vendor-Empfehlung inkl. Kosten, Setup-Komplexität, **`required_integrations`**, **`data_flow`** und **`integration_with_existing`** liefern (`ToolRecommendationOutput`). *(Diese Felder sind der Eingangs-Datensatz für Stufe 2.)* | [H1] |
| **FR-9** | Ein ROI-Calculator MUSS einen 3-Jahres-Business-Case mit Investment, Savings, Payback, Konfidenz und Sensitivität liefern (`ROIOutput`). | [H1] |
| **FR-10** | Ein Compliance-Checker MUSS DSGVO-/AI-Act-Flags pro Use-Case mit Mitigationen und Disclaimer liefern (`ComplianceOutput`). | [H1] |
| **FR-11** | Ein Roadmap-Generator MUSS eine 3-Phasen-Roadmap mit Meilensteinen, Aufwand (PT), Critical-Path und Kill-Kriterien liefern (`RoadmapOutput`). | [H1] |
| **FR-12** | Ein Reporter MUSS alle Agent-Outputs zu einem `FullReport` mit Executive Summary aggregieren. | [H1] |
| **FR-13** | Das System MUSS aus dem `FullReport` ein PPTX- und ein Excel-Deliverable erzeugen und als signierten Download bereitstellen (`api/routers/run.py · /{run_id}/download/{fmt}`). | [H1] |
| **FR-14** | Der gesamte Run MUSS als Hintergrund-Job laufen, mit nachverfolgbarem Status (`runs.status`, `current_step`) und einzeln persistierten Agent-Outputs (`run_results`, unique `(run_id, agent_name)`). | [H1] |
| **FR-15** | Das System MUSS die Pipeline auch ohne Voice/Frontend lokal lauffähig halten (Smoke-Test gegen `mock_data/demo_hotel.json`). | [H1] |
| **FR-16** | Ein Document-Analyst MUSS Voice-Aussagen gegen Dokument-Daten kreuzvalidieren und einen Datenqualitäts-Score liefern (`DocumentAnalysisOutput`). | [H1] |

## Funktionale Anforderungen — Stufe 2: DESIGNEN

| ID | Anforderung | Horizont |
|---|---|---|
| **FR-17** | Es MUSS ein neues Output-Schema `SystemLandscape` geben mit `nodes[]` (System: Name, Kategorie, Tier, Vendor, `eu_hosting`, Kosten, Status `keep` / `add` / `replace` / `retire`), `edges[]` (Integration: `from`→`to`, `mechanism` ∈ {native-API, webhook, iPaaS-n8n, file-export, manual}, `data_objects[]`, `direction`, `frequency`, Compliance-Flag), `automations[]` (Trigger → Schritte → Outcome, gemappt auf Use-Cases) und `layers` (Datenquelle / Orchestrierung / Aktion / Analytik). | [H1] |
| **FR-18** | Das System MUSS aus dem Audit einen **Ist-Graphen** ableiten (aus `ProcessTouchpoint.system` + `integration_status` + `CurrentToolInUse`). | [H1] |
| **FR-19** | Das System MUSS aus den Tool-Empfehlungen einen **Ziel-Graphen** ableiten (aus `ToolRecommendation.required_integrations` + `data_flow` + `integration_with_existing`). | [H1] |
| **FR-20** | Ein neuer `system_architect`-Agent MUSS Ist- und Ziel-Graph zu einem kohärenten `SystemLandscape` verdichten, Integrations-Konflikte auflösen (z.B. doppelte PMS) und fehlende Konnektoren als explizite Lücke markieren ("Tool A braucht Daten X, keine Quelle liefert X"). Der Agent MUSS additiv via `agent_patterns` registriert werden (kein Core-Eingriff). | [H1] |
| **FR-21** | Ein **Integritäts-Validierungspass** (analog VUFVE) MUSS sicherstellen: jede Kante hat einen realen `mechanism` (kein "magisch verbunden"), jeder geforderte Datenfluss hat eine Quelle, jede Automation hat einen Owner. Verletzungen MÜSSEN als Findings ausgewiesen, nicht verschwiegen werden. | [H1] |
| **FR-22** | Das System MUSS den `SystemLandscape`-Graphen interaktiv rendern — **Ist links / Ziel rechts** — als 2D/3D-Visualisierung (Reuse `System-Map/` Three.js), in <10 Sekunden als "aus Bedürfnissen wird Struktur" verständlich. | [H1] |
| **FR-23** | Das System MUSS eine neue Report-/Web-Sektion "Eure Ziel-Systemlandschaft" liefern und das `SystemLandscape`-Artefakt in den `FullReport` integrieren. | [H1] |
| **FR-24** | In H1 MÜSSEN `automations[]` **deklarativ-abstrakt** modelliert sein ("Trigger X → Aktion Y"), 1:1 auf Use-Cases gemappt — KEIN voll ausführbares JSON (Ausnahme: der eine Teaser-Flow, FR-27). | [H1] |
| **FR-25** | `SystemLandscape` MUSS pro Run versioniert und immutable in Supabase persistiert werden (neue Tabellen `system_landscapes`, `landscape_nodes`, `landscape_edges`, `automation_blueprints`), owner-scoped via RLS (Muster aus `runs`/`run_results`). | [H2] |
| **FR-26** | Das System MUSS einen **Re-Design-Loop** unterstützen: bei geänderten Bedürfnissen wird eine neue Landschafts-Version erzeugt und gegen die Vorversion vergleichbar gemacht. | [H2] |

## Funktionale Anforderungen — Stufe 3: BAUEN / ORCHESTRIEREN

| ID | Anforderung | Horizont |
|---|---|---|
| **FR-27** | Das System MUSS in der Demo **genau eine** `automation` als valides n8n-Workflow-JSON generieren, lokal validieren (`n8n_validate_workflow`) und gegen ein Mock-/Sandbox-Ziel deployen (`n8n_create_workflow` / `n8n_deploy_template`). Der Flow MUSS lauffähig sein — kein Slide. | [H1] |
| **FR-28** | Das System MUSS den Stufe-3-Teaser ehrlich rahmen: gegen Mock/Sandbox gebaut, im Pitch als "gegen echte API live schaltbar" deklariert — nie als fertig produktiv verkauft. | [H1] |
| **FR-29** | Ein **Blueprint→n8n-Compiler** MUSS aus `automations[]` einer **ganzen** Landschaft generisch n8n-Workflows erzeugen (nicht nur 1 Flow). | [H2] |
| **FR-30** | Ein **Konnektor-Framework** MUSS ≥20 echte API-Konnektoren bereitstellen, mit Credential-Vault (verschlüsselt, Tenant-scoped, neue Tabelle `connector_credentials`). | [H2] |
| **FR-31** | Das System MUSS deployte Orchestrierungen mit Status nachhalten (neue Tabelle `orchestration_runs`) und ein Monitoring der laufenden Flows bereitstellen. | [H2] |
| **FR-32** | Das System MUSS eine **ganze** designte Landschaft (nicht nur einen Einzel-Flow) als Bündel deployen können. | [H2] |

## Funktionale Anforderungen — Querschnitt (Auth, Branchen, Betrieb)

| ID | Anforderung | Horizont |
|---|---|---|
| **FR-33** | Das System MUSS owner-scoped Zugriff über RLS sicherstellen (bestehendes `auth.uid()`-Muster auf allen Tabellen). | [H1] |
| **FR-34** | Das System MUSS vollständig branchenagnostisch erweiterbar sein: ein Branchenwechsel ist ein neues Vendor-Pack + Fragepool (`agent_patterns/patterns/<domain>/`), **nicht** ein neuer Generator. Graph-Abstraktion (nodes/edges/automations) bleibt domänenfrei. | [H2] |
| **FR-35** | Das System MUSS echte Multi-Tenant-Isolation über das heutige `owner_id`/RLS-Muster hinaus bieten (Tenant-Slug/Namespace). | [H2] |
| **FR-36** | Das System MUSS Billing/Pricing/Metering pro Tenant unterstützen (heute Stub). | [H2] |
| **FR-37** | Das System MUSS mindestens eine zweite Branche (über Hospitality hinaus, z.B. Retail oder Healthcare aus den heutigen Stubs) als eigenes Pack lauffähig machen — Nachweis der Branchenagnostik. | [H2] |

---

## Nicht-funktionale Anforderungen

| ID | Bereich | Anforderung | Horizont |
|---|---|---|---|
| **NFR-1** | **Mandantenfähigkeit** | Datenisolation MUSS in H1 mindestens per `owner_id`/RLS gewährleistet sein; in H2 echte Tenant-Namespace-Isolation. Kein Tenant darf je Daten eines anderen sehen. | [H1]/[H2] |
| **NFR-2** | **DSGVO** | EU-Hosting MUSS für verarbeitete Firmendaten möglich sein; AVV-Fähigkeit der eingesetzten Vendoren ist im Schema abgebildet (`VendorComplianceBlock.eu_hosting`, `avv_available`). Jede Stufe-2-Kante mit personenbezogenen Datenflüssen MUSS ein DSGVO-Flag tragen. | [H1] |
| **NFR-3** | **AI-Act** | Jeder Use-Case und jede Empfehlung MUSS eine AI-Act-Risikoklasse führen (`minimal`/`limited`/`high`/`unacceptable`); Compliance-Hinweise MÜSSEN den Disclaimer "ersetzt keine Rechtsberatung" tragen. | [H1] |
| **NFR-4** | **Performance** | Ein vollständiger Multi-Agent-Run MUSS in der Demo zuverlässig durchlaufen (serielle Agenten mit Rate-Limit-Pause, `AGENT_PAUSE_SECONDS`, Default 8s). H1 läuft bewusst **single-run** — keine Production-Concurrency. | [H1] |
| **NFR-5** | **Performance/Skalierung** | In H2 MUSS der Run-Executor von FastAPI-BackgroundTasks auf Celery/Redis umgestellt werden (Retry/Backoff, Timeouts, Concurrency). | [H2] |
| **NFR-6** | **Kosten** | Agent-Token-Verbrauch MUSS pro Run nachvollziehbar sein (`run_results.tokens_input`/`tokens_output`); die Pipeline MUSS für die Demo innerhalb des Anthropic-Tier-1-Budgets laufen. | [H1] |
| **NFR-7** | **Security** | Secrets/API-Keys MÜSSEN aus `.env` geladen, niemals ins Repo committet werden; Service-Role-Key umgeht RLS nur backend-seitig. In H2 MÜSSEN Konnektor-Credentials verschlüsselt und Tenant-scoped abgelegt sein. | [H1]/[H2] |
| **NFR-8** | **Ehrlichkeit/Integrität** | Es DÜRFEN keine erfundenen Zahlen oder als "fertig" verkaufte leere Features gezeigt werden. Jede gezeigte Verbindung MUSS einen realen Mechanismus haben (Integritäts-Guardrail, FR-21). | [H1] |
| **NFR-9** | **Projekt-Leitplanken** | Das Repo DARF nirgends "BIZ26"/"KI-Boutique" enthalten; "Münster" ist verboten; echte Umlaute (ä/ö/ü) statt ae/oe/ue überall; Trevor-Noah-Voice in Texten. Pre-Deploy-grep Pflicht. | [H1]/[H2] |
| **NFR-10** | **Wartbarkeit/Erweiterbarkeit** | Neue Agenten MÜSSEN additiv via `agent_patterns` (3-Schritt-Registrierung, kein Core-Eingriff) eingehängt werden; Output-Schemas (`schemas/`) bleiben für SDK- und Legacy-Pfad identisch. | [H1] |
| **NFR-11** | **Deploybarkeit** | Das System MUSS auf den bestehenden Deploy-Zielen (Vercel Frontend / Hostinger-VPS Backend, n8n self-hosted) lauffähig sein. | [H1] |
| **NFR-12** | **Auditierbarkeit** | In H2 MÜSSEN Multi-Tenant-Isolation und Credential-Zugriffe auditierbar protokolliert werden. | [H2] |

---

## MVP-Schnitt für H1-Demo (was MUSS bis 21.07. lauffähig sein)

Der MVP ist der **kleinste lauffähige Beweis der vollen 3-Stufen-Story**. Alles, was nicht direkt zur Pitch-Wirkung beiträgt, ist gestrichen.

### MUSS im H1-MVP (Pitch-kritisch)

- **Stufe 1 — VOLL:** FR-1 bis FR-16 end-to-end gegen das Mock-Hotel lauffähig (Ada-Voice-Intake + Doku-Analyse + Multi-Agent-Run + PPTX/Excel-Report).
- **Stufe 2 — überzeugender Prototyp:** FR-17, FR-18, FR-19, FR-20, FR-21, FR-22, FR-23, FR-24. Das heisst: `SystemLandscape`-Schema + Ist-/Ziel-Ableitung + `system_architect`-Agent + Validierungspass + interaktiver Ist→Ziel-Graph + Report-Sektion. Automationen deklarativ.
- **Stufe 3 — angedeutet/teil-real:** FR-27, FR-28. Genau **eine** Automation live generiert, validiert und gegen Sandbox deployt.
- **Querschnitt:** FR-33 (RLS), plus alle relevanten NFRs für H1: NFR-1 (Basis), NFR-2, NFR-3, NFR-4, NFR-6, NFR-7 (Basis), NFR-8, NFR-9, NFR-10, NFR-11.

### KANN im H1-MVP (nice-to-have, nicht blockierend)

- Persistenz des `SystemLandscape` in dedizierte Tabellen (FR-25 ist eigentlich H2; in H1 reicht JSONB im `run_results`-Muster).
- Mehr als eine Teaser-Automation (über FR-27 hinaus).

### Vorgeschlagener Milestone-Schnitt H1

Neuer Milestone **"P6 · System-Design-Demo"** (~21.06.–14.07., parallel zu P4/P5):
- **E1** `SystemLandscape`-Schema + Validierungspass (FR-17, FR-21)
- **E2** `system_architect`-Agent additiv via `agent_patterns` (FR-18, FR-19, FR-20)
- **E3** Ist→Ziel-Graph-Renderer (FR-22)
- **E4** Report-Integration (FR-23, FR-24)
- **E5** Stufe-3-Teaser: 1 n8n-Flow generiert + deployt (FR-27, FR-28)

### Definition of Done — H1-Demo

1. Die komplette Story "verstehen → designen → bauen" ist in **einer** Sitzung lauffähig vorführbar.
2. Der Ist→Ziel-Graph rendert live für das Mock-Hotel.
3. Mindestens eine Automation wird im Pitch real generiert, validiert und deployt.
4. Kein erfundenes Zahlenmaterial; Integritäts-Guardrail (FR-21) bestanden.
5. Alle Projekt-Leitplanken (NFR-9) erfüllt; Pre-Deploy-grep grün.

---

## Abgrenzung H1 / H2

| Thema | H1 (Demo bis 21.07.) | H2 (SaaS danach) |
|---|---|---|
| **Stufe 1** | voll lauffähig gegen Mock-Hotel | mehrfach wiederholbar, echte Kundendaten, Re-Run/Versionierung |
| **Stufe 2** | überzeugender Prototyp; Automationen deklarativ; JSONB-Persistenz | dedizierte versionierte Tabellen (FR-25), Re-Design-Loop (FR-26) |
| **Stufe 3** | **1** Teaser-Flow gegen Sandbox (FR-27/28) | Voll-Compiler (FR-29), Konnektor-Bibliothek + Vault (FR-30), Monitoring (FR-31), ganze Landschaft deployen (FR-32) |
| **Mandanten** | `owner_id`/RLS | echte Tenant-Isolation (FR-35), Billing (FR-36) |
| **Performance** | single-run, BackgroundTasks | Celery/Redis, Concurrency (NFR-5) |
| **Branchen** | Hospitality tief | branchenagnostisch, ≥2. Branche (FR-34, FR-37) |
| **Daten gegen** | Mock/Sandbox | echte Live-API-Connects |

**Explizit NICHT in diesem PRD (jeglicher Horizont):** die interne Meta-Delivery-Plattform (Studio baut sich selbst, Linear ALE-44/49/50). Das ist ein separates internes Werkzeug, kein Endkunden-Feature, und darf mit Stufe 3 nicht vermischt werden.

---

## Akzeptanzkriterien für die wichtigsten Flows

> Format: **Given / When / Then**. Pitch-kritische Flows zuerst.

### AC-1 — Multi-Agent-Run Stufe 1 (FR-6 bis FR-15)

- **Given** ein angelegtes Mock-Hotel mit Briefing (`schemas/briefing.py`) und optionalem Voice-Transcript,
- **When** ein Run gestartet wird (`POST /run/start`),
- **Then** laufen alle 7 Agenten seriell, jeder Output wird einzeln in `run_results` persistiert (unique `(run_id, agent_name)`), `runs.status` wechselt `pending → in_progress → completed`, `current_step` wird mitgeführt,
- **And** der `Reporter` liefert einen validen `FullReport` mit nicht-leerer `executive_summary`,
- **And** PPTX + Excel sind als signierter Download abrufbar (`/{run_id}/download/{fmt}`).
- **And** der Smoke-Test gegen `mock_data/demo_hotel.json` läuft ohne Supabase/Voice/Frontend durch (FR-15).

### AC-2 — System-Design-Generierung Stufe 2 (FR-17 bis FR-21)

- **Given** ein abgeschlossener `FullReport` mit `ProcessAuditOutput` und `ToolRecommendationOutput`,
- **When** der `system_architect`-Agent läuft,
- **Then** entsteht ein valides `SystemLandscape` mit nicht-leeren `nodes[]`, `edges[]`, `automations[]` und `layers`,
- **And** jeder Knoten trägt einen Status (`keep`/`add`/`replace`/`retire`), jede Kante einen realen `mechanism`,
- **And** der Ist-Graph leitet sich nachweisbar aus `ProcessTouchpoint.integration_status` ab, der Ziel-Graph aus `ToolRecommendation.required_integrations`,
- **And** der Validierungspass (FR-21) markiert jede Kante ohne realen Mechanismus, jeden Datenfluss ohne Quelle und jede Automation ohne Owner als explizites Finding (statt es zu verschweigen).

### AC-3 — Ist→Ziel-Visualisierung Stufe 2 (FR-22, FR-23)

- **Given** ein generiertes `SystemLandscape`,
- **When** die Demo-Page geöffnet wird,
- **Then** rendert links die Ist-Landschaft (isolierte Inseln, `manual-sync`/`isolated` visuell hervorgehoben) und rechts die Ziel-Landschaft (verbundene Knoten, n8n als Hub),
- **And** ein nicht-tech-affiner Betrachter erfasst die Aussage "aus Bedürfnissen wird Struktur" in unter 10 Sekunden,
- **And** die Report-Sektion "Eure Ziel-Systemlandschaft" ist im `FullReport` enthalten.

### AC-4 — Bauen-Teaser Stufe 3 (FR-27, FR-28)

- **Given** eine ausgewählte `automation` aus dem `SystemLandscape` (z.B. "Reservierungs-Mail → PMS-Eintrag"),
- **When** der Bauen-Teaser ausgelöst wird,
- **Then** wird valides n8n-Workflow-JSON generiert, lokal validiert (`n8n_validate_workflow` ohne Fehler) und gegen das Sandbox-Ziel deployt (`n8n_create_workflow`),
- **And** der deployte Flow ist lauffähig (kein Mockup-Screenshot),
- **And** die UI/der Pitch rahmt ihn ehrlich als "gegen echte API live schaltbar" — nie als produktiv fertig.

### AC-5 — Voice-Interview Stufe 1 (FR-5)

- **Given** ein vorbereitetes Pre-Brief (Hypothesen aus FR-4),
- **When** das Ada-Interview gestartet wird,
- **Then** selektiert Ada dynamisch 10–15 Fragen aus dem Master-Pool, führt ein hypothesen-getriebenes (nicht-lineares) Gespräch,
- **And** das Transcript wird in `voice_sessions` persistiert und fliesst als `voice_interview_transcript` ins Briefing.

### AC-6 — Integrität & Leitplanken (NFR-8, NFR-9)

- **Given** der fertige Demo-Stand vor dem Pitch,
- **When** der Pre-Deploy-Check läuft,
- **Then** findet ein grep auf "BIZ26"/"KI-Boutique"/"Münster"/"ae|oe|ue" (in betroffenen Kontexten) **keine** Treffer,
- **And** keine im Pitch gezeigte Zahl ist erfunden, keine Kante ohne realen Mechanismus, kein leeres Feature als "fertig" deklariert.

### AC-7 — Mandanten-Isolation H2 (FR-35, NFR-1)

- **Given** zwei Tenants A und B mit je eigenen Companies/Runs/Landscapes,
- **When** Tenant A Daten abfragt,
- **Then** liefert das System ausschliesslich A-Daten; ein Zugriff auf B-Daten ist über RLS/Namespace technisch ausgeschlossen und auditierbar protokolliert.

---

## Offene Punkte (von Alex zu entscheiden)

- **OQ-1 [H1]:** Tiefe von Stufe 3 in der Demo — reicht 1 Teaser-Flow gegen Sandbox, oder soll ein zweiter Flow gezeigt werden? (Empfehlung: 1 reicht, Scope-Risiko.)
- **OQ-2 [H1]:** Mock-PMS vs. echter Sandbox-Account für den n8n-Teaser (A2/A3 verifizieren).
- **OQ-3 [H1]:** Persistiert `SystemLandscape` in H1 als JSONB (schnell) oder direkt in dedizierte Tabellen (FR-25, mehr Aufwand)?
- **OQ-4 [H1/H2]:** Granularität von `automations[]` final — bleibt H1 strikt deklarativ, oder soll ein zweites Automations-Schema-Feld den späteren Compiler-Pfad vorbereiten?
- **OQ-5 [H2]:** Welche zweite Branche zuerst (Retail vs. Healthcare) für den Branchenagnostik-Nachweis (FR-37)?
- **OQ-6 [H1]:** Wird der Ist→Ziel-Renderer in die bestehende Next.js-Web-App integriert oder als eigenständige `System-Map/`-Page gezeigt?

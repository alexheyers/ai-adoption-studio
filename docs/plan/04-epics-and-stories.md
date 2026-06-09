# Epics & Stories — AI-Adoption-Studio

> **Dokument-Typ:** BMAD Epics & Stories (Phase 3 — Umsetzungs-Strukturierung)
> **Projekt:** AI-Adoption-Studio
> **Stand:** 09.06.2026
> **Autor-Kontext:** Alex Heyers · Vibe Coding Bootcamp (Digitale Leute School, Kohorte 05/26)
> **Horizonte:** **H1** = Portfolio-Demo bis Final-Pitch 21.07.2026 · **H2** = BIZ26-SaaS danach
> **Vorgelagert:** `docs/plan/01-product-brief.md`, `docs/plan/02-prd.md`, `docs/plan/03-architecture.md`
> **Linear-Anker (real verifiziert, Team ALE):** 50 Issues ALE-1…ALE-50, Milestones P1 (100%) · P2 (52%) · P3 (3%) · P4 (17%) · P5 (4%); Targets P3 30.06., P4 14.07., P5 20.07.

---

## Wie dieses Dokument zu lesen ist

- **Epic-ID:** `EPIC-1` … `EPIC-12`. Jeder Epic ist **genau einem Horizont** (`[H1]`/`[H2]`) und **genau einer Stufe** (1 = Verstehen · 2 = Designen · 3 = Bauen/Orchestrieren · Q = Querschnitt) zugeordnet.
- **User-Story-Format:** *„Als &lt;Rolle&gt; möchte ich &lt;Ziel&gt;, um &lt;Nutzen&gt;."* mit grober Grösse **S / M / L** (S ≈ ≤1 Tag, M ≈ 1–3 Tage, L ≈ 3–8 Tage Vibe-Coding-Aufwand).
- **Rollen:** *Operator* = Alex führt die Demo · *Hiring-Manager* = Publikum/Käufer der Demo · *Hotelier* = Demo-Subjekt (Mock-Hotel) · *KMU-Kunde* = zahlender Self-Service-Nutzer (H2) · *Entwickler* = Alex als Builder des Studios.
- **Linear-Mapping:** Jeder Epic listet **bestehende** ALE-Issues (was schon im Backlog ist) und markiert mit **🆕 NEU** die Stories, die noch **nicht** als Issue existieren — das ist v.a. der gesamte Stufe-2- und Stufe-3-Block.
- **Abgrenzungs-Pflicht (zwingend, aus Brief/PRD/Architektur):** Wo „Orchestrierung" auftaucht, ist immer das **Produkt-Feature Stufe 3** gemeint (die Systeme **des Kunden** verbinden). Das ist **niemals** die interne **Meta-Delivery-Plattform** (das Studio baut sich selbst — ALE-44/45/46/49/50). Diese Meta-Plattform ist **out of scope** dieses Plans und wird unten in einem eigenen Abschnitt explizit ausgeklammert, damit die Verwechslung im Linear-Backlog sichtbar aufgelöst ist.

---

## Epic-Landkarte (Überblick)

| Epic | Titel | Horizont | Stufe | Kern-Linear | Status |
|---|---|---|---|---|---|
| **EPIC-1** | Verstehen — Daten-Erfassung & Onboarding | [H1] | 1 | ALE-7…10, 12, 16 | grösstenteils im Backlog |
| **EPIC-2** | Verstehen — Voice-Intake mit Ada | [H1] | 1 | ALE-20…27 | im Backlog (P3, 3%) |
| **EPIC-3** | Verstehen — Multi-Agent-Analyse & Report | [H1] | 1 | ALE-28…34, 37 | im Backlog (P4, 17%) |
| **EPIC-4** | Designen — `SystemLandscape`-Schema & Integritäts-Pass | [H1] | 2 | — | **komplett NEU** |
| **EPIC-5** | Designen — `system_architect`-Agent (Ist→Ziel-Verdichter) | [H1] | 2 | (Basis ALE-29/31) | **komplett NEU** |
| **EPIC-6** | Designen — Ist→Ziel-Systemkarte & Report-Sektion | [H1] | 2 | (Reuse System-Map) | **komplett NEU** |
| **EPIC-7** | Bauen — Stufe-3-Teaser (1 n8n-Flow live) | [H1] | 3 | — | **komplett NEU** |
| **EPIC-8** | Querschnitt — Demo-Härtung, Pitch & Leitplanken | [H1] | Q | ALE-37…40, 38, 39 | teils im Backlog (P5) |
| **EPIC-9** | Designen voll — Versionierung & Re-Design-Loop | [H2] | 2 | — | **NEU (H2)** |
| **EPIC-10** | Bauen voll — Compiler, Konnektoren, Vault, Monitoring | [H2] | 3 | — | **NEU (H2)** |
| **EPIC-11** | Querschnitt — Multi-Tenant, Billing, Production-Hardening | [H2] | Q | ALE-35, 36, 41, 42 | teils Backlog (deferred) |
| **EPIC-12** | Branchenagnostik — zweites Branchen-Pack | [H2] | Q | — | **NEU (H2)** |

**Lesart:** EPIC-1…3 + EPIC-8 sind die bestehende, im Linear-Backlog gut abgedeckte **Stufe-1-Welt** (plus H1-Demo-Härtung). EPIC-4…7 sind der **strategische Kern dieses Plans** — die heute fehlende Stufe-2/3-Lücke für H1. EPIC-9…12 ist der H2-Ausbau zum SaaS.

---

# HORIZONT H1 — Portfolio-Demo bis 21.07.2026

---

## EPIC-1 — Verstehen: Daten-Erfassung & Onboarding [H1 · Stufe 1]

**Ziel:** Ein (Mock-)Unternehmen lässt sich vollständig anlegen, mit Dokumenten anreichern und in ein analysierbares `Briefing` überführen — die Eingangsstufe der gesamten Pipeline. Grösstenteils gebaut; offen sind Verdrahtung der Confirmation-Page und Web-Research.

**Bestehende Linear-Issues:** ALE-7 (Supabase-Schema + RLS + Storage · *Done*), ALE-8 (FastAPI Router-Grundgerüst · *Done*), ALE-9 (Document-Pipeline PDF/Excel/CSV/DOCX · *Done*), ALE-10 (Onboarding-Wizard 4 Schritte · *Done*), ALE-12 (Presentation-Confirmation-Page verdrahten · *In Progress*), ALE-16 (Production-Deployment-Checkliste · *In Review*), ALE-13 (Backend-Deployment Railway/VPS · *Done*), ALE-19 (Web-Research-Agent integrieren · *Todo*).

**User-Stories:**
1. Als **Hotelier** möchte ich mein Unternehmen mit Stammdaten, KPIs und Pain Points anlegen (`CompanyContext`, `HospitalityKPIs`, `PainPoint`), um die Analyse auf meinen Betrieb zuzuschneiden. **(M)** — *ALE-10 (Done)*
2. Als **Hotelier** möchte ich Dokumente (PDF/Excel/CSV/DOCX) hochladen und automatisch parsen + KPI-extrahieren lassen, um nicht alles manuell eintippen zu müssen. **(M)** — *ALE-9 (Done)*
3. Als **Operator** möchte ich, dass ein Web-Research-Agent firmen- und regionsbezogenen Kontext zieht (`WebResearchOutput`), um die Analyse mit externen Benchmarks anzureichern. **(M)** — *ALE-19 (Todo)*
4. Als **Hotelier** möchte ich vor dem Interview eine Bestätigungs-/Präsentationsseite mit dem erfassten Stand sehen (Confirmation-Page), um sicher zu sein, dass das System mich richtig verstanden hat. **(M)** — *ALE-12 (In Progress)*
5. Als **Entwickler** möchte ich owner-scoped Datenzugriff über RLS auf allen Tabellen (`auth.uid()`), um Datenisolation von Anfang an zu garantieren (FR-33, NFR-1). **(S)** — *ALE-7 (Done)*
6. Als **Operator** möchte ich aus Company + Web-Research + Voice-Transcript ein konsolidiertes `Briefing` bauen lassen (`briefing_builder`), um einen einzigen sauberen Pipeline-Input zu haben. **(M)** — *Teil ALE-8/12* 🆕 *(als eigene Story noch nicht ausgewiesen)*

---

## EPIC-2 — Verstehen: Voice-Intake mit Ada [H1 · Stufe 1]

**Ziel:** Ada führt ein kontextbewusstes, hypothesen-getriebenes Voice-Interview, dessen Transkript strukturiert ins Briefing fliesst — der differenzierende Anti-Black-Box-USP. Linear-seitig der grösste offene Brocken in H1 (Milestone P3 erst 3%).

**Bestehende Linear-Issues:** ALE-20 (Master-Fragen-Pool YAML + 30 MVP-Fragen · *In Review*), ALE-21 (ElevenLabs-Agent Ada Production-Config + Function-Calling · *Backlog*), ALE-22 (Pre-Brief-Pipeline · *Backlog*), ALE-23 (Hypothesengetriebene Fragen-Auswahl-Logik · *Backlog*), ALE-24 (Voice-Transkript → strukturierte Antwort-Objekte · *Backlog*), ALE-25 (Voice-Interview-UI end-to-end · *Backlog*), ALE-26 (ElevenLabs-Webhook für Transkript-Handling · *Backlog*), ALE-27 (Voice-Interview mit echten Hotel-Partnern testen · *Backlog*).

**User-Stories:**
1. Als **Operator** möchte ich einen Master-Fragepool pflegen, aus dem dynamisch 10–15 Fragen pro Run selektiert werden, um jedes Interview relevant statt generisch zu machen (FR-5). **(M)** — *ALE-20 (In Review)*
2. Als **Hotelier** möchte ich mit Ada (ElevenLabs) sprechen statt ein Formular auszufüllen, um mich verstanden statt abgefragt zu fühlen (USP). **(L)** — *ALE-21 (Backlog)*
3. Als **Operator** möchte ich vor dem Call ein Pre-Brief mit Hypothesen, Benchmark-Abgleich und Push-Back-Fragen erzeugen (`PreAuditOutput`, FR-4), um Ada gezielt statt linear fragen zu lassen. **(M)** — *ALE-22 (Backlog)*
4. Als **Hotelier** möchte ich, dass Ada auf meine Antworten reagiert (hypothesen-getrieben, nicht-linear), um ein echtes Gespräch statt einer Abfrage zu erleben. **(M)** — *ALE-23 (Backlog)*
5. Als **Operator** möchte ich das Transkript automatisch in strukturierte Antwort-Objekte überführen, um es als `voice_interview_transcript` ins Briefing zu binden (FR-5). **(M)** — *ALE-24 (Backlog)*
6. Als **Operator** möchte ich das Transkript per ElevenLabs-Webhook empfangen statt manuell zu submitten, um den Flow robust zu machen. **(M)** — *ALE-26 (Backlog)*
7. Als **Hiring-Manager** möchte ich das Voice-Interview in der Demo end-to-end laufen sehen (UI verdrahtet), um zu glauben, dass es real funktioniert. **(L)** — *ALE-25 (Backlog)*

---

## EPIC-3 — Verstehen: Multi-Agent-Analyse & Report [H1 · Stufe 1]

**Ziel:** Sieben Analyse-Agenten erzeugen aus dem Briefing einen vollständigen `FullReport` (Audit → Use-Cases → Tools → ROI → Compliance → Roadmap), aus dem PPTX/Excel-Deliverables entstehen. Der reife Kern; Milestone P4 bei 17%. **Wichtig:** die Felder von `ToolRecommendation` (`required_integrations`, `data_flow`, `integration_with_existing`) sind der **Eingangs-Datensatz für Stufe 2** — diese Story-Gruppe speist EPIC-5.

**Bestehende Linear-Issues:** ALE-28 (Process-Auditor verfeinern · *In Review*), ALE-29 (Use-Case-Generator + Tool-Recommender verfeinern · *In Review*), ALE-30 (Compliance-Checker DSGVO+AI-Act · *In Review*), ALE-31 (Roadmap-Generator · *In Review*), ALE-32 (PPTX-Generierung · *In Review*), ALE-33 (Excel-Generierung · *In Review*), ALE-34 (E2E Run→Outputs→Download Signed-URL · *Backlog*), ALE-37 (E2E-Smoke-Test-Suite · *In Review*).

**User-Stories:**
1. Als **Hotelier** möchte ich pro Prozess Ist-Situation, Stakeholder, Touchpoints (inkl. `integration_status`), Tools und Automatisierungs-Potenzial bekommen (`ProcessAuditOutput`, FR-6), um zu sehen, wo ich heute stehe. **(L)** — *ALE-28 (In Review)*
2. Als **Hotelier** möchte ich konkrete Use-Cases mit AI-Pattern, Impact, Quick-Win-Flag und VUFVE-Reality-Check (FR-7), um realistische statt überzogene Vorschläge zu erhalten. **(M)** — *ALE-29 (In Review)*
3. Als **Hotelier** möchte ich pro Use-Case eine Tool-Empfehlung **inkl. `required_integrations`, `data_flow`, `integration_with_existing`** (FR-8), um nicht nur ein Tool, sondern auch seine Anschlussfähigkeit zu kennen *(= Stufe-2-Input)*. **(M)** — *ALE-29 (In Review)*
4. Als **Hotelier** möchte ich einen 3-Jahres-ROI-Business-Case mit Payback und Sensitivität (`ROIOutput`, FR-9), um die Investition rechtfertigen zu können. **(M)** — *ALE-33 (In Review)*
5. Als **Hotelier** möchte ich DSGVO-/AI-Act-Flags pro Use-Case mit Mitigationen und Disclaimer (`ComplianceOutput`, FR-10, NFR-3), um rechtliche Risiken früh zu sehen. **(M)** — *ALE-30 (In Review)*
6. Als **Hotelier** möchte ich eine 3-Phasen-Roadmap mit Aufwand (PT), Critical-Path und Kill-Kriterien (`RoadmapOutput`, FR-11), um einen umsetzbaren Fahrplan zu haben. **(M)** — *ALE-31 (In Review)*
7. Als **Operator** möchte ich alle Agent-Outputs zu einem `FullReport` aggregiert + als PPTX/Excel-Download (FR-12/13), um ein vorzeigbares Ergebnis zu liefern. **(M)** — *ALE-32/33/34 (In Review/Backlog)*
8. Als **Entwickler** möchte ich die Pipeline ohne Voice/Frontend lokal gegen `mock_data/demo_hotel.json` smoke-testen (FR-15), um die Engine offline und CI-fähig zu halten. **(S)** — *ALE-37 (In Review)*

---

## EPIC-4 — Designen: `SystemLandscape`-Schema & Integritäts-Pass [H1 · Stufe 2] 🆕

**Ziel:** Das fehlende maschinenlesbare Architektur-Artefakt schaffen — ein Pydantic-Schema `SystemLandscape` (nodes/edges/automations/layers) plus einen **deterministischen** Integritäts-Validierungspass, der halluzinierte Verbindungen verhindert. **Das ist die erste und fundamentalste Lücke** (Risiko R1: ohne Schema halluziniert der Generator). Entspricht Brief-Epic E1.

**Bestehende Linear-Issues:** **keine** — komplett neu. Dies ist der Kern dessen, was im Backlog fehlt.

**User-Stories:**
1. 🆕 Als **Entwickler** möchte ich ein neues Schema-Modul `schemas/system_design.py` mit `SystemLandscapeNode` (id, name, category, tier, vendor, `eu_hosting`, cost, `status` ∈ keep/add/replace/retire, `layer`, `source_ref`), um die Ziel-Architektur typisiert abzubilden (FR-17). **(M)**
2. 🆕 Als **Entwickler** möchte ich `SystemLandscapeEdge` (from→to, `mechanism` ∈ native-API/webhook/iPaaS-n8n/file-export/manual, `data_objects[]`, `direction`, `frequency`, `dsgvo_personal_data`, `integrity_status`), um Datenflüsse belegbar statt vage zu modellieren (FR-17). **(M)**
3. 🆕 Als **Entwickler** möchte ich `AutomationBlueprint` (trigger, steps, outcome, `mapped_use_case`, **`owner` (Pflicht)**, `buildable_now`), um Stufe 2 sauber an Stufe 3 anzubinden (FR-17/24). **(S)**
4. 🆕 Als **Hiring-Manager** möchte ich, dass ein deterministischer Integritäts-Pass (kein LLM) jede Kante ohne realen `mechanism`, jeden Datenfluss ohne Quelle und jede Automation ohne Owner als **explizites Finding** ausweist (FR-21, NFR-8), um sicher zu sein, dass nichts „magisch verbunden" behauptet wird. **(M)**
5. 🆕 Als **Hotelier** möchte ich, dass jede Kante mit personenbezogenem Datenfluss (`dsgvo_personal_data=true`) auf einen Knoten mit bekanntem `eu_hosting` zeigen muss (NFR-2), um DSGVO-Konformität im Design sichtbar zu machen. **(S)**
6. 🆕 Als **Operator** möchte ich einen kuratierten `knowledge/integration_catalog.yaml` (native-API? / webhook? / n8n-Node? / file-export) als **Wahrheitsquelle für jede `mechanism`**, um Kanten an reale Schnittstellen statt an Wunschdenken zu binden (Architektur §„Tool-Katalog-Konzept"). **(M)**
7. 🆕 Als **Operator** möchte ich `SystemLandscape.validation_findings` und `narrative` (Trevor-Noah-Voice) im Schema, um offene Lücken ehrlich zu zeigen und die Ist→Ziel-Geschichte erzählbar zu machen. **(S)**

---

## EPIC-5 — Designen: `system_architect`-Agent (Ist→Ziel-Verdichter) [H1 · Stufe 2] 🆕

**Ziel:** Ein neuer Analyse-Agent, der die bereits erzeugten Stufe-1-Outputs zu einem kohärenten, validierten `SystemLandscape` **verdichtet** — der Sprung von „Tool-Liste" zu „verbundener Ziel-Systemlandschaft". Additiv via `agent_patterns` (SDK-Pfad), **ohne** Core-Eingriff (Annahme A1 vorab verifizieren). Entspricht Brief-Epic E2.

**Bestehende Linear-Issues:** **keine** eigenständig; baut datenmässig auf ALE-28 (Ist-Daten) und ALE-29/31 (Ziel-Daten) auf, ist aber ein **neuer** Agent.

**User-Stories:**
1. 🆕 Als **Entwickler** möchte ich vorab verifizieren, dass sich ein neuer Agent additiv via `agent_patterns` in 3 Schritten registrieren lässt (`docs/sdk-architecture.md` §5, Annahme A1), um den Stufe-1-Live-Pfad nicht zu gefährden. **(S)**
2. 🆕 Als **Operator** möchte ich aus dem Audit einen **Ist-Graphen** ableiten (aus `ProcessTouchpoint.system` + `integration_status` + `CurrentToolInUse`), um die heutige isolierte Landschaft zu rekonstruieren (FR-18). **(M)**
3. 🆕 Als **Operator** möchte ich aus den Tool-Empfehlungen einen **Ziel-Graphen** ableiten (aus `required_integrations` + `data_flow` + `integration_with_existing`), um die gewünschte verbundene Landschaft zu erzeugen (FR-19). **(M)**
4. 🆕 Als **Hotelier** möchte ich, dass der `system_architect` Ist- und Ziel-Graph zu **einem** kohärenten `SystemLandscape` verdichtet und Integrations-Konflikte auflöst (z.B. zwei empfohlene PMS → einer `keep`, einer `retire`), um eine widerspruchsfreie Ziel-Architektur zu erhalten (FR-20). **(L)**
5. 🆕 Als **Hotelier** möchte ich, dass fehlende Konnektoren explizit als Lücke markiert werden („Tool A braucht Datenobjekt X, keine Quelle liefert X"), um zu wissen, wo das Design noch hakt (FR-20). **(M)**
6. 🆕 Als **Entwickler** möchte ich den Agenten so registrieren, dass er den fertigen `FullReport` aus dem Context konsumiert und sein Output 1:1 Reporter-kompatibel ist (NFR-10), um nahtlos in die bestehende Pipeline einzuhängen. **(M)**
7. 🆕 Als **Operator** möchte ich nach dem Agent-Lauf den deterministischen Integritäts-Pass (EPIC-4) automatisch über das `SystemLandscape` laufen lassen, um die Senior-Qualitäts-Garantie vor jeder Visualisierung durchzusetzen. **(S)**

---

## EPIC-6 — Designen: Ist→Ziel-Systemkarte & Report-Sektion [H1 · Stufe 2] 🆕

**Ziel:** Das **verkaufsstärkste Demo-Artefakt** sichtbar machen — ein interaktiver Graph, der links die heutigen isolierten Inseln und rechts die verbundene Ziel-Landschaft mit n8n als Hub zeigt, plus eine Report-/Web-Sektion „Eure Ziel-Systemlandschaft". Reuse der bestehenden Three.js-Galaxie (`System-Map/`). Entspricht Brief-Epics E3 + E4.

**Bestehende Linear-Issues:** **keine** als Produkt-Feature; technische Vorarbeit liegt im `System-Map/`-Repo (Memory `[[project_system_map_3d]]`), das hier **wiederverwendet**, nicht neu gebaut wird.

**User-Stories:**
1. 🆕 Als **Hiring-Manager** möchte ich den `SystemLandscape`-Graphen interaktiv rendern sehen — **Ist links / Ziel rechts** (2D/3D, Reuse `System-Map/` Three.js) —, um „aus Bedürfnissen wird Struktur" in unter 10 Sekunden zu erfassen (FR-22, AC-3). **(L)**
2. 🆕 Als **Hotelier** möchte ich, dass `isolated`/`manual-sync`-Knoten in der Ist-Ansicht visuell hervorgehoben (rot) sind, um meine heutigen Bruchstellen sofort zu erkennen. **(S)**
3. 🆕 Als **Hotelier** möchte ich in der Ziel-Ansicht n8n als zentralen Orchestrierungs-Hub sehen, um zu verstehen, wie meine Systeme künftig zusammenspielen. **(S)**
4. 🆕 Als **Operator** möchte ich die Karte aus dem `SystemLandscape`-JSON speisen (datengetrieben, nicht hartcodiert), um sie für jeden Run automatisch zu erzeugen. **(M)**
5. 🆕 Als **Hotelier** möchte ich eine neue Report-/Web-Sektion „Eure Ziel-Systemlandschaft" im `FullReport` (`FullReport.system_landscape`, PPTX-Slide + Web-Sektion), um das Design auch ausserhalb der Live-Demo greifbar zu haben (FR-23). **(M)**
6. 🆕 Als **Operator** möchte ich das `SystemLandscape` in H1 als JSONB-Zeile in `run_results` (`agent_name="system_architect"`) persistieren (JSONB-First, OQ-3), um ohne riskante Migration vor dem Pitch auszukommen. **(S)**
7. 🆕 Als **Operator** möchte ich entscheiden, ob die Karte als eigenständige `System-Map/`-Page oder in `web/app/system-map/` integriert läuft (AO-1/OQ-6), um Reuse gegen Integrations-Aufwand abzuwägen *(Empfehlung: eigenständige Page für H1)*. **(S)**

---

## EPIC-7 — Bauen: Stufe-3-Teaser — 1 n8n-Flow live [H1 · Stufe 3] 🆕

**Ziel:** Den „BAUEN"-Beweis liefern — **genau eine** `AutomationBlueprint` (mit `buildable_now=true`, z.B. „Reservierungs-Mail → PMS-Eintrag") wird real als valides n8n-Workflow-JSON generiert, validiert und gegen Mock/Sandbox deployt. Ehrlich gerahmt, kein Slide. Entspricht Brief-Epic E5. **Produkt-Feature Stufe 3 — NICHT die Meta-Delivery-Plattform.**

**Bestehende Linear-Issues:** **keine** für das Produkt-Feature. ⚠️ ALE-44/45 nutzen zwar n8n, gehören aber zur **internen Meta-Delivery-Plattform** (out of scope, siehe unten) — nicht hierher verwechseln.

**User-Stories:**
1. 🆕 Als **Entwickler** möchte ich vor dem Teaser end-to-end smoke-testen, dass n8n-MCP (`n8n_validate_workflow`, `n8n_create_workflow`, `n8n_deploy_template`) gegen die VPS-n8n-Instanz aus der Demo-Umgebung trägt (Annahme A2), um keinen toten Flow zu zeigen. **(S)**
2. 🆕 Als **Operator** möchte ich entscheiden, ob der Teaser gegen ein **Mock-PMS** (volle Kontrolle) oder einen **echten Sandbox-Account** (höhere Glaubwürdigkeit) läuft (AO-2/OQ-2/A3), um Risiko und Wirkung abzuwägen. **(S)**
3. 🆕 Als **Entwickler** möchte ich ein Backend-Modul `builders/n8n_compiler.py`, das aus **einer** `AutomationBlueprint` parametrisiert valides n8n-Workflow-JSON erzeugt (H1: deterministischer Generator für genau das Teaser-Pattern), um „bauen" konkret zu machen (FR-27). **(L)**
4. 🆕 Als **Operator** möchte ich, dass nur Automationen mit `buildable_now=true` **und** bestandenem Integritäts-Pass kompiliert werden dürfen (Guardrail), um keine unbelegte Verbindung zu deployen. **(S)**
5. 🆕 Als **Operator** möchte ich, dass `n8n_validate_workflow` als **harter Gate** vor jedem Deploy läuft (kein Fehler = Freigabe), um nur valide Flows live zu schalten (FR-27). **(S)**
6. 🆕 Als **Hiring-Manager** möchte ich im Pitch sehen, wie der Flow live generiert, validiert und gegen Sandbox deployt wird (lauffähig, kein Mockup-Screenshot), um zu glauben, dass „bauen" kein Buzzword ist (AC-4). **(M)**
7. 🆕 Als **Hiring-Manager** möchte ich, dass der Teaser ehrlich als „gegen echte API live schaltbar" gerahmt ist — nie als produktiv fertig (FR-28, NFR-8), um Substanz statt Hochglanz zu erleben. **(S)**
8. 🆕 Als **Entwickler** möchte ich den Pre-Deploy-grep (NFR-9) auch über das **generierte n8n-JSON** laufen lassen (kein BIZ26/KI-Boutique/Münster, echte Umlaute), um die Leitplanken auch im erzeugten Artefakt zu halten. **(S)**

---

## EPIC-8 — Querschnitt: Demo-Härtung, Pitch & Leitplanken [H1 · Querschnitt]

**Ziel:** Die komplette 3-Stufen-Story in **einer** Sitzung lauffähig, ehrlich und leitplanken-konform vorführbar machen — die Definition of Done für H1. Milestone P5.

**Bestehende Linear-Issues:** ALE-37 (E2E-Smoke-Test-Suite · *In Review*), ALE-38 (Demo-Walkthrough-Skript 5-Min-Tour · *Backlog*), ALE-39 (Finaler Pitch-Deck B05-23 · *Backlog*), ALE-40 (Security-Audit JWT/RLS/Secrets · *Backlog*), ALE-34 (E2E Run→Outputs→Download · *Backlog*), ALE-17 (Soft-Launch Smoke-Test · *Todo*), ALE-14 (Email-Service Resend Magic-Link · *Todo*), ALE-15 (Landing-Page Style-Konsistenz · *Todo*), ALE-18 (Landing-Page Redesign · *Done*).

**User-Stories:**
1. Als **Operator** möchte ich ein Demo-Walkthrough-Skript (5-Min-Tour), das verstehen→designen→bauen in einer Sitzung erzählt (DoD-1), um den Pitch flüssig zu halten. **(M)** — *ALE-38 (Backlog)*
2. Als **Operator** möchte ich ein finales Pitch-Deck B05-23, das die 3-Stufen-Story ohne erfundene Zahlen trägt, um am 21.07. zu überzeugen. **(M)** — *ALE-39 (Backlog)*
3. Als **Hiring-Manager** möchte ich, dass der Ist→Ziel-Graph live für das Mock-Hotel rendert (DoD-2), um die Designen-Stufe selbst zu sehen. **(S)** — *speist EPIC-6*
4. Als **Hiring-Manager** möchte ich, dass mindestens eine Automation im Pitch real deployt wird (DoD-3), um den Bauen-Beweis zu erleben. **(S)** — *speist EPIC-7*
5. Als **Entwickler** möchte ich ein Security-Audit (JWT, RLS, Secrets aus `.env`, NFR-7), um keine offensichtliche Lücke im Demo-System zu haben. **(M)** — *ALE-40 (Backlog)*
6. Als **Entwickler** möchte ich einen Pre-Deploy-grep auf „BIZ26"/„KI-Boutique"/„Münster"/falsche Umlaute über das **gesamte** Repo inkl. generierter Artefakte (NFR-9, AC-6), um die Leitplanken hart durchzusetzen. **(S)** — 🆕 *(als Gate noch nicht als Issue)*
7. Als **Hiring-Manager** möchte ich, dass der Integritäts-Guardrail (FR-21) vor dem Pitch grün ist und keine Kante ohne realen Mechanismus existiert (DoD-4, NFR-8), um Substanz statt Behauptung zu sehen. **(S)** — *speist EPIC-4*
8. Als **Operator** möchte ich die volle Pipeline (Stufe 1→2→3) als E2E-Smoke-Test gegen das Mock-Hotel laufen lassen, um vor dem Pitch Regressionen auszuschliessen. **(M)** — *ALE-37 (In Review), erweitert um Stufe 2/3* 🆕

---

# HORIZONT H2 — BIZ26-SaaS danach

---

## EPIC-9 — Designen voll: Versionierung & Re-Design-Loop [H2 · Stufe 2] 🆕

**Ziel:** Aus dem H1-Prototyp ein produktives Stufe-2-Feature machen — versionierte, immutable Landschaften pro Run in dedizierten Tabellen plus ein Re-Design-Loop, wenn sich Bedürfnisse ändern. Entspricht Brief-Epic-Gruppe P7 (Teil).

**Bestehende Linear-Issues:** **keine** — komplett neu (H2).

**User-Stories:**
1. 🆕 Als **KMU-Kunde** möchte ich, dass meine Ziel-Landschaft pro Run versioniert und immutable in dedizierten Tabellen (`system_landscapes`, `landscape_nodes`, `landscape_edges`, `automation_blueprints`) persistiert wird (FR-25), um meine Design-Historie nachvollziehen zu können. **(L)**
2. 🆕 Als **Entwickler** möchte ich die neue Migration `2026xxxx_005_system_design.sql` mit owner-scoped RLS (Muster aus `runs`/`run_results`), um die Tabellen sicher und konsistent anzulegen. **(M)**
3. 🆕 Als **KMU-Kunde** möchte ich bei geänderten Bedürfnissen eine neue Landschafts-Version erzeugen, die gegen die Vorversion vergleichbar ist (Re-Design-Loop, FR-26), um die Evolution meiner Systemlandschaft zu steuern. **(L)**
4. 🆕 Als **KMU-Kunde** möchte ich ein Versions-Diff (was kam dazu / fiel weg / änderte den Status), um Entscheidungen zwischen zwei Designs treffen zu können. **(M)**
5. 🆕 Als **Operator** möchte ich die H1-JSONB-Persistenz transparent auf die dedizierten Tabellen migrieren, um Bestands-Demos nicht zu brechen. **(M)**

---

## EPIC-10 — Bauen voll: Compiler, Konnektoren, Vault, Monitoring [H2 · Stufe 3] 🆕

**Ziel:** Aus dem 1-Flow-Teaser eine echte Orchestrierungs-Plattform machen — Voll-Compiler für ganze Landschaften, ≥20 echte API-Konnektoren mit verschlüsseltem Credential-Vault und Monitoring deployter Orchestrierungen. **Produkt-Feature Stufe 3 (Kunden-Systeme), nicht Meta-Delivery.** Entspricht Brief-Epic-Gruppe P7 (Kern).

**Bestehende Linear-Issues:** **keine** als Produkt-Feature.

**User-Stories:**
1. 🆕 Als **KMU-Kunde** möchte ich, dass ein Blueprint→n8n-Compiler aus `automations[]` einer **ganzen** Landschaft generisch n8n-Workflows erzeugt (FR-29), um nicht nur einen, sondern alle geplanten Flows real zu bauen. **(L)**
2. 🆕 Als **KMU-Kunde** möchte ich ≥20 echte API-Konnektoren (Mapping `data_object ↔ API-Endpoint`, FR-30), um meine realen Systeme (PMS/HubSpot/DATEV/GA4) tatsächlich anzubinden. **(L)**
3. 🆕 Als **Entwickler** möchte ich einen verschlüsselten, Tenant-scoped Credential-Vault (`connector_credentials`, FR-30, NFR-7), um Kunden-Secrets sicher und isoliert zu verwalten. **(L)**
4. 🆕 Als **KMU-Kunde** möchte ich eine **ganze** designte Landschaft als Bündel deployen (nicht nur Einzel-Flow, FR-32), um die komplette Adoption in einem Schritt produktiv zu schalten. **(L)**
5. 🆕 Als **KMU-Kunde** möchte ich deployte Orchestrierungen mit Status nachhalten + Monitoring laufender Flows (`orchestration_runs`, FR-31), um den Betrieb meiner Automationen zu überwachen. **(M)**
6. 🆕 Als **KMU-Kunde** möchte ich echte Live-API-Connects gegen Produktiv-Systeme (statt Sandbox), um die Adoption real und nicht nur demonstrativ zu betreiben. **(L)**
7. 🆕 Als **KMU-Kunde** möchte ich den ROI meiner laufenden Orchestrierungen gegen die ursprüngliche ROI-Prognose nachhalten (Journey J2-5), um den Wert messbar zu belegen. **(M)**

---

## EPIC-11 — Querschnitt: Multi-Tenant, Billing, Production-Hardening [H2 · Querschnitt]

**Ziel:** Das System vom Single-Run-Demo-Stand auf echtes Multi-Tenant-SaaS mit Billing und Production-Concurrency heben. Teils als „deferred" bereits im Backlog markiert.

**Bestehende Linear-Issues:** ALE-36 (BackgroundTasks → Celery+Redis · *Backlog, deferred*), ALE-35 (Last-Test 5 parallele Runs · *Backlog*), ALE-41 (Performance-Tuning · *Backlog*), ALE-42 (Production-Deployment + Monitoring · *Backlog*).

**User-Stories:**
1. 🆕 Als **KMU-Kunde** möchte ich echte Tenant-Namespace-Isolation über `owner_id`/RLS hinaus (Tenant-Slug-Spalte, FR-35, AC-7), um sicher zu sein, dass kein anderer Tenant je meine Daten sieht. **(L)**
2. 🆕 Als **KMU-Kunde** möchte ich Billing/Pricing/Metering pro Tenant (FR-36), um das Studio als bezahlten Service nutzen zu können. **(L)**
3. Als **Entwickler** möchte ich den Run-Executor von FastAPI-BackgroundTasks auf Celery/Redis umstellen (Retry/Backoff, Timeouts, Concurrency, NFR-5), um mehrere Tenants parallel zu bedienen. **(L)** — *ALE-36 (Backlog)*
4. Als **Entwickler** möchte ich einen Last-Test mit ≥5 parallelen Runs (Rate-Limit + Queue), um die Concurrency-Annahmen zu verifizieren. **(M)** — *ALE-35 (Backlog)*
5. 🆕 Als **Entwickler** möchte ich Multi-Tenant-Isolation und Credential-Zugriffe auditierbar protokollieren (NFR-12, AC-7), um Compliance-Nachweise führen zu können. **(M)**
6. Als **Entwickler** möchte ich Production-Deployment + Monitoring + Performance-Tuning, um den SaaS-Betrieb stabil zu halten. **(M)** — *ALE-41/42 (Backlog)*

---

## EPIC-12 — Branchenagnostik: zweites Branchen-Pack [H2 · Querschnitt] 🆕

**Ziel:** Den Beweis erbringen, dass Hospitality nur Fall 1 ist — eine zweite Branche als eigenes Pack (Vendor-Pack + Fragepool) lauffähig machen, **ohne** den Generator anzufassen. Die Graph-Abstraktion (nodes/edges/automations) bleibt domänenfrei. Entspricht Brief-Epic E9.

**Bestehende Linear-Issues:** **keine** — komplett neu (H2).

**User-Stories:**
1. 🆕 Als **Operator** möchte ich entscheiden, welche zweite Branche zuerst kommt (Retail oder Healthcare, OQ-5/AO-6), um den Agnostik-Nachweis gezielt zu planen. **(S)**
2. 🆕 Als **Entwickler** möchte ich eine zweite Branche als neues `agent_patterns/patterns/<domain>/`-Pack (eigene REGISTRY + config.yaml, Core bleibt, FR-34), um Branchenwechsel als Konfiguration statt Neubau zu beweisen. **(L)**
3. 🆕 Als **Entwickler** möchte ich ein branchenspezifisches Vendor-Pack + Fragepool für die zweite Branche, um die domänenspezifischen Wissens-Inhalte zu liefern (FR-37). **(L)**
4. 🆕 Als **Hiring-Manager/KMU-Kunde** möchte ich, dass die zweite Branche end-to-end durch alle 3 Stufen läuft (verstehen→designen→bauen), um zu sehen, dass die Architektur wirklich branchenagnostisch ist. **(M)**
5. 🆕 Als **Entwickler** möchte ich verifizieren, dass das `SystemLandscape`-Schema und der `system_architect`-Agent für die neue Branche **unverändert** funktionieren, um die Agnostik-These technisch zu belegen. **(M)**

---

## Ausgeklammert: Meta-Delivery-Plattform (NICHT Teil dieses Plans)

> **Zwingende Abgrenzung (Brief Out-of-Scope, PRD, Architektur):** Die folgenden bestehenden Linear-Issues betreffen die **interne Meta-Delivery-Plattform** — das Werkzeug, mit dem das **Studio sich selbst** autonom baut/deployt (Email-One-Click, VPS-Webhook, Studio-Dashboard). Sie nutzen ebenfalls n8n, sind aber **ein anderes Produkt** als das Stufe-3-Produkt-Feature (Kunden-Systeme verbinden) und gehören **nicht** in die Epics oben.

| Linear | Titel | Warum ausgeklammert |
|---|---|---|
| ALE-43 | Agent Smoke-Test (Delivery-Loop) | interne Delivery-Loop, kein Endkunden-Feature |
| ALE-44 | Stufe 2: Autonomer Webhook auf VPS (Email-One-Click, off-Mac) | Studio baut sich selbst — Meta-Tool |
| ALE-45 | n8n VPS-Bridge absichern (Token-Auth) | Infrastruktur des Meta-Tools |
| ALE-46 | Monitoring-Agent: Git/GitHub/Linear live synchronisieren | internes Projekt-Monitoring |
| ALE-47 | Homepage-Struktur konzipieren | Marketing/Portfolio-Seite, kein Produkt-Feature |
| ALE-48 | HTML-Preview als Standard-Option | internes Arbeits-Tooling |
| ALE-49 | Interaktives Studio-Dashboard (Next.js) | Meta-Delivery-Oberfläche |
| ALE-50 | Web-App: Autonome Software-Delivery-Plattform (Konzept) | das Meta-Tool selbst |

**Hinweis zur Namensgleichheit:** Dass ALE-44 „Stufe 2" heisst, meint die **Reife-Stufe des Meta-Tools**, NICHT die **Produkt-Stufe 2 (Designen)** dieses Plans. Diese Doppelbedeutung ist die Hauptquelle der Verwechslung (Risiko R4) — daher hier explizit aufgelöst.

**Einordnung ALE-1…ALE-4** (Linear-Onboarding-Defaults „Get familiar with Linear" etc.): kein Produkt-Scope, ignorierbar.

---

## Mapping-Bilanz: Was ist schon da, was kommt NEU dazu

| Stufe / Bereich | Im Backlog (bestehende ALE-Issues) | NEU (in keinem Issue) |
|---|---|---|
| **Stufe 1 — Verstehen** | ALE-7…10, 12, 13, 16, 19, 20…34, 37 (Onboarding, Voice, Multi-Agent, Report) — **gut abgedeckt** | `briefing_builder` als eigene Story |
| **Stufe 2 — Designen** | **nichts** | **EPIC-4, EPIC-5, EPIC-6 komplett** (Schema, Integritäts-Pass, `system_architect`-Agent, `integration_catalog.yaml`, Ist→Ziel-Karte, Report-Sektion) + H2: EPIC-9 |
| **Stufe 3 — Bauen** | **nichts** (ALE-44/45 = Meta-Tool, nicht hier) | **EPIC-7 komplett** (n8n-Compiler, Teaser-Flow) + H2: EPIC-10 |
| **Querschnitt H1** | ALE-14, 15, 17, 18, 38, 39, 40 | Pre-Deploy-grep-Gate, Stufe-2/3-E2E-Erweiterung |
| **Querschnitt H2** | ALE-35, 36, 41, 42 | Multi-Tenant-Namespace, Billing, Audit-Log, EPIC-12 (2. Branche) |

**Kernbefund:** Der gesamte **Designen- und Bauen-Layer (Stufe 2 + 3)** ist im aktuellen Linear-Backlog **nicht modelliert** — die Issues enden bei der Assessment-Engine (Stufe 1) plus der separaten Meta-Delivery-Plattform. EPIC-4 bis EPIC-7 (H1) und EPIC-9/10/12 (H2) schliessen genau diese Lücke.

---

## Vorschlag Linear-Struktur (Initiative → Projekte → Milestones)

Damit die 3-Stufen-/2-Horizonte-Logik im Tool sichtbar wird, wird die heutige flache Struktur (1 Projekt „AI Adoption Studio", Milestones P1–P5) um eine **Initiative** und zwei neue **Milestones** ergänzt — additiv, ohne Bestehendes umzubauen.

### Ebene 1 — Initiative

**`AI-Adoption-Studio · 3-Stufen-Vision`** (neue Linear-Initiative)
Klammer über beide Horizonte; trägt die Vision „Verstehen → Designen → Bauen" und die H1/H2-Trennung.

### Ebene 2 — Projekte (je Horizont)

| Projekt | Inhalt | Status |
|---|---|---|
| **`Studio H1 · Portfolio-Demo`** | bestehendes Projekt „AI Adoption Studio" umbenannt/erweitert; trägt P1–P5 **plus neuen Milestone P6** | bestehend, erweitert |
| **`Studio H2 · BIZ26-SaaS`** | neues Projekt für den Post-Bootcamp-Ausbau; trägt neuen Milestone **P7** | **neu** |

> Pragmatische Alternative (weniger Umbau): alles im bestehenden Projekt belassen und nur **P6** und **P7** als Milestones ergänzen — Horizont-Trennung dann rein über Milestone + Label.

### Ebene 3 — Milestones (Epic-Zuordnung)

| Milestone | Horizont | Target | Epics | Bestehende Issues |
|---|---|---|---|---|
| **P1 · Concept** | H1 | 19.05. (100%) | — | ALE-5, 6 |
| **P2 · Foundation** | H1 | 09.06. | EPIC-1 | ALE-7…10, 12, 13, 16 |
| **P3 · Voice-Core** | H1 | 30.06. | EPIC-2 | ALE-20…27 |
| **P4 · Multi-Agent** | H1 | 14.07. | EPIC-3 | ALE-28…34, 37 |
| **P5 · Polish & Pitch** | H1 | 20.07. | EPIC-8 | ALE-17, 38, 39, 40 |
| **🆕 P6 · System-Design-Demo** | H1 | **~21.06.–14.07.** (parallel zu P4/P5) | **EPIC-4, EPIC-5, EPIC-6, EPIC-7** | **alle NEU** |
| **🆕 P7 · Orchestrierungs-Plattform** | H2 | post-Bootcamp | **EPIC-9, EPIC-10, EPIC-11, EPIC-12** | ALE-35/36/41/42 + NEU |

### Ebene 4 — Labels (Querschnitt, zur Filterung)

- `stufe:1-verstehen` · `stufe:2-designen` · `stufe:3-bauen` · `querschnitt`
- `horizont:H1` · `horizont:H2`
- **`produkt-feature`** vs. **`meta-delivery`** — das **wichtigste** Label-Paar: löst die Orchestrierungs-Verwechslung (R4) dauerhaft auf. Alle EPIC-7/10-Issues = `produkt-feature`; alle ALE-43…50 = `meta-delivery`.

### Umsetzungs-Reihenfolge für P6 (H1, kritischer Pfad)

1. **EPIC-4** (Schema + Integritäts-Pass) — Fundament, blockiert alles Weitere (Risiko R1).
2. **EPIC-5** (`system_architect`-Agent) — braucht EPIC-4 + die Stufe-1-Outputs aus EPIC-3.
3. **EPIC-6** (Ist→Ziel-Karte + Report) — braucht ein erstes valides `SystemLandscape` aus EPIC-5.
4. **EPIC-7** (n8n-Teaser) — braucht eine `AutomationBlueprint` mit `buildable_now=true` aus EPIC-5; **A2 vorab smoke-testen**.

**Leitsatz (aus Architektur):** *Additiv, nicht invasiv.* P6 hängt sich an bestehende Schemas, den SDK-Agent-Pfad und externe VPS-n8n-Infra — der laufende Stufe-1-Kern (P2–P5) bleibt unberührt.

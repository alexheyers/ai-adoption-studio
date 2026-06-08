# Product Brief — AI-Adoption-Studio

> **Dokument-Typ:** BMAD Product Brief (Phase 0 — Vision & Scope)
> **Projekt:** AI-Adoption-Studio
> **Stand:** 09.06.2026
> **Autor-Kontext:** Alex Heyers · Vibe Coding Bootcamp (Digitale Leute School, Kohorte 05/26)
> **Horizonte:** H1 = Portfolio-Demo bis Final-Pitch 21.07.2026 · H2 = BIZ26-SaaS danach
> **Quellen:** `AI-ADOPTION-STUDIO.md` (Master-Spec, Architektur 2.1, Stand 13.05.), `schemas/outputs.py`, `agents/`, `knowledge/`, `docs/sdk-architecture.md`, 46 Linear-Issues (Team ALE, Milestones P1–P5), Recherche-Digests Lens 1–3 (09.06.)

---

## Executive Summary

Das AI-Adoption-Studio ist eine Multi-Agent-Plattform, die KI-Adoptions-Beratung im Mittelstand automatisiert — erster vertikaler Fall: Hospitality DACH, konzeptionell aber branchenagnostisch gedacht ("Hotel oder anderes Prinzip"). Es hat zwei Zwecke in klarer Priorität: **primär** ist es Alex Heyers' Bewerbungs-Portfolio, das ihn als Vibe Coder und Solutions Engineer beweist (Final-Pitch 21.07.2026); **sekundär** ist es die Keimzelle eines echten BIZ26-SaaS-Produkts danach.

Der entscheidende Schärfungs-Schritt vom 09.06.2026: Das Produkt ist **nicht** ein KI-Audit- oder Report-Tool. Das Audit ist nur **Stufe 1**. Das vollständige Produkt hat **drei Stufen** — **Verstehen → Designen → Bauen/Orchestrieren**. Heute deckt die Codebasis (FastAPI-Backend, 7 Multi-Agenten, Voice-Agent "Ada", Supabase, PPTX/Excel-Report) zusammen mit den 46 bestehenden Linear-Issues praktisch ausschließlich **Stufe 1 (Verstehen)** ab. Stufe 2 (System-Design-Generator) und Stufe 3 (Build-/Orchestrierungs-Plattform) sind im Plan bisher **nicht modelliert**. Dieser Brief setzt die Vision für genau diese Lücke und trennt dabei diszipliniert nach Horizont: Was ist **H1** (lauffähige, beeindruckende Demo bis zum Pitch) und was ist **H2** (zahlende Kunden, Multi-Tenant, Production).

Die gute Nachricht aus der Ist-Analyse: Die Erweiterung ist keine Wunsch-Fantasie, sondern verlängert vorhandene Assets. Das Schema `ToolRecommendation` trägt bereits die Felder `required_integrations`, `data_flow` und `integration_with_existing` (`schemas/outputs.py` Z. 145–147) — das ist faktisch eine flache Kantenliste, aus der Stufe 2 einen verbundenen Ziel-Graphen verdichtet. Die Agent-SDK-Architektur ist additiv erweiterbar (`docs/sdk-architecture.md`), die Wissensbasis kennt bereits iPaaS-Tools (n8n/Make/Zapier in `vendor_landscape.yaml`), und Alex' dokumentierte n8n-Kernkompetenz plus der installierte n8n-MCP-Server (525-Node-Coverage) machen Stufe 3 vorzeigbar statt Vaporware. Realistisch für H1: Stufe 1 voll lauffähig, Stufe 2 als überzeugender interaktiver Blueprint-Prototyp, Stufe 3 ehrlich **angedeutet** (genau eine live generierte und deploybare n8n-Automation als Proof).

---

## Problem & Motivation

### Das Marktproblem (Endkunden-Sicht)

KI-Adoption im Mittelstand scheitert selten an fehlender Technologie, sondern an drei Lücken:

1. **Verstehens-Lücke:** Mittelständische Betriebe (im Erstfall: Hotels) wissen nicht präzise, wo ihre Prozesse stehen, welche Systeme isoliert nebeneinander laufen und wo das echte Automatisierungs-Potenzial liegt. Klassische Beratung erfasst das über teure Workshops und Fragebögen — langsam, unstrukturiert, abhängig von der Tagesform des Beraters.
2. **Design-Lücke:** Selbst wenn das Problem verstanden ist, bleibt die Empfehlung meist eine Tool-Liste ("nehmt Tool A, B, C"). Was fehlt, ist die **kohärente Ziel-Systemlandschaft** — welche Tools, wie miteinander verbunden, welche Datenflüsse, welche Automationen. Genau das ist der Teil, an dem Standard-Beratung aufhört.
3. **Umsetzungs-Lücke:** Die Ziel-Landschaft auf Papier hilft niemandem. Sie muss tatsächlich gebaut, konfiguriert und verbunden werden. Hier verlieren sich die meisten Adoptions-Initiativen, weil der Betrieb keine Build-Kompetenz hat und der Berater nach dem Report-Termin weg ist.

Das Studio adressiert alle drei Lücken als ein durchgängiges System — vom Berater-Report zur **ausführenden Adoption-Engine**.

### Die persönliche Motivation (Alex / Projekt-Sicht)

Das Projekt ist primär ein **Karriere-Asset**. Alex dokumentiert seinen Bootcamp-Weg öffentlich und will sich nach dem Bootcamp (Ende 30.07.2026) als Solutions Engineer / CSM bei Hospitality-SaaS DACH positionieren. Eine Multi-Agent-Plattform, die nicht nur Tools bedient, sondern **Systemdenken zeigt** — verstehen, designen, bauen — ist der wirksamste Beweis dafür. Die 3-Stufen-Erweiterung erhöht die Pitch-Wirkung massiv: Sie hebt das Projekt von "noch ein KI-Audit-Tool" auf "Adoption-Operating-System". Genau deshalb muss Stufe 3 in H1 **ehrlich** als "angedeutet" gerahmt werden — die Projekt-Leitplanke "keine Fake-Zahlen, Tools statt Träume" darf im Pitch nicht verletzt werden.

### Die belegte Lücke im aktuellen Stand

Alle Linear-Milestones P1–P5 enden bei Stufe 1. P4 ("Multi-Agent") liefert 4 volle / 2 funktionale / 2 Stub-Agenten plus PPTX/Excel; P5 ist Polish/Pitch. Es gibt **kein** Milestone und **kein** Issue für "Systemlandschaft designen" oder "Systeme für den Kunden bauen/verbinden". Der nächstverwandte Agent — der Roadmap-Generator — produziert nur eine Phasen-/Use-Case-Liste, **keinen** Tool-plus-Integrations-plus-Datenfluss-Blueprint. Diese Lücke ist der strategische Kern dieses und der folgenden Plan-Dokumente.

---

## Produktvision (3 Stufen)

Das Studio versteht ein Unternehmen vollständig, leitet daraus die komplette Ziel-Systemlandschaft ab und baut diese Systeme dann real auf und verbindet sie. Alex' Kernsatz: *"So ein Tool wollen wir bauen. Und natürlich alles, was dazugehört."*

### Stufe 1 — VERSTEHEN (heute weitgehend gebaut)

Voice-Agent **Ada** (ElevenLabs Conversational AI) plus Dokument-Analyse erfassen die komplette Ist-Infrastruktur und die Bedürfnisse eines Unternehmens. Konkret bereits implementiert: Onboarding → geführter Daten-Upload (PDF/Excel/CSV/DOCX) → Web-Research-Agent → Präsentationsseite (Confirmation) → kontextbewusstes Voice-Interview mit Ada (Master-Fragepool, im Code aktuell 105 Fragen) → Multi-Agent-Run (7 Agenten: Process-Auditor, Use-Case-Generator, Tool-Recommender, ROI-Calculator, Compliance-Checker, Roadmap-Generator, Reporter; plus Web-Research) → strukturierte, Pydantic-typisierte Outputs (`schemas/outputs.py`) → PPTX/Excel-Report.

**Output Stufe 1 heute:** Analyse + Empfehlung + Report. Also Erkenntnisse, **noch kein** verbundenes Design und **kein** real gebautes System.

### Stufe 2 — DESIGNEN (fehlt als eigene Ebene)

Aus den Verstehens-Informationen wird die komplette **Ziel-Systemlandschaft** logisch und strukturiert entworfen: welche Tools, wie verbunden, welche Automationen, welche Datenflüsse — die gesamte System-Tool-Landschaft, vollständig aus den Bedürfnissen abgeleitet.

Heute existiert dafür **kein** "System-Design-Generator" und **kein** Schema. Der Tool-Recommender liefert nur eine Top-3-Liste mit Preis und Integration, keine Gesamtarchitektur. Der Roadmap-Generator gibt nur "Phase 1/2/3 mit Personentagen" zurück, keinen Blueprint. **Embryonal vorhanden** sind aber die Bausteine: `ToolRecommendation` trägt schon `required_integrations`, `data_flow`, `integration_with_existing`; `ProcessTouchpoint` erfasst pro Prozess den `integration_status` (isolated | manual-sync | api-integrated | unknown) und damit die **heutige** Systemlandschaft. Stufe 2 = das **Delta** zwischen Ist-Graph (aus dem Audit) und Ziel-Graph (aus den Tool-Empfehlungen), verdichtet zu einem validierten, maschinenlesbaren Architektur-Artefakt.

### Stufe 3 — BAUEN / ORCHESTRIEREN (fehlt vollständig)

Die strukturierten Systeme werden tatsächlich aufgebaut und alle Tools miteinander verbunden. Kein Agent und kein Schema im Repo adressiert das heute. Spec §8 verschiebt sogar alle Live-API-Connects (HubSpot, Salesforce, GA4) explizit auf Phase 2 — im MVP nur ElevenLabs-WebRTC.

Der konkrete, glaubwürdige Hebel für Stufe 3 ist **n8n als Orchestrierungs-Hub**: Alex' dokumentierte Kernkompetenz, ein self-hosted n8n auf dem VPS, der installierte n8n-MCP-Server mit 525-Node-Coverage (`n8n_create_workflow`, `n8n_validate_workflow`, `n8n_deploy_template`). Damit wird aus jeder geplanten Automation valides n8n-Workflow-JSON generiert, lokal validiert und per REST deployt — branchenagnostisch über generische API-Konnektoren.

### Branchenagnostik als Designprinzip

Die Graph-Abstraktion von Stufe 2/3 (nodes = Systeme, edges = Datenflüsse, automations) ist domänenfrei. Branchenspezifisch sind nur die Wissens-Packs (`hospitality_tools_db.yaml`, `vendor_landscape.yaml`) und der Fragepool. Hospitality ist der **erste vertikale Beweis**, nicht die Grenze — ein Branchenwechsel ist ein neues Vendor-Pack plus neuer Fragepool, kein neuer Generator.

---

## Zielgruppen / Personas

Die Personas unterscheiden sich fundamental zwischen den Horizonten. In H1 ist der wahre "Käufer" der Demo nicht der Hotelier, sondern der Recruiter.

### H1 — Portfolio-Demo bis 21.07.

**Persona A — "Der Hiring-Manager / Recruiter" (der eigentliche Käufer der Demo).**
- *Wer:* Hiring-Manager, Tech-Lead oder Head of Solutions bei Hospitality-SaaS oder Tech-Unternehmen DACH; Bootcamp-Trainer und Peers beim Final-Pitch.
- *Job-to-be-done:* In wenigen Minuten beurteilen, ob Alex Systeme **denken, designen und bauen** kann — nicht nur Tools bedient.
- *Was überzeugt:* Eine lauffähige, kohärente Demo, die alle drei Stufen sichtbar macht; der visuelle Ist→Ziel-Systemlandschafts-Sprung; ein **real deployter** n8n-Flow als Beweis, dass "bauen" kein Buzzword ist.
- *Was tötet:* Hochglanz-Behauptungen ohne Substanz, erkennbar erfundene Zahlen, eine Stufe 3, die als "fertig" verkauft, aber leer ist.

**Persona B — "Der fiktive Erst-Kunde: Hotel-Mittelstand DACH" (Demo-Subjekt, nicht Käufer).**
- *Wer:* Inhaber:in oder Ops-Verantwortliche:r eines mittelständischen Hotels (S/M/L), DACH, Deutsch sprechend. In der Demo verkörpert durch ein realistisches Mock-Hotel (`mock_data/`).
- *Job-to-be-done:* Verstehen, wo der Betrieb KI/Automation einsetzen kann, ohne sich in Tool-Jargon zu verlieren.
- *Funktion in H1:* Liefert den glaubwürdigen, branchentiefen Anwendungsfall, an dem die drei Stufen demonstriert werden. Dient der Erzählung, ist aber kein zahlender Nutzer.

### H2 — BIZ26-SaaS danach

**Persona C — "Der KMU-/Mittelstands-Entscheider DACH" (zahlender Self-Service-Kunde).**
- *Wer:* Inhaber:in / Geschäftsführung / Ops-Lead eines KMU im Mittelstand DACH — zuerst Hospitality, dann über die heutigen Stubs (Retail, Healthcare) hinaus branchenagnostisch.
- *Job-to-be-done:* Nicht nur eine Analyse bekommen, sondern die Ziel-Landschaft real aufgebaut und betrieben sehen — verstehen, designen, bauen, als laufender Service.
- *Was überzeugt:* Multi-Tenant-Self-Service, echte Konnektoren, deploybare Orchestrierungen, nachvollziehbarer ROI.

**Persona D — "Alex als Berater im Branchen-Netzwerk" (Power-User / interner Operator).**
- *Wer:* Alex selbst, nutzt das Studio als Beratungs-Werkzeug bei eigenen Kunden.
- *Job-to-be-done:* Schnell von Erst-Gespräch zu designter und teil-gebauter Landschaft kommen, mit Senior-Qualität ohne manuellen Workshop-Aufwand.

---

## Wert & USP

### Kern-USP (Stufe 1, heute differenzierend)

Kontextbewusstes **Voice-Interview mit Senior-Coach "Ada"** statt Formular. Pre-Call-Briefing kennt Name, Pain Points und Branchenprofil; dynamische Fragenselektion aus einem Master-Fragepool (Code aktuell 105 Fragen), hypothesen-getrieben statt linear. Das ist der Anti-Black-Box-Aufhänger: Der Nutzer fühlt sich verstanden, nicht abgefragt.

### Erweiterter USP (3 Stufen, der eigentliche Sprung)

Der Sprung über den Markt hinaus ist **nicht** das Audit, sondern dass aus dem Verstehen automatisiert eine vollständige Ziel-Architektur **designed** und anschließend real **gebaut/orchestriert** wird. Die meisten KI-Beratungs-Tools enden beim Report. Das Studio macht aus dem Berater-Werkzeug eine ausführende Adoption-Engine.

### Konkrete Wert-Beweise (aus vorhandenen Assets)

- **Ist→Ziel-Visualisierung als stärkstes Demo-Artefakt:** Der Delta-Graph (heutige isolierte Inseln → verbundene Ziel-Landschaft mit n8n als Hub) ist fast "geschenkt" aus bereits erfassten Daten (`ProcessTouchpoint.integration_status` + Tool-Empfehlungen). Alex hat die interaktive 3D-Graph-Visualisierung technisch schon zweimal gebaut (`System-Map/` Three.js). Das schlägt jede Slide.
- **Echtes Bauen statt Behauptung:** n8n-MCP (525 Nodes) + Alex' n8n-Kompetenz erlauben in der Demo genau **eine** vollständig generierte, validierte und deploybare Automation (z.B. "Reservierungs-Mail → PMS-Eintrag") — der konkrete "BAUEN"-Beweis.
- **Senior-Qualität durch Integritäts-Guardrail:** Analog zum bestehenden VUFVE-Check der Use-Cases bekommt der Ziel-Graph einen Validierungs-Pass — jede Kante braucht einen realen Mechanismus, jeder Datenfluss eine Quelle, jede Automation einen Owner. So bleibt die Story ehrlich und wird im Pitch nicht als Hochglanz entlarvt.

---

## Scope H1 (Portfolio-Demo bis 21.07.) vs. H2 (SaaS)

### Scope H1 — Portfolio-Demo (Deadline Final-Pitch 21.07.2026)

Ziel: eine lauffähige, beeindruckende Demo, die Alex als Vibe Coder / Solutions Engineer verkauft. Realistisch über alle drei Stufen:

| Stufe | H1-Tiefe | Konkrete Lieferung |
|---|---|---|
| **Stufe 1 — Verstehen** | **VOLL** | Ada-Voice-Intake + Doku-Analyse + Multi-Agent-Run + PPTX/Excel-Report, end-to-end lauffähig gegen das Mock-Hotel (passt zur bestehenden P5-Polish-Deadline). |
| **Stufe 2 — Designen** | **PROTOTYP (überzeugend)** | Neuer `system_architect`-Agent erzeugt aus dem echten Hotel-Fall ein `SystemLandscape`-Artefakt; interaktiver Ist→Ziel-Graph (2D/3D, Reuse `System-Map/`); neue Report-/Web-Sektion "Eure Ziel-Systemlandschaft". Automationen deklarativ-abstrakt ("Trigger X → Aktion Y"), 1:1 auf Use-Cases gemappt. |
| **Stufe 3 — Bauen** | **ANGEDEUTET / teil-real** | Genau **eine** Automation wird live als generiertes, valides, lauffähiges n8n-JSON gezeigt und deployt (via n8n-MCP, gegen Mock/Sandbox). Im Pitch ehrlich gerahmt als "gegen echte API live schaltbar". |

Vorgeschlagener neuer Milestone für H1: **"P6 · System-Design-Demo"** (~21.06.–14.07., parallel zu P4) mit Epics: (E1) `SystemLandscape`-Schema + Validierungspass · (E2) `system_architect`-Agent additiv via `agent_patterns` · (E3) Ist→Ziel-Graph-Renderer · (E4) Report-Integration · (E5) Stufe-3-Teaser (1 n8n-Flow generiert + deployt).

### Scope H2 — BIZ26-SaaS (post-Bootcamp)

Ziel: echtes Produkt mit zahlenden Kunden.

| Bereich | H2-Tiefe |
|---|---|
| **Stufe 2 voll** | Vollständige, versionierte Landschaften pro Run; Re-Design-Loop (Landschaft entwickelt sich mit). |
| **Stufe 3 voll** | Konnektor-Bibliothek (>20 echte API-Konnektoren) + verschlüsselter, Tenant-scoped Credential-Vault; Blueprint→n8n-Compiler für **ganze** Landschaften (nicht nur 1 Flow); Deploy/Monitoring deployter Orchestrierungen. |
| **Multi-Tenant & Billing** | Tenant-Slug/Namespace-Isolation über das vorhandene `owner_id`/RLS-Muster hinaus; Billing/Pricing/Metering (heute Stub). |
| **Production-Hardening** | Celery/Redis statt FastAPI BackgroundTasks; Retry/Backoff; Timeouts; Concurrency. |
| **Branchenagnostik** | Branchen-Packs (Retail/Healthcare aus den heutigen Stubs aufbohren, dann die 25 weiteren Branchen) — neues Vendor-Pack + Fragepool je Domäne, Generator bleibt. |

Vorgeschlagener neuer Milestone für H2: **"P7 · Orchestrierungs-Plattform"** mit Epics: (E6) Konnektor-Framework + Credential-Vault · (E7) Blueprint→n8n-Compiler · (E8) Deploy/Monitoring-Layer · (E9) Branchen-Pack-Mechanik · (E10) Multi-Tenant + Billing.

---

## Erfolgskriterien / North-Star

### H1 — North-Star: "Würde ein Hiring-Manager Alex nach dieser Demo zum Gespräch einladen?"

- Die komplette 3-Stufen-Story ist in einer einzigen Demo **lauffähig** vorführbar (Stufe 1 voll, Stufe 2 als interaktiver Blueprint, Stufe 3 mit 1 live deployten Flow).
- Der Ist→Ziel-Systemlandschafts-Graph wird für den Mock-Hotel-Fall live gerendert und ist in unter 10 Sekunden als "aus Bedürfnissen wird Struktur" verständlich.
- Mindestens **eine** Automation wird im Pitch real generiert, validiert und deployt — kein Slide, sondern ein laufender Flow.
- Der Final-Pitch B05-23 am 21.07. wird ohne erfundene Zahlen gehalten; jede gezeigte Verbindung hat einen realen Mechanismus (Integritäts-Guardrail bestanden).
- Alle Projekt-Leitplanken sind erfüllt (kein BIZ26/KI-Boutique im Repo, kein Münster, echte Umlaute, Trevor-Noah-Voice in Texten).

### H2 — North-Star: "Zahlt ein KMU-Entscheider für eine real gebaute und betriebene Ziel-Landschaft?"

- Erster zahlender Tenant betreibt mindestens eine produktiv deployte, vom Studio generierte Orchestrierung.
- Multi-Tenant-Isolation + Credential-Vault produktiv und auditierbar.
- Mindestens eine zweite Branche (über Hospitality hinaus) als eigenes Pack lauffähig — Nachweis der Branchenagnostik.
- Blueprint→Deploy funktioniert für eine **ganze** Landschaft, nicht nur einen Einzel-Flow.

---

## Wichtigste Risiken & Annahmen

| # | Risiko / Annahme | Horizont | Umgang |
|---|---|---|---|
| R1 | **Stufe-2-Schema fehlt komplett.** Es gibt keinen Datentyp/kein Pydantic-Modell für eine "Ziel-Systemlandschaft" (nur `briefing.py` + `outputs.py`). | H1 | Neues `SystemLandscape`-Schema (nodes/edges/automations/layers) als erste Aufgabe in P6 definieren. Risiko: ohne sauberes Schema halluziniert der Generator Verbindungen. |
| R2 | **Stufe-3-Tiefe in H1 unklar.** Wie tief darf "real bauen" gehen, ohne von echten Kunden-Credentials abhängig zu sein? | H1 | **Annahme:** Demo baut gegen Mock-PMS / Sandbox-Account, im Pitch ehrlich als "gegen echte API live schaltbar" gerahmt. Bewusster Scope-Cut, nicht stillschweigend angenommen. |
| R3 | **`automations[]`-Granularität treibt Aufwand massiv.** Deklarativ ("Trigger X → Aktion Y") vs. voll ausführbares n8n-JSON. | H1 | **Entscheidung:** H1 deklarativ-abstrakt (rendert schön, mappt 1:1 auf Use-Cases); nur **der eine** Teaser-Flow voll ausführbar. Voll-Compiler ist H2. |
| R4 | **Begriffs-Verwechslung "Orchestrierung".** Es existieren ZWEI Bedeutungen: (1) Produkt-Feature Stufe 3 (Kunden-Systeme verbinden) vs. (2) Meta-Delivery-Plattform (Studio baut sich selbst, Linear ALE-44/49/50). Beide nutzen n8n. | H1+H2 | Jeder Epic/Feature im Plan bekommt ein explizites Label, welche Bedeutung gemeint ist. Dieser Brief adressiert **ausschließlich** das Produkt-Feature für den Endkunden. |
| R5 | **Ehrlichkeits-/Pitch-Risiko.** No-Fake-Zahlen-Regel; eine als "fertig" verkaufte, aber leere Stufe 3 würde den Pitch entwerten. | H1 | Stufe 3 konsequent als "angedeutet" rahmen; Integritäts-Guardrail über den Ziel-Graphen; nur belegbare Verbindungen zeigen. |
| R6 | **Zeitbudget bis 21.07.** P6 läuft parallel zu P4 (Multi-Agent) und P5 (Polish). | H1 | P6 bewusst auf den überzeugenden Prototyp + 1 Teaser-Flow begrenzen; keine H2-Features in H1 ziehen. |
| R7 | **Branchen-Hartcodierung.** Stufe-1-Audit ist Hospitality-DNA-durchtränkt (PMS/POS/Channel-Manager, TSE, Hotel-Enums). Branchenagnostik braucht Pattern-Abstraktionen. | H2 | Graph-Abstraktion ist bereits domänenfrei; `agent_patterns/patterns/<domain>/` ist für Mehr-Domänen gebaut. Refactoring der Wissens-Packs erst in H2 (E9). |
| R8 | **Skalierungs-Architektur.** FastAPI BackgroundTasks trägt 1 Run (Demo), nicht Production-Concurrency. | H2 | Celery/Redis-Umstieg klar als H2 (P7) markiert; H1 läuft bewusst single-run. |
| **A1** | **Annahme:** Die bestehende SDK-Architektur (`docs/sdk-architecture.md`) erlaubt das additive Einhängen des `system_architect`-Agents ohne Eingriff in den Core (3-Schritt-Registrierung). | H1 | Zu verifizieren beim Start von P6/E2. |
| **A2** | **Annahme:** n8n-MCP (`n8n_create_workflow` / `n8n_validate_workflow` / `n8n_deploy_template`) ist gegen die VPS-n8n-Instanz aus dieser Umgebung wirklich nutzbar. | H1 | Vor dem Teaser-Flow (E5) end-to-end smoke-testen. |

---

## Out-of-Scope

**Explizit NICHT in H1 (Portfolio-Demo bis 21.07.):**
- Voll ausführbarer Blueprint→n8n-Compiler für ganze Landschaften (nur 1 Teaser-Flow real).
- Echte Live-API-Connects gegen Produktiv-Systeme (HubSpot, Salesforce, GA4, echte PMS-Credentials) — Demo läuft gegen Mock/Sandbox.
- Multi-Tenant-Isolation über das vorhandene `owner_id`/RLS-Muster hinaus; Billing/Pricing/Metering.
- Konnektor-Bibliothek (>20 Konnektoren) und verschlüsselter Credential-Vault.
- Production-Hardening (Celery/Redis, Retry/Backoff, Timeouts, Concurrency).
- Branchen über Hospitality hinaus voll ausgebaut (Retail/Healthcare bleiben Stubs).
- Re-Run-/Edit-Modus und Versions-Vergleich (bereits in Spec §7 als Phase 2).

**Explizit NICHT Teil dieses Produkts (jeglicher Horizont):**
- Die **Meta-Delivery-Plattform** (Studio baut sich selbst per Email-One-Click / VPS-Webhook, Linear ALE-44/49/50) — das ist ein **separates** internes Werkzeug, kein Endkunden-Feature, und darf mit Stufe 3 nicht vermischt werden.
- Branchen-/Tonalitäts-Verstöße gegen die Projekt-Leitplanken (BIZ26/KI-Boutique-Nennung im Repo, "Münster", ae/oe/ue-Schreibung) — harte No-Gos, kein Scope-Thema.

---

*Folge-Dokumente dieses Plans modellieren auf Basis dieses Briefs: detaillierten Scope/Features, Epics & Stories (mit H1/H2-Horizont-Label), sowie die System-Design-Schema-Spezifikation für Stufe 2/3.*

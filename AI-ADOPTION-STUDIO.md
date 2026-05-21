# AI-Adoption-Studio — Lokales Sync-File

> **Zweck:** Lokaler Working-Snapshot des Bootcamp-Hauptprojekts. Spiegelt Notion (Single Source of Truth) für direkten Zugriff im Terminal/Editor.
> **Notion-SSoT:** [🎯 Projekt: AI-Adoption-Studio](https://www.notion.so/359066d22c8e81b0a9f8fadb9d777908)
> **Letzter Sync:** 2026-05-13 (Spec-Blöcke 4–10 + 2.1-Ergänzungen geschlossen)
> **Sync-Regel:** Wenn ich (Claude Code) im Notion etwas ändere oder dort etwas Neues lese → sofort hier nachziehen. Wenn Alex etwas hier oder mündlich entscheidet → in Notion dokumentieren UND hier nachziehen.

---

## 1. Status auf einen Blick

| Feld | Wert |
|---|---|
| Phase | **P1 Konzept** (8.5. → 19.5.2026) |
| Architektur-Version | **2.1** (Update läuft, ergänzt 2.0 um Onboarding/Prozess/Web-Recherche/Präsentation) |
| Konzept-Pitch | **B05-05 · 19. Mai 2026** |
| Final-Pitch | **B05-23 · 21. Juli 2026** |
| Bootcamp-Ende | **30. Juli 2026** |
| Spec-Blöcke fertig | **10 von 10** — alle Blöcke + 2.1-Ergänzungen geschlossen (13.5.) |
| Repo | **Live:** [github.com/alexheyers/ai-adoption-studio](https://github.com/alexheyers/ai-adoption-studio) |

---

## 2. Was ist die App?

**AI-Adoption-Studio** = Multi-Agent-AI-System mit Voice-Agent-Interview, das die strategische KI-Adoptions-Beratung im Mittelstand zu ~80% automatisiert.

### Dreifach-Funktion (Architektur 2.0/2.1)

1. **Bewerbungs-Demo & Senior-Skill-Beweis** für Karriere nach Bootcamp ← Hauptpfad (seit 11.05.)
2. **Self-Service-App für Direkt-Kunden** ← Sekundärpfad
3. **Beratungs-Werkzeug für Alex selbst** ← Eigennutzung im Branchen-Netzwerk

### Kern-USP

**ElevenLabs Conversational AI Voice-Interview** — kontext-bewusster Senior-Coach "Ada" statt Formular-Befragung. Pre-Call-Briefing kennt Namen, Pain Points, Branchen-Profil. Master-Fragepool 200+, dynamische Selektion 10–15 Fragen pro Run.

---

## 3. End-to-End User-Flow (Architektur 2.1)

```
1. Onboarding              Persönliche Daten + Firmendaten + Pfad-Wahl + DSGVO-Opt-In
   ↓
   Self-Service ODER Berater-Pfad (CRM)
   ↓
2. Daten-Upload            G&V, Personal, KPIs, Prozess-Docs
   ↓
3. Prozess-Erfassung       Methode TBD (Formular/Voice/Datei/Freitext)
   ↓
4. Web-Recherche-Agent     Firma online + Stadt/Region-Benchmarks
   ↓
5. Präsentationsseite      "Was wir extrahiert haben" — User bestätigt/korrigiert
   ↓
6. Voice-Interview         ElevenLabs · Ada · 10–15 Fragen · 15 Min Cap
   ↓
7. Multi-Agent-Run         8 Agents (4 voll, 2 funktional, 2 Stub für MVP)
   ↓
8. Outputs                 PPTX-Pitch-Deck + Excel-ROI + PDF
```

### Was 2.1 vs 2.0 hinzufügt

- Onboarding als eigener Step 1 (war unterspezifiziert)
- Geführter Daten-Upload statt offene Drop-Zone
- Prozess-Erfassung als eigener Step 3 (Methode noch offen)
- Web-Recherche-Agent als neuer Layer (Firma + Stadt/Region-Benchmarks)
- Präsentationsseite vor Voice-Interview (Vertrauens-Boost, anti Black-Box)

---

## 4. Roadmap bis 21.7.2026

| Phase | Zeitraum | Tage | Ziel |
|---|---|---|---|
| **P1 Konzept** | 8.5. → 19.5. | 11 | Konzept-Pitch B05-05 · alle 10 Spec-Blöcke fertig · Pitch-Deck |
| **P2 Foundation** | 20.5. → 9.6. | 21 | Repo · Auth · CRM · Document-Pipeline · Onboarding-Frontend · Deployment |
| **P3 Voice-Core** | 10.6. → 30.6. | 21 | Master-Fragepool · ElevenLabs-Integration · Voice-Interview End-to-End |
| **P4 Multi-Agent** | 1.7. → 14.7. | 14 | 4 Agents voll · 2 funktional · 2 Stub · PPTX + Excel-Generator |
| **P5 Polish** | 15.7. → 20.7. | 6 | E2E-Test · Demo-Skript · Final-Pitch-Deck B05-23 |

---

## 5. Spezifikations-Blöcke

| # | Themenblock | Status |
|---|---|---|
| 1 | User & Persona | ✅ (Berater-Persona kommt in 2.0-Erweiterung) |
| 2 | Tier-Logik & Feature-Differenzierung | ✅ (Entscheidung: nur EIN Tier) |
| 3 | Briefing-Eingabe & Daten-Architektur | ✅ |
| 4 | Document-Upload | ✅ |
| 5 | Multi-Agent-Run | ✅ |
| 6 | Outputs & Deliverables | ✅ |
| 7 | Re-Run & Edit-Modus | ✅ |
| 8 | MVP-Scope vs. Phase 2 | ✅ |
| 10 | Voice-Agent USP & Master-Fragepool | ✅ |

**2.1-Ergänzungen:**
- Onboarding-Flow ✅
- Prozess-Erfassung ✅
- Web-Recherche-Agent ✅
- Präsentationsseite ✅

---

## 6. Werkzeug-Aufteilung

| Werkzeug | Rolle |
|---|---|
| **Notion** (AI-Adoption-Studio + Sub-Pages) | Projekt-HQ — Roadmap, Tasks-DB, Specs, Decision-Log, Architektur |
| **Cowork** (Claude Desktop) | Strategy-Konsole — Konzept, Recherche, Q&A, Synthese |
| **Claude Code** (Terminal) | Build-Konsole — tatsächlicher Code, Multi-Agent-System, Deployment |
| **GitHub Projects** | Code-HQ — Issues, PRs, Build-Tasks (ab 21.5.) |
| **ElevenLabs Dashboard** | Voice-Agent-Konfiguration (Account vorhanden) |
| **Vercel + Railway + Supabase** | Deployment |

---

## 7. Tech-Stack 2.0/2.1

| Layer | Tools |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind, shadcn/ui, react-dropzone |
| Voice-SDK | ElevenLabs WebRTC SDK + Audio-Streaming |
| Backend | Python FastAPI + LangGraph + Anthropic SDK + ElevenLabs SDK |
| Auth | Supabase Auth (Magic-Link für Kunden-Invites) |
| DB | PostgreSQL (Supabase) + Chroma (Vector) + Redis (Session-Cache) |
| File-Storage | Supabase Storage |
| Email | Resend |
| LLM | Claude Sonnet 4.6 (Conversation), Haiku (Tool-Calls), GPT-4 Backup |
| Voice | ElevenLabs Conversational AI (TTS + STT + Pipeline) |
| Document-Processing | pdfplumber, python-docx, pandas, openpyxl, GPT-4V |
| Output | python-pptx, openpyxl, WeasyPrint, Notion-API |
| Deployment | Vercel (Frontend) + Railway (Backend) + Supabase Cloud |

---

## 8. MVP-Scope vs. Phase-2 (Decision-Log 8.5.)

**Branchen-Tiefe MVP:** 1 Branche voll (**Hospitality**), 2 Stubs, 25 als Phase-2-Story.
*Begründung:* Hospitality = Alex' DNA (20 J.), Branding "From Bar to Bytes", Karriere-Strategie.

**Agent-Scope MVP:** 4 voll · 2 funktional · 2 Stub.
- **Voll:** Process-Auditor, Use-Case-Generator, Tool-Recommender, ROI-Calculator
- **Funktional:** Orchestrator (LangGraph), Reporter (Templates)
- **Stub:** Compliance-Checker (DSGVO-Light), Roadmap-Generator (3-Phasen)

**Outputs MVP:** PPTX-Pitch-Deck + Excel-ROI **voll**. PDF, Excel-Tool-Vergleich, Workshop-Templates **funktional**. Notion-Workspace + Compliance-Report **Stub**.

**Document-Processing MVP:** PDF (Text) + Excel/CSV **voll**, Word funktional, OCR/Image-Charts/PPTX-Parsing **Phase 2**.

**Live-API-Connects:** Alle (HubSpot, Salesforce, GA4) **Phase 2**. Im MVP nur ElevenLabs-WebRTC.

---

## 9. Voice-Agent "Ada" — Quick-Reference

- **Stimme:** ElevenLabs, Deutsch, weiblich, warm-professionell, 95% Geschwindigkeit
- **Persona:** 38, 15 Jahre virtuelle Beratungs-Erfahrung Mittelstand
- **Pre-Call-Kontext:** CRM-Pre-Briefing + Document-Insights + Branchen-Profil + bekannte Pain Points
- **Master-Fragepool:** 200+ Fragen, kategorisiert (Branche/Ops/Personal/Tools/Marketing/Compliance/Strategie)
- **Pro Run:** 10–15 ausgewählte Fragen, max. 3 Folge-Fragen pro Thema, 15 Min Cap
- **MVP-Phase 1:** 30 Hospitality-Fragen reichen
- **Function-Calling-Tools:** `save_answer()`, `flag_for_human()`, `get_customer_data()`

---

## 10. Tasks-DB Schema (Notion)

DB: [AI-Adoption-Studio Tasks](https://www.notion.so/7ec67bf12f29485fa9a47e70937c9fc2) · `collection://98fbc54b-cc4b-46d3-87fd-007f6624c216`

| Property | Werte |
|---|---|
| **Status** | 🔴 To Do · 🟡 Doing · 🟢 Done · ⚫ Blocked · 🔵 Pending Decision |
| **Phase** | P1 Konzept · P2 Foundation · P3 Voice-Core · P4 Multi-Agent · P5 Polish |
| **Priorität** | 🔴 P0 Kritisch · 🟠 P1 Wichtig · 🟡 P2 Normal · ⚪ P3 Nice |
| **Bereich** | Block 1–10 / Architektur / Onboarding / Web-Recherche / Prozess-Erfassung / Frontend / Backend / DevOps / Pitch / Übergreifend |
| **Deadline** | optional |
| **Notiz** | Kontext, Links |

**Filter-Views:** 🎯 Heute (Doing) · 📋 Open (To Do nach Prio) · 📅 Phase P1 · 🔥 P0 Kritisch · ✅ Done

---

## 11. Quick-Links zu Notion

| Seite | URL |
|---|---|
| 🎯 Hauptseite | https://www.notion.so/359066d22c8e81b0a9f8fadb9d777908 |
| 🗺 App-Architektur 2.1 | https://www.notion.so/359066d22c8e8160a9e4c497bdcb733c |
| 🗂 Roadmap bis 21.7. | https://www.notion.so/35a066d22c8e816bad90fe299aa3ac12 |
| ✅ Tasks Hub | https://www.notion.so/35a066d22c8e8119a84fd9acbed4a5f0 |
| 📓 Decision-Log | https://www.notion.so/35a066d22c8e81248e06ee884059df90 |
| 🎨 Wireframes & User-Flow | https://www.notion.so/35a066d22c8e81248475ee2ba8ee01d8 |
| 🎤 Voice-Agent USP (Spec 10) | https://www.notion.so/359066d22c8e817e9d9ddf0851d9679a |
| Block 1 User & Persona | https://www.notion.so/359066d22c8e819a8ad9f7fb976f9bdf |
| Block 2 Tier-Logik | https://www.notion.so/359066d22c8e81c5ba71cafcad17d10f |
| Block 3 Briefing-Eingabe | https://www.notion.so/359066d22c8e8197bd59c7346994ea31 |
| Block 4 Document-Upload | https://www.notion.so/359066d22c8e81ffb4f6d272e6fe7d83 |
| Block 5 Multi-Agent-Run | https://www.notion.so/359066d22c8e817eb1adf8e4d8fb8125 |
| Block 6 Outputs | https://www.notion.so/359066d22c8e81f388aad6d909c40b6a |
| Block 7 Re-Run & Edit | https://www.notion.so/359066d22c8e810f96c4c9a30599c124 |
| Block 8 MVP-Scope | https://www.notion.so/359066d22c8e81668c9ac46cc2bf2f36 |

---

## 12. Sync-Workflow (so bleibt das File aktuell)

**Beim Start einer Session:**
1. Diese Datei kurz scannen — Status, Phase, offene Specs?
2. Wenn länger als 24h kein Sync → Notion `🎯 Hauptseite` + `📓 Decision-Log` + `🗺 Architektur` re-fetchen, Diff hier einbauen.

**Während der Arbeit:**
- Neue Entscheidung → in Notion-Decision-Log + hier in Abschnitt 8.
- Spec-Block fertig → Status in Tabelle Abschnitt 5 updaten + in Notion.
- Phase-Wechsel → Abschnitt 1 + Abschnitt 4 updaten.
- Neue Sub-Page in Notion → Quick-Link in Abschnitt 11 ergänzen.

**Trigger-Phrasen für Alex:**
- *"Sync das File"* → kompletter Re-Fetch + Update.
- *"Was steht in Notion zu X?"* → erst hier checken, dann Notion bei Lücken.

**Update-Marker in der Datei:**
- Datum oben in der Header-Box bei jedem Sync neu setzen.
- Letztes Sync-Datum **nicht** stillschweigend ändern — Alex muss wissen, wann zuletzt mit Notion abgeglichen wurde.

---

## 13. Spec-Block 4 — Document-Upload

**Entscheidung (13.5.):** Geführter Upload mit Owner-Check + Inline-Parsing direkt nach Upload.

### Unterstützte Formate (MVP)
| Format | Parser | KPI-Extraktion |
|---|---|---|
| PDF | pdfplumber (Text + Tabellen) | — |
| Excel / XLSX | pandas + openpyxl | ✅ (ADR, RevPAR, Occupancy, Personalkosten) |
| CSV | pandas | ✅ |
| DOCX | python-docx | — |
| TXT | direkt | — |
| OCR / Image-Charts / PPTX | **Phase 2** | — |

### Upload-Flow
1. Frontend sendet `multipart/form-data` → `POST /upload` (file + company_id + doc_type)
2. Backend prüft Owner-Rechte via Supabase RLS
3. File landet in Supabase Storage unter `{company_id}/{document_id}/{filename}`
4. Metadaten-Eintrag in `documents`-Tabelle (parser_status: "pending")
5. Parser läuft **inline** (kein Queue für MVP) → `parsed_text` + `extracted_kpis` zurück
6. Fehler → parser_status: "failed" + parser_error gespeichert

### Doc-Typen
`gv_report` · `personal` · `kpi` · `process` · `other`

### KPI-Extraktion (Excel/CSV)
Pattern-Matching auf: `adr_eur`, `revpar_eur`, `occupancy_rate`, `personal_quote`, `gop_margin`
Werte landen in `documents.extracted_kpis` (JSONB) → Briefing-Builder aggregiert sie.

### MVP-Limits
- Max. 50 MB pro Datei
- Max. 50.000 Zeichen parsed_text (Rest wird abgeschnitten)
- Keine asynchrone Queue → bei großen PDFs kann Upload 10–30s dauern (akzeptiert für MVP)

---

## 14. Spec-Block 5 — Multi-Agent-Run

**Entscheidung (13.5.):** Orchestrator löst 7 Agents seriell aus. BackgroundTasks (FastAPI) für MVP, Celery/RQ für Production.

### Agent-Reihenfolge & Dependencies
```
[0] Web-Research-Agent      Optional — Firma + Region-Benchmarks (nur wenn --with-research)
[1] Process-Auditor         → ProcessAuditOutput (nutzt Briefing + Docs)
[2] Use-Case-Generator      → UseCaseOutput (nutzt Audit)
[3] Tool-Recommender        → ToolRecommendationOutput (nutzt Use-Cases)
[4] ROI-Calculator          → ROIOutput (nutzt Audit + Use-Cases + Tools)
[5] Compliance-Checker      → ComplianceOutput (nutzt Use-Cases + Tools) [Stub MVP]
[6] Roadmap-Generator       → RoadmapOutput (nutzt Use-Cases + Tools + ROI) [Stub MVP]
[7] Reporter                → FullReport (aggregiert alle Outputs)
```

### Run-Lifecycle (Supabase)
- `runs.status`: `pending` → `in_progress` → `completed` / `failed`
- `runs.current_step`: aktueller Agent-Name (für Frontend-Polling)
- `run_results`: 1 Zeile pro Agent (JSONB), unique auf `(run_id, agent_name)`
- Frontend pollt `GET /run/{run_id}` alle 3s während status ≠ completed/failed

### Rate-Limit-Handling
Pause von 8s zwischen Agent-Calls (konfigurierbar via `AGENT_PAUSE_SECONDS`).
Anthropic Tier 1: ~30k Tokens/Min. ~25k pro Call → Pause + Verarbeitungszeit reicht.

### Briefing-Builder
`runs/briefing_builder.py` — aggregiert Company-Daten + geparste Dokument-KPIs + Voice-Transcript + Web-Research zu einem strukturierten `Briefing`-Objekt (Pydantic). Das ist der Input für alle Agents.

### MVP vs. Production
| Aspekt | MVP | Production |
|---|---|---|
| Queue | FastAPI BackgroundTasks | Celery + Redis |
| Parallelität | seriell | parallel wo möglich |
| Retry | kein Auto-Retry | 3x mit Backoff |
| Timeout | kein Hard-Limit | 5 Min pro Agent |

---

## 15. Spec-Block 6 — Outputs & Deliverables

**Entscheidung (13.5.):** PPTX + Excel voll. PDF funktional. Ablage in Supabase Storage `deliverables`-Bucket.

### Output-Typen
| Format | Status MVP | Inhalt |
|---|---|---|
| PPTX | **Voll** | Pitch-Deck: Executive Summary + Use-Cases + ROI + Roadmap (python-pptx) |
| Excel | **Voll** | ROI-Calculator mit Line-Items + Tool-Vergleich (openpyxl) |
| PDF | **Funktional** | Rendered aus PPTX oder WeasyPrint-HTML |
| Notion-Workspace | **Stub** | Phase 2 |
| Compliance-Report | **Stub** | Phase 2 |

### Storage-Pfad
`deliverables/{run_id}/report.{pptx|xlsx|pdf}`

### Download-Flow
1. `GET /run/{run_id}/download/{fmt}` → prüft Owner → gibt Signed URL zurück (1h gültig)
2. Frontend zeigt Download-Button nach `run.status == "completed"`

### Struktur PPTX-Deck (MVP, ~10 Slides)
1. Cover — Firma, Datum, Branche
2. Executive Summary — 3-4 Sätze Top-Empfehlung
3. Ist-Analyse — Prozesse mit höchstem Automatisierungs-Potenzial
4. Top-3 Use-Cases — Name, AI-Pattern, Quick Win Y/N
5. ROI-Übersicht — Investment / Savings Year 1-3 / Payback
6. Tool-Empfehlungen — Top-3 mit Preis + Integration
7. Roadmap — 3 Phasen visuell
8. Compliance-Hinweise — DSGVO + AI-Act (Stub)
9. Nächste Schritte — Konkrete To-Dos
10. Über Alex Heyers — Kontakt

---

## 16. Spec-Block 7 — Re-Run & Edit-Modus

**Entscheidung (13.5.):** Re-Run ist Phase 2. MVP hat Read-Only-Report. Manuelles Edit über Notion-Workspace (Stub).

### MVP-Scope
- User kann **keinen** laufenden Run abbrechen (akzeptiert)
- Report ist **read-only** nach Abschluss
- Fehler → `run.status = "failed"` + Error-Message → User startet manuell neu via Dashboard
- Kein Edit-Modus im MVP — alle Korrekturen über Neuen Run

### Phase-2-Scope
- Inline-Edit einzelner Agent-Outputs (z.B. ROI-Werte korrigieren)
- Re-Run einzelner Agents ohne kompletten Pipeline-Restart
- Versionierung von Reports (runs sind immutable, neuer Run = neue Version)
- Vergleichs-Ansicht zweier Runs

---

## 17. Spec-Block 8 — MVP-Scope (komplett, Q6–Q9)

**Q6 — Welche Branchen hat der MVP?**
Nur **Hospitality** voll. 2 Stubs (Retail, Healthcare) als Platzhalter. 25 weitere → Phase 2.

**Q7 — Welche Sprachen?**
Nur **Deutsch** im MVP. Ada spricht Deutsch. Reports auf Deutsch.

**Q8 — Wie viele gleichzeitige User?**
MVP-Ziel: 1 gleichzeitiger Run (Alex Demo-Umgebung). Keine Concurrency-Limits implementiert aber nicht getestet. Production (ab P5): 10 gleichzeitige Runs via Celery.

**Q9 — Wie wird die App deployed?**
- Frontend: Vercel (Next.js, auto-deploy auf `main`)
- Backend: Railway oder Hostinger VPS Docker (FastAPI + uvicorn)
- DB/Auth/Storage: Supabase Cloud (Frankfurt)
- Domain: subdomain von myflowmotion.cloud oder eigene Domain in Phase 2

---

## 18. Spec-Block 10 — Voice-Agent "Ada" (komplett)

**Entscheidung (13.5.):** ElevenLabs Conversational AI. Master-Fragepool 200+ mit Hypothesis-Tree-Struktur. 30 Hospitality-Fragen für MVP ausreichend.

### Pre-Call-Briefing-Pipeline
1. `pre_brief.py` generiert Pre-Brief aus Company + Docs + Web-Research
2. Pre-Brief enthält: Name, Branche, bekannte Pain Points, extrahierte KPIs, offene Datenlücken
3. Ada öffnet Gespräch mit Daten-Recap-Monolog (2-3 Min) → Vertrauens-Boost

### Fragepool-Struktur
```
master_pool.yaml
  └── categories: [front-office, housekeeping, fnb, personal, marketing, compliance, strategie]
      └── questions: [{id, text, follow_ups[], hypothesis_ids[], priority}]

hypothesis_trees.yaml
  └── hypotheses: [{id, title, trigger_conditions[], linked_questions[]}]
```

### Dynamische Selektion (pro Run)
- Basis: 30 Pflichtfragen Hospitality MVP
- + Hypothesis-triggered: bis zu 5 aus Pre-Audit-Hypothesen
- Cap: max. 15 Fragen · max. 15 Min · max. 3 Follow-ups pro Thema

### Function-Calling-Tools (Ada)
- `save_answer(question_id, answer_text, confidence)` — speichert strukturiert
- `flag_for_human(reason)` — markiert für manuelle Nachbearbeitung
- `get_customer_data(field)` — Ada kann Daten aus Pre-Brief abrufen

---

## 19. Spec-2.1 — Onboarding-Flow

**Entscheidung (13.5.):** 4-Step-Wizard. Supabase Auth Magic-Link für Kunden-Invites. Berater-Pfad (Alex) direkt via Dashboard.

### Steps
```
Step 1: Account — Name, E-Mail, Passwort (oder Magic-Link)
Step 2: Firma — Name, Branche (Hospitality), Sub-Segment (Hotel/Restaurant/Bar/etc.),
                 Größe (S/M/L/XL), Mitarbeiter, Standorte, Region
Step 3: Pfad-Wahl — "Ich mache das selbst" vs. "Alex berät mich" (CRM-Flag)
Step 4: DSGVO-Opt-In + Einverständnis Voice-Interview
```

### Berater-Pfad (Alex)
- Alex legt Company im Dashboard an (kein Wizard nötig)
- Sendet Magic-Link-Invite an Kunden
- Kunde startet bei Step 3/4 (Firmen-Daten bereits ausgefüllt)

---

## 20. Spec-2.1 — Prozess-Erfassung

**Entscheidung (13.5.):** Kombination aus Dokument-Upload + Voice-Interview. Kein separates Prozess-Formular im MVP.

### Begründung
- Formular = 50+ Felder → schlechte UX, niedrige Completion-Rate
- Voice-Interview deckt Prozess-Themen organisch ab (Ada fragt explizit danach)
- Dokument-Parsing extrahiert KPIs automatisch
- Process-Auditor-Agent synthesiert aus beiden Quellen

### Was der User tut
1. Dokumente hochladen (G&V, KPI-Sheet, Prozess-Docs falls vorhanden)
2. Voice-Interview mit Ada (Ada fragt Prozesse aktiv ab)
3. Fertig — kein manuelles Prozess-Formular

### Phase-2-Option
Strukturiertes Prozess-Canvas als optionaler Step zwischen Upload und Voice.

---

## 21. Spec-2.1 — Web-Recherche-Agent

**Entscheidung (13.5.):** Optional per Flag. Nutzt Anthropic web_search Tool. Output fließt ins Briefing.

### Was der Agent recherchiert
- Firmen-Website, Google-Bewertungen, LinkedIn, Presse
- Region-Benchmarks: Stadt-Tourismus-KPIs, Wettbewerber, Förderprogramme
- Ergebnis: `web_research.company_findings` + `web_research.region_benchmarks`

### Verfügbarkeit
- Braucht `web_search`-Tool-Zugang im Anthropic API Tier (Tier 2+)
- MVP: per `--with-research`-Flag in `test_pipeline.py` aktivierbar
- Production: automatisch wenn Anthropic-Tier es erlaubt, sonst überspringen

---

## 22. Spec-2.1 — Präsentationsseite (Pre-Voice-Confirmation)

**Entscheidung (13.5.):** Zwischen Daten-Upload und Voice-Interview. User sieht was das System extrahiert hat und bestätigt oder korrigiert.

### Zweck
- Anti-Black-Box: User versteht was Ada wissen wird
- Vertrauens-Aufbau vor dem Voice-Interview
- Möglichkeit kleine Korrekturen einzugeben (Freitext-Kommentar reicht)

### Inhalt
- Firmenprofil-Zusammenfassung (aus Onboarding)
- Extrahierte KPIs aus Dokumenten (mit Confidence-Level)
- Top-3 Hypothesen aus Pre-Audit-Analyst (kurz formuliert)
- "Was Ada fragen wird" — Themenvorschau (keine genauen Fragen)
- CTA: "Stimmt so — Interview starten" / "Ich möchte etwas korrigieren" (Freitext)


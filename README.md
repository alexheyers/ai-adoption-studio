# AI-Adoption-Studio

> Multi-Agent-AI-System mit Voice-Agent für KI-Adoptions-Beratung im Hospitality-Mittelstand.
> Bootcamp-Projekt · Final-Pitch 21.07.2026 · MVP-Branche: Hospitality DACH.

## Überblick

```
Onboarding (Auth + Profil + Daten-Upload)
   ↓
Web-Research-Agent (Firma online + Region-Benchmarks)
   ↓
Voice-Interview mit Ada (ElevenLabs · 30 Min · 12-15 Fragen)
   ↓
Multi-Agent-Run (8 Agents parallel/seriell)
   ├─ Process-Auditor
   ├─ Use-Case-Generator
   ├─ Tool-Recommender
   ├─ ROI-Calculator
   ├─ Compliance-Checker (DSGVO + AI-Act)
   ├─ Roadmap-Generator (3 Phasen)
   └─ Reporter (Executive Summary)
   ↓
Outputs (PPTX + Excel + PDF)
```

## Tech-Stack

| Layer | Stack |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind + TanStack Query |
| Backend | Python 3.11+ · FastAPI · uvicorn |
| LLMs | Anthropic Claude Sonnet 4.6 (Agents) · GPT-4V (Doc-Parsing) |
| Voice | ElevenLabs Conversational AI (WebRTC SDK) |
| DB · Auth · Storage | Supabase Cloud |
| Doc-Parsing | pdfplumber, openpyxl, pandas, python-docx |

## Verzeichnis-Struktur

```
ai-adoption-studio/
├── agents/                  # 8 Multi-Agents (Python)
├── api/                     # FastAPI-Server (REST-Endpoints)
├── documents/               # PDF/Excel/CSV/DOCX-Parser
├── mock_data/               # Demo-Briefing für Smoke-Test
├── runs/                    # Pipeline-Runner + Briefing-Builder
├── schemas/                 # Pydantic-Modelle (Briefing, Outputs)
├── supabase/migrations/     # SQL-Schema + RLS-Policies
├── voice/                   # ElevenLabs-Client + Master-Fragepool (105 Fragen) + Pre-Brief
├── web/                     # Next.js-Frontend
├── .env.example
├── requirements.txt
├── test_pipeline.py         # E2E-Smoke-Test (ohne Supabase, ohne Voice)
└── README.md
```

## Setup (lokales Dev)

### 1. Klonen & .env vorbereiten

```bash
cp .env.example .env
# Keys eintragen — siehe ~/.claude/memory/reference_credentials.md
# Mindestens: ANTHROPIC_API_KEY (für Smoke-Test reicht das)
# Für volles Setup zusätzlich: ELEVENLABS_API_KEY, SUPABASE_*
```

### 2. Backend-Dependencies

```bash
cd ai-adoption-studio
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Smoke-Test (ohne Supabase, ohne Voice, dauert ~60 Sek)

```bash
python test_pipeline.py
# Output: mock_data/demo_hotel_report.json + Executive-Summary in der Konsole
```

Damit ist Backend-Logik (5 Voll-Agents + 2 Stubs + Reporter) verifiziert.

### 4. Supabase-Setup (für volles E2E)

```bash
# Supabase-Projekt anlegen → https://supabase.com/dashboard → New Project
# Im Dashboard: Project Settings → API:
#   - Project URL → SUPABASE_URL
#   - anon public → SUPABASE_ANON_KEY
#   - service_role → SUPABASE_SERVICE_ROLE_KEY
#   - JWT Settings → JWT Secret → SUPABASE_JWT_SECRET
# In .env eintragen.

# Migrations applyen — entweder via CLI:
brew install supabase/tap/supabase
supabase link --project-ref <PROJECT-REF>
supabase db push

# Oder via Dashboard → SQL Editor:
# 1. Inhalt von supabase/migrations/20260509_001_init.sql ausführen
# 2. Inhalt von supabase/migrations/20260509_002_storage.sql ausführen
```

### 5. Backend starten

```bash
uvicorn api.main:app --reload --port 8000
# OpenAPI-Doc: http://localhost:8000/docs
```

### 6. Frontend starten

```bash
cd web
cp .env.local.example .env.local
# NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY aus Schritt 4 eintragen
pnpm install   # oder: npm install
pnpm dev       # http://localhost:3000
```

**Mock-Mode:** Wenn `NEXT_PUBLIC_SUPABASE_URL` leer ist, läuft Frontend im Dev-Mode mit simuliertem Login — dann lassen sich Onboarding und Voice-UI ohne Supabase-Setup durchklicken (Backend muss aber laufen).

### 7. ElevenLabs-Agent

Beim ersten Voice-Run wird automatisch ein Agent angelegt. Die `agent_id` wird ins Log geschrieben — bitte als `ELEVENLABS_AGENT_ID` in `.env` setzen, damit nicht bei jedem Start ein neuer Agent erstellt wird.

Alternativ: manuell im ElevenLabs-Dashboard einen Conversational-AI-Agent anlegen, ID kopieren, in `.env` eintragen.

## Volles E2E (Frontend → Backend → Supabase → ElevenLabs → Multi-Agent)

```
1. http://localhost:3000 → "Analyse starten"
2. /login → Magic-Link an deine Mail (oder Dev-Mode-Klick)
3. /onboarding → 3-Step-Form: Profil + Daten-Upload + Pfad-Wahl
4. /voice?company_id=... → Voice-Interview-Bühne
5. /report/<run-id> → Live-Status + Executive-Summary
```

## Test ohne Voice (CLI-Pipeline)

```bash
# Standard (5 Voll + 2 Stub-Agents):
python test_pipeline.py

# Mit Web-Research (braucht web_search-Zugang im Anthropic-Tier):
python test_pipeline.py --with-research
```

## Bekannte Limits / TODO

- **PPTX/Excel/PDF-Output-Generator** — noch Stub (kommt in P4 Multi-Agent / P5 Polish).
- **Background-Tasks** — aktuell `BackgroundTasks` (FastAPI). Production: Celery/RQ + Redis.
- **ElevenLabs-Webhook für Transcript** — momentan setzt das Frontend transcript manuell beim "finish". Production: ElevenLabs Webhook → Backend.
- **Berater-Pfad im Onboarding** — UI gestubbt, Logik kommt in P3 (CRM-Integration).
- **Resend-Email für Magic-Links** — aktuell Supabase eigener Mailer.

## Feature: 3D-System-Galaxie

Interaktive Three.js-Visualisierung des kompletten Agent-Ökosystems hinter dem Studio —
Claude Code als Kern, umkreist von Skills, Plugins, MCP-Servern, der n8n-Automation
(48 Workflows als Satelliten-Schwarm) und der Deploy-Infrastruktur. Galaxie-Cluster-Layout,
Glas-Bubble-Knoten mit Firmen-Icons, Klick-Panel mit allen Verbindungen.

- **Datei:** `web/public/system-map/index.html` (self-contained, kein Build nötig)
- **Route (Next.js):** erreichbar unter `/system-map/` sobald das Frontend deployed ist
- **Bedienung:** Ziehen = Drehen · `+`/`-`/`0` = Zoom/Fit · Klick = Details · Legende = Filter
- **Daten:** inline im HTML (NODES/EDGES/WORKFLOWS) — bei Systemänderungen dort aktualisieren

## Architektur-Refs

- Notion App-Architektur 2.1: https://www.notion.so/359066d22c8e8160a9e4c497bdcb733c
- Lokales Sync-File: `../AI-ADOPTION-STUDIO.md`

## Credentials

Alle API-Keys liegen zentral in `~/.claude/memory/reference_credentials.md`. NICHT in dieses Repo committen.

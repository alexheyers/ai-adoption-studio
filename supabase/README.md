# Supabase-Schema · AI-Adoption-Studio

## Setup

```bash
# Supabase CLI installieren (einmalig)
brew install supabase/tap/supabase

# Im Projekt-Root linken (einmalig)
cd ai-adoption-studio
supabase link --project-ref <DEINE-PROJECT-REF>

# Migrations applyen
supabase db push
```

Alternativ via Dashboard → SQL Editor: `migrations/20260509_001_init.sql` und dann `20260509_002_storage.sql` direkt einfügen und ausführen.

## Tabellen

| Tabelle | Zweck |
|---|---|
| `profiles` | 1:1 mit `auth.users`, erweiterte User-Daten |
| `companies` | Firmen-Stammdaten + Pain Points + KPIs |
| `documents` | Datei-Metadaten (Files in Storage) |
| `web_research` | Web-Research-Agent-Output |
| `voice_sessions` | ElevenLabs-Voice-Interview + Transcript |
| `runs` | Multi-Agent-Pipeline-Run pro Briefing |
| `run_results` | Outputs der 8 Agents pro Run |

## RLS-Modell

- Alle Tabellen RLS-aktiv.
- Frontend (anon-Key + JWT): User sieht nur eigene Daten via `auth.uid()`.
- Backend (service_role-Key): umgeht RLS für Multi-Agent-Runs, Storage-Writes etc.

## Storage

Bucket `documents` (privat, max 50 MB, PDF/Excel/CSV/DOCX/TXT).
Pfad-Konvention: `{company_id}/{document_id}/{filename}`.

## Erwartete Agent-Namen in `run_results.agent_name`

```
process_auditor       → ProcessAuditOutput
use_case_generator    → UseCaseOutput
tool_recommender      → ToolRecommendationOutput
roi_calculator        → ROIOutput
compliance_checker    → ComplianceOutput
roadmap_generator     → RoadmapOutput
web_research          → WebResearchOutput  (Hinweis: auch eigene Tabelle, hier optional gespiegelt)
full_report           → FullReport (Reporter-Aggregat)
```

Unique-Constraint `(run_id, agent_name)` → jeder Agent läuft pro Run genau einmal.

## Nächste Schritte (Backend-seitig)

1. `.env` füllen mit `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
2. `agents/_supabase.py` ist bereits kompatibel mit diesem Schema.
3. FastAPI-Endpoints (siehe `api/`) nutzen JWT-Verify gegen Supabase Auth.

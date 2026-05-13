-- AI-Adoption-Studio · Initial Schema (Architektur 2.1)
-- Datum: 2026-05-09
--
-- Tabellen:
--   profiles         — pro auth.users-Eintrag, erweiterte Profildaten
--   companies        — Firmen-Stammdaten (1 Profile : N Companies)
--   documents        — hochgeladene Dateien-Metadaten (Storage-Bucket: "documents")
--   web_research     — Output des Web-Research-Agents pro Company
--   voice_sessions   — ElevenLabs Voice-Interview-Sessions + Transcripts
--   runs             — ein kompletter Multi-Agent-Run pro Briefing
--   run_results      — Agent-Outputs (8 Agents je Run, generisch via JSONB)
--
-- RLS-Strategie: alle Tabellen RLS-an. Owner-Read+Write via auth.uid().
-- Service-Role (Backend) umgeht RLS via SUPABASE_SERVICE_ROLE_KEY.

-- ────────────────────────────────────────────────────────────
-- profiles (1:1 mit auth.users)
-- ────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "profiles_owner_select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_owner_insert" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-Insert Profile beim Signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- companies
-- ────────────────────────────────────────────────────────────
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  industry text default 'Hospitality' not null,
  sub_segment text,
  size_class text check (size_class in ('S', 'M', 'L', 'XL')),
  employees int,
  locations int default 1,
  annual_revenue_eur bigint,
  region text,
  website text,
  pain_points jsonb default '[]'::jsonb,
  current_tools jsonb default '[]'::jsonb,
  kpis jsonb default '{}'::jsonb,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index companies_owner_idx on public.companies(owner_id);

alter table public.companies enable row level security;

create policy "companies_owner_all" on public.companies
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ────────────────────────────────────────────────────────────
-- documents (Metadaten; Files in Supabase Storage)
-- ────────────────────────────────────────────────────────────
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  uploader_id uuid not null references public.profiles(id) on delete restrict,
  storage_path text not null,                        -- Pfad im "documents"-Bucket
  filename text not null,
  mime_type text,
  file_size_bytes bigint,
  doc_type text check (doc_type in ('gv_report', 'personal', 'kpi', 'process', 'other')),
  parsed_text text,                                   -- Klartext nach Parser
  extracted_kpis jsonb default '{}'::jsonb,
  parser_status text default 'pending' check (parser_status in ('pending', 'parsed', 'failed')),
  parser_error text,
  created_at timestamptz default now() not null
);

create index documents_company_idx on public.documents(company_id);

alter table public.documents enable row level security;

create policy "documents_owner_all" on public.documents
  for all using (
    auth.uid() = uploader_id
    or auth.uid() in (select owner_id from public.companies where id = documents.company_id)
  ) with check (
    auth.uid() in (select owner_id from public.companies where id = documents.company_id)
  );

-- ────────────────────────────────────────────────────────────
-- web_research (Web-Research-Agent Output)
-- ────────────────────────────────────────────────────────────
create table public.web_research (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  company_findings jsonb default '{}'::jsonb,         -- Website, Reviews, LinkedIn etc
  region_benchmarks jsonb default '{}'::jsonb,        -- Markt-Daten Region/Stadt
  sources jsonb default '[]'::jsonb,                  -- [{url, title, snippet}]
  raw_search_log jsonb default '[]'::jsonb,           -- Audit-Trail
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'failed')),
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

create index web_research_company_idx on public.web_research(company_id);

alter table public.web_research enable row level security;

create policy "web_research_owner_select" on public.web_research
  for select using (
    auth.uid() in (select owner_id from public.companies where id = web_research.company_id)
  );

-- ────────────────────────────────────────────────────────────
-- voice_sessions (ElevenLabs Conversational AI Runs)
-- ────────────────────────────────────────────────────────────
create table public.voice_sessions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete restrict,
  elevenlabs_agent_id text,                           -- Ada Agent
  elevenlabs_conversation_id text,                    -- ElevenLabs Conversation ID
  pre_brief jsonb default '{}'::jsonb,                -- Was Ada vorab wusste
  selected_questions jsonb default '[]'::jsonb,       -- Subset aus Master-Pool
  transcript text,                                    -- Vollständiger Verlauf
  transcript_json jsonb,                              -- Strukturiert (turns[])
  duration_seconds int,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'failed')),
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

create index voice_sessions_company_idx on public.voice_sessions(company_id);

alter table public.voice_sessions enable row level security;

create policy "voice_sessions_owner_select" on public.voice_sessions
  for select using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- runs (Multi-Agent-Pipeline-Run)
-- ────────────────────────────────────────────────────────────
create table public.runs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  voice_session_id uuid references public.voice_sessions(id) on delete set null,
  web_research_id uuid references public.web_research(id) on delete set null,
  briefing jsonb not null,                            -- Vollständiges Briefing-Snapshot
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'failed')),
  current_step text,                                  -- z.B. "use_case_generator"
  error text,
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

create index runs_company_idx on public.runs(company_id);

alter table public.runs enable row level security;

create policy "runs_owner_select" on public.runs
  for select using (
    auth.uid() in (select owner_id from public.companies where id = runs.company_id)
  );

-- ────────────────────────────────────────────────────────────
-- run_results (8 Agent-Outputs pro Run, generisch via JSONB)
-- Erwartete agent_name-Werte:
--   process_auditor, use_case_generator, tool_recommender, roi_calculator,
--   compliance_checker, roadmap_generator, web_research, full_report (Reporter-Output)
-- ────────────────────────────────────────────────────────────
create table public.run_results (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.runs(id) on delete cascade,
  agent_name text not null,
  output jsonb not null,
  duration_ms int,
  tokens_input int,
  tokens_output int,
  created_at timestamptz default now() not null,
  unique (run_id, agent_name)
);

create index run_results_run_idx on public.run_results(run_id);

alter table public.run_results enable row level security;

create policy "run_results_owner_select" on public.run_results
  for select using (
    auth.uid() in (
      select c.owner_id
      from public.runs r
      join public.companies c on c.id = r.company_id
      where r.id = run_results.run_id
    )
  );

-- ────────────────────────────────────────────────────────────
-- updated_at-Trigger (für profiles + companies)
-- ────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger companies_updated_at before update on public.companies
  for each row execute function public.set_updated_at();

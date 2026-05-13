-- AI-Adoption-Studio · Explizite GRANTs für Data API (PostgREST / supabase-js)
-- Hintergrund: Ab 30.05.2026 müssen neue Supabase-Projekte GRANTs explizit setzen.
-- Ab 30.10.2026 gilt das auch für bestehende Projekte.
--
-- Strategie:
--   anon       → kein Zugriff (Login erforderlich für alles)
--   authenticated → READ/WRITE je nach Tabelle (RLS schränkt Zeilen weiter ein)
--   service_role  → umgeht RLS ohnehin via SUPABASE_SERVICE_ROLE_KEY (kein GRANT nötig)

-- ────────────────────────────────────────────────────────────
-- profiles (User liest + updatet sein eigenes Profil)
-- ────────────────────────────────────────────────────────────
grant select, insert, update
  on public.profiles
  to authenticated;

-- ────────────────────────────────────────────────────────────
-- companies (User verwaltet seine eigenen Firmen)
-- ────────────────────────────────────────────────────────────
grant select, insert, update, delete
  on public.companies
  to authenticated;

-- ────────────────────────────────────────────────────────────
-- documents (User lädt hoch + liest seine Dokumente)
-- ────────────────────────────────────────────────────────────
grant select, insert, update, delete
  on public.documents
  to authenticated;

-- ────────────────────────────────────────────────────────────
-- web_research (User liest Ergebnisse; Backend schreibt via service_role)
-- ────────────────────────────────────────────────────────────
grant select
  on public.web_research
  to authenticated;

-- ────────────────────────────────────────────────────────────
-- voice_sessions (User liest; Backend schreibt via service_role)
-- ────────────────────────────────────────────────────────────
grant select
  on public.voice_sessions
  to authenticated;

-- ────────────────────────────────────────────────────────────
-- runs (User liest; Backend schreibt + updated via service_role)
-- ────────────────────────────────────────────────────────────
grant select
  on public.runs
  to authenticated;

-- ────────────────────────────────────────────────────────────
-- run_results (User liest Agent-Outputs; Backend schreibt via service_role)
-- ────────────────────────────────────────────────────────────
grant select
  on public.run_results
  to authenticated;

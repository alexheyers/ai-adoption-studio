# Production-Deployment-Checkliste · AI-Adoption-Studio

**Ziel:** Sicherer, zuverlässiger Go-Live auf **myflowmotion.cloud** (Hostinger VPS srv1405308) mit Frontend-Vercel, Backend-Docker, Supabase-Cloud, ElevenLabs-Voice.

**Gültig ab:** 2026-05-13 | **Version:** 1.0 | **Audience:** DevOps, Deployment-Lead, Ops-Team

---

## Phase 1: Pre-Deployment (48h vor Launch)

### 1.1 Umgebungsvariablen & Secrets

#### Backend (`.env`)
- [ ] `ANTHROPIC_API_KEY` — Produktions-Key gesetzt (nicht Dev/Test-Key)
  - **Verifikation:** `echo $ANTHROPIC_API_KEY | head -c 10` sollte `sk-ant-...` zeigen
- [ ] `OPENAI_API_KEY` — Wenn Doc-Parsing via GPT-4V aktiv (sonst optional)
- [ ] `ELEVENLABS_API_KEY` — Produktions-API-Key
  - **Verifikation:** Curl-Test: `curl -H "xi-api-key: $ELEVENLABS_API_KEY" https://api.elevenlabs.io/v1/user | jq .`
- [ ] `ELEVENLABS_AGENT_ID` — Production-Agent-ID (not empty)
  - **Verifikation:** Sollte mit `agent_` anfangen (z.B. `agent_2301krbfvzawfydvv4nh889g9337`)
- [ ] `ELEVENLABS_VOICE_ID` — Optional (Default: warm female German voice)
- [ ] `SUPABASE_URL` — Production-Project-URL
  - **Verifikation:** `echo $SUPABASE_URL | grep '.supabase.co'`
- [ ] `SUPABASE_ANON_KEY` — Correct anon public key (not service_role)
  - **Verifikation:** Curl-Test: `curl -H "apikey: $SUPABASE_ANON_KEY" https://$SUPABASE_URL/rest/v1/profiles -s | head -c 50`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — Backend-only, restricted access (never expose to browser)
  - **Verifikation:** Should differ from ANON_KEY
- [ ] `SUPABASE_JWT_SECRET` — From Project Settings → API → JWT Settings
  - **Verifikation:** `echo $SUPABASE_JWT_SECRET | wc -c` sollte > 30 sein
- [ ] `FRONTEND_URL` — Production-Domain für CORS
  - **Beispiel:** `https://myflowmotion.cloud`
  - **Verifikation:** `echo $FRONTEND_URL | grep -E '^https://'`
- [ ] **.env not committed to repo**
  - **Verifikation:** `git log --full-history -p -- .env | head -1` sollte "commit deleted file" sein (falls je commitet)
  - **Verifikation:** `grep -i "ANTHROPIC_API_KEY\|ELEVENLABS_API_KEY" .env && echo "FAIL: Secrets in env file!" || echo "PASS"`

#### Frontend (`.env.web`)
- [ ] `NEXT_PUBLIC_API_URL` — Production-API-Domain
  - **Beispiel:** `https://api.myflowmotion.cloud`
  - **Verifikation:** `curl -s $NEXT_PUBLIC_API_URL/health | jq .status`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — Production-Supabase-URL
  - **Verifikation:** Same as backend SUPABASE_URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Same anon key as backend
  - **Verifikation:** `echo $NEXT_PUBLIC_SUPABASE_ANON_KEY | wc -c` sollte > 100 sein
- [ ] `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` — Production-Agent-ID (visible to browser is OK)
  - **Verifikation:** Should match backend value

#### Secrets in .gitignore
- [ ] `.env` is listed in `.gitignore`
  - **Verifikation:** `cat .gitignore | grep '\.env'`
- [ ] No credentials file is tracked (grep-check)
  - **Verifikation:** `git ls-files | grep -iE '(\.env|credentials|secret|api.?key)' | wc -l` sollte 0 sein
- [ ] No accidental commits of .env.local / .env.production
  - **Verifikation:** `git log --name-only --pretty='' | grep -iE '^\.env' | wc -l` sollte 0 sein

---

### 1.2 Supabase-Setup (Cloud)

#### Schema & Migrations
- [ ] All migrations applied to production project
  - **Verifikation:** Via Supabase CLI:
    ```bash
    supabase link --project-ref <PROD-REF>
    supabase status
    # Output sollte alle 4 Migrationen als "applied" zeigen
    ```
  - Migrations applyen (falls nicht yet):
    ```bash
    supabase db push --dry-run  # Erst simulieren
    supabase db push            # Dann applyen
    ```
  - **Migrations zu applyen (in Reihenfolge):**
    1. `supabase/migrations/20260509_001_init.sql` — Basis-Tabellen (profiles, companies, documents, web_research, voice_sessions, runs, run_results)
    2. `supabase/migrations/20260509_002_storage.sql` — Storage-Bucket "documents" + RLS-Policies
    3. `supabase/migrations/20260511_003_deliverables_bucket.sql` — Output-Bucket für PPTX/Excel/PDF
    4. `supabase/migrations/20260513_004_explicit_grants.sql` — Zusätzliche Grants falls nötig

#### RLS-Policies (anon vs. service_role)
- [ ] **profiles** — auth.uid() == id (owner-only read/write)
  - **Verifikation:** SQL im Dashboard:
    ```sql
    select * from public.profiles where id != auth.uid();  -- sollte 0 Reihen
    ```
  - **Verifikation:** Nur Supabase-Service-Role (Backend) darf alle Profile abrufen
    ```sql
    -- Als anon_key: sollte fehlschlagen oder leer sein
    select * from public.profiles limit 1;
    ```

- [ ] **companies** — auth.uid() == owner_id (owner-all)
  - **Verifikation:** `select count(*) from public.companies where owner_id = auth.uid();`
  
- [ ] **documents** — owner OR company-owner
  - **Verifikation:** Policy erlaubt Uploader + Company-Owner Read/Write
  
- [ ] **web_research** — company-owner (select only)
  - **Verifikation:** No insert/update/delete für anon
  
- [ ] **voice_sessions** — user_id == auth.uid()
  - **Verifikation:** User kann nur eigene Sessions lesen
  
- [ ] **runs** — company-owner (select only)
  - **Verifikation:** Keine direct-user-insert (nur Backend via Service-Role)
  
- [ ] **run_results** — no anon access (only via runs RLS)
  - **Verifikation:** run_results sollte keine anon-Policies haben

#### Storage-Buckets
- [ ] **documents** Bucket exists + private
  - **Verifikation:** Supabase Dashboard → Storage → documents sollte "Private" zeigen
  - **File-Size-Limit:** 50 MB pro Datei
  - **Verifikation:** `select file_size_limit from storage.buckets where name = 'documents';`
  - **Allowed MIME-Types:** PDF, Excel, CSV, DOCX, TXT
  - **Verifikation:** `select allowed_mime_types from storage.buckets where name = 'documents';`

- [ ] **deliverables** Bucket exists + private
  - **Verifikation:** Storage → deliverables sollte "Private" zeigen
  - **File-Size-Limit:** 20 MB pro Output
  - **Allowed MIME-Types:** XLSX, PPTX, PDF
  - **Verifikation:** `select allowed_mime_types from storage.buckets where name = 'deliverables';`

#### Authentication
- [ ] JWT Secret set in Project Settings
  - **Verifikation:** `echo $SUPABASE_JWT_SECRET | openssl base64 -d | xxd | head -3`
- [ ] Email Provider configured (Supabase Auth)
  - **Verifikation:** Supabase Dashboard → Authentication → Email → Status sollte "Enabled" sein
  - Falls custom SMTP: SMTP-Credentials geprüft
- [ ] Redirect URLs configured
  - **Verifikation:** Auth → URL Configuration sollte enthalten:
    - `https://myflowmotion.cloud/**`
    - `https://localhost:3000/**` (optional, für lokales Testing)

---

## Phase 2: DNS & TLS (Domain-Level)

### 2.1 Domain-Konfiguration
- [ ] **Primary Domain: myflowmotion.cloud**
  - [ ] DNS-A-Record zeigt auf VPS-IP (srv1405308)
    - **Verifikation:** `nslookup myflowmotion.cloud`
    - **Ergebnis sollte sein:** IP von Hostinger VPS (z.B. 86.179.xxx.xxx)
  - [ ] CNAME `www` → `myflowmotion.cloud`
    - **Verifikation:** `nslookup www.myflowmotion.cloud`

- [ ] **API-Subdomain: api.myflowmotion.cloud**
  - [ ] DNS-A-Record zeigt auf VPS-IP (same as primary)
    - **Verifikation:** `nslookup api.myflowmotion.cloud`

- [ ] **Nameserver** sind korrekt auf Hostinger
  - **Verifikation:** `whois myflowmotion.cloud | grep -i nameserver`

### 2.2 TLS-Zertifikat (Let's Encrypt via Certbot)
- [ ] Certbot installed on VPS
  - **Verifikation:** `certbot --version`
  
- [ ] Certificate issued for both domains
  - **Verifikation:** `certbot certificates | grep myflowmotion.cloud`
  - **Ergebnis sollte zeigen:**
    ```
    Domains: myflowmotion.cloud, www.myflowmotion.cloud, api.myflowmotion.cloud
    Expiry Date: ...
    Certificate Path: /etc/letsencrypt/live/myflowmotion.cloud/fullchain.pem
    ```
  
- [ ] Nginx SSL-Config updated (http → https redirect)
  - [ ] Datei `/etc/nginx/sites-available/myflowmotion` sollte enthalten:
    ```nginx
    server {
        server_name myflowmotion.cloud www.myflowmotion.cloud;
        listen 443 ssl http2;
        ssl_certificate /etc/letsencrypt/live/myflowmotion.cloud/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/myflowmotion.cloud/privkey.pem;
        # Rest der Konfiguration...
    }
    ```
  - [ ] Datei `/etc/nginx/sites-available/api` sollte enthalten:
    ```nginx
    server {
        server_name api.myflowmotion.cloud;
        listen 443 ssl http2;
        ssl_certificate /etc/letsencrypt/live/myflowmotion.cloud/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/myflowmotion.cloud/privkey.pem;
        # Rest der Konfiguration...
    }
    ```
  - **Verifikation:** `sudo nginx -t` sollte "successful" zeigen

- [ ] HTTP (Port 80) redirects to HTTPS (Port 443)
  - **Verifikation:** `curl -I http://myflowmotion.cloud | grep -i location`
  - **Ergebnis:** Sollte `Location: https://myflowmotion.cloud...` zeigen
  
- [ ] SSL-Test bestanden
  - **Verifikation:** https://www.ssllabs.com/ssltest/analyze.html?d=myflowmotion.cloud
  - **Mindest-Rating:** A-

### 2.3 CORS-Origins
- [ ] Backend CORS-Middleware konfiguriert
  - **Verifikation:** `api/main.py` contains:
    ```python
    allowed_origins = [
        "https://myflowmotion.cloud",
        "https://www.myflowmotion.cloud",
    ]
    ```
  - **Verifikation:** `curl -X OPTIONS https://api.myflowmotion.cloud/ -H "Origin: https://myflowmotion.cloud" | grep -i access-control`

---

## Phase 3: VPS-Infrastruktur (srv1405308 · myflowmotion.cloud)

### 3.1 Docker & Container-Setup
- [ ] Docker & Docker Compose installed
  - **Verifikation:** `docker --version && docker-compose --version`
  
- [ ] `docker-compose.yml` copied to VPS
  - **Verifikation:** `cat /opt/ai-adoption-studio/docker-compose.yml | grep -E "api:|web:" | head -5`
  
- [ ] `.env` file on VPS (NOT in git)
  - **Path:** `/opt/ai-adoption-studio/.env`
  - **Verifikation:** `ls -la /opt/ai-adoption-studio/.env` (should exist, mode 600)
  - **Content Check:** No secrets visible in logs
  - **Verifikation:** `docker inspect studio-api | jq '.[] | .Config.Env' | grep -c ANTHROPIC` sollte 1 sein

- [ ] `.env.web` file on VPS
  - **Path:** `/opt/ai-adoption-studio/.env.web`
  - **Verifikation:** `ls -la /opt/ai-adoption-studio/.env.web`

- [ ] Images built & available locally
  - **Verifikation:** 
    ```bash
    docker images | grep -E 'studio-api|studio-web'
    # oder:
    docker-compose images
    ```

### 3.2 Container-Lifecycle (Restart-Policy & Healthcheck)
- [ ] Restart-Policy: `unless-stopped`
  - **Verifikation:** `docker inspect studio-api | jq '.[] | .HostConfig.RestartPolicy'`
  - **Ergebnis:** `{"Name":"unless-stopped","MaximumRetryCount":0}`

- [ ] API Healthcheck configured
  - **Verifikation:** `docker inspect studio-api | jq '.[] | .State.Health'`
  - **Ergebnis:** Status sollte "healthy" sein
  - **Endpoint:** `curl -s http://localhost:8010/health | jq .status` sollte `"ok"` zeigen

- [ ] Web-Container startet NACH API (depends_on)
  - **Verifikation:** `docker-compose.yml` enthält `depends_on: [api]`

- [ ] Containers starten automatisch nach VPS-Reboot
  - **Verifikation:** Reboot durchführen:
    ```bash
    sudo reboot
    # Nach ~2 Min:
    docker ps | grep -E 'studio-api|studio-web'
    # Beide sollten "Up"-Status zeigen
    ```

### 3.3 Port-Mapping & Reverse-Proxy (Nginx)
- [ ] API Container läuft auf localhost:8010 (nur lokal, nicht exposed)
  - **docker-compose.yml:** `ports: ["127.0.0.1:8010:8000"]`
  - **Verifikation:** `docker port studio-api | grep 8010`
  - **Verifikation:** `curl -s http://localhost:8010/health` sollte funktionieren
  - **Verifikation:** `curl -s http://0.0.0.0:8010/health` sollte NICHT funktionieren

- [ ] Web Container läuft auf localhost:3010
  - **docker-compose.yml:** `ports: ["127.0.0.1:3010:3000"]`
  - **Verifikation:** `docker port studio-web | grep 3010`

- [ ] Nginx reverse-proxy: myflowmotion.cloud → web:3010
  - **Config-Datei:** `/etc/nginx/sites-available/myflowmotion`
  - **Verifikation:** `grep -A5 'location /' /etc/nginx/sites-available/myflowmotion | grep proxy_pass`
  - **Ergebnis:** `proxy_pass http://127.0.0.1:3010;`

- [ ] Nginx reverse-proxy: api.myflowmotion.cloud → api:8010
  - **Config-Datei:** `/etc/nginx/sites-available/api`
  - **Verifikation:** `grep -A5 'location /' /etc/nginx/sites-available/api | grep proxy_pass`
  - **Ergebnis:** `proxy_pass http://127.0.0.1:8010;`

- [ ] Nginx enabled & running
  - **Verifikation:** `sudo systemctl status nginx | grep Active`
  - **Ergebnis:** `Active: active (running)`
  
- [ ] Nginx config syntax is valid
  - **Verifikation:** `sudo nginx -t`
  - **Ergebnis:** `nginx: configuration file test is successful`

---

## Phase 4: Application-Layer Checks

### 4.1 Backend (FastAPI) Verification
- [ ] `/health` endpoint responds with 200 OK
  - **Verifikation:** `curl -I https://api.myflowmotion.cloud/health`
  - **Ergebnis:** HTTP/2 200 (or HTTP/1.1 200)
  - **Verifikation:** `curl -s https://api.myflowmotion.cloud/health | jq .`
  - **Ergebnis:** `{"status": "ok"}`

- [ ] `/docs` OpenAPI-Dokumentation erreichbar
  - **Verifikation:** `curl -s https://api.myflowmotion.cloud/docs | grep -i openapi | head -1`

- [ ] `/` Root-Endpoint antwortet
  - **Verifikation:** `curl -s https://api.myflowmotion.cloud/ | jq '.version'`
  - **Ergebnis:** `"0.1.0"` or similar

- [ ] Supabase-Verbindung funktioniert
  - **Verifikation:** Backend-Logs überprüfen auf Connection-Fehler:
    ```bash
    docker logs studio-api 2>&1 | tail -50 | grep -iE 'error|traceback' | head -5
    ```
  - **Ergebnis:** Sollte keine Supabase-Connection-Fehler zeigen

- [ ] Environment-Variablen geladen
  - **Verifikation:** `docker exec studio-api env | grep ANTHROPIC_API_KEY | wc -c` sollte > 10 sein
  - **Verifikation:** `docker exec studio-api env | grep SUPABASE_URL | grep supabase.co`

### 4.2 Frontend (Next.js) Verification
- [ ] Landing-Page erreichbar
  - **Verifikation:** `curl -s https://myflowmotion.cloud/ | grep -i '<title>' | head -1`
  - **Ergebnis:** Sollte HTML-Title enthalten (z.B. "AI-Adoption-Studio")

- [ ] Static assets laden
  - **Verifikation:** `curl -I https://myflowmotion.cloud/_next/static/chunks/main.js`
  - **Ergebnis:** HTTP 200

- [ ] NEXT_PUBLIC_* vars in Browser-Bundle
  - **Verifikation:** In Browser-DevTools oder:
    ```bash
    curl -s https://myflowmotion.cloud/_next/static/ | head -100 | grep -i 'SUPABASE_URL'
    # Oder besser: Öffne https://myflowmotion.cloud im Browser → DevTools → Network → doc → Response
    # Sollte <script> tags enthalten mit Variablen
    ```

- [ ] Supabase Client funktioniert (Auth-Check)
  - **Verifikation:** Öffne https://myflowmotion.cloud → Go to /login
  - **Ergebnis:** Magic-Link-Form sollte sichtbar sein, keine CORS-Fehler in Console

### 4.3 Multi-Agent-Pipeline (Smoke-Test)
- [ ] Smoke-Test lokal erfolgreich
  - **Verifikation:** 
    ```bash
    cd /path/to/ai-adoption-studio
    python test_pipeline.py
    # Sollte in ~60 Sek durchlaufen, mit Output: mock_data/demo_hotel_report.json
    ```
  - **Ergebnis:** "Completed pipeline successfully" in stdout

- [ ] Backend kann Test-Run starten
  - **Verifikation:** 
    ```bash
    curl -X POST https://api.myflowmotion.cloud/run \
      -H "Content-Type: application/json" \
      -d '{
        "company_id": "test-uuid",
        "briefing": {"company": {"name": "Test Co"}},
        "interview_type": "automated"
      }' \
      -H "Authorization: Bearer $SERVICE_ROLE_KEY"  # Falls Auth erzwungen
    ```
  - **Ergebnis:** 202 Accepted oder 200 OK (je nach API-Spec)

- [ ] Error-Handling aktiv
  - **Verifikation:** Sende invalid JSON:
    ```bash
    curl -X POST https://api.myflowmotion.cloud/run \
      -H "Content-Type: application/json" \
      -d '{invalid json}' 2>&1
    ```
  - **Ergebnis:** 400 Bad Request, nicht 500

### 4.4 Logging & Observability
- [ ] Backend-Logs ausgeben zu stdout (für docker logs)
  - **Verifikation:** `docker logs studio-api 2>&1 | tail -20`
  - **Ergebnis:** Sollte startup-messages, requests zeigen (nicht nur errors)

- [ ] No sensitive data in logs
  - **Verifikation:** `docker logs studio-api 2>&1 | grep -iE '(ANTHROPIC|ELEVENLABS|SUPABASE)_.*=' | wc -l` sollte 0 sein
  - **Verifikation:** Keine API-Keys in Tracebacks

---

## Phase 5: Supabase Production-Readiness

### 5.1 Backup & Recovery
- [ ] Automated backups enabled in Supabase
  - **Verifikation:** Supabase Dashboard → Project Settings → Backups
  - **Ergebnis:** Sollte "Daily" oder höher zeigen

- [ ] Backup-Retention: mindestens 7 Tage
  - **Verifikation:** Dashboard → Backups → Retention

- [ ] Point-in-Time Recovery (PITR) aktiv (falls Premium)
  - **Verifikation:** Dashboard → Backups → PITR Status

### 5.2 Performance & Limits
- [ ] Database-Connections limit überprüft
  - **Verifikation:** Dashboard → Project Settings → Database → Connection Pool
  - **Ergebnis:** Sollte genug Pool-Slots für API haben (z.B. 10-20 gleichzeitig)

- [ ] Storage-Usage monitored
  - **Verifikation:** Dashboard → Storage → Usage
  - **Ergebnis:** Sollte < 50% des Plans sein

- [ ] Row-Level Security enabled (nicht deaktiviert!)
  - **Verifikation:** Dashboard → SQL Editor:
    ```sql
    select schemaname, tablename, rowsecurity 
    from pg_tables 
    where tablename in ('profiles', 'companies', 'documents', 'runs', 'run_results', 'voice_sessions', 'web_research')
    order by tablename;
    ```
  - **Ergebnis:** Alle sollten `rowsecurity = ON` zeigen

### 5.3 Rate-Limiting & Auth
- [ ] Brute-force protection enabled
  - **Verifikation:** Dashboard → Authentication → Security
  
- [ ] JWT Expiry reasonable (z.B. 1 hour)
  - **Verifikation:** Dashboard → Project Settings → API → JWT Settings
  - **Ergebnis:** Should show JWT Expiry time

---

## Phase 6: ElevenLabs Voice Integration

### 6.1 Agent Setup
- [ ] Agent exists in ElevenLabs Dashboard
  - **Verifikation:** https://elevenlabs.io/app/agents → find agent_id
  - **Ergebnis:** Agent sollte "Ready" Status zeigen

- [ ] Agent-ID korrekt in .env
  - **Verifikation:** `echo $ELEVENLABS_AGENT_ID`
  - **Ergebnis:** Sollte mit `agent_` anfangen

- [ ] Agent kann mit API angesprochen werden
  - **Verifikation:** 
    ```bash
    curl -X GET https://api.elevenlabs.io/v1/agents \
      -H "xi-api-key: $ELEVENLABS_API_KEY" | jq '.agents[] | select(.id == "'$ELEVENLABS_AGENT_ID'")'
    ```
  - **Ergebnis:** Agent-Details sollten angezeigt werden

### 6.2 Webhook-Konfiguration (optional, für Transcript)
- [ ] Webhook-Endpoint konfiguriert (falls Backend Transcript empfangen soll)
  - **Verifikation:** ElevenLabs Dashboard → Agent → Webhook
  - **URL:** `https://api.myflowmotion.cloud/webhooks/elevenlabs`
  - **Verifikation:** `curl https://api.myflowmotion.cloud/webhooks/elevenlabs -X POST -H 'Content-Type: application/json' -d '{"test": true}'`
  - **Ergebnis:** 200 OK (oder spezifische Error-Response)

---

## Phase 7: Security & Compliance Checks

### 7.1 Secrets Management
- [ ] No .env file in git history
  - **Verifikation:** `git log --all --full-history -- .env | head -5`
  - **Ergebnis:** Sollte "commit deleted" sein (oder gar nicht existieren)

- [ ] No API-Keys in source-code
  - **Verifikation:** 
    ```bash
    grep -r "sk-ant-\|sk-proj-\|sk_" --include="*.py" --include="*.js" --include="*.ts" . \
      | grep -v node_modules | grep -v .venv | wc -l
    ```
  - **Ergebnis:** 0 Matches

- [ ] Secrets-Scanning enabled (GitHub/GitLab)
  - **Verifikation:** GitHub Settings → Security & Analysis → Secret scanning
  - **Ergebnis:** Sollte enabled sein

- [ ] API-Keys rotiert mindestens alle 90 Tage
  - **Verifikation:** Dokumentation: Letzte Rotation-Datum
  - **Ergebnis:** < 90 Tage

### 7.2 Database Security
- [ ] Supabase Database-Password strong (nicht default)
  - **Verifikation:** Dashboard → Project Settings → Database → Password
  - **Ergebnis:** Nur Admins können sehen

- [ ] Role-Based Access Control (RBAC) configured
  - **Verifikation:** Supabase → Users → Roles
  - **Rollen erwartet:** authenticated, anon, service_role

- [ ] Service-Role-Key wird NUR backend-seitig benutzt
  - **Verifikation:** 
    ```bash
    grep -r "SUPABASE_SERVICE_ROLE_KEY" --include="*.js" --include="*.ts" web/
    # Sollte NICHTS finden
    grep -r "SUPABASE_SERVICE_ROLE_KEY" --include="*.py" api/
    # Sollte nur in api/*.py sein
    ```

### 7.3 HTTPS & Encryption
- [ ] All traffic HTTPS (no HTTP unencrypted)
  - **Verifikation:** `curl -I http://myflowmotion.cloud 2>&1 | grep -i location`
  - **Ergebnis:** Sollte 301/302 zu https:// sein

- [ ] TLS 1.2+ (TLS 1.0/1.1 deaktiviert)
  - **Verifikation:** `echo | openssl s_client -connect myflowmotion.cloud:443 | grep Protocol`
  - **Ergebnis:** `TLSv1.3` oder mindestens `TLSv1.2`

- [ ] Certificate valid & not expired
  - **Verifikation:** `openssl s_client -connect myflowmotion.cloud:443 -dates 2>/dev/null | grep -E notBefore|notAfter`
  - **Ergebnis:** notBefore und notAfter im korrekten Bereich

---

## Phase 8: Rollback-Plan & Disaster Recovery

### 8.1 Rollback-Prozess dokumentiert
- [ ] Previous Docker-Images tagged & available
  - **Verifikation:** `docker images | grep -E 'studio-api|studio-web' | head -10`
  - **Dokumentation:** Jeder Prod-Deployment sollte image-Tag haben (z.B. v0.1.0)

- [ ] Rollback-Skript vorhanden
  - **Path:** `/opt/ai-adoption-studio/rollback.sh`
  - **Inhalt:** 
    ```bash
    #!/bin/bash
    set -e
    cd /opt/ai-adoption-studio
    docker-compose down
    docker-compose up -d   # Mit vorigem Image-Tag in compose-override
    docker-compose logs -f
    ```

- [ ] Rollback getestet (mindestens simuliert)
  - **Verifikation:** Dokumentation: "Rollback tested on [DATE]"

### 8.2 Backup-Restore-Prozess
- [ ] Supabase Backup kann wiederhergestellt werden
  - **Verifikation:** Backup-Dokumentation vorhanden
  - **Prozess:** Supabase Dashboard → Backups → [Backup] → Restore
  - **ETA:** < 1 Stunde Downtime

- [ ] Datenbank-Restore getestet im Staging
  - **Verifikation:** Staging-Project existiert, Restore durchgespielt

### 8.3 Incident Response
- [ ] On-Call Schedule dokumentiert
  - **Ergebnis:** Wer ist Ansprechperson bei Incidents

- [ ] Monitoring & Alerting aktiv
  - **Verifikation:** Supabase Dashboard → Monitoring
  - **Alert-Channels:** Email, Slack, etc.

---

## Phase 9: Monitoring & Post-Launch

### 9.1 Uptime & Latency Monitoring
- [ ] Monitoring-Tool konfiguriert (z.B. Uptime Robot, Betterstack)
  - **Endpoints zu monitoren:**
    - `https://myflowmotion.cloud/` (HTTP 200, < 3s)
    - `https://api.myflowmotion.cloud/health` (HTTP 200, < 1s)
  - **Alert-Threshold:** Downtime > 5 Min → Alert
  - **Verifikation:** `curl -w "Time: %{time_total}s, Status: %{http_code}\n" https://myflowmotion.cloud/`

### 9.2 Error-Tracking
- [ ] Sentry / Error-Tracking aktiv (optional)
  - **Verifikation:** Backend-Code enthält `sentry_sdk.init()`
  - **Dashboard:** https://sentry.io → Errors sollten real-time fließen

- [ ] Application-Logs aggregiert
  - **Tool:** Docker logs, Supabase Logs, Nginx logs zentral verfügbar
  - **Verifikation:** `docker logs studio-api --tail 100`

### 9.3 Performance Baselines
- [ ] Response-Times dokumentiert (Baseline)
  - **Beispiel:**
    - `/health`: < 100ms
    - `/onboarding/profile`: < 500ms
    - `/run` (Multi-Agent): 3-5 Minuten
  
  - **Verifikation:** Load-Test durchführen:
    ```bash
    # Einfacher Test mit Apache Bench
    ab -n 100 -c 10 https://api.myflowmotion.cloud/health
    # oder mit wrk:
    wrk -t4 -c100 -d30s https://api.myflowmotion.cloud/health
    ```

- [ ] Database-Query-Performance monitored
  - **Verifikation:** Supabase Dashboard → Database → Monitoring → Slow Queries

---

## Phase 10: Final Pre-Launch Checklist (48h before)

### 10.1 Smoke-Tests
- [ ] Full E2E-Test durchgeführt (Staging/Prod-like)
  1. [ ] Öffne https://myflowmotion.cloud
  2. [ ] Klick auf "Analyse starten"
  3. [ ] Login mit Testmail
  4. [ ] Durchlaufe Onboarding (3 Steps)
  5. [ ] Lade Test-Dokument hoch (PDF)
  6. [ ] Starte Voice-Interview (oder überspringe im Dev-Mode)
  7. [ ] Warte auf Multi-Agent-Pipeline (könnte 3-5 Min dauern)
  8. [ ] Lade Executive Summary herunter
  - **Ergebnis:** Alle Schritte sollten ohne 5xx-Fehler durchlaufen

- [ ] Error-Scenarios getestet
  - [ ] Invalid Email beim Login → Fehlerbehandlung OK
  - [ ] Large File (> 50 MB) Upload → Richtige Fehlermeldung
  - [ ] Network-Fehler simulieren (Browser DevTools) → Graceful Recovery
  - [ ] Gehe zu `/report/<invalid-id>` → 404 oder 403 OK

### 10.2 Content & UX
- [ ] Texte auf Deutsch (oder gewünschte Sprache)
  - **Verifikation:** UI-Copy überprüfen

- [ ] Branding korrekt (Logo, Farben, Links)
  - **Verifikation:** Öffne https://myflowmotion.cloud → Visuelle Kontrolle

- [ ] Impressum & Datenschutz verlinkt (Compliance)
  - **Verifikation:** Footer sollte Links enthalten
  - **Status:** PDF oder Seite muss gehostet sein

### 10.3 Stakeholder Sign-Off
- [ ] Product Owner genehmigt
  - [ ] Sign-Off bestätigt (Email, Slack, etc.)

- [ ] Compliance-Team genehmigt (DSGVO, AI-Act)
  - [ ] Sign-Off bestätigt

- [ ] Operations-Team bereit
  - [ ] On-Call Person benannt
  - [ ] Rollback-Plan durchgesprochen

---

## Deployment-Schritt-für-Schritt (Launch-Tag)

### 10 Minuten vor Go-Live
1. [ ] Backup manuell ausgelöst (Supabase)
   ```bash
   # oder via CLI: supabase projects list → note project-ref
   ```
2. [ ] Alle Monitoring-Tools aktiv
3. [ ] Team in Standby (Chat/Call)

### Launch
4. [ ] `docker-compose up -d` auf VPS (falls noch nicht running)
   ```bash
   cd /opt/ai-adoption-studio
   docker-compose up -d
   docker-compose logs -f
   ```
5. [ ] Warte auf "healthy" Status für beide Container (~30 Sek)

### Post-Launch (erste 30 Min)
6. [ ] Öffne https://myflowmotion.cloud im Browser
7. [ ] Überprüfe /health-Endpoint: `curl https://api.myflowmotion.cloud/health`
8. [ ] Supabase-Verbindung check: versuche zu registrieren
9. [ ] Monitoring-Dashboards schauen auf Errors
10. [ ] Chat mit Team: "Launch erfolgreich?" Y/N

---

## Post-Deployment-Runbook (erste Woche)

| Tag | Aktion | Verifikation |
|-----|--------|-------------|
| **Tag 0 (Launch)** | Live | Keine Errors in Monitoring |
| **Tag 1** | Daily Backup check | Backup-Größe > 10 MB (Daten vorhanden) |
| **Tag 1-3** | Monitor Error-Rate | < 0.5% 5xx-Errors |
| **Tag 3** | Performance Review | Response-Times wie dokumentiert |
| **Tag 7** | Security Scan | No leaked credentials in logs |
| **Day 7+** | Rotate API-Keys | Jede 90 Tage |

---

## Checklisten-Status

**Prepared By:** [DevOps Lead Name]  
**Date:** [YYYY-MM-DD]  
**Sign-Off:** [ ] Ready for Production  

**Launch Status (update täglich):**
```
[ ] Pre-Deployment (Phase 1-2)
[ ] Infrastructure Ready (Phase 3-5)
[ ] App Tests Passed (Phase 4)
[ ] Security Review (Phase 7)
[ ] Final Smoke Tests (Phase 10)
[ ] LAUNCH APPROVED
```

---

## Schnelle Referenz: Wichtige Commands

```bash
# VPS-SSH
ssh -i ~/.ssh/hostinger_key.pem root@srv1405308.myflowmotion.cloud

# Container-Status
docker ps -a
docker-compose status

# Health-Checks
curl https://api.myflowmotion.cloud/health
curl https://myflowmotion.cloud/

# Logs
docker logs studio-api -f --tail 50
docker logs studio-web -f --tail 50

# Restart
docker-compose restart api
docker-compose restart web

# Nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl reload nginx

# Supabase CLI
supabase link --project-ref YOUR_REF
supabase status
supabase db push --dry-run

# TLS-Zertifikat
certbot certificates
certbot renew --dry-run
```

---

## Links & Kontakte

- **Hostinger VPS:** https://hpanel.hostinger.com/ (srv1405308)
- **Supabase Dashboard:** https://supabase.com/dashboard
- **ElevenLabs Agent:** https://elevenlabs.io/app/agents
- **Vercel Frontend:** https://vercel.com/dashboard (falls Vercel genutzt)
- **Domain Registrar:** [Hostinger / Name.com / etc.]
- **On-Call:** [Slack #ops-oncall oder ähnlich]

---

**Version History:**
- v1.0 (2026-05-13): Initial Production-Checklist
- Updates nach Major-Deployments dokumentieren


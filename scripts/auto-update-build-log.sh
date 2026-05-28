#!/usr/bin/env bash
# Auto-Updater für das Build-Log auf myflowmotion.cloud.
#
# Ablauf:
#   1. Regeneriert web/lib/build-log.generated.json aus Git/Curated/Notion.
#   2. Vergleicht die ENTRIES (nicht updatedAt) per Hash — nur bei inhaltlicher
#      Änderung wird committet + deployed. Keine Noise-Commits, wenn nur die
#      Generierungs-Uhrzeit anders ist.
#   3. Bei Änderung: git commit auf main + Deploy via deploy-Skill (--service web).
#
# Aufruf:
#   bash scripts/auto-update-build-log.sh           # produktiv
#   bash scripts/auto-update-build-log.sh --dry     # nur regenerieren, kein Commit/Deploy
#
# Wird per launchd täglich getriggert (~/Library/LaunchAgents/cloud.myflowmotion.build-log.plist).
# Notion-Token (optional) wird aus ~/.config/myflowmotion/notion.env gesourced.

set -euo pipefail

REPO="/Users/alexanderheyers/Documents/Claude/Projects/Vibe Coding Bootcamp/ai-adoption-studio"
WEB="$REPO/web"
JSON="$WEB/lib/build-log.generated.json"
LOG="$HOME/Library/Logs/myflowmotion-build-log.log"
DEPLOY="$HOME/.claude/skills/deploy-ai-adoption-studio/scripts/deploy.sh"

DRY=0
[[ "${1:-}" == "--dry" ]] && DRY=1

mkdir -p "$(dirname "$LOG")"
ts()  { date "+%Y-%m-%d %H:%M:%S"; }
log() { echo "[$(ts)] $*" | tee -a "$LOG"; }

log "── auto-update-build-log · start (dry=$DRY) ──"

# Hash der entries-Liste VOR Regenerierung (updatedAt ignoriert)
entries_hash() {
  node -e "
    try { process.stdout.write(JSON.stringify(require('$JSON').entries)); }
    catch (e) { process.stdout.write(''); }
  " | shasum | cut -d' ' -f1
}
HASH_BEFORE=$(entries_hash)
log "entries-hash vorher: $HASH_BEFORE"

# Optional: Notion-Token sourcen (build-log Generator nutzt NOTION_TOKEN selbständig)
if [[ -f "$HOME/.config/myflowmotion/notion.env" ]]; then
  set -a; . "$HOME/.config/myflowmotion/notion.env"; set +a
  log "Notion-Token aus ~/.config/myflowmotion/notion.env geladen."
else
  log "Kein Notion-Token-File — Generator läuft ohne Notion-Layer (Git + Curated only)."
fi

cd "$WEB"
log "Regeneriere build-log…"
node scripts/gen-build-log.mjs 2>&1 | tee -a "$LOG"

HASH_AFTER=$(entries_hash)
log "entries-hash nachher: $HASH_AFTER"

if [[ "$HASH_BEFORE" == "$HASH_AFTER" ]]; then
  log "Keine inhaltliche Änderung → kein Commit, kein Deploy. Fertig."
  exit 0
fi
log "Einträge haben sich geändert."

if [[ $DRY -eq 1 ]]; then
  log "DRY-Mode → kein Commit, kein Deploy. Fertig."
  exit 0
fi

cd "$REPO"
git add web/lib/build-log.generated.json
git commit -m "chore: build-log automatisch aktualisiert ($(ts))

Auto-Update via launchd-Job cloud.myflowmotion.build-log.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>" 2>&1 | tee -a "$LOG"

log "Deploye web…"
bash "$DEPLOY" --service web 2>&1 | tee -a "$LOG"

log "── auto-update-build-log · done ──"

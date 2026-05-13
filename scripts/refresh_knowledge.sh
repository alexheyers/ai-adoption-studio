#!/bin/bash
# Wöchentlicher Knowledge-Refresh (Pulse + Tools-DB rotierend)
#
# Cron-Eintrag auf dem VPS (srv1405308.hstgr.cloud):
#   0 6 * * MON  /opt/ai-adoption-studio/scripts/refresh_knowledge.sh >> /var/log/ai-adoption-knowledge.log 2>&1
#
# Lokal: bash scripts/refresh_knowledge.sh

set -e
cd "$(dirname "$0")/.."
source .venv/bin/activate

echo "════════════════════════════════════════════"
echo "  Knowledge-Refresh · $(date)"
echo "════════════════════════════════════════════"

# 1. Branchen-Pulse (jeden Run)
echo ""
echo "[1/2] Branchen-Pulse-Refresh"
DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib python -m agents.knowledge_refresher

# 2. Tools-DB inkrementell (3 älteste Kategorien — rotiert alle 18 Kategorien über 6 Wochen)
echo ""
echo "[2/2] Tools-DB inkrementeller Refresh"
DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib python -m agents.tools_db_builder --partial --n=3

# Auto-Commit
if [ -d ".git" ]; then
    git add knowledge/pulse/ knowledge/CHANGELOG.md knowledge/hospitality_tools_db.yaml 2>/dev/null || true
    git commit -m "knowledge: refresh $(date +%Y-%m-%d)" 2>/dev/null || echo "Kein neuer Commit nötig"
fi

echo ""
echo "✓ Knowledge-Refresh fertig · $(date)"

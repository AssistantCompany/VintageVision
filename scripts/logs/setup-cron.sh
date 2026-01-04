#!/bin/bash
# ============================================================================
# VintageVision Log Manager - Cron Setup
# Sets up automated log management
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_MANAGER="${SCRIPT_DIR}/log-manager.sh"
CRON_LOG="/home/dev/scaledminds_07/logs/vintagevision/cron.log"

# Create the log directory
mkdir -p "$(dirname "$CRON_LOG")"

# Define cron entries
CRON_ENTRIES="
# VintageVision Log Management
# Export logs daily at 23:55
55 23 * * * ${LOG_MANAGER} export >> ${CRON_LOG} 2>&1

# Archive old logs weekly on Sunday at 02:00
0 2 * * 0 ${LOG_MANAGER} archive >> ${CRON_LOG} 2>&1

# Purge very old logs monthly on the 1st at 03:00
0 3 1 * * ${LOG_MANAGER} purge >> ${CRON_LOG} 2>&1
"

echo "VintageVision Log Manager - Cron Setup"
echo "======================================="
echo ""
echo "This will add the following cron jobs:"
echo ""
echo "  • Daily at 23:55  - Export container logs"
echo "  • Weekly (Sunday) - Archive logs older than 7 days"
echo "  • Monthly (1st)   - Purge logs older than 30 days"
echo ""

# Check if entries already exist
if crontab -l 2>/dev/null | grep -q "VintageVision Log Management"; then
    echo "⚠️  VintageVision cron entries already exist."
    echo ""
    read -p "Do you want to replace them? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
    # Remove existing entries
    crontab -l 2>/dev/null | grep -v "VintageVision\|log-manager.sh" | crontab -
fi

# Add new entries
(crontab -l 2>/dev/null; echo "$CRON_ENTRIES") | crontab -

echo "✅ Cron jobs installed successfully!"
echo ""
echo "Current crontab:"
echo "----------------"
crontab -l | grep -A5 "VintageVision"
echo ""
echo "Logs will be written to: ${CRON_LOG}"

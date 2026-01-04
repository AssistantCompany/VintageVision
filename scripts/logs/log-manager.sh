#!/bin/bash
# ============================================================================
# VintageVision Log Manager
# Comprehensive logging system for Docker containers
#
# Features:
# - Daily log export with human & AI readable format
# - Automatic archival of logs older than 7 days
# - Automatic purge of logs older than 30 days
# - Structured directory organization
#
# Usage:
#   ./log-manager.sh export    - Export today's logs
#   ./log-manager.sh archive   - Archive logs older than 7 days
#   ./log-manager.sh purge     - Purge logs older than 30 days
#   ./log-manager.sh all       - Run all operations
#   ./log-manager.sh status    - Show log storage status
# ============================================================================

set -euo pipefail

# Configuration
PROJECT_NAME="vintagevision"
PROJECT_DIR="/home/dev/scaledminds_07/projects/vintagevision"
LOG_BASE_DIR="/home/dev/scaledminds_07/logs/${PROJECT_NAME}"
ARCHIVE_AFTER_DAYS=7
PURGE_AFTER_DAYS=30

# Container names
CONTAINERS=(
    "vintagevision_api"
    "vintagevision_frontend"
    "vintagevision_db"
    "vintagevision_redis"
    "vintagevision_minio"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure directories exist
setup_directories() {
    mkdir -p "${LOG_BASE_DIR}/daily"
    mkdir -p "${LOG_BASE_DIR}/archived"
    mkdir -p "${LOG_BASE_DIR}/reports"
    echo -e "${GREEN}✅ Log directories initialized${NC}"
}

# Get formatted date
get_date() {
    date +"%Y-%m-%d"
}

get_timestamp() {
    date +"%Y-%m-%d_%H-%M-%S"
}

# Export logs for a specific container
export_container_logs() {
    local container=$1
    local date_str=$(get_date)
    local output_dir="${LOG_BASE_DIR}/daily/${date_str}"
    local service_name="${container#vintagevision_}"  # Remove prefix

    mkdir -p "${output_dir}"

    # Check if container exists
    if ! docker ps -a --format '{{.Names}}' | grep -q "^${container}$"; then
        echo -e "${YELLOW}⚠️  Container ${container} not found, skipping${NC}"
        return 0
    fi

    # Export logs in JSON format (structured for AI parsing)
    local json_file="${output_dir}/${service_name}.json"
    docker logs "${container}" --timestamps 2>&1 | while IFS= read -r line; do
        # Parse timestamp and message
        timestamp=$(echo "$line" | grep -oP '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}' || echo "")
        message=$(echo "$line" | sed 's/^[0-9T:.-]*Z\s*//')

        # Determine log level
        level="info"
        if echo "$line" | grep -qiE 'error|❌|fail'; then
            level="error"
        elif echo "$line" | grep -qiE 'warn|⚠️'; then
            level="warn"
        elif echo "$line" | grep -qiE 'debug|verbose'; then
            level="debug"
        fi

        echo "{\"timestamp\":\"${timestamp}\",\"service\":\"${service_name}\",\"level\":\"${level}\",\"message\":$(echo "$message" | jq -Rs .)}"
    done > "${json_file}" 2>/dev/null || true

    # Export logs in human-readable format
    local txt_file="${output_dir}/${service_name}.log"
    docker logs "${container}" --timestamps 2>&1 > "${txt_file}" || true

    # Get file size
    local size=$(du -h "${txt_file}" 2>/dev/null | cut -f1 || echo "0")
    echo -e "${BLUE}📝 ${service_name}${NC}: ${size}"
}

# Export all container logs
export_logs() {
    echo -e "${GREEN}📦 Exporting logs for $(get_date)${NC}"
    echo "----------------------------------------"

    setup_directories

    for container in "${CONTAINERS[@]}"; do
        export_container_logs "$container"
    done

    # Generate daily summary report
    generate_daily_report

    echo "----------------------------------------"
    echo -e "${GREEN}✅ Logs exported to ${LOG_BASE_DIR}/daily/$(get_date)${NC}"
}

# Generate daily summary report
generate_daily_report() {
    local date_str=$(get_date)
    local report_file="${LOG_BASE_DIR}/reports/${date_str}-summary.md"
    local log_dir="${LOG_BASE_DIR}/daily/${date_str}"

    cat > "${report_file}" << EOF
# VintageVision Daily Log Report
**Date:** ${date_str}
**Generated:** $(date +"%Y-%m-%d %H:%M:%S %Z")

## Log Files

| Service | Size | Errors | Warnings |
|---------|------|--------|----------|
EOF

    for container in "${CONTAINERS[@]}"; do
        local service_name="${container#vintagevision_}"
        local log_file="${log_dir}/${service_name}.log"

        if [[ -f "$log_file" ]]; then
            local size=$(du -h "$log_file" | cut -f1)
            local errors=$(grep -ciE 'error|❌|fail' "$log_file" 2>/dev/null || echo "0")
            local warnings=$(grep -ciE 'warn|⚠️' "$log_file" 2>/dev/null || echo "0")
            echo "| ${service_name} | ${size} | ${errors} | ${warnings} |" >> "${report_file}"
        fi
    done

    cat >> "${report_file}" << EOF

## Error Summary

\`\`\`
EOF

    # Add error excerpts
    for container in "${CONTAINERS[@]}"; do
        local service_name="${container#vintagevision_}"
        local log_file="${log_dir}/${service_name}.log"

        if [[ -f "$log_file" ]]; then
            local errors=$(grep -iE 'error|❌|fail' "$log_file" 2>/dev/null | tail -5 || true)
            if [[ -n "$errors" ]]; then
                echo "=== ${service_name} ===" >> "${report_file}"
                echo "$errors" >> "${report_file}"
                echo "" >> "${report_file}"
            fi
        fi
    done

    echo '```' >> "${report_file}"
    echo "" >> "${report_file}"
    echo "---" >> "${report_file}"
    echo "*Report generated by VintageVision Log Manager*" >> "${report_file}"
}

# Archive old logs
archive_logs() {
    echo -e "${YELLOW}📁 Archiving logs older than ${ARCHIVE_AFTER_DAYS} days${NC}"
    echo "----------------------------------------"

    local archived_count=0
    local archive_date=$(date -d "-${ARCHIVE_AFTER_DAYS} days" +"%Y-%m-%d")

    # Find directories older than ARCHIVE_AFTER_DAYS
    for dir in "${LOG_BASE_DIR}/daily/"*/; do
        if [[ -d "$dir" ]]; then
            local dir_date=$(basename "$dir")

            # Compare dates
            if [[ "$dir_date" < "$archive_date" ]]; then
                local archive_name="${dir_date}.tar.gz"
                local archive_path="${LOG_BASE_DIR}/archived/${archive_name}"

                # Create compressed archive
                if tar -czf "${archive_path}" -C "${LOG_BASE_DIR}/daily" "${dir_date}" 2>/dev/null; then
                    rm -rf "$dir"
                    echo -e "${GREEN}✅ Archived: ${dir_date}${NC}"
                    ((archived_count++))
                else
                    echo -e "${RED}❌ Failed to archive: ${dir_date}${NC}"
                fi
            fi
        fi
    done

    # Also archive old reports
    for report in "${LOG_BASE_DIR}/reports/"*.md; do
        if [[ -f "$report" ]]; then
            local report_date=$(basename "$report" | grep -oP '^\d{4}-\d{2}-\d{2}' || continue)

            if [[ "$report_date" < "$archive_date" ]]; then
                gzip -f "$report" 2>/dev/null && echo -e "${GREEN}✅ Compressed report: ${report_date}${NC}"
            fi
        fi
    done

    echo "----------------------------------------"
    echo -e "${GREEN}✅ Archived ${archived_count} log directories${NC}"
}

# Purge very old logs
purge_logs() {
    echo -e "${RED}🗑️  Purging logs older than ${PURGE_AFTER_DAYS} days${NC}"
    echo "----------------------------------------"

    local purged_count=0
    local purge_date=$(date -d "-${PURGE_AFTER_DAYS} days" +"%Y-%m-%d")

    # Find and delete old archives
    for archive in "${LOG_BASE_DIR}/archived/"*.tar.gz; do
        if [[ -f "$archive" ]]; then
            local archive_date=$(basename "$archive" .tar.gz)

            if [[ "$archive_date" < "$purge_date" ]]; then
                rm -f "$archive"
                echo -e "${YELLOW}🗑️  Purged: ${archive_date}${NC}"
                ((purged_count++))
            fi
        fi
    done

    # Purge old compressed reports
    for report in "${LOG_BASE_DIR}/reports/"*.md.gz; do
        if [[ -f "$report" ]]; then
            local report_date=$(basename "$report" | grep -oP '^\d{4}-\d{2}-\d{2}' || continue)

            if [[ "$report_date" < "$purge_date" ]]; then
                rm -f "$report"
                echo -e "${YELLOW}🗑️  Purged report: ${report_date}${NC}"
            fi
        fi
    done

    echo "----------------------------------------"
    echo -e "${GREEN}✅ Purged ${purged_count} old archives${NC}"
}

# Show status
show_status() {
    echo -e "${BLUE}📊 VintageVision Log Status${NC}"
    echo "========================================"

    echo ""
    echo -e "${GREEN}Daily Logs:${NC}"
    if [[ -d "${LOG_BASE_DIR}/daily" ]]; then
        local daily_count=$(find "${LOG_BASE_DIR}/daily" -maxdepth 1 -type d | wc -l)
        local daily_size=$(du -sh "${LOG_BASE_DIR}/daily" 2>/dev/null | cut -f1 || echo "0")
        echo "  Count: $((daily_count - 1)) days"
        echo "  Size:  ${daily_size}"
    else
        echo "  No daily logs found"
    fi

    echo ""
    echo -e "${YELLOW}Archived Logs:${NC}"
    if [[ -d "${LOG_BASE_DIR}/archived" ]]; then
        local archive_count=$(find "${LOG_BASE_DIR}/archived" -name "*.tar.gz" | wc -l)
        local archive_size=$(du -sh "${LOG_BASE_DIR}/archived" 2>/dev/null | cut -f1 || echo "0")
        echo "  Count: ${archive_count} archives"
        echo "  Size:  ${archive_size}"
    else
        echo "  No archived logs found"
    fi

    echo ""
    echo -e "${BLUE}Reports:${NC}"
    if [[ -d "${LOG_BASE_DIR}/reports" ]]; then
        local report_count=$(find "${LOG_BASE_DIR}/reports" -name "*.md*" | wc -l)
        echo "  Count: ${report_count} reports"
    else
        echo "  No reports found"
    fi

    echo ""
    echo -e "${GREEN}Docker Container Log Sizes:${NC}"
    for container in "${CONTAINERS[@]}"; do
        if docker ps -a --format '{{.Names}}' | grep -q "^${container}$"; then
            local log_path=$(docker inspect --format='{{.LogPath}}' "$container" 2>/dev/null || echo "")
            if [[ -n "$log_path" && -f "$log_path" ]]; then
                local size=$(du -h "$log_path" 2>/dev/null | cut -f1 || echo "?")
                echo "  ${container#vintagevision_}: ${size}"
            fi
        fi
    done

    echo ""
    echo "========================================"
}

# Main
case "${1:-}" in
    export)
        export_logs
        ;;
    archive)
        archive_logs
        ;;
    purge)
        purge_logs
        ;;
    all)
        export_logs
        echo ""
        archive_logs
        echo ""
        purge_logs
        ;;
    status)
        show_status
        ;;
    *)
        echo "VintageVision Log Manager"
        echo ""
        echo "Usage: $0 {export|archive|purge|all|status}"
        echo ""
        echo "Commands:"
        echo "  export   - Export today's container logs"
        echo "  archive  - Archive logs older than ${ARCHIVE_AFTER_DAYS} days"
        echo "  purge    - Delete logs older than ${PURGE_AFTER_DAYS} days"
        echo "  all      - Run export, archive, and purge"
        echo "  status   - Show current log storage status"
        exit 1
        ;;
esac

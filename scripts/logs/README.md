# VintageVision Log Management System

A comprehensive logging solution for the VintageVision application.

## Features

- **Daily log export** with both JSON (AI-parseable) and plain text formats
- **Automatic archival** of logs older than 7 days (compressed tar.gz)
- **Automatic purge** of logs older than 30 days
- **Structured directory organization** for easy navigation
- **Daily summary reports** with error counts

## Directory Structure

```
/home/dev/scaledminds_07/logs/vintagevision/
├── daily/                    # Daily log exports
│   └── YYYY-MM-DD/
│       ├── api.log          # Human-readable API logs
│       ├── api.json         # Structured JSON logs
│       ├── frontend.log
│       ├── frontend.json
│       ├── db.log
│       └── ...
├── archived/                 # Compressed old logs
│   └── YYYY-MM-DD.tar.gz
├── reports/                  # Daily summary reports
│   └── YYYY-MM-DD-summary.md
└── cron.log                  # Cron job output
```

## Usage

### Manual Commands

```bash
# Export today's logs
./log-manager.sh export

# Archive logs older than 7 days
./log-manager.sh archive

# Purge logs older than 30 days
./log-manager.sh purge

# Run all operations
./log-manager.sh all

# Show log storage status
./log-manager.sh status
```

### Setting Up Automation

#### Option 1: Crontab (Recommended)

Add these entries to your crontab (`crontab -e`):

```cron
# VintageVision Log Management
# Export logs daily at 23:55
55 23 * * * /home/dev/scaledminds_07/projects/vintagevision/scripts/logs/log-manager.sh export >> /home/dev/scaledminds_07/logs/vintagevision/cron.log 2>&1

# Archive old logs weekly on Sunday at 02:00
0 2 * * 0 /home/dev/scaledminds_07/projects/vintagevision/scripts/logs/log-manager.sh archive >> /home/dev/scaledminds_07/logs/vintagevision/cron.log 2>&1

# Purge very old logs monthly on the 1st at 03:00
0 3 1 * * /home/dev/scaledminds_07/projects/vintagevision/scripts/logs/log-manager.sh purge >> /home/dev/scaledminds_07/logs/vintagevision/cron.log 2>&1
```

#### Option 2: Systemd Timer

Create `/etc/systemd/system/vintagevision-logs.service`:

```ini
[Unit]
Description=VintageVision Log Management
After=docker.service

[Service]
Type=oneshot
ExecStart=/home/dev/scaledminds_07/projects/vintagevision/scripts/logs/log-manager.sh all
User=dev
```

Create `/etc/systemd/system/vintagevision-logs.timer`:

```ini
[Unit]
Description=Run VintageVision log management daily

[Timer]
OnCalendar=*-*-* 23:55:00
Persistent=true

[Install]
WantedBy=timers.target
```

Enable the timer:

```bash
sudo systemctl enable vintagevision-logs.timer
sudo systemctl start vintagevision-logs.timer
```

## Debug Mode

To enable verbose logging in the API:

1. Set environment variables in `.env`:
   ```
   LOG_LEVEL=debug
   DEBUG=true
   ```

2. Or set them in docker-compose.yml:
   ```yaml
   environment:
     - LOG_LEVEL=debug
     - DEBUG=true
   ```

3. Restart the API container:
   ```bash
   docker compose up -d api
   ```

## Log Levels

| Level | Description |
|-------|-------------|
| `debug` | Verbose debugging information |
| `info` | General operational messages |
| `warn` | Warning conditions |
| `error` | Error conditions |

## Analyzing Logs

### With jq (JSON logs)

```bash
# Find all errors
cat api.json | jq 'select(.level == "error")'

# Find requests by path
cat api.json | jq 'select(.message | contains("/api/analyze"))'

# Count by level
cat api.json | jq -s 'group_by(.level) | map({level: .[0].level, count: length})'
```

### With grep (Plain logs)

```bash
# Find errors
grep -i "error\|❌" api.log

# Find OAuth issues
grep -i "oauth\|auth" api.log

# Find slow requests (if timing logged)
grep "ms$" api.log | sort -t' ' -k5 -n
```

## System Tuning

### Redis Memory Overcommit Warning

If you see this warning in Redis logs:
```
WARNING Memory overcommit must be enabled!
```

Fix it by running (requires sudo):
```bash
# Temporary fix (until reboot)
sudo sysctl vm.overcommit_memory=1

# Permanent fix
echo 'vm.overcommit_memory = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Maintenance

The system automatically:
- **Daily**: Exports all container logs
- **Weekly**: Compresses logs older than 7 days
- **Monthly**: Deletes logs older than 30 days

Manual cleanup:
```bash
# Check disk usage
./log-manager.sh status

# Force immediate cleanup
./log-manager.sh all
```

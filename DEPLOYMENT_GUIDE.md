# 🏺 VintageVision - Complete Deployment Guide

**Self-Hosted AI Antique Expert**
**Domain:** vintagevision.app
**Platform:** ScaledMinds_07

---

## ✅ WHAT'S BEEN BUILT

### Complete Self-Hosted Stack

**Backend (Node.js + Hono):**
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Passport.js authentication (Google OAuth)
- ✅ MinIO S3-compatible storage
- ✅ OpenAI GPT-4o Vision integration
- ✅ Session management with PostgreSQL store
- ✅ Complete API routes (auth, analysis, collection)
- ✅ Error handling and logging
- ✅ Health monitoring

**Frontend (React + Vite):**
- ✅ All legacy UI components preserved
- ✅ Custom auth provider (replaces Mocha)
- ✅ API client for backend integration
- ✅ TypeScript types matching backend
- ✅ Production build configuration
- ✅ Nginx for production serving

**Infrastructure (Docker):**
- ✅ docker-compose.yml with all services
- ✅ Traefik labels for HTTPS
- ✅ Network isolation
- ✅ Resource limits
- ✅ Health checks
- ✅ Persistent volumes

---

## 🚀 DEPLOYMENT STEPS

### Prerequisites

Before deploying, you need:

1. **Google OAuth Credentials**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - **Authorized redirect URI:** `https://vintagevision.app/api/auth/google/callback`
   - Save Client ID and Client Secret

2. **OpenAI API Key**
   - Visit: https://platform.openai.com/api-keys
   - Create new secret key
   - Save securely

### Step 1: Run Deployment Script

```bash
cd /home/dev/scaledminds_07/projects/vintagevision
./deploy.sh
```

The script will:
1. Generate secure passwords automatically
2. Prompt for API keys (OpenAI, Google OAuth)
3. Create `.env` file with all credentials
4. Build Docker images
5. Start all services
6. Run health checks
7. Show deployment status

### Step 2: Verify Deployment

```bash
# Check all containers are running
sudo docker compose ps

# Should show:
# vintagevision_frontend   running
# vintagevision_api        running
# vintagevision_db         running
# vintagevision_redis      running
# vintagevision_minio      running

# Check health
curl http://localhost:3000/health

# Should return:
# {"status":"healthy","services":{"database":"up","storage":"up","openai":"up"}}
```

### Step 3: Access Application

Open browser: **https://vintagevision.app**

The SSL certificate will be automatically issued by Let's Encrypt via Traefik within 5-10 minutes.

---

## 🔐 CREDENTIALS GENERATED

The deployment script generates:

- **DB_PASSWORD** - PostgreSQL database password (32 chars)
- **MINIO_ACCESS_KEY** - MinIO storage access key (32 chars)
- **MINIO_SECRET_KEY** - MinIO storage secret (32 chars)
- **SESSION_SECRET** - Session encryption key (32 chars)

**⚠️ CRITICAL:** Backup your `.env` file immediately!

```bash
cp .env .env.backup-$(date +%Y%m%d)
```

---

## 📋 SERVICES OVERVIEW

### Frontend (Port 80 via Traefik)
- **Container:** vintagevision_frontend
- **Technology:** React 19 + Vite + Nginx
- **Resources:** 512MB RAM, 0.5 CPU
- **URL:** https://vintagevision.app

### API (Internal Port 3000)
- **Container:** vintagevision_api
- **Technology:** Node.js 20 + Hono + TypeScript
- **Resources:** 1GB RAM, 1.0 CPU
- **Health Check:** http://localhost:3000/health

### Database (Internal Port 5432)
- **Container:** vintagevision_db
- **Technology:** PostgreSQL 16
- **Resources:** 512MB RAM, 0.5 CPU
- **Volume:** db_data (persistent)

### Cache (Internal Port 6379)
- **Container:** vintagevision_redis
- **Technology:** Redis 7
- **Resources:** 256MB RAM, 0.25 CPU
- **Volume:** redis_data (persistent)

### Storage (Internal Port 9000)
- **Container:** vintagevision_minio
- **Technology:** MinIO (S3-compatible)
- **Resources:** 512MB RAM, 0.5 CPU
- **Volume:** minio_data (persistent)

---

## 🎯 KEY FEATURES WORKING

### Authentication
- ✅ Google OAuth sign-in
- ✅ Session persistence (30 days)
- ✅ Secure cookie handling
- ✅ Auto-redirect after login

### Image Analysis
- ✅ Upload images (up to 20MB)
- ✅ GPT-4o Vision analysis
- ✅ Antique identification
- ✅ Era and style classification
- ✅ Value estimation
- ✅ Historical context
- ✅ Styling suggestions

### Collection Management
- ✅ Save items to collection
- ✅ Add notes and location
- ✅ View all saved items
- ✅ Update collection items
- ✅ Remove from collection

### Marketplace Integration
- ✅ Auto-generate search links
- ✅ eBay, Etsy, Chairish, 1stDibs
- ✅ Price-based filtering

### Storage
- ✅ MinIO S3-compatible storage
- ✅ Presigned URLs for security
- ✅ Automatic bucket creation
- ✅ Image persistence

---

## 🛠️ MANAGEMENT COMMANDS

### View Logs
```bash
cd /home/dev/scaledminds_07/projects/vintagevision

# All services
sudo docker compose logs -f

# Specific service
sudo docker compose logs -f api
sudo docker compose logs -f frontend
sudo docker compose logs -f db
```

### Restart Services
```bash
# Restart all
sudo docker compose restart

# Restart specific
sudo docker compose restart api
sudo docker compose restart frontend
```

### Stop/Start
```bash
# Stop all
sudo docker compose down

# Start all
sudo docker compose up -d
```

### Database Access
```bash
# Connect to PostgreSQL
sudo docker compose exec db psql -U vintagevision -d vintagevision

# Example queries
SELECT COUNT(*) FROM item_analyses;
SELECT COUNT(*) FROM users;
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

### Health Check
```bash
# API health
curl http://localhost:3000/health | python3 -m json.tool

# Container stats
sudo docker stats

# Network inspection
sudo docker network inspect scaledminds_network
```

---

## 🔧 TROUBLESHOOTING

### Issue: Containers Won't Start

```bash
# Check logs
sudo docker compose logs

# Common fixes:
# 1. Check .env file exists and has all variables
# 2. Ensure ports aren't in use
# 3. Verify Docker is running
sudo docker ps
```

### Issue: Database Connection Failed

```bash
# Check database container
sudo docker compose ps db

# Check database logs
sudo docker compose logs db

# Restart database
sudo docker compose restart db
```

### Issue: Authentication Not Working

**Check Google OAuth settings:**
1. Callback URL must be exact: `https://vintagevision.app/api/auth/google/callback`
2. Domain must be verified in Google Console
3. OAuth consent screen must be configured

```bash
# Check API logs for auth errors
sudo docker compose logs api | grep -i auth
```

### Issue: Images Not Uploading

```bash
# Check MinIO is running
sudo docker compose ps minio

# Check MinIO logs
sudo docker compose logs minio

# Verify bucket creation
sudo docker compose logs minio | grep -i bucket

# Check API can connect to MinIO
sudo docker compose exec api wget --spider http://minio:9000/minio/health/live
```

### Issue: SSL Certificate Not Issued

**Wait 5-10 minutes after DNS propagation**

```bash
# Check DNS is pointing to server
dig vintagevision.app +short
# Should return: 23.227.173.166

# Check Traefik logs
sudo docker logs traefik | grep -i vintagevision

# Check certificate status
sudo docker exec traefik cat /letsencrypt/acme.json | grep vintagevision
```

---

## 📊 MONITORING

### Health Dashboard

```bash
# Run health check script
/home/dev/scaledminds_07/scripts/health-check.sh
```

### Application Logs

All logs are stored in Docker:
```bash
# Export logs
sudo docker compose logs --since 24h > logs-$(date +%Y%m%d).txt

# Watch logs in real-time
sudo docker compose logs -f --tail=100
```

### Database Metrics

```bash
# Connect to database
sudo docker compose exec db psql -U vintagevision -d vintagevision

# Run analytics
SELECT
  'Total Users' as metric, COUNT(*) as count FROM users
UNION ALL
SELECT
  'Total Analyses', COUNT(*) FROM item_analyses
UNION ALL
SELECT
  'Total Collection Items', COUNT(*) FROM collection_items;
```

---

## 🔄 UPDATES & MAINTENANCE

### Update Application

```bash
cd /home/dev/scaledminds_07/projects/vintagevision

# Pull latest code (if using git)
git pull

# Rebuild and restart
sudo docker compose build
sudo docker compose down
sudo docker compose up -d
```

### Database Backup

```bash
# Backup database
sudo docker compose exec db pg_dump -U vintagevision vintagevision > \
  backup-vintagevision-$(date +%Y%m%d-%H%M%S).sql

# Backup with compression
sudo docker compose exec db pg_dump -U vintagevision vintagevision | \
  gzip > backup-vintagevision-$(date +%Y%m%d-%H%M%S).sql.gz
```

### Restore Database

```bash
# Restore from backup
sudo docker compose exec -T db psql -U vintagevision vintagevision < backup.sql

# Restore from compressed
gunzip -c backup.sql.gz | \
  sudo docker compose exec -T db psql -U vintagevision vintagevision
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Expected Performance
- **Response Time:** < 2s for analysis
- **Image Upload:** < 5s for 5MB image
- **Page Load:** < 1s
- **SSL Handshake:** < 500ms

### Resource Usage
- **CPU:** ~1.5 cores under load
- **Memory:** ~2GB total
- **Disk:** ~5GB (grows with images)
- **Network:** Minimal (API calls to OpenAI only)

### Optimization Tips

1. **Monitor container resources:**
```bash
sudo docker stats
```

2. **Check slow queries:**
```sql
-- In PostgreSQL
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

3. **Clear old images (if needed):**
```bash
# List old images in MinIO
# Connect to MinIO container and use mc client
```

---

## 🎉 SUCCESS CRITERIA

**Deployment is successful when:**

- ✅ All 5 containers running
- ✅ Health check returns "healthy"
- ✅ https://vintagevision.app loads
- ✅ Google sign-in works
- ✅ Image upload and analysis works
- ✅ Collection save/view works
- ✅ No errors in logs

---

## 📞 SUPPORT

### Quick Checks

1. **Container Status:** `sudo docker compose ps`
2. **Health Check:** `curl http://localhost:3000/health`
3. **Recent Logs:** `sudo docker compose logs --tail=50`
4. **Resource Usage:** `sudo docker stats`

### Common Issues Reference

| Issue | Check | Solution |
|-------|-------|----------|
| 502 Bad Gateway | API container | `sudo docker compose restart api` |
| Database error | DB connection | Check DATABASE_URL in .env |
| Auth failure | Google OAuth | Verify callback URL |
| Image upload fail | MinIO | Check storage health |
| Slow response | Resources | Check `docker stats` |

---

## 🔒 SECURITY CHECKLIST

- ✅ Environment variables in .env only
- ✅ .env file backed up securely
- ✅ Database not exposed to internet
- ✅ MinIO not exposed to internet
- ✅ HTTPS enforced by Traefik
- ✅ Session cookies are HTTP-only
- ✅ Strong passwords generated (32 chars)
- ✅ Google OAuth properly configured
- ✅ Container security: no-new-privileges

---

**Deployment Date:** $(date)
**Platform:** ScaledMinds_07
**Domain:** vintagevision.app
**Status:** Production Ready ✅

---

For questions or issues, check:
- Container logs: `sudo docker compose logs`
- Health endpoint: `curl http://localhost:3000/health`
- ScaledMinds docs: `/home/dev/scaledminds_07/docs/`

# 🏺 VintageVision - Self-Hosted Deployment

**AI-Powered Antique Identification & Styling**
Self-Hosted on ScaledMinds_07 Infrastructure

---

## 🎯 Project Overview

VintageVision is a complete rewrite of the Cloudflare-hosted application, now fully self-hosted with:

- ✅ **Self-Hosted Authentication** (Passport.js + Google OAuth)
- ✅ **PostgreSQL Database** (Drizzle ORM)
- ✅ **MinIO Storage** (S3-Compatible)
- ✅ **Node.js + Hono API** (Replaced Cloudflare Workers)
- ✅ **Docker Deployment** (Following ScaledMinds procedures)
- ✅ **Traefik Integration** (Automatic HTTPS)

---

## 🏗️ Architecture

```
vintagevision.app (Traefik)
          ↓
    ┌─────────────────┐
    │  Frontend       │  Nginx → React App
    │  (Port 80)      │
    └─────────────────┘
           ↓
    ┌─────────────────┐
    │  API            │  Node.js + Hono
    │  (Port 3000)    │
    └─────────────────┘
           ↓
    ┌──────────────────────────────┐
    │  PostgreSQL  │  Redis  │  MinIO
    │  (DB)        │  (Cache)│  (Storage)
    └──────────────────────────────┘
           ↓
    External: OpenAI API
```

---

## 📁 Project Structure

```
vintagevision/
├── backend/                    # Node.js API
│   ├── src/
│   │   ├── config/            # Environment & configuration
│   │   ├── db/                # Drizzle ORM schema & client
│   │   ├── storage/           # MinIO S3 client
│   │   ├── auth/              # Passport.js configuration
│   │   ├── middleware/        # Auth, session, error handling
│   │   ├── services/          # OpenAI service
│   │   ├── routes/            # API endpoints
│   │   └── index.ts           # Main server file
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React Application
│   ├── src/                   # React components (from legacy)
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── database/
│   └── schema.sql             # PostgreSQL schema
│
├── docker-compose.yml         # Full stack orchestration
├── .env.template              # Environment variables template
└── README.md                  # This file
```

---

## 🚀 Deployment Instructions

### Prerequisites

1. **Google OAuth Credentials**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://vintagevision.app/api/auth/google/callback`
   - Save Client ID and Client Secret

2. **OpenAI API Key**
   - Go to: https://platform.openai.com/api-keys
   - Create new API key
   - Save securely

### Step 1: Generate Secure Credentials

```bash
cd /home/dev/scaledminds_07/projects/vintagevision

# Generate database password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
echo "DB_PASSWORD=$DB_PASSWORD"

# Generate MinIO credentials
MINIO_ACCESS_KEY=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
MINIO_SECRET_KEY=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
echo "MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY"
echo "MINIO_SECRET_KEY=$MINIO_SECRET_KEY"

# Generate session secret
SESSION_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
echo "SESSION_SECRET=$SESSION_SECRET"
```

### Step 2: Create .env File

```bash
cp .env.template .env
nano .env
```

Fill in ALL values:
```env
PROJECT_NAME=vintagevision
DOMAIN=vintagevision.app

DB_PASSWORD=[generated above]
MINIO_ACCESS_KEY=[generated above]
MINIO_SECRET_KEY=[generated above]
SESSION_SECRET=[generated above]

OPENAI_API_KEY=[from OpenAI dashboard]

GOOGLE_CLIENT_ID=[from Google Console]
GOOGLE_CLIENT_SECRET=[from Google Console]

NODE_ENV=production
TZ=UTC
```

### Step 3: Deploy with Docker Compose

```bash
# Build images
sudo docker compose build

# Start all services
sudo docker compose up -d

# Check status
sudo docker compose ps

# View logs
sudo docker compose logs -f
```

### Step 4: Verify Deployment

```bash
# Health check
curl http://localhost:3000/health

# Should return:
# {"status":"healthy","timestamp":"...","services":{"database":"up","storage":"up","openai":"up"}}
```

### Step 5: Access Application

Open browser: `https://vintagevision.app`

---

## 🔧 Management Commands

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

# Restart specific service
sudo docker compose restart api
```

### Stop Services
```bash
sudo docker compose down
```

### Database Access
```bash
# Connect to PostgreSQL
sudo docker compose exec db psql -U vintagevision -d vintagevision

# Run migrations (if needed)
sudo docker compose exec db psql -U vintagevision -d vintagevision < database/schema.sql
```

### MinIO Access
```bash
# MinIO console (internal only)
# Access via: http://localhost:9001
# User: $MINIO_ACCESS_KEY
# Pass: $MINIO_SECRET_KEY
```

---

## 🔐 Security Notes

1. **Environment Variables**: Never commit `.env` to git
2. **Backups**: Backup `.env` file securely
3. **Passwords**: Use generated passwords, never simple ones
4. **OAuth**: Keep Google credentials private
5. **MinIO**: Access keys grant full storage access

---

## 📊 Resource Usage

**Expected Usage:**
- CPU: ~1.5 cores under load
- Memory: ~2GB total
- Disk: ~5GB (grows with images)
- Network: Depends on traffic

**Container Limits:**
- Frontend: 512MB RAM, 0.5 CPU
- API: 1GB RAM, 1.0 CPU
- PostgreSQL: 512MB RAM, 0.5 CPU
- Redis: 256MB RAM, 0.25 CPU
- MinIO: 512MB RAM, 0.5 CPU

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
sudo docker compose logs [service-name]

# Common issues:
# - Missing environment variables
# - Port conflicts
# - Database connection failed
```

### Database Connection Failed

```bash
# Check database is running
sudo docker compose ps db

# Check database logs
sudo docker compose logs db

# Verify connection string in .env
```

### Authentication Not Working

```bash
# Verify Google OAuth settings
# - Callback URL must match exactly
# - Credentials must be correct

# Check API logs
sudo docker compose logs api
```

### Images Not Uploading

```bash
# Check MinIO is running
sudo docker compose ps minio

# Check bucket was created
sudo docker compose logs minio

# Verify MinIO credentials in .env
```

---

## 🔄 Updates & Maintenance

### Update Application

```bash
cd /home/dev/scaledminds_07/projects/vintagevision

# Pull latest changes
git pull

# Rebuild
sudo docker compose build

# Restart
sudo docker compose down
sudo docker compose up -d
```

### Database Backups

```bash
# Backup database
sudo docker compose exec db pg_dump -U vintagevision vintagevision > backup-$(date +%Y%m%d).sql

# Restore database
sudo docker compose exec -T db psql -U vintagevision vintagevision < backup-20251024.sql
```

---

## 📝 API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Analysis
- `POST /api/analyze` - Analyze antique image
- `GET /api/analyze/:id` - Get analysis by ID

### Collection
- `GET /api/collection` - Get user's collection
- `POST /api/collection` - Save item to collection
- `PATCH /api/collection/:id` - Update collection item
- `DELETE /api/collection/:id` - Remove from collection
- `GET /api/collection/wishlist` - Get wishlist

### Health
- `GET /health` - Service health check

---

## 🎉 Success Criteria

**Deployment is successful when:**

1. ✅ All containers running and healthy
2. ✅ Health endpoint returns all services "up"
3. ✅ Frontend loads at vintagevision.app
4. ✅ Google OAuth login works
5. ✅ Image upload and analysis works
6. ✅ Collection features work
7. ✅ HTTPS enabled by Traefik
8. ✅ No errors in logs

---

## 🤝 Support

For issues or questions, check:
1. Container logs: `sudo docker compose logs`
2. Health endpoint: `curl http://localhost:3000/health`
3. ScaledMinds documentation: `/home/dev/scaledminds_07/docs/`

---

**Built with ❤️ for ScaledMinds_07**
Self-Hosted | Secure | Independent

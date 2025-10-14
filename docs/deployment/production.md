# Production Deployment Guide

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Deployment Platforms](#deployment-platforms)
  - [Render.com (Recommended)](#rendercom-recommended)
  - [Railway](#railway)
  - [Vercel (Frontend Only)](#vercel-frontend-only)
  - [DigitalOcean](#digitalocean)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Monitoring & Logging](#monitoring--logging)
- [Scaling](#scaling)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers deploying the Elio application to production environments. The system consists of two deployable components:

1. **Backend API** (Node.js/Fastify)
2. **Frontend SPA** (Angular)

### Architecture Overview

```
Internet
    │
    ├─> Frontend (Static Files)
    │   └─> CDN/Static Hosting
    │
    └─> Backend API (Node.js)
        └─> Container/VM
            └─> Google Gemini API
```

---

## Prerequisites

### Required Accounts

- [ ] GitHub account (for repository access)
- [ ] Google Cloud account (for Gemini API key)
- [ ] Deployment platform account (Render.com, Railway, etc.)
- [ ] Domain registrar (optional, for custom domain)

### Required Tools

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
```

### Required Credentials

- Google Gemini API Key ([Get it here](https://aistudio.google.com/apikey))
- GitHub repository access
- Deployment platform API key (if using CLI)

---

## Deployment Platforms

### Render.com (Recommended)

Render provides simple deployment with automatic HTTPS, health checks, and zero-downtime deploys.

#### Backend Deployment

**Step 1: Create Web Service**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `alearecuest/ProyectoFinal`
4. Configure service:

```yaml
Name: elio-backend
Environment: Node
Region: Oregon (US West) # or closest to your users
Branch: main
Root Directory: Server
Build Command: npm install && npm run build
Start Command: npm run prod
```

**Step 2: Configure Environment Variables**

```env
GEMINI_API_KEY=your_actual_api_key_here
NODE_ENV=production
PORT=10000
ALLOWED_ORIGINS=https://elio-frontend.onrender.com,https://yourdomain.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MINUTES=15
SESSION_TIMEOUT_MINUTES=30
GEMINI_MODEL=gemini-2.5-flash
MAX_OPTIONS=8
```

**Step 3: Configure Health Check**

```yaml
Health Check Path: /health
```

**Step 4: Deploy**

- Click "Create Web Service"
- Wait for initial deployment (~3-5 minutes)
- Note the URL: `https://elio-backend.onrender.com`

#### Frontend Deployment

**Step 1: Create Static Site**

1. Click "New +" → "Static Site"
2. Connect same repository
3. Configure:

```yaml
Name: elio-frontend
Branch: main
Root Directory: ui
Build Command: npm install && npm run build
Publish Directory: dist/ui/browser
```

**Step 2: Configure Environment Variables**

Create `ui/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://elio-backend.onrender.com'
};
```

**Step 3: Update Build Command**

```bash
npm install && npm run build -- --configuration production
```

**Step 4: Deploy**

- Click "Create Static Site"
- Wait for deployment (~2-3 minutes)
- Access at: `https://elio-frontend.onrender.com`

#### Custom Domain (Optional)

**Backend:**
1. Go to backend service settings
2. Click "Custom Domain"
3. Add: `api.yourdomain.com`
4. Update DNS with provided CNAME record

**Frontend:**
1. Go to frontend site settings
2. Click "Custom Domain"
3. Add: `yourdomain.com` or `www.yourdomain.com`
4. Update DNS with provided CNAME record

---

### Railway

Alternative platform with excellent developer experience.

#### Backend Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd Server
railway init

# Set environment variables
railway variables set GEMINI_API_KEY=your_key_here
railway variables set NODE_ENV=production
railway variables set ALLOWED_ORIGINS=https://your-frontend.railway.app

# Deploy
railway up
```

#### Frontend Deployment

```bash
cd ui

# Initialize
railway init

# Deploy
railway up
```

---

### Vercel (Frontend Only)

Vercel is optimized for frontend deployments.

#### Deployment Steps

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd ui
vercel

# Configure environment variables
vercel env add VITE_API_URL production
# Enter: https://your-backend-url.com

# Deploy to production
vercel --prod
```

**Note:** Backend must be deployed elsewhere (Render, Railway, etc.)

---

### DigitalOcean

For more control and potential cost savings at scale.

#### Droplet Setup

```bash
# 1. Create Ubuntu 22.04 droplet
# 2. SSH into server
ssh root@your-droplet-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install Nginx
sudo apt-get install nginx

# 5. Clone repository
git clone https://github.com/alearecuest/ProyectoFinal.git
cd ProyectoFinal
```

#### Backend Setup

```bash
cd Server

# Install dependencies
npm install

# Create .env
cat > .env << EOF
GEMINI_API_KEY=your_key_here
NODE_ENV=production
PORT=10000
ALLOWED_ORIGINS=https://yourdomain.com
EOF

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start npm --name "elio-backend" -- run prod

# Setup auto-restart
pm2 startup
pm2 save
```

#### Frontend Setup

```bash
cd ../ui

# Install dependencies
npm install

# Build
npm run build

# Copy build to Nginx
sudo cp -r dist/ui/browser/* /var/www/html/
```

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/elio

# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend proxy
    location /api {
        proxy_pass http://localhost:10000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/elio /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Environment Configuration

### Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | - | Google Gemini API key |
| `NODE_ENV` | Yes | development | Environment (`production` or `development`) |
| `PORT` | No | 10000 | Server port |
| `ALLOWED_ORIGINS` | Yes | - | Comma-separated CORS origins |
| `RATE_LIMIT_MAX` | No | 100 | Max requests per window |
| `RATE_LIMIT_WINDOW_MINUTES` | No | 15 | Rate limit window |
| `SESSION_TIMEOUT_MINUTES` | No | 30 | Session timeout |
| `GEMINI_MODEL` | No | gemini-2.5-flash | AI model to use |
| `MAX_OPTIONS` | No | 8 | Max history options |

### Frontend Environment Variables

**Production (`ui/src/environments/environment.prod.ts`):**

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com'
};
```

**Development (`ui/src/environments/environment.ts`):**

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:10000'
};
```

---

## Database Setup

**Current:** In-memory session storage (no database required)

**Future:** For production at scale, consider:

### Redis (Session Storage)

```bash
# Install Redis
sudo apt-get install redis-server

# Update backend to use Redis
npm install redis
```

```typescript
// Server/session-redis.ts
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

await client.connect();
```

### PostgreSQL (Audit Logging)

```bash
# Create database
createdb elio_audit

# Run migrations
npm run migrate:up
```

---

## Monitoring & Logging

### Health Monitoring

Setup uptime monitoring:

1. **UptimeRobot** (free tier)
   - Monitor: `https://your-api.com/health`
   - Interval: 5 minutes
   - Alert: Email/SMS on failure

2. **Render Native Monitoring**
   - Automatic health checks
   - Dashboard metrics
   - Email alerts

### Application Logging

**Recommended: Logtail/Papertrail**

```bash
# Install Winston logger
npm install winston winston-logtail

# Update server.ts
import { createLogger } from './utils/logger';
const logger = createLogger();
```

### Error Tracking

**Recommended: Sentry**

```bash
# Install Sentry
npm install @sentry/node

# Initialize in server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

---

## Scaling

### Horizontal Scaling

**Load Balancer Setup (Nginx):**

```nginx
upstream backend {
    server backend-1:10000;
    server backend-2:10000;
    server backend-3:10000;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

### Session Sharing

**Redis for Distributed Sessions:**

```typescript
// Share sessions across instances
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Store session
await redis.set(`session:${id}`, JSON.stringify(session));

// Retrieve session
const session = JSON.parse(await redis.get(`session:${id}`));
```

### CDN for Frontend

**Cloudflare Setup:**

1. Add site to Cloudflare
2. Update DNS to Cloudflare nameservers
3. Enable caching rules
4. Enable Brotli compression
5. Enable HTTP/3

---

## Troubleshooting

### Common Issues

#### CORS Errors

**Problem:** Frontend cannot reach backend

**Solution:**
```bash
# Verify ALLOWED_ORIGINS includes frontend URL
railway variables set ALLOWED_ORIGINS=https://frontend.com

# Check backend logs
railway logs
```

#### 502 Bad Gateway

**Problem:** Backend not responding

**Solution:**
```bash
# Check if backend is running
curl https://your-backend.com/health

# Check logs for errors
railway logs --tail 100

# Restart service
railway restart
```

#### Out of Memory

**Problem:** Backend crashes due to memory

**Solution:**
```bash
# Upgrade instance size on Render/Railway
# Or optimize session cleanup interval

# Current: 5 minutes
# Reduce to: 2 minutes
railway variables set SESSION_CLEANUP_INTERVAL_MINUTES=2
```

#### API Quota Exceeded

**Problem:** Gemini API quota exhausted

**Solution:**
1. Upgrade to paid Gemini API plan
2. Implement response caching
3. Add rate limiting per user
4. Use mock responses for development

---

## Checklist

### Pre-Deployment

- [ ] Test locally with production build
- [ ] Update environment variables
- [ ] Configure CORS origins
- [ ] Setup health check endpoint
- [ ] Add error tracking (Sentry)
- [ ] Configure logging

### Post-Deployment

- [ ] Verify health check passes
- [ ] Test all API endpoints
- [ ] Verify CORS configuration
- [ ] Setup monitoring alerts
- [ ] Configure custom domain
- [ ] Enable SSL/HTTPS
- [ ] Test complete user flow
- [ ] Document API URLs

### Security

- [ ] Use HTTPS only
- [ ] Restrict CORS origins
- [ ] Enable rate limiting
- [ ] Rotate API keys regularly
- [ ] Review security headers
- [ ] Setup WAF (Web Application Firewall)

---

## Production URLs

After deployment, document your URLs:

```
Production Frontend: https://your-frontend.com
Production Backend: https://your-backend.com
API Documentation: https://your-backend.com/docs
Health Check: https://your-backend.com/health
```

---

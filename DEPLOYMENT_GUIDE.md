# Manual Deployment Guide - HR Approval App for Initiative (HAI)

## Overview
This guide explains how to manually deploy the HAI application to a Linux/Windows server.

## Prerequisites
- Node.js 16+ and npm installed on the server
- Git (optional, for cloning the repository)
- A process manager like PM2 (recommended) or systemd
- Nginx or Apache (for serving the frontend and proxying backend)

---

## Deployment Steps

### 1. Prepare the Server

#### Install Node.js (if not installed)
```bash
# For Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# For Windows Server
# Download and install from: https://nodejs.org/
```

#### Install PM2 (Process Manager)
```bash
npm install -g pm2
```

#### Install Nginx (for reverse proxy)
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y nginx

# For Windows, download from: https://nginx.org/en/download.html
```

---

### 2. Upload/Clone Application Files

#### Option A: Using Git
```bash
cd /var/www
git clone https://github.com/frafeek/hrinitapp-hai-juniorbaikeoff.git hai-app
cd hai-app
```

#### Option B: Manual Upload
1. Create directory: `mkdir -p /var/www/hai-app`
2. Upload all files via FTP/SCP to `/var/www/hai-app/`

---

### 3. Backend Setup

```bash
cd /var/www/hai-app/backend

# Install dependencies
npm install --production

# Create .env file
cat > .env << EOF
PORT=3000
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=production
EOF

# Generate user accounts
node generatePasswords.js

# Create data directory if not exists
mkdir -p ../data

# Test the backend
node server.js
# Press Ctrl+C after verifying it starts successfully
```

---

### 4. Frontend Build

```bash
cd /var/www/hai-app/frontend

# Install dependencies
npm install

# Update API endpoint for production (if needed)
# Edit src/api.js to point to your production domain

# Build for production
npm run build
# This creates a 'dist' folder with optimized static files
```

---

### 5. Configure Backend with PM2

```bash
cd /var/www/hai-app/backend

# Start backend with PM2
pm2 start server.js --name hai-backend --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it outputs
```

**PM2 Useful Commands:**
```bash
pm2 list                  # View running apps
pm2 logs hai-backend      # View logs
pm2 restart hai-backend   # Restart app
pm2 stop hai-backend      # Stop app
pm2 delete hai-backend    # Remove from PM2
```

---

### 6. Configure Nginx

Create Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/hai-app
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    # Frontend - Serve static files
    location / {
        root /var/www/hai-app/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API - Reverse proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;
}
```

Enable the site:

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/hai-app /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

### 7. Update Frontend API Configuration

Before building, ensure the frontend points to the correct backend URL:

**Edit: `frontend/src/api.js`**

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api'  // Change this to your domain
  : 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ... rest of the file
```

Then rebuild:
```bash
cd /var/www/hai-app/frontend
npm run build
```

---

### 8. Set Proper Permissions

```bash
# Set ownership
sudo chown -R www-data:www-data /var/www/hai-app

# Set directory permissions
sudo find /var/www/hai-app -type d -exec chmod 755 {} \;

# Set file permissions
sudo find /var/www/hai-app -type f -exec chmod 644 {} \;

# Make data directory writable
sudo chmod 775 /var/www/hai-app/data
```

---

### 9. Setup SSL (Optional but Recommended)

Using Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Certbot will automatically update your Nginx config
```

---

### 10. Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Allow SSH (if not already allowed)
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable
```

---

## Verification

1. **Check Backend Status:**
   ```bash
   pm2 status
   curl http://localhost:3000/api/health
   ```

2. **Check Nginx:**
   ```bash
   sudo systemctl status nginx
   ```

3. **Access Application:**
   - Open browser: `http://your-domain.com`
   - Login with demo accounts:
     - PO: `po_admin` / `po123456`
     - User: `john_user` / `user123456`

---

## Monitoring & Logs

### Backend Logs (PM2)
```bash
pm2 logs hai-backend          # View live logs
pm2 logs hai-backend --lines 100  # View last 100 lines
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Application Logs
```bash
# Backend logs
tail -f /var/www/hai-app/backend/.pm2/logs/hai-backend-out.log
tail -f /var/www/hai-app/backend/.pm2/logs/hai-backend-error.log
```

---

## Updating the Application

```bash
# 1. Pull latest code (if using git)
cd /var/www/hai-app
git pull

# 2. Update backend
cd backend
npm install --production
pm2 restart hai-backend

# 3. Update frontend
cd ../frontend
npm install
npm run build

# 4. Clear Nginx cache (if applicable)
sudo systemctl reload nginx
```

---

## Backup Strategy

### Database Backup
```bash
# Create backup script
cat > /usr/local/bin/backup-hai-data.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/hai-app"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
cp /var/www/hai-app/data/*.json $BACKUP_DIR/backup_$DATE.tar.gz
# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-hai-data.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-hai-data.sh") | crontab -
```

---

## Troubleshooting

### Backend won't start
```bash
# Check logs
pm2 logs hai-backend

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart backend
pm2 restart hai-backend
```

### Frontend shows blank page
```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Verify build files exist
ls -la /var/www/hai-app/frontend/dist

# Check Nginx configuration
sudo nginx -t
```

### API calls failing
```bash
# Check CORS settings in backend/server.js
# Verify backend is running: curl http://localhost:3000/api/health
# Check browser console for errors
# Verify API_BASE_URL in frontend/src/api.js
```

### Permission errors
```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/hai-app

# Fix data directory permissions
sudo chmod 775 /var/www/hai-app/data
```

---

## Environment Variables

**Backend (.env):**
- `PORT` - Backend port (default: 3000)
- `GEMINI_API_KEY` - Google Gemini API key for AI features
- `NODE_ENV` - Environment (production/development)

---

## Security Recommendations

1. ✅ Use SSL/HTTPS in production
2. ✅ Set strong passwords in production (regenerate user accounts)
3. ✅ Keep Node.js and dependencies updated
4. ✅ Use environment variables for sensitive data
5. ✅ Enable firewall (ufw or iptables)
6. ✅ Regular backups of data directory
7. ✅ Monitor logs for suspicious activity
8. ✅ Consider using a reverse proxy (Nginx/Apache)
9. ✅ Implement rate limiting on API endpoints
10. ✅ Regular security updates: `apt-get update && apt-get upgrade`

---

## Alternative: Docker Deployment

For Docker deployment, see `DOCKER_DEPLOYMENT.md` (to be created).

---

## Support

For issues or questions:
- Check logs first (PM2 and Nginx)
- Review this guide
- Check GitHub repository issues

---

**Deployment Checklist:**
- [ ] Node.js installed
- [ ] Application files uploaded
- [ ] Backend dependencies installed
- [ ] .env file configured
- [ ] User accounts generated
- [ ] Frontend built
- [ ] PM2 configured
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Application tested
- [ ] Backups configured
- [ ] Monitoring setup

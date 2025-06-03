
# AWS Lightsail Deployment Guide for Elika Engineering MERN Stack

This guide provides step-by-step instructions to deploy the Elika Engineering job application system on AWS Lightsail.

## Prerequisites

1. AWS Account with Lightsail access
2. Domain name (optional but recommended)
3. Email account for SMTP (Gmail recommended)
4. Basic knowledge of Linux commands

## Step 1: Create Lightsail Instance

### 1.1 Create the Instance
1. Log in to AWS Lightsail Console
2. Click "Create instance"
3. Choose "Linux/Unix" platform
4. Select "OS Only" → "Ubuntu 20.04 LTS"
5. Choose instance plan:
   - **Recommended**: $10/month (2GB RAM, 1 vCPU, 60GB SSD)
   - **Minimum**: $5/month (1GB RAM, 1 vCPU, 40GB SSD)
6. Name your instance: `elika-engineering-app`
7. Click "Create instance"

### 1.2 Configure Networking
1. Go to "Networking" tab of your instance
2. Create static IP:
   - Click "Create static IP"
   - Attach to your instance
   - Name it: `elika-engineering-ip`
3. Configure firewall:
   - SSH (port 22) - Default
   - HTTP (port 80) - Default  
   - HTTPS (port 443) - Add this
   - Custom (port 5000) - Add for API during setup

## Step 2: Connect and Setup Server

### 2.1 Connect to Instance
```bash
# Use Lightsail browser SSH or download key and use:
ssh -i LightsailDefaultKey-*.pem ubuntu@YOUR_STATIC_IP
```

### 2.2 Update System and Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

### 2.3 Configure MongoDB
```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongosh
```

```javascript
// In MongoDB shell
use elika-engineering
db.createUser({
  user: "elikauser",
  pwd: "YOUR_SECURE_PASSWORD",
  roles: ["readWrite"]
})
exit
```

## Step 3: Deploy Backend

### 3.1 Clone and Setup Backend
```bash
# Create app directory
sudo mkdir -p /var/www/elika-engineering
sudo chown ubuntu:ubuntu /var/www/elika-engineering
cd /var/www/elika-engineering

# Clone your repository (replace with your repo URL)
git clone YOUR_REPOSITORY_URL .

# Navigate to backend
cd backend

# Install dependencies
npm install

# Create uploads directory
mkdir uploads
chmod 755 uploads
```

### 3.2 Configure Environment Variables
```bash
# Create production environment file
nano .env
```

```bash
# Production environment variables
NODE_ENV=production
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://elikauser:YOUR_SECURE_PASSWORD@localhost:27017/elika-engineering

# Email Configuration (using Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@elikaengineering.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Security
JWT_SECRET=your-very-secure-jwt-secret-key-here
```

### 3.3 Test Backend
```bash
# Test the backend
npm start

# In another terminal, test the API
curl http://localhost:5000/api/health
```

### 3.4 Setup PM2 for Backend
```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'elika-backend',
    script: 'server.js',
    cwd: '/var/www/elika-engineering/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/elika-backend-error.log',
    out_file: '/var/log/elika-backend-out.log',
    log_file: '/var/log/elika-backend.log'
  }]
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 4: Deploy Frontend

### 4.1 Build React App
```bash
cd /var/www/elika-engineering

# Install frontend dependencies
npm install

# Update API base URL for production
# Edit src/config/api.js or wherever you define API URLs
nano src/config/api.js
```

```javascript
// src/config/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api'  // Replace with your domain
  : 'http://localhost:5000/api';

export default API_BASE_URL;
```

```bash
# Build for production
npm run build

# Move build files to nginx directory
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
```

## Step 5: Configure Nginx

### 5.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/elika-engineering
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain
    
    # Frontend - React App
    location / {
        root /var/www/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # Enable gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Handle large file uploads
        client_max_body_size 10M;
    }
    
    # Uploaded files
    location /uploads/ {
        alias /var/www/elika-engineering/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5.2 Enable Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/elika-engineering /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Step 6: SSL Certificate (Optional but Recommended)

### 6.1 Install Certbot
```bash
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 6.2 Get SSL Certificate
```bash
# Get certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 7: Configure Email

### 7.1 Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select app: Mail, Select device: Other → "Elika Engineering"
   - Copy the generated password

### 7.2 Update Backend Environment
```bash
cd /var/www/elika-engineering/backend
nano .env
```

Update with your Gmail credentials:
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-from-gmail
ADMIN_EMAIL=admin@elikaengineering.com
```

```bash
# Restart backend
pm2 restart elika-backend
```

## Step 8: Database Backup Setup

### 8.1 Create Backup Script
```bash
sudo nano /usr/local/bin/backup-mongo.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --host localhost --port 27017 --db elika-engineering --out $BACKUP_DIR/backup_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -name "backup_*" -mtime +7 -exec rm -rf {} +

echo "Backup completed: $BACKUP_DIR/backup_$DATE"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-mongo.sh

# Add to crontab (daily backup at 2 AM)
sudo crontab -e
```

Add this line:
```
0 2 * * * /usr/local/bin/backup-mongo.sh >> /var/log/mongodb-backup.log 2>&1
```

## Step 9: Monitoring and Logs

### 9.1 Setup Log Rotation
```bash
sudo nano /etc/logrotate.d/elika-engineering
```

```
/var/log/elika-*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 9.2 Monitoring Commands
```bash
# Check backend status
pm2 status
pm2 logs elika-backend

# Check MongoDB status
sudo systemctl status mongod

# Check Nginx status
sudo systemctl status nginx

# Check Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h
```

## Step 10: Domain Configuration

### 10.1 Point Domain to Lightsail
1. In your domain registrar's DNS settings:
   - Create A record: `@` → Your Lightsail static IP
   - Create A record: `www` → Your Lightsail static IP
2. Wait for DNS propagation (24-48 hours)

### 10.2 Update Configuration
```bash
# Update Nginx config with your actual domain
sudo nano /etc/nginx/sites-available/elika-engineering
# Replace "your-domain.com" with your actual domain

# Update backend CORS settings
cd /var/www/elika-engineering/backend
nano server.js
```

Update CORS origins:
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com', 'https://www.your-domain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

```bash
# Restart services
pm2 restart elika-backend
sudo systemctl restart nginx
```

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   ```bash
   pm2 logs elika-backend
   sudo systemctl restart nginx
   ```

2. **MongoDB Connection Issues**
   ```bash
   sudo systemctl status mongod
   mongosh
   ```

3. **File Upload Issues**
   ```bash
   ls -la /var/www/elika-engineering/backend/uploads
   chmod 755 /var/www/elika-engineering/backend/uploads
   ```

4. **Email Not Working**
   - Check Gmail app password
   - Verify firewall allows outbound SMTP (port 587)

### Performance Optimization

1. **Enable Gzip in Nginx** (already included in config)
2. **Optimize MongoDB**:
   ```bash
   mongosh
   db.jobapplications.createIndex({email: 1, position: 1})
   db.jobapplications.createIndex({status: 1})
   db.jobapplications.createIndex({applicationDate: -1})
   ```

3. **Setup MongoDB Memory Optimization**:
   ```bash
   sudo nano /etc/mongod.conf
   ```
   Add:
   ```yaml
   storage:
     wiredTiger:
       engineConfig:
         cacheSizeGB: 0.5  # Adjust based on available RAM
   ```

## Security Checklist

- ✅ Firewall configured (only necessary ports open)
- ✅ MongoDB authentication enabled
- ✅ SSL certificate installed
- ✅ Environment variables secured
- ✅ File upload restrictions in place
- ✅ Rate limiting enabled
- ✅ Regular backups scheduled
- ✅ Log rotation configured

## Maintenance

### Regular Tasks
1. **Weekly**: Check PM2 status and logs
2. **Monthly**: Update system packages
3. **Monthly**: Review and clean old backups
4. **Quarterly**: Review and update dependencies

### Update Process
```bash
# Update backend
cd /var/www/elika-engineering
git pull origin main
cd backend
npm install
pm2 restart elika-backend

# Update frontend
cd /var/www/elika-engineering
npm install
npm run build
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
```

Your Elika Engineering MERN stack application is now deployed on AWS Lightsail!

Access your application at: `https://your-domain.com`
API endpoint: `https://your-domain.com/api`

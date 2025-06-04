
# Production Deployment Checklist

## Before Deployment

### 1. Environment Configuration
- [ ] Update `.env` with production API URL
- [ ] Update `backend/.env` with production database URI
- [ ] Set secure JWT secret key
- [ ] Configure email credentials (Gmail app password)
- [ ] Update CORS origins in `backend/server.js` with your domain/IP

### 2. Database Setup
- [ ] MongoDB is running and accessible
- [ ] Database user created with proper permissions
- [ ] Test database connection

### 3. Domain/IP Configuration
Replace placeholders in these files:
- [ ] `.env` - Replace `https://your-lightsail-domain.com` with your actual domain/IP
- [ ] `backend/server.js` - Add your Lightsail IP/domain to CORS origins
- [ ] Nginx configuration - Update server_name with your domain

## Deployment Steps

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```

### 2. Frontend Build
```bash
npm install
npm run build
```

### 3. Test Endpoints
- [ ] Health check: `curl http://your-ip:5000/api/health`
- [ ] CORS test: Test from browser console
- [ ] Database connection: Check MongoDB logs

### 4. Common Issues & Solutions

#### "Failed to fetch" Error
- Check if backend server is running: `pm2 status`
- Verify CORS configuration includes your domain
- Check firewall rules (ports 80, 443, 5000)

#### Database Connection Issues
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check connection string in backend/.env
- Test with: `mongosh "your-connection-string"`

#### CORS Errors
- Add your domain to CORS origins in backend/server.js
- Restart backend: `pm2 restart elika-backend`

#### 404 API Errors
- Verify API base URL in frontend .env
- Check Nginx proxy configuration
- Ensure all routes are properly configured

## Testing Checklist

After deployment, test these features:
- [ ] Contact form submission
- [ ] Job application submission (with file upload)
- [ ] Admin login (admin@elikaengineering.com / admin123)
- [ ] Admin dashboard access
- [ ] View applications in admin panel
- [ ] Update application status

## URLs to Test

Replace `your-domain.com` with your actual domain:

- Frontend: `https://your-domain.com`
- API Health: `https://your-domain.com/api/health`
- Admin: `https://your-domain.com/admin`

## Emergency Rollback

If issues occur:
```bash
# Check logs
pm2 logs elika-backend
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart elika-backend
sudo systemctl restart nginx

# Database backup restore
mongorestore /path/to/backup
```

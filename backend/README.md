
# Elika Engineering Backend

This is the backend API for the Elika Engineering recruitment platform.

## Requirements

- **Node.js**: 22 LTS or higher
- **npm**: 11.4.2 or higher
- **MongoDB**: 4.4 or higher

## Quick Start

1. **Check your Node.js and npm versions:**
   ```bash
   node --version  # Should be v22.x.x or higher
   npm --version   # Should be 11.4.2 or higher
   ```

2. **Upgrade if needed:**
   ```bash
   # Install Node.js 22 LTS from https://nodejs.org/
   # Upgrade npm
   npm install -g npm@latest
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values.

5. **Start MongoDB:**
   Make sure MongoDB is running on your system.

6. **Start the server:**
   ```bash
   npm run dev
   ```

7. **Seed sample data (optional):**
   ```bash
   npm run seed
   ```

## Security Updates

This version includes important security updates:

- **Multer**: Upgraded to 2.x to patch known vulnerabilities in 1.x
- **Express**: Updated to latest stable version
- **Mongoose**: Updated to v8.x with latest security patches
- **Helmet**: Updated to v8.x for enhanced security headers
- **Express Rate Limit**: Updated to v7.x for better DDoS protection

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Job Applications
- `POST /api/applications` - Submit job application
- `GET /api/applications` - Get all applications (admin)
- `GET /api/applications/:id` - Get specific application
- `PUT /api/applications/:id/status` - Update application status
- `GET /api/applications/:id/resume` - Download resume

### Jobs
- `GET /api/jobs` - Get all active jobs
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create job (admin)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Contact
- `POST /api/contact` - Submit contact form

## Environment Variables

Required environment variables:

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password
- `ADMIN_EMAIL` - Admin email
- `ADMIN_PASSWORD` - Admin password
- `JWT_SECRET` - JWT secret key

## Default Admin Credentials

- Email: `admin@elikaengineering.com`
- Password: `admin123`

**⚠️ Change these in production!**

## Troubleshooting

### Version Compatibility Issues
If you encounter issues after upgrading:

1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules`
3. Reinstall dependencies: `npm install`
4. Restart the server: `npm run dev`

### Multer 2.x Migration
The file upload functionality has been updated for Multer 2.x compatibility. If you experience file upload issues, ensure your client is sending proper multipart/form-data requests.

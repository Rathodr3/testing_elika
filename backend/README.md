
# Elika Engineering Backend

This is the backend API for the Elika Engineering recruitment platform.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values.

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Seed sample data (optional):**
   ```bash
   npm run seed
   ```

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

# GoDaddy Deployment Guide for Auto Direct

## Overview
This guide will help you deploy both the frontend (React) and backend (Node.js API) to GoDaddy hosting.

## Prerequisites
- GoDaddy hosting account with cPanel access
- Database hosting (GoDaddy MySQL or external database)
- Domain name configured

## Step 1: Prepare Backend for Production

### 1.1 Create Production Environment File
Create `.env` file in `auto-direct-api/` directory:

```env
NODE_ENV=production
PORT=3001
DB_HOST=your_database_host
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=autos-direct
JWT_SECRET=your_jwt_secret_key
```

### 1.2 Update Database Configuration
Modify `auto-direct-api/config/connectionsConfig.js`:

```javascript
const connectionConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345678",
  database: process.env.DB_NAME || "autos-direct",
  port: process.env.DB_PORT || 3306
}

const jwtKey = process.env.JWT_SECRET || "your_jwt_secret_key";

module.exports = {connectionConfig, jwtKey};
```

### 1.3 Create Production Start Script
Add to `auto-direct-api/package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "prod": "NODE_ENV=production node index.js"
  }
}
```

## Step 2: Prepare Frontend for Production

### 2.1 Update API Base URL
Modify `auto-direct-app/src/data/api-calls.js`:

```javascript
// For production, use your domain
const api = process.env.NODE_ENV === 'production' 
  ? 'https://yourdomain.com/api' 
  : '/api';

export default api;
```

### 2.2 Build Frontend
```bash
cd auto-direct-app
npm run build
```

This creates a `dist/` folder with production files.

## Step 3: GoDaddy Deployment

### 3.1 Upload Backend (API)
1. **Via cPanel File Manager:**
   - Navigate to your domain's root directory (usually `public_html/`)
   - Create a folder called `api/`
   - Upload all files from `auto-direct-api/` to `api/` folder
   - Upload `vehicle-images/` folder to `api/` directory

2. **Via FTP:**
   - Connect to your GoDaddy FTP
   - Upload `auto-direct-api/` contents to `/api/` directory
   - Upload `vehicle-images/` to `/api/vehicle-images/`

### 3.2 Upload Frontend
1. **Via cPanel File Manager:**
   - Upload all contents from `auto-direct-app/dist/` to `public_html/`
   - This includes `index.html`, `assets/` folder, etc.

2. **Via FTP:**
   - Upload `dist/` contents to root directory (`/`)

### 3.3 Configure GoDaddy Hosting

#### Option A: Using GoDaddy's Node.js Hosting (Recommended)
1. In cPanel, go to "Node.js" section
2. Create a new Node.js application:
   - **Application Root**: `/api`
   - **Application URL**: `yourdomain.com/api`
   - **Application Startup File**: `index.js`
3. Set environment variables in Node.js app settings
4. Start the application

#### Option B: Using Shared Hosting with .htaccess
Create `.htaccess` file in `public_html/`:

```apache
RewriteEngine On

# Handle API requests
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ /api/index.php [QSA,L]

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Step 4: Database Setup

### 4.1 Create Database
1. In cPanel, go to "MySQL Databases"
2. Create database: `autos-direct`
3. Create user and assign to database
4. Import your database schema from `auto-direct-api/data/`

### 4.2 Update Connection Details
Update your `.env` file with GoDaddy database credentials.

## Step 5: Configure Domain and SSL

### 5.1 Domain Configuration
- Ensure your domain points to the correct hosting
- Set up subdomain for API if needed (e.g., `api.yourdomain.com`)

### 5.2 SSL Certificate
- Enable SSL certificate in cPanel
- Update API calls to use HTTPS

## Step 6: Testing

### 6.1 Test API Endpoints
```bash
curl https://yourdomain.com/api/vehicle/browse-vehicles
```

### 6.2 Test Frontend
- Visit your domain
- Check if cars are loading
- Test login/registration
- Test all functionality

## Step 7: Troubleshooting

### Common Issues:

1. **Cars not appearing:**
   - Check API is running: `https://yourdomain.com/api/vehicle/browse-vehicles`
   - Verify database connection
   - Check CORS settings

2. **Images not loading:**
   - Verify `vehicle-images/` folder is uploaded
   - Check file permissions (755)
   - Verify image paths in database

3. **API not responding:**
   - Check Node.js application is running
   - Verify environment variables
   - Check server logs

4. **CORS errors:**
   - Update CORS settings in `index.js`
   - Add your domain to allowed origins

### Debug Steps:
1. Check GoDaddy error logs
2. Test API endpoints directly
3. Verify database connectivity
4. Check file permissions
5. Test with different browsers

## Step 8: Maintenance

### Regular Tasks:
- Monitor server logs
- Update dependencies
- Backup database regularly
- Monitor performance

### Security:
- Keep dependencies updated
- Use strong passwords
- Enable HTTPS
- Regular security scans

## Alternative: Separate API Hosting

If GoDaddy doesn't support Node.js well, consider:
- **Heroku** for API (free tier available)
- **Railway** for API
- **DigitalOcean** for both
- **Vercel** for frontend + **Railway** for API

This approach often works better for full-stack applications.

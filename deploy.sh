#!/bin/bash

# Auto Direct Deployment Script for GoDaddy
echo "🚀 Starting Auto Direct Deployment..."

# Build frontend
echo "📦 Building frontend..."
cd auto-direct-app
npm run build
echo "✅ Frontend built successfully"

# Go back to root
cd ..

# Create deployment package
echo "📁 Creating deployment package..."
mkdir -p deployment/frontend
mkdir -p deployment/api

# Copy frontend build files
cp -r auto-direct-app/dist/* deployment/frontend/
echo "✅ Frontend files copied"

# Copy API files
cp -r auto-direct-api/* deployment/api/
echo "✅ API files copied"

# Copy vehicle images
cp -r auto-direct-api/vehicle-images deployment/api/
echo "✅ Vehicle images copied"

# Create deployment instructions
cat > deployment/DEPLOYMENT_INSTRUCTIONS.txt << EOF
GoDaddy Deployment Instructions
==============================

1. FRONTEND DEPLOYMENT:
   - Upload all files from 'frontend/' folder to your domain's public_html/ directory
   - This includes index.html, assets/ folder, etc.

2. API DEPLOYMENT:
   - Upload all files from 'api/' folder to a subdirectory like 'api/' in your domain
   - Make sure vehicle-images/ folder is included
   - Set up Node.js application in cPanel if available

3. DATABASE SETUP:
   - Create MySQL database in cPanel
   - Import your database schema
   - Update .env file with production database credentials

4. ENVIRONMENT VARIABLES:
   - Create .env file in api/ directory with:
     NODE_ENV=production
     PORT=3001
     DB_HOST=your_database_host
     DB_USER=your_database_username
     DB_PASSWORD=your_database_password
     DB_NAME=autos-direct
     JWT_SECRET=your_jwt_secret

5. TESTING:
   - Test API: https://yourdomain.com/api/vehicle/browse-vehicles
   - Test frontend: https://yourdomain.com
   - Check if cars are loading properly

For detailed instructions, see DEPLOYMENT_GUIDE.md
EOF

echo "✅ Deployment package created in 'deployment/' folder"
echo "📋 See deployment/DEPLOYMENT_INSTRUCTIONS.txt for next steps"
echo "🎉 Ready for GoDaddy deployment!"

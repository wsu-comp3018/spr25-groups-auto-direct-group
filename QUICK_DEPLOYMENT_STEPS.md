# Quick GoDaddy Deployment Steps

## 🚀 Ready to Deploy! Your files are prepared in the `deployment/` folder.

### Step 1: Upload Frontend (5 minutes)
1. **Go to cPanel File Manager**
2. **Navigate to `public_html/`**
3. **Upload ALL files from `deployment/frontend/` folder**
   - This includes `index.html`, `assets/` folder, etc.
4. **Make sure `black.png` is in `public_html/assets/`**

### Step 2: Upload Backend API (10 minutes)
1. **Create a folder called `api/` in your domain root**
2. **Upload ALL files from `deployment/api/` folder to `api/`**
3. **Make sure `vehicle-images/` folder is included**

### Step 3: Set Up Database (15 minutes)
1. **Go to cPanel → MySQL Databases**
2. **Create database:** `autos-direct`
3. **Create user and assign to database**
4. **Import your database schema** (from `auto-direct-api/data/`)

### Step 4: Configure Environment Variables (5 minutes)
1. **In cPanel File Manager, go to `api/` folder**
2. **Create `.env` file with:**
```env
NODE_ENV=production
PORT=3001
DB_HOST=your_database_host
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=autos-direct
JWT_SECRET=your_jwt_secret_key
```

### Step 5: Set Up Node.js App (10 minutes)
1. **Go to cPanel → Node.js**
2. **Create new Node.js application:**
   - **Application Root:** `/api`
   - **Application URL:** `yourdomain.com/api`
   - **Application Startup File:** `index.js`
3. **Set environment variables in Node.js settings**
4. **Start the application**

### Step 6: Test Your Deployment (5 minutes)
1. **Test API:** Visit `https://yourdomain.com/api/vehicle/browse-vehicles`
2. **Test Frontend:** Visit `https://yourdomain.com`
3. **Check if cars are loading**

## 🔧 If Cars Don't Appear:

### Check These:
1. **API is running:** Test the API URL directly
2. **Database connection:** Check if database credentials are correct
3. **CORS settings:** Make sure API allows your domain
4. **File permissions:** Ensure images are accessible

### Quick Fixes:
- **Check GoDaddy error logs**
- **Verify all files uploaded correctly**
- **Test API endpoints with curl or Postman**

## 📞 Need Help?
- Check `DEPLOYMENT_GUIDE.md` for detailed instructions
- Look at GoDaddy's Node.js hosting documentation
- Test each step individually

## 🎯 Success Indicators:
- ✅ API responds at `/api/vehicle/browse-vehicles`
- ✅ Frontend loads at your domain
- ✅ Cars appear in browse section
- ✅ Login/registration works
- ✅ Images load properly

Your deployment package is ready in the `deployment/` folder!

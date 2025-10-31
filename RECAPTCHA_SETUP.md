# reCAPTCHA Setup for Live Site

## What You Need for Production

### 1. Register Your Site with Google reCAPTCHA

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click **"+ Create"** to register a new site
3. Fill in the registration form:
   - **Label**: Give your site a name (e.g., "AutoDirect Production")
   - **reCAPTCHA type**: Select **"reCAPTCHA v2"** → **"I'm not a robot" Checkbox**
   - **Domains**: Add your production domains:
     - `yourdomain.com`
     - `www.yourdomain.com`
     - Add `localhost` if you want to test locally with production keys
   - **Owners**: Add email addresses that should have access
4. Click **"Submit"**
5. **Copy your keys**:
   - **Site Key** (public key - used in frontend)
   - **Secret Key** (private key - used in backend, keep it secret!)

### 2. Environment Variables Setup

✅ **Done!** Environment variables have been configured with your keys.

#### Frontend (`auto-direct-app/.env`)
The frontend `.env.example` file has been created with your site key:
```env
VITE_RECAPTCHA_SITE_KEY=6LfKgtcrAAAAAGCmjr1qoXSMbp3tU-yHP-Cl_44r
```

**To use it:**
1. Copy `.env.example` to `.env`:
   ```bash
   cd auto-direct-app
   cp .env.example .env
   ```

#### Backend (`auto-direct-api/.env`)
The backend `.env.example` file has been created with your secret key:
```env
RECAPTCHA_SECRET_KEY=6LfKgtcrAAAAAJZ2BL_4DGDVqNytFjer40klwvsP
```

**To use it:**
1. Copy `.env.example` to `.env`:
   ```bash
   cd auto-direct-api
   cp .env.example .env
   ```

**Note**: The backend already has `dotenv` installed and configured in `index.js`, so it will automatically load the `.env` file when you start the server.

### 3. Security Notes

- ✅ **Site Key** can be public (safe to expose in frontend code)
- 🔒 **Secret Key** must be kept private (never commit to git)
- ✅ Add `.env` files to `.gitignore` to prevent accidental commits
- ✅ Use different keys for development and production
- ✅ Regularly rotate keys if compromised

### 4. Current Status

- **Register Page**: reCAPTCHA enabled (using test keys)
- **Login Page**: reCAPTCHA disabled for development (needs to be enabled for production)

### 5. Testing

**Development/Test Keys** (currently in use):
- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

These always pass verification but show "TESTING" on the widget.

**Production Keys**: Will require actual user verification.


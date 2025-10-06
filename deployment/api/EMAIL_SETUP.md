# Email Setup for Complaints System

## Overview
The complaints system now sends emails directly to `22070210@student.westernsydney.edu.au` when a complaint is submitted.

## Setup Instructions

### 1. Install Nodemailer
```bash
cd auto-direct-api
npm install nodemailer
```

### 2. Configure Email Settings
Edit `auto-direct-api/email-config.js` and update the email credentials:

```javascript
module.exports = {
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Your Gmail address
    pass: 'your-app-password'     // Your Gmail App Password
  }
};
```

### 3. Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in the config file

### 4. Alternative Email Services
You can use other email services by changing the configuration:

**Outlook/Hotmail:**
```javascript
service: 'hotmail',
auth: {
  user: 'your-email@outlook.com',
  pass: 'your-password'
}
```

**Yahoo:**
```javascript
service: 'yahoo',
auth: {
  user: 'your-email@yahoo.com',
  pass: 'your-app-password'
}
```

## How It Works
1. User submits complaint form
2. Data is saved to MySQL database
3. Email is automatically sent to `22070210@student.westernsydney.edu.au`
4. Email contains all complaint details in HTML format

## Testing
1. Start the API server: `npm start`
2. Submit a test complaint through the web form
3. Check the email inbox for the complaint notification

## Troubleshooting
- Check console logs for email errors
- Verify email credentials are correct
- Ensure 2FA is enabled for Gmail
- Check spam folder for emails

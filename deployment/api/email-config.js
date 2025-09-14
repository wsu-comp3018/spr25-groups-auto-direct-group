// Email configuration for complaints system
// Update these settings with your email credentials

module.exports = {
  // Gmail Configuration (recommended)
  service: 'gmail',
  auth: {
    user: 'autosdirect.au@gmail.com',    // Your Gmail address
    pass: 'vnmn yqxk srae hiae'          // Your Gmail App Password
  },
  
  // Alternative configurations for other email services:
  
  // For Outlook/Hotmail:
  // service: 'hotmail',
  // auth: {
  //   user: 'your-email@outlook.com',
  //   pass: 'your-password'
  // }
  
  // For Yahoo:
  // service: 'yahoo',
  // auth: {
  //   user: 'your-email@yahoo.com',
  //   pass: 'your-app-password'
  // }
  
  // For custom SMTP:
  // host: 'smtp.your-provider.com',
  // port: 587,
  // secure: false,
  // auth: {
  //   user: 'your-email@domain.com',
  //   pass: 'your-password'
  // }
};

// Email service debug test
const nodemailer = require('nodemailer');

// Test email configuration
const testEmailConfig = {
  service: 'gmail',
  auth: {
    user: 'autosdirect.au@gmail.com',
    pass: 'vnmn yqxk srae hiae'
  }
};

async function testEmailConnection() {
  console.log('🔧 Testing email connection...');
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport(testEmailConfig);
    
    // Verify connection
    console.log('📡 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    // Send test email
    console.log('📧 Sending test email...');
    const testEmail = {
      from: testEmailConfig.auth.user,
      to: testEmailConfig.auth.user, // Send to self for testing
      subject: 'Auto Direct - Email Test',
      html: `
        <h2>Email Service Test</h2>
        <p>This is a test email from Auto Direct email service.</p>
        <p>If you receive this, the email configuration is working correctly!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error details:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed - check email and app password');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🌐 Network error - check internet connection');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('⏰ Connection timeout - check firewall/network settings');
    }
    
    return false;
  }
}

// Run the test
console.log('🚀 Starting email service test...');
testEmailConnection()
  .then((success) => {
    if (success) {
      console.log('\n✅ Email service is working correctly!');
      console.log('📋 Next steps:');
      console.log('1. Check your inbox for the test email');
      console.log('2. Try submitting a test drive booking or vehicle comparison request');
      console.log('3. Check spam folder if emails don\'t appear in inbox');
    } else {
      console.log('\n❌ Email service needs attention');
      console.log('📋 Check the error details above and fix configuration');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
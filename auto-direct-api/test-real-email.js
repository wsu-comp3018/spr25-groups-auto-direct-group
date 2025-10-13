// Test the actual email confirmation with real database data
const mysql = require('mysql2');
const { connectionConfig } = require('./config/connectionsConfig.js');
const { sendTestDriveConfirmationEmail, sendComparisonConfirmationEmail } = require('./service/email-service.js');

async function testRealEmailConfirmation() {
  console.log('🔧 Testing email confirmation with real database data...');
  
  const pool = mysql.createPool(connectionConfig);
  
  try {
    // Get a real user from the database
    console.log('📋 Fetching real user data...');
    const userResult = await new Promise((resolve, reject) => {
      pool.query('SELECT userID, firstName, lastName, emailAddress, phone FROM users LIMIT 1', (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    if (!userResult || userResult.length === 0) {
      console.error('❌ No users found in database');
      return;
    }
    
    // Get a real vehicle from the database  
    console.log('🚗 Fetching real vehicle data...');
    const vehicleResult = await new Promise((resolve, reject) => {
      pool.query(`
        SELECT v.vehicleID, v.modelName, v.price, v.bodyType, v.colour, v.description, m.makeName 
        FROM vehicles v 
        LEFT JOIN makes m ON v.makeID = m.makeID 
        LIMIT 1
      `, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    if (!vehicleResult || vehicleResult.length === 0) {
      console.error('❌ No vehicles found in database');
      return;
    }
    
    const user = userResult[0];
    const vehicle = vehicleResult[0];
    
    console.log('👤 User found:', user.firstName, user.lastName, '(', user.emailAddress, ')');
    console.log('🚗 Vehicle found:', vehicle.makeName, vehicle.modelName);
    
    // Test with your email instead of the user's email
    const customerData = {
      firstName: user.firstName || 'Test',
      lastName: user.lastName || 'Customer', 
      email: 'husselache2005@gmail.com', // Use your email for testing
      phone: user.phone || '+61 123 456 789',
      preferredDate: '2025-10-05',
      preferredTime: '2:00 PM'
    };
    
    const vehicleData = {
      makeName: vehicle.makeName || '',
      modelName: vehicle.modelName || '',
      year: 'N/A',
      price: vehicle.price || '',
      bodyType: vehicle.bodyType || '',
      colour: vehicle.colour || '',
      description: vehicle.description || ''
    };
    
    console.log('\n📧 Sending test drive confirmation email...');
    const emailResult = await sendTestDriveConfirmationEmail(customerData, vehicleData);
    
    if (emailResult.success) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', emailResult.messageId);
      console.log('📋 Check husselache2005@gmail.com for the confirmation email');
    } else {
      console.error('❌ Email failed:', emailResult.error);
    }
    
  } catch (error) {
    console.error('💥 Error during test:', error);
  } finally {
    pool.end();
  }
}

// Run the test
testRealEmailConfirmation()
  .then(() => {
    console.log('\n✅ Real database test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
// Test email confirmations with specific email address
const { sendTestDriveConfirmationEmail, sendComparisonConfirmationEmail } = require('./service/email-service.js');

async function testEmailConfirmations() {
  console.log('🚀 Testing email confirmations with husselache2005@gmail.com...');
  
  // Test customer data
  const customerData = {
    firstName: 'Test',
    lastName: 'Customer',
    email: 'husselache2005@gmail.com',
    phone: '+61 123 456 789',
    preferredDate: '2025-10-05',
    preferredTime: '10:00 AM'
  };
  
  // Test vehicle data
  const vehicleData = {
    makeName: 'Toyota',
    modelName: 'Camry',
    year: '2024',
    price: '45000'
  };
  
  try {
    console.log('\n📧 Testing Test Drive Confirmation Email...');
    const testDriveResult = await sendTestDriveConfirmationEmail(customerData, vehicleData);
    
    if (testDriveResult.success) {
      console.log('✅ Test Drive confirmation email sent successfully!');
      console.log('📧 Message ID:', testDriveResult.messageId);
    } else {
      console.error('❌ Test Drive email failed:', testDriveResult.error);
    }
    
    console.log('\n📧 Testing Vehicle Comparison Confirmation Email...');
    
    // Test vehicle comparison data (array of vehicles)
    const comparisonVehicles = [
      {
        makeName: 'Toyota',
        modelName: 'Camry',
        year: '2024',
        price: '45000',
        description: 'Reliable mid-size sedan with excellent fuel economy'
      },
      {
        makeName: 'Honda',
        modelName: 'Accord',
        year: '2024',
        price: '47000',
        description: 'Spacious sedan with advanced safety features'
      },
      {
        makeName: 'Mazda',
        modelName: 'CX-5',
        year: '2024',
        price: '52000',
        description: 'Compact SUV with premium interior and handling'
      }
    ];
    
    // Add message to customer data for comparison
    const comparisonCustomerData = {
      ...customerData,
      message: 'Please provide detailed comparison of fuel efficiency, safety ratings, and maintenance costs.'
    };
    
    const comparisonResult = await sendComparisonConfirmationEmail(comparisonCustomerData, comparisonVehicles);
    
    if (comparisonResult.success) {
      console.log('✅ Vehicle Comparison confirmation email sent successfully!');
      console.log('📧 Message ID:', comparisonResult.messageId);
    } else {
      console.error('❌ Vehicle Comparison email failed:', comparisonResult.error);
    }
    
    console.log('\n🎉 Email confirmation tests completed!');
    console.log('📋 Check your inbox at husselache2005@gmail.com');
    console.log('📋 Don\'t forget to check your spam/junk folder');
    console.log('📋 You should receive 2 emails:');
    console.log('   1. Test Drive Booking Confirmation');
    console.log('   2. Vehicle Comparison Request Confirmation');
    
  } catch (error) {
    console.error('💥 Unexpected error during email tests:', error);
  }
}

// Run the test
testEmailConfirmations()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
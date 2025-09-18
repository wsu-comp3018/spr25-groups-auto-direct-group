const { emailService } = require('./service/email-service.js');

// Test logistics email with sample data
const testData = {
  orderID: 'SUBSA123UP',
  customerDetails: {
    firstName: 'Sayed',
    lastName: 'Amini',
    email: 'sayed02w@gmail.com',
    phone: '+61434146010',
    streetNumber: '123',
    streetName: 'George Street',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    testDriveRequested: false
  },
  vehicleDetails: {
    makeName: 'Subaru',
    modelName: 'BRZ',
    price: 50000,
    transmission: 'Manual',
    bodyType: 'Coupe',
    driveType: 'Rear Wheel Drive',
    vin: 'JF1VA1J62N9024523'
  }
};

console.log('🧪 Testing logistics email...');
console.log('📧 Test data:', JSON.stringify(testData, null, 2));

// Send logistics email directly
emailService.sendLogisticsTeamNotification(
  testData.customerDetails, 
  testData.vehicleDetails, 
  testData.orderID
)
  .then(result => {
    console.log('✅ Logistics email sent successfully!');
    console.log('📧 Result:', result);
  })
  .catch(error => {
    console.error('❌ Email failed to send:');
    console.error(error);
  });
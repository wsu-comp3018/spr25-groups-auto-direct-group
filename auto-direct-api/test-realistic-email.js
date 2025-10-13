// Test email confirmation with realistic test drive booking data
const { sendTestDriveConfirmationEmail } = require('./service/email-service.js');

async function testRealisticEmailConfirmation() {
  console.log('🎯 Testing email confirmation with realistic test drive booking data...');
  
  // Simulate real form data that would be submitted by a customer
  const formData = {
    slot: '2:00 PM',
    suburb: 'Melbourne CBD', 
    name: 'John Smith',
    email: 'husselache2005@gmail.com', // Use your email for testing
    phone: '0412 345 678',
    date: '2025-10-08'
  };
  
  // Simulate the notes string format: "slot | suburb | name | email | phone | date"
  const notes = `${formData.slot} | ${formData.suburb} | ${formData.name} | ${formData.email} | ${formData.phone} | ${formData.date}`;
  
  console.log('📋 Simulated notes from frontend:', notes);
  
  // Parse the notes like the backend does
  let parsedNotes = {
    slot: 'To be confirmed',
    suburb: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    requestedDate: 'To be confirmed'
  };
  
  if (notes && typeof notes === 'string') {
    const noteParts = notes.split('|').map(part => part.trim());
    if (noteParts.length >= 6) {
      parsedNotes = {
        slot: noteParts[0] || 'To be confirmed',
        suburb: noteParts[1] || '',
        customerName: noteParts[2] || '',
        customerEmail: noteParts[3] || '',
        customerPhone: noteParts[4] || '',
        requestedDate: noteParts[5] || 'To be confirmed'
      };
    }
  }
  
  console.log('🔍 Parsed customer data:', parsedNotes);
  
  // Prepare customer data for email - this mirrors what the backend does
  const customerData = {
    firstName: parsedNotes.customerName.split(' ')[0] || '',
    lastName: parsedNotes.customerName.split(' ').slice(1).join(' ') || '',
    email: parsedNotes.customerEmail || '',
    phone: parsedNotes.customerPhone || '',
    preferredDate: parsedNotes.requestedDate || 'To be confirmed',
    preferredTime: parsedNotes.slot || 'To be confirmed',
    suburb: parsedNotes.suburb || '',
    notes: notes || ''
  };
  
  // Sample vehicle data (like what would come from database)
  const vehicleData = {
    makeName: 'Toyota',
    modelName: 'Camry Hybrid',
    year: 'N/A',
    price: '42000',
    bodyType: 'Sedan',
    colour: 'White',
    description: 'Fuel-efficient hybrid sedan with advanced safety features'
  };
  
  console.log('👤 Customer data for email:', customerData);
  console.log('🚗 Vehicle data for email:', vehicleData);
  
  try {
    console.log('\n📧 Sending realistic test drive confirmation email...');
    const emailResult = await sendTestDriveConfirmationEmail(customerData, vehicleData);
    
    if (emailResult.success) {
      console.log('✅ Realistic test drive confirmation email sent successfully!');
      console.log('📧 Message ID:', emailResult.messageId);
      console.log('\n🎉 SUCCESS: Email confirmation system working with real data!');
      console.log('📋 Email sent to: husselache2005@gmail.com');
      console.log('📋 Customer: John Smith');
      console.log('📋 Vehicle: Toyota Camry Hybrid');
      console.log('📋 Date: 2025-10-08 at 2:00 PM');
      console.log('📋 Location: Melbourne CBD');
      console.log('\n📬 Check your email for the professional confirmation!');
    } else {
      console.error('❌ Email failed:', emailResult.error);
    }
    
  } catch (error) {
    console.error('💥 Error during realistic email test:', error);
  }
}

// Run the test
testRealisticEmailConfirmation()
  .then(() => {
    console.log('\n✅ Realistic email test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
const { sendTestDriveConfirmation, sendComparisonConfirmation } = require('./service/email-service.js');

async function testEmailService() {
    console.log('🧪 Testing email service...');
    
    // Test data
    const testData = {
        customerDetails: {
            firstName: 'Test',
            lastName: 'Customer',
            email: 'your-email@example.com', // Replace with your actual email
            phone: '0400000000'
        },
        vehicleDetails: {
            makeModel: '2023 Toyota Camry',
            bodyType: 'Sedan',
            price: 35000
        },
        bookingDetails: {
            bookingID: 'TEST-123',
            time: '10:00 AM',
            suburb: 'Sydney',
            date: '2025-10-15',
            status: 'Pending'
        }
    };

    try {
        console.log('📧 Sending test drive confirmation email...');
        await sendTestDriveConfirmation(testData);
        console.log('✅ Test drive email sent successfully!');
        
        console.log('📧 Sending comparison confirmation email...');
        await sendComparisonConfirmation({
            customerDetails: testData.customerDetails,
            comparisonDetails: {
                requestID: 'TEST-COMP-456',
                requestType: 'Vehicle Comparison',
                vehicleCount: 3,
                budget: 50000,
                customerNotes: 'Looking for a family car'
            }
        });
        console.log('✅ Comparison email sent successfully!');
        
    } catch (error) {
        console.error('❌ Email test failed:', error);
    }
}

// Replace 'your-email@example.com' above with your actual email and run this test
// testEmailService();

console.log('📋 Email service test ready. Uncomment the last line and replace email to test.');
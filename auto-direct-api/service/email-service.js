const nodemailer = require('nodemailer');

const emailService = {
  // Gmail Configuration
  service: 'gmail',
  auth: {
    user: 'autosdirect.au@gmail.com',    // Your Gmail email
    pass: 'vnmn yqxk srae hiae'          // Your Gmail App Password
  },

  // Create transporter
  createTransporter() {
    return nodemailer.createTransport({
      service: this.service,
      auth: this.auth
    });
  },

  // Send customer confirmation email
  async sendCustomerConfirmationEmail(customerDetails, vehicleDetails, manufacturerDetails, orderID) {
    console.log('📧 sendCustomerConfirmationEmail called with:');
    console.log('- Customer:', customerDetails);
    console.log('- Vehicle:', vehicleDetails);
    console.log('- Order ID:', orderID);
    
    const transporter = this.createTransporter();
    
    const mailOptions = {
      from: this.auth.user,
      to: customerDetails.email,
      subject: `Auto's Direct Order - ${orderID}`,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      },
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Auto's Direct Order - ${orderID}</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
            <p style="color: black;">Dear ${customerDetails.firstName} ${customerDetails.lastName},</p>
            
            <p style="color: black;">Thank you for placing your order with Autos Direct. A unique reference number has been generated for your purchase:</p>
            
            <p style="color: black;"><strong>Order Details:</strong></p>
            <p style="color: black;"><strong>Order ID:</strong> ${orderID}</p>
            <p style="color: black;"><strong>Manufacturer:</strong> ${manufacturerDetails?.companyName || vehicleDetails.makeName}</p>
            <p style="color: black;"><strong>Vehicle Make & Model:</strong> ${vehicleDetails.makeName} ${vehicleDetails.modelName}</p>
            <p style="color: black;"><strong>VIN:</strong> ${vehicleDetails.vin || vehicleDetails.vehicleID || 'To be provided'}</p>
            
            <p style="color: black;">Please keep this Order ID safe, as it will be used as an identifier for your payment and all correspondence regarding your order.</p>
            
            <p style="color: black;">If you have requested a test drive, our Test Drive Team will contact you shortly to finalise the appointment.</p>
            
            <p style="color: black;">For any further enquiries, please contact our Customer Service Team at [support@email.com] or [phone number].</p>
            
            <p style="color: black;">We appreciate your order and look forward to delivering your new vehicle.</p>
            
            <p style="color: black;">Yours sincerely,<br>
            Autos Direct Team</p>
          </div>
        </body>
        </html>
      `
    };

    console.log('📧 Sending email from:', mailOptions.from);
    console.log('📧 Sending email to:', mailOptions.to);
    
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Email send error:', error);
      throw error;
    }
  },

  // Send notification to sales team
  async sendSalesTeamNotification(customerDetails, vehicleDetails, orderID) {
    const transporter = this.createTransporter();
    
    // Construct address from available fields (same logic as logistics)
    let deliveryAddress = '';
    
    if (customerDetails.address) {
      deliveryAddress = customerDetails.address;
    } else {
      // Build address from individual components
      const addressParts = [];
      
      if (customerDetails.streetNumber || customerDetails.street_number) {
        addressParts.push(customerDetails.streetNumber || customerDetails.street_number);
      }
      
      if (customerDetails.streetName || customerDetails.street_name || customerDetails.street) {
        addressParts.push(customerDetails.streetName || customerDetails.street_name || customerDetails.street);
      }
      
      if (customerDetails.suburb || customerDetails.city) {
        addressParts.push(customerDetails.suburb || customerDetails.city);
      }
      
      if (customerDetails.state) {
        addressParts.push(customerDetails.state);
      }
      
      if (customerDetails.postcode || customerDetails.postal_code || customerDetails.zip) {
        addressParts.push(customerDetails.postcode || customerDetails.postal_code || customerDetails.zip);
      }
      
      deliveryAddress = addressParts.filter(part => part).join(', ');
    }
    
    // If only postcode is available, make it clear
    if (deliveryAddress === customerDetails.postcode) {
      deliveryAddress = `Postcode: ${customerDetails.postcode} (Full address required - please contact customer: ${customerDetails.phone})`;
    }
    
    // Fallback if no address found
    if (!deliveryAddress.trim()) {
      deliveryAddress = `Address not provided - please contact customer: ${customerDetails.phone}`;
    }
    
    const mailOptions = {
      from: this.auth.user,
      to: 'sales@autodirect.com.au', // Sales team email
      cc: this.auth.user, // CC to main account
      subject: `Vehicle Delivery Request - Order ${orderID}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <p style="color: black;">Dear Logistics Company</p>
          
          <p style="color: black;">Auto Direct requires your assistance to arrange the delivery of a newly ordered vehicle. Please find the order details below:</p>
          
          <p style="color: black;"><strong>Order Details:</strong></p>
          
          <ul style="color: black;">
            <li style="color: black;"><strong>Order ID:</strong> ${orderID}</li>
            <li style="color: black;"><strong>Customer Name:</strong> ${customerDetails.firstName} ${customerDetails.lastName}</li>
            <li style="color: black;"><strong>Vehicle Model:</strong> ${vehicleDetails.makeName} ${vehicleDetails.modelName}</li>
            <li style="color: black;"><strong>Delivery Address:</strong> ${deliveryAddress}</li>
            <li style="color: black;"><strong>Payment Status:</strong> Pending Confirmation from Manufacturer</li>
            <li style="color: black;"><strong>Test Drive Requested:</strong> ${customerDetails.testDriveRequested ? 'Yes' : 'No'}</li>
          </ul>
          
          <p style="color: black;"><strong>Instructions:</strong></p>
          <p style="color: black;">Please schedule the delivery once payment has been confirmed by the manufacturer. Coordinate directly with the customer to arrange a convenient delivery date and time.</p>
          
          <p style="color: black;">If you require further information or assistance, please contact our customer service team at [support@gmail.com] or [phone number].</p>
          
          <p style="color: black;">Thank you for the prompt attention and support in ensuring a smooth delivery process.</p>
          
          <p style="color: black;">Yours sincerely,<br>
          Autos Direct Team</p>
        </div>
      `
    };

    return transporter.sendMail(mailOptions);
  },

  // Send notification to logistics team
  async sendLogisticsTeamNotification(customerDetails, vehicleDetails, orderID) {
    const transporter = this.createTransporter();
    
    // Log customer details to see what address fields are available
    console.log('🏠 Customer details for logistics email:', JSON.stringify(customerDetails, null, 2));
    
    // Construct address from available fields
    let deliveryAddress = '';
    
    // Try different possible field combinations
    if (customerDetails.address) {
      deliveryAddress = customerDetails.address;
    } else {
      // Build address from individual components
      const addressParts = [];
      
      if (customerDetails.streetNumber || customerDetails.street_number) {
        addressParts.push(customerDetails.streetNumber || customerDetails.street_number);
      }
      
      if (customerDetails.streetName || customerDetails.street_name || customerDetails.street) {
        addressParts.push(customerDetails.streetName || customerDetails.street_name || customerDetails.street);
      }
      
      if (customerDetails.suburb || customerDetails.city) {
        addressParts.push(customerDetails.suburb || customerDetails.city);
      }
      
      if (customerDetails.state) {
        addressParts.push(customerDetails.state);
      }
      
      if (customerDetails.postcode || customerDetails.postal_code || customerDetails.zip) {
        addressParts.push(customerDetails.postcode || customerDetails.postal_code || customerDetails.zip);
      }
      
      deliveryAddress = addressParts.filter(part => part).join(', ');
    }
    
    // If only postcode is available, make it clear
    if (deliveryAddress === customerDetails.postcode) {
      deliveryAddress = `Postcode: ${customerDetails.postcode} (Full address required - please contact customer: ${customerDetails.phone})`;
    }
    
    // Fallback if no address found
    if (!deliveryAddress.trim()) {
      deliveryAddress = `Address not provided - please contact customer: ${customerDetails.phone}`;
    }
    
    console.log('🏠 Constructed delivery address:', deliveryAddress);
    
    const mailOptions = {
      from: this.auth.user,
      to: 'logistics@autodirect.com.au',
      cc: this.auth.user,
      subject: `Delivery Request - Order ${orderID}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <p style="color: black;">Dear Logistics Team,</p>
          
          <p style="color: black;">A new vehicle delivery needs to be arranged. Please find the order details below:</p>
          
          <p style="color: black;"><strong>Order Details:</strong></p>
          
          <ul style="color: black;">
            <li style="color: black;"><strong>Order ID:</strong> ${orderID}</li>
            <li style="color: black;"><strong>Customer Name:</strong> ${customerDetails.firstName} ${customerDetails.lastName}</li>
            <li style="color: black;"><strong>Vehicle Model:</strong> ${vehicleDetails.makeName} ${vehicleDetails.modelName}</li>
            <li style="color: black;"><strong>VIN:</strong> ${vehicleDetails.vin || vehicleDetails.vehicleID || 'To be provided'}</li>
            <li style="color: black;"><strong>Delivery Address:</strong> ${deliveryAddress}</li>
            <li style="color: black;"><strong>Payment Status:</strong> Pending confirmation from the manufacturer</li>
            <li style="color: black;"><strong>Test Drive Requested:</strong> ${customerDetails.testDriveRequested ? 'Yes' : 'No'}</li>
          </ul>
          
          <p style="color: black;">Please await confirmation from the manufacturer that payment has been received before scheduling the delivery. Once confirmed, coordinate with the customer to arrange a suitable delivery time.</p>
          
          <p style="color: black;">For any further assistance, contact our Customer Service Team at [support@gmail.com] or [phone number].</p>
          
          <p style="color: black;">Thank you for ensuring a smooth delivery process.</p>
          
          <p style="color: black;">Yours sincerely,<br>
          Autos Direct Team</p>
        </div>
      `
    };

    return transporter.sendMail(mailOptions);
  },

  // Send notification to manufacturer
  async sendManufacturerNotification(customerDetails, vehicleDetails, manufacturerDetails, orderID) {
    const transporter = this.createTransporter();
    
    // Smart address construction with multiple fallbacks
    let deliveryAddress = '';
    const addressParts = [];
    
    // Try to build complete address if we have multiple parts
    if (customerDetails.streetNumber || customerDetails.streetName || customerDetails.suburb || customerDetails.state) {
      // Build street address (number + name)
      if (customerDetails.streetNumber && customerDetails.streetName) {
        addressParts.push(`${customerDetails.streetNumber} ${customerDetails.streetName}`);
      } else if (customerDetails.streetName || customerDetails.street_name || customerDetails.street) {
        addressParts.push(customerDetails.streetName || customerDetails.street_name || customerDetails.street);
      }
      
      if (customerDetails.suburb || customerDetails.city) {
        addressParts.push(customerDetails.suburb || customerDetails.city);
      }
      
      if (customerDetails.state) {
        addressParts.push(customerDetails.state);
      }
      
      if (customerDetails.postcode || customerDetails.postal_code || customerDetails.zip) {
        addressParts.push(customerDetails.postcode || customerDetails.postal_code || customerDetails.zip);
      }
      
      deliveryAddress = addressParts.filter(part => part).join(', ');
    }
    
    // If only postcode is available, make it clear
    if (deliveryAddress === customerDetails.postcode) {
      deliveryAddress = `Postcode: ${customerDetails.postcode} (Full address required - please contact customer: ${customerDetails.phone})`;
    }
    
    // Fallback if no address found
    if (!deliveryAddress.trim()) {
      deliveryAddress = `Address not provided - please contact customer: ${customerDetails.phone}`;
    }
    
    const mailOptions = {
      from: this.auth.user,
      to: 'manufacturer@autodirect.com.au', // Manufacturer email
      cc: this.auth.user, // CC to main account
      subject: `New Vehicle Order - ${orderID}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <p style="color: black;">Dear Manufacturer</p>
          
          <p style="color: black;">A new vehicle order has been submitted through Auto Direct. Please find the details below:</p>
          
          <p style="color: black;"><strong>Order Details:</strong></p>
          
          <p style="color: black;">* <strong>Order ID:</strong> ${orderID}</p>
          
          <p style="color: black;">* <strong>Customer Name:</strong> ${customerDetails.firstName} ${customerDetails.lastName}</p>
          
          <p style="color: black;">* <strong>Vehicle Model:</strong> ${vehicleDetails.makeName} ${vehicleDetails.modelName}</p>
          
          <p style="color: black;">* <strong>Delivery Address:</strong> ${deliveryAddress}</p>
          
          <p style="color: black;">* <strong>Test Drive Requested:</strong> ${customerDetails.testDriveRequested ? 'Yes' : 'No'}</p>
          
          <p style="color: black;">Payment Instructions:</p>
          
          <p style="color: black;">The customer has been provided with your bank transfer details to complete payment. Please confirm once the payment has been received and processed.</p>
          
          <p style="color: black;">Once payment is confirmed, kindly notify Autos Direct so that our logistics partner can proceed with delivery arrangements.</p>
          
          <p style="color: black;">If you require any additional information, please contact our customer service team at [support@gmail.com] or [phone number].</p>
          
          <p style="color: black;">Thank you for the prompt attention to this order.</p>
          
          <p style="color: black;">Yours sincerely,<br>
          Autos Direct Team</p>
        </div>
      `
    };

    return transporter.sendMail(mailOptions);
  },

  // Send all notifications
  async sendAllPurchaseNotifications(customerDetails, vehicleDetails, manufacturerDetails, orderID) {
    try {
      // Send customer confirmation
      await this.sendCustomerConfirmationEmail(customerDetails, vehicleDetails, manufacturerDetails, orderID);
      console.log('✅ Customer confirmation email sent');

      // Send sales team notification
      await this.sendSalesTeamNotification(customerDetails, vehicleDetails, orderID);
      console.log('✅ Sales team notification sent');

      // Send logistics team notification
      await this.sendLogisticsTeamNotification(customerDetails, vehicleDetails, orderID);
      console.log('✅ Logistics team notification sent');

      // Send manufacturer notification
      await this.sendManufacturerNotification(customerDetails, vehicleDetails, manufacturerDetails, orderID);
      console.log('✅ Manufacturer notification sent');

      return { success: true, message: 'All notifications sent successfully' };
    } catch (error) {
      console.error('❌ Email notification error:', error);
      return { success: false, error: error.message };
    }
  },

  // Wrapper functions for route imports
  async sendPurchaseNotification(purchaseData) {
    return await this.sendAllPurchaseNotifications(
      purchaseData.customerDetails || {}, 
      purchaseData.vehicleDetails || {}, 
      purchaseData.manufacturerDetails || {},
      purchaseData.orderID
    );
  },

  async sendCustomerConfirmation(confirmationData) {
    return await this.sendCustomerConfirmationEmail(
      confirmationData.customerDetails || {},
      confirmationData.vehicleDetails || {},
      confirmationData.manufacturerDetails || {},
      confirmationData.orderID
    );
  },

  // Test Drive Booking Confirmation Email
  async sendTestDriveConfirmationEmail(customerData, vehicleData) {
    console.log('📧 Sending test drive confirmation email...');
    console.log('Customer:', customerData);
    console.log('Vehicle:', vehicleData);
    
    try {
      const transporter = this.createTransporter();
      
      const mailOptions = {
        from: this.auth.user,
        to: customerData.email,
        subject: 'Test Drive Booking Confirmation - Autos Direct',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Drive Booking Confirmation</title>
          </head>
          <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
              <h2 style="color: black; border-bottom: 2px solid black; padding-bottom: 10px;">Test Drive Booking Confirmation</h2>
              
              <p style="color: black;">Dear ${customerData.firstName} ${customerData.lastName},</p>
              
              <p style="color: black;">Thank you for booking a test drive with <strong>Autos Direct</strong>. We have received your request and our team will contact you shortly to confirm the appointment details.</p>
              
              <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; margin: 20px 0;">
                <h3 style="color: black; margin-top: 0;">Booking Details</h3>
                <p style="color: black; margin: 8px 0;"><strong>Vehicle:</strong> ${vehicleData.makeName} ${vehicleData.modelName}</p>
                <p style="color: black; margin: 8px 0;"><strong>Year:</strong> ${vehicleData.year}</p>
                <p style="color: black; margin: 8px 0;"><strong>Customer Name:</strong> ${customerData.firstName} ${customerData.lastName}</p>
                <p style="color: black; margin: 8px 0;"><strong>Email:</strong> ${customerData.email}</p>
                <p style="color: black; margin: 8px 0;"><strong>Phone:</strong> ${customerData.phone}</p>
                <p style="color: black; margin: 8px 0;"><strong>Preferred Date:</strong> ${customerData.preferredDate}</p>
                <p style="color: black; margin: 8px 0;"><strong>Preferred Time:</strong> ${customerData.preferredTime}</p>
              </div>
              
              <p style="color: black;">Our sales team will contact you within 24 hours to confirm your test drive appointment and provide you with the exact location and any additional details.</p>
              
              <p style="color: black;">If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>
              
              <p style="color: black;">Thank you for choosing Autos Direct!</p>
              
              <p style="color: black;">Best regards,<br>
              <strong>The Autos Direct Team</strong></p>
              
              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
              <p style="color: #6c757d; font-size: 12px; text-align: center;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </div>
          </body>
          </html>
        `
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Test drive confirmation email sent successfully!');
      console.log('Message ID:', result.messageId);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send test drive confirmation email:', error);
      return { success: false, error: error.message };
    }
  },

  // Vehicle Comparison Confirmation Email
  async sendComparisonConfirmationEmail(customerData, vehicleData) {
    console.log('📧 Sending vehicle comparison confirmation email...');
    console.log('Customer:', customerData);
    console.log('Vehicles:', vehicleData);
    
    try {
      const transporter = this.createTransporter();
      
      // Build vehicle list HTML
      let vehicleListHtml = '';
      if (Array.isArray(vehicleData) && vehicleData.length > 0) {
        vehicleListHtml = vehicleData.map(vehicle => `
          <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; margin: 10px 0;">
            <h4 style="color: black; margin: 0 0 10px 0;">${vehicle.makeName} ${vehicle.modelName}</h4>
            <p style="color: black; margin: 5px 0;"><strong>Year:</strong> ${vehicle.year}</p>
            <p style="color: black; margin: 5px 0;"><strong>Price:</strong> $${vehicle.price ? Number(vehicle.price).toLocaleString() : 'Contact for pricing'}</p>
            ${vehicle.description ? `<p style="color: black; margin: 5px 0;"><strong>Description:</strong> ${vehicle.description}</p>` : ''}
          </div>
        `).join('');
      } else {
        vehicleListHtml = '<p style="color: black;">Vehicle details will be provided separately.</p>';
      }
      
      const mailOptions = {
        from: this.auth.user,
        to: customerData.email,
        subject: 'Vehicle Comparison Request Confirmation - Autos Direct',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vehicle Comparison Request Confirmation</title>
          </head>
          <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
              <h2 style="color: black; border-bottom: 2px solid black; padding-bottom: 10px;">Vehicle Comparison Request Confirmation</h2>
              
              <p style="color: black;">Dear ${customerData.firstName} ${customerData.lastName},</p>
              
              <p style="color: black;">Thank you for requesting a vehicle comparison with <strong>Autos Direct</strong>. We have received your request and our team will prepare a detailed comparison for you.</p>
              
              <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; margin: 20px 0;">
                <h3 style="color: black; margin-top: 0;">Request Details</h3>
                <p style="color: black; margin: 8px 0;"><strong>Customer Name:</strong> ${customerData.firstName} ${customerData.lastName}</p>
                <p style="color: black; margin: 8px 0;"><strong>Email:</strong> ${customerData.email}</p>
                <p style="color: black; margin: 8px 0;"><strong>Phone:</strong> ${customerData.phone}</p>
                ${customerData.message ? `<p style="color: black; margin: 8px 0;"><strong>Additional Notes:</strong> ${customerData.message}</p>` : ''}
              </div>
              
              <h3 style="color: black;">Vehicles for Comparison</h3>
              ${vehicleListHtml}
              
              <p style="color: black;">Our sales team will prepare a comprehensive comparison including specifications, pricing, and features for the vehicles you've selected. You can expect to receive this comparison within 24-48 hours.</p>
              
              <p style="color: black;">If you have any questions or would like to add more vehicles to your comparison, please don't hesitate to contact us.</p>
              
              <p style="color: black;">Thank you for choosing Autos Direct!</p>
              
              <p style="color: black;">Best regards,<br>
              <strong>The Autos Direct Team</strong></p>
              
              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
              <p style="color: #6c757d; font-size: 12px; text-align: center;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </div>
          </body>
          </html>
        `
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Vehicle comparison confirmation email sent successfully!');
      console.log('Message ID:', result.messageId);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send vehicle comparison confirmation email:', error);
      return { success: false, error: error.message };
    }
  }
};

// Export the functions
module.exports = {
  sendPurchaseNotification: emailService.sendPurchaseNotification.bind(emailService),
  sendCustomerConfirmation: emailService.sendCustomerConfirmation.bind(emailService),
  sendTestDriveConfirmationEmail: emailService.sendTestDriveConfirmationEmail.bind(emailService),
  sendComparisonConfirmationEmail: emailService.sendComparisonConfirmationEmail.bind(emailService),
  emailService
};
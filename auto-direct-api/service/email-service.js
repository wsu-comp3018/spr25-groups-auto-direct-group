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

  // Professional AutoDirect email template
  createProfessionalEmailTemplate(subject, content, customerName = '') {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #000000;
            background-color: #f5f5f5;
        }
        
        .email-container {
            max-width: 650px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: #000000;
            color: #ffffff;
            padding: 30px;
            text-align: center;
            position: relative;
            border-bottom: 2px solid #333333;
        }
        
        .logo-section {
            position: relative;
            z-index: 2;
            margin-bottom: 20px;
        }
        
        .logo-container {
            width: 300px;
            height: 60px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
        }
        
        .logo {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
            letter-spacing: 1px;
            color: #ffffff;
        }
        
        .tagline {
            font-size: 14px;
            color: #cccccc;
            font-weight: 300;
            letter-spacing: 1px;
        }
        
        .content {
            padding: 45px 40px;
            background-color: #ffffff;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 25px;
        }
        
        .message-text {
            font-size: 16px;
            color: #333333;
            margin-bottom: 25px;
            line-height: 1.7;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 5px solid #000000;
            padding: 25px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .highlight-box h3 {
            color: #000000;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .details-container {
            background-color: #fafafa;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
        }
        
        .details-title {
            font-size: 22px;
            font-weight: 800;
            color: #000000;
            margin-bottom: 20px;
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 3px solid #000000;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-weight: 600;
            color: #000000;
            font-size: 15px;
            min-width: 140px;
        }
        
        .detail-value {
            color: #444444;
            font-size: 15px;
            text-align: right;
            flex: 1;
        }
        
        .detail-value strong {
            color: #000000;
            font-weight: 700;
        }
        
        .action-section {
            background: linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%);
            padding: 25px;
            margin: 30px 0;
            border-radius: 12px;
            border: 1px solid #dadce0;
        }
        
        .action-title {
            font-size: 18px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 15px;
        }
        
        .action-list {
            list-style: none;
            padding: 0;
        }
        
        .action-list li {
            padding: 8px 0;
            color: #333333;
            position: relative;
            padding-left: 25px;
        }
        
        .action-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #000000;
            font-weight: bold;
            font-size: 16px;
        }
        
        .signature-section {
            margin-top: 40px;
            padding-top: 25px;
            border-top: 2px solid #f0f0f0;
        }
        
        .signature {
            font-size: 16px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 5px;
        }
        
        .signature-title {
            font-size: 14px;
            color: #666666;
            font-weight: 400;
        }
        
        .footer {
            background: linear-gradient(135deg, #000000 0%, #333333 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        
        .footer-content {
            margin-bottom: 25px;
        }
        
        .company-info {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
            letter-spacing: 1px;
        }
        
        .contact-details {
            font-size: 14px;
            margin: 8px 0;
            opacity: 0.9;
        }
        
        .contact-details strong {
            color: #ffffff;
            font-weight: 600;
        }
        
        .social-links {
            margin: 25px 0;
            padding: 20px 0;
            border-top: 1px solid #444444;
            border-bottom: 1px solid #444444;
        }
        
        .social-link {
            color: #ffffff;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
            opacity: 0.9;
            transition: opacity 0.3s ease;
        }
        
        .social-link:hover {
            opacity: 1;
            text-decoration: underline;
        }
        
        .disclaimer {
            font-size: 12px;
            color: #cccccc;
            margin-top: 20px;
            font-style: italic;
            line-height: 1.5;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header, .content, .footer {
                padding: 25px 20px;
            }
            
            .company-name {
                font-size: 26px;
            }
            
            .details-container {
                padding: 20px;
            }
            
            .detail-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
            
            .detail-value {
                text-align: left;
            }
            
            .detail-label {
                min-width: auto;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header">
            <div class="logo-section">
                <div class="company-name">Autos Direct</div>
                <div class="tagline">Your Premier Automotive Partner</div>
            </div>
        </div>
        
        <!-- Content Section -->
        <div class="content">
            ${customerName ? `<div class="greeting">Dear ${customerName},</div>` : ''}
            ${content}
            
            <div class="signature-section">
                <div class="signature">Best regards,</div>
                <div class="signature-title">The AutoDirect Team</div>
            </div>
        </div>
        
        <!-- Footer Section -->
        <div class="footer">
            <div class="footer-content">
                <div class="company-info">AutoDirect</div>
                <div class="contact-details">
                    <strong>Email:</strong> autosdirect.au@gmail.com
                </div>
                <div class="contact-details">
                    <strong>Customer Service:</strong> Available 24/7
                </div>
                <div class="contact-details">
                    <strong>Website:</strong> www.autodirect.com.au
                </div>
            </div>
            
            <div class="social-links">
                <a href="#" class="social-link">Contact Us</a>
                <a href="#" class="social-link">Privacy Policy</a>
                <a href="#" class="social-link">Terms of Service</a>
                <a href="#" class="social-link">Support Center</a>
            </div>
            
            <div class="disclaimer">
                This is an automated email from AutoDirect. Please do not reply directly to this email.<br>
                © ${new Date().getFullYear()} AutoDirect. All rights reserved. | Licensed Automotive Dealer
            </div>
        </div>
    </div>
</body>
</html>`;
  },

  // Send customer confirmation email
  async sendCustomerConfirmationEmail(customerDetails, vehicleDetails, manufacturerDetails, orderID) {
    console.log('📧 sendCustomerConfirmationEmail called with:');
    console.log('- Customer:', customerDetails);
    console.log('- Vehicle:', vehicleDetails);
    console.log('- Order ID:', orderID);
    
    const transporter = this.createTransporter();
    const customerName = `${customerDetails.firstName} ${customerDetails.lastName}`;
    
    const content = `
      <div class="message-text">
        Thank you for placing your order with <strong>AutoDirect</strong>! We're thrilled to help you get your new vehicle. 
        Your order has been successfully received and is now being processed by our team.
      </div>
      
      <div class="highlight-box">
        <h3>Order Successfully Placed!</h3>
        <p>Your unique order reference number has been generated and all our teams have been notified to begin processing your request.</p>
      </div>
      
      <div class="details-container">
        <div class="details-title">Order Confirmation Details</div>
        <div class="detail-row">
          <span class="detail-label">Order ID:</span>
          <span class="detail-value"><strong style="color: #d4af37; font-size: 16px;">${orderID}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer:</span>
          <span class="detail-value">${customerName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${customerDetails.email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Manufacturer:</span>
          <span class="detail-value">${manufacturerDetails?.companyName || vehicleDetails.makeName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Vehicle:</span>
          <span class="detail-value"><strong>${vehicleDetails.makeName} ${vehicleDetails.modelName}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Year:</span>
          <span class="detail-value">${vehicleDetails.year || 'Current Model'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">VIN:</span>
          <span class="detail-value">${vehicleDetails.vin || vehicleDetails.vehicleID || 'To be provided upon delivery'}</span>
        </div>
        ${vehicleDetails.price ? `
        <div class="detail-row">
          <span class="detail-label">Price:</span>
          <span class="detail-value"><strong>$${Number(vehicleDetails.price).toLocaleString()}</strong></span>
        </div>
        ` : ''}
        <div class="detail-row">
          <span class="detail-label">Test Drive Requested:</span>
          <span class="detail-value">${customerDetails.testDriveRequested ? 'Yes' : 'No'}</span>
        </div>
      </div>
      
      <div class="action-section">
        <div class="action-title">🚨 IMPORTANT - Please Save Your Order ID</div>
        <p style="margin: 10px 0; color: #d4af37; font-weight: 600; font-size: 16px;">Order ID: ${orderID}</p>
        <p style="margin: 10px 0; color: #333;">This Order ID will be used for:</p>
        <ul class="action-list">
          <li>Payment identification and processing</li>
          <li>All correspondence regarding your order</li>
          <li>Tracking your order status and delivery</li>
          <li>Customer service inquiries and support</li>
        </ul>
      </div>
      
      ${customerDetails.testDriveRequested ? `
      <div class="highlight-box">
        <h3>Test Drive Scheduled</h3>
        <p>Our Test Drive Team will contact you within 24 hours to finalize your appointment details and confirm the time and location.</p>
      </div>
      ` : ''}
      
      <div class="action-section">
        <div class="action-title">What happens next?</div>
        <ul class="action-list">
          <li>Payment instructions will be provided by the manufacturer</li>
          <li>Our logistics team will coordinate delivery once payment is confirmed</li>
          <li>You'll receive updates at every step of the process</li>
          <li>All vehicle documentation will be prepared for delivery</li>
          <li>Final inspection and quality checks will be completed</li>
        </ul>
      </div>
      
      <div class="message-text">
        <strong>Need assistance?</strong><br>
        For any enquiries about your order, please contact our Customer Service Team and reference your Order ID. 
        We're here to help make your vehicle purchase experience as smooth as possible.
      </div>
      
      <div class="message-text">
        We truly appreciate your business and look forward to delivering your new vehicle. Thank you for choosing 
        AutoDirect as your trusted automotive partner!
      </div>
    `;
    
    const subject = `AutoDirect - Order Confirmation ${orderID}`;
    const htmlContent = this.createProfessionalEmailTemplate(subject, content, customerName);
    
    const mailOptions = {
      from: `AutoDirect <${this.auth.user}>`,
      to: customerDetails.email,
      subject: subject,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      },
      html: htmlContent
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
      const customerName = `${customerData.firstName} ${customerData.lastName}`;
      
      const content = `
        <div class="message-text">
          Thank you for booking a test drive with <strong>AutoDirect</strong>! We're excited to help you experience 
          your potential new vehicle firsthand.
        </div>
        
        <div class="highlight-box">
          <h3>Test Drive Booking Confirmed!</h3>
          <p>Our sales team will contact you within 24 hours to finalize all the details and confirm your appointment.</p>
        </div>
        
        <div class="details-container">
          <div class="details-title">Test Drive Booking Details</div>
          <div class="detail-row">
            <span class="detail-label">Vehicle:</span>
            <span class="detail-value"><strong>${vehicleData.makeName} ${vehicleData.modelName}</strong></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Year:</span>
            <span class="detail-value">${vehicleData.year || 'Current Model'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Customer Name:</span>
            <span class="detail-value">${customerName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${customerData.email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${customerData.phone}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Preferred Date:</span>
            <span class="detail-value"><strong>${customerData.preferredDate}</strong></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Preferred Time:</span>
            <span class="detail-value"><strong>${customerData.preferredTime}</strong></span>
          </div>
        </div>
        
        <div class="action-section">
          <div class="action-title">What happens next?</div>
          <ul class="action-list">
            <li>Our sales team will call you within 24 hours</li>
            <li>We'll confirm the exact location and timing</li>
            <li>Any special requirements will be discussed</li>
            <li>We'll provide directions and our contact details</li>
            <li>Vehicle will be prepared and ready for your test drive</li>
          </ul>
        </div>
        
        <div class="message-text">
          <strong>Need to make changes?</strong><br>
          No problem! Simply contact our customer service team and we'll help you reschedule 
          or modify your booking at your convenience.
        </div>
        
        <div class="message-text">
          We look forward to helping you find your perfect vehicle. Thank you for choosing AutoDirect 
          as your trusted automotive partner!
        </div>
      `;
      
      const subject = 'Test Drive Booking Confirmed - AutoDirect';
      const htmlContent = this.createProfessionalEmailTemplate(subject, content, customerName);
      
      const mailOptions = {
        from: `AutoDirect <${this.auth.user}>`,
        to: customerData.email,
        subject: subject,
        html: htmlContent
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
      const customerName = `${customerData.firstName} ${customerData.lastName}`;
      
      // Build professional vehicle list HTML
      let vehicleListHtml = '';
      if (Array.isArray(vehicleData) && vehicleData.length > 0) {
        vehicleListHtml = vehicleData.map((vehicle, index) => `
          <div class="details-container" style="margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h4 style="color: #000000; margin: 0; font-size: 20px; font-weight: 700;">
                ${vehicle.makeName} ${vehicle.modelName}
              </h4>
              <span style="background-color: #000000; color: #ffffff; padding: 6px 15px; border-radius: 25px; font-size: 14px; font-weight: 600;">
                Vehicle ${index + 1}
              </span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div class="detail-row">
                <span class="detail-label">Year:</span>
                <span class="detail-value">${vehicle.year || 'Current Model'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Price:</span>
                <span class="detail-value"><strong>$${vehicle.price ? Number(vehicle.price).toLocaleString() : 'Contact for pricing'}</strong></span>
              </div>
              ${vehicle.fuelType ? `
              <div class="detail-row">
                <span class="detail-label">Fuel Type:</span>
                <span class="detail-value">${vehicle.fuelType}</span>
              </div>
              ` : ''}
              ${vehicle.transmission ? `
              <div class="detail-row">
                <span class="detail-label">Transmission:</span>
                <span class="detail-value">${vehicle.transmission}</span>
              </div>
              ` : ''}
            </div>
            ${vehicle.description ? `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e9ecef; font-size: 14px; color: #555555;">
              <strong>Description:</strong> ${vehicle.description}
            </div>
            ` : ''}
          </div>
        `).join('');
      } else {
        vehicleListHtml = `
          <div class="details-container" style="text-align: center; color: #666666; font-style: italic;">
            <p>Vehicle details will be provided in your detailed comparison report.</p>
          </div>
        `;
      }
      
      const content = `
        <div class="message-text">
          Thank you for requesting a vehicle comparison with <strong>AutoDirect</strong>! Our expert automotive 
          team will prepare a comprehensive analysis to help you make the most informed decision for your needs and budget.
        </div>
        
        <div class="highlight-box">
          <h3>Vehicle Comparison Request Confirmed!</h3>
          <p>Expect your detailed professional comparison report within 24-48 hours, delivered directly to your inbox.</p>
        </div>
        
        <div class="details-container">
          <div class="details-title">Request Information</div>
          <div class="detail-row">
            <span class="detail-label">Customer Name:</span>
            <span class="detail-value">${customerName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${customerData.email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${customerData.phone}</span>
          </div>
          ${customerData.message ? `
          <div class="detail-row">
            <span class="detail-label">Special Requirements:</span>
            <span class="detail-value">${customerData.message}</span>
          </div>
          ` : ''}
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #000000; font-size: 22px; font-weight: 700; margin-bottom: 20px; text-align: center;">
            Vehicles Selected for Comparison
          </h3>
          ${vehicleListHtml}
        </div>
        
        <div class="action-section">
          <div class="action-title">Your comprehensive comparison report will include:</div>
          <ul class="action-list">
            <li>Detailed specifications and performance data</li>
            <li>Pricing analysis and value assessment</li>
            <li>Fuel efficiency and running cost estimates</li>
            <li>Safety ratings and reliability scores</li>
            <li>Feature comparison and technology overview</li>
            <li>Our expert recommendations based on your requirements</li>
          </ul>
        </div>
        
        <div class="message-text">
          <strong>Need to add more vehicles or make changes?</strong><br>
          Simply contact our team and we'll update your comparison request. We're committed to helping you 
          find the perfect vehicle that matches your lifestyle, budget, and preferences.
        </div>
        
        <div class="message-text">
          Thank you for choosing AutoDirect as your trusted automotive partner. Our team is dedicated to 
          providing you with the most accurate and helpful vehicle information to guide your decision.
        </div>
      `;
      
      const subject = 'Vehicle Comparison Request Confirmed - AutoDirect';
      const htmlContent = this.createProfessionalEmailTemplate(subject, content, customerName);
      
      const mailOptions = {
        from: `AutoDirect <${this.auth.user}>`,
        to: customerData.email,
        subject: subject,
        html: htmlContent
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
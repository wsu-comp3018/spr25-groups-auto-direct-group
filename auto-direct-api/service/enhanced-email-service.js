const nodemailer = require('nodemailer');

const enhancedEmailService = {
  // Gmail Configuration
  service: 'gmail',
  auth: {
    user: 'autosdirect@gmail.com',    // Your Gmail email
    pass: 'vnmn yqxk srae hiae'          // Your Gmail App Password
  },

  // Create transporter
  createTransporter() {
    return nodemailer.createTransporter({
      service: this.service,
      auth: this.auth
    });
  },

  // Email 1: Data Entry Team Notification (Image 5)
  async sendDataEntryTeamNotification(orderData) {
    const transporter = this.createTransporter();
    
    const mailOptions = {
      from: 'Auto Direct <AutoDirect@gmail.com>',
      to: 'dataentry@autodirect.com',
      cc: 'autosdirect@gmail.com',
      subject: `Order Update Required - Order ${orderData.orderID} (Payment Confirmed)`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Update Required</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
            <p style="color: black;">Dear Data Entry Team,</p>
            
            <p style="color: black;">Please be advised that payment has been confirmed for the following order. Kindly update our internal records to reflect the payment status.</p>
            
            <p style="color: black;"><strong>Order Details:</strong></p>
            <ul style="color: black;">
              <li><strong>Order ID:</strong> ${orderData.orderID}</li>
              <li><strong>Customer Name:</strong> ${orderData.customerFirstName || orderData.customerName} ${orderData.customerLastName || ''}</li>
              <li><strong>Customer Email:</strong> ${orderData.customerEmail}</li>
              <li><strong>Customer Phone:</strong> ${orderData.customerPhone}</li>
              <li><strong>Manufacturer:</strong> ${orderData.manufacturerName || orderData.vehicleMake}</li>
              <li><strong>Vehicle Make & Model:</strong> ${orderData.vehicleMake} ${orderData.vehicleModel}</li>
              <li><strong>VIN:</strong> ${orderData.vehicleVIN || orderData.vehicleID}</li>
              <li><strong>Delivery Address:</strong> ${orderData.deliveryAddress}</li>
            </ul>
            
            <p style="color: black;">Please ensure this order is updated as "Payment Received" in the system without delay.</p>
            
            <p style="color: black;">Yours sincerely,<br>
            Autos Direct</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Data Entry Team notification sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Data Entry Team email error:', error);
      throw error;
    }
  },

  // Email 2: Logistics Team Notification (Image 6)
  async sendLogisticsTeamNotification(orderData) {
    const transporter = this.createTransporter();
    
    const customerName = `${orderData.customerFirstName || ''} ${orderData.customerLastName || ''}`.trim() || orderData.customerName || 'Customer';
    
    const mailOptions = {
      from: 'Auto Direct <AutoDirect@gmail.com>',
      to: 'logistics@autodirect.com',
      cc: 'autosdirect@gmail.com',
      subject: `Delivery Instruction - Order ${orderData.orderID} (Processed)`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Delivery Instruction</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
            <p style="color: black;">Dear Logistics Team,</p>
            
            <p style="color: black;">Please be advised that the following order has now been fully processed. You are requested to proceed with delivery arrangements.</p>
            
            <p style="color: black;"><strong>Order Details:</strong></p>
            <ul style="color: black;">
              <li><strong>Order ID:</strong> ${orderData.orderID}</li>
              <li><strong>Customer Name:</strong> ${customerName}</li>
              <li><strong>Manufacturer:</strong> ${orderData.manufacturerName || orderData.vehicleMake}</li>
              <li><strong>Vehicle Make & Model:</strong> ${orderData.vehicleMake} ${orderData.vehicleModel}</li>
              <li><strong>VIN:</strong> ${orderData.vehicleVIN || orderData.vehicleID}</li>
              <li><strong>Delivery Address:</strong> ${orderData.deliveryAddress}</li>
              <li><strong>Test Drive Requested:</strong> ${orderData.testDriveRequested ? 'Yes' : 'No'}</li>
            </ul>
            
            <p style="color: black;">Kindly coordinate directly with the customer to schedule a suitable delivery date and time. Please confirm once delivery has been arranged.</p>
            
            <p style="color: black;">For any queries, please contact us at <a href="mailto:autosdirect@gmail.com" style="color: #0066cc;">autosdirect@gmail.com</a> or phone number</p>
            
            <p style="color: black;">Yours sincerely,<br>
            Autos Direct</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Logistics Team notification sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Logistics Team email error:', error);
      throw error;
    }
  },

  // Email 3: Customer Order Processed (Image 8)
  async sendCustomerOrderProcessed(orderData) {
    const transporter = this.createTransporter();
    
    const customerName = `${orderData.customerFirstName || ''} ${orderData.customerLastName || ''}`.trim() || orderData.customerName || 'Valued Customer';
    
    const mailOptions = {
      from: 'Auto Direct <AutoDirect@gmail.com>',
      to: orderData.customerEmail,
      cc: 'autosdirect@gmail.com',
      subject: `Order Processed - Your Vehicle is Being Prepared for Delivery (${orderData.orderID})`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Processed</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
            <p style="color: black;">Dear ${customerName},</p>
            
            <p style="color: black;">We are pleased to inform you that your order has now been fully processed. Your vehicle is being prepared for delivery.</p>
            
            <p style="color: black;"><strong>Order Details:</strong></p>
            <ul style="color: black;">
              <li><strong>Order ID:</strong> ${orderData.orderID}</li>
              <li><strong>Manufacturer:</strong> ${orderData.manufacturerName || orderData.vehicleMake}</li>
              <li><strong>Vehicle Make & Model:</strong> ${orderData.vehicleMake} ${orderData.vehicleModel}</li>
              <li><strong>VIN:</strong> ${orderData.vehicleVIN || orderData.vehicleID}</li>
            </ul>
            
            <p style="color: black;">Our logistics partner will be in contact with you shortly to confirm the delivery schedule to the address provided in your order.</p>
            
            <p style="color: black;">For any further assistance, please contact us at <a href="mailto:autosdirect@gmail.com" style="color: #0066cc;">autosdirect@gmail.com</a> or phone number</p>
            
            <p style="color: black;">Thank you for choosing Autos Direct. We look forward to delivering your new vehicle.</p>
            
            <p style="color: black;">Yours sincerely,<br>
            Autos Direct</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Customer Order Processed email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Customer Order Processed email error:', error);
      throw error;
    }
  },

  // Email 4: Internal Logistics Team (Image 9)
  async sendInternalLogisticsInstruction(orderData) {
    const transporter = this.createTransporter();
    
    const mailOptions = {
      from: 'Auto Direct <AutoDirect@gmail.com>',
      to: 'internallogistics@autodirect.com',
      cc: 'autosdirect@gmail.com',
      subject: `Delivery Instruction - Order ${orderData.orderID} (Processed)`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Delivery Instruction</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
            <p style="color: black;">Dear Logistics Team,</p>
            
            <p style="color: black;">Please be advised that the following order has now been fully processed. You are requested to proceed with delivery arrangements.</p>
            
            <p style="color: black;"><strong>Order Details:</strong></p>
            <ul style="color: black;">
              <li><strong>Order ID:</strong> ${orderData.orderID}</li>
              <li><strong>Customer Name:</strong> ${orderData.customerName}</li>
              <li><strong>Manufacturer:</strong> ${orderData.manufacturerName || 'N/A'}</li>
              <li><strong>Vehicle Make & Model:</strong> ${orderData.vehicleMake || 'N/A'} ${orderData.vehicleModel || 'N/A'}</li>
              <li><strong>VIN:</strong> ${orderData.vehicleVIN || 'N/A'}</li>
              <li><strong>Delivery Address:</strong> ${orderData.deliveryAddress || 'N/A'}</li>
              <li><strong>Test Drive Requested:</strong> ${orderData.testDriveRequested ? 'Yes' : 'No'}</li>
            </ul>
            
            <p style="color: black;">Kindly coordinate directly with the customer to schedule a suitable delivery date and time. Please confirm once delivery has been arranged.</p>
            
            <p style="color: black;">For any queries, please contact us at [support@gmail.com] or [phone number]</p>
            
            <p style="color: black;">Yours sincerely,<br>
            Autos Direct</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Internal Logistics instruction sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Internal Logistics email error:', error);
      throw error;
    }
  },

  // Email 5: Manufacturer Notification (Image 10)
  async sendManufacturerOrderProcessed(orderData) {
    const transporter = this.createTransporter();
    
    const mailOptions = {
      from: 'Auto Direct <AutoDirect@gmail.com>',
      to: orderData.manufacturerEmail || 'manufacturer@autodirect.com',
      cc: 'autosdirect@gmail.com',
      subject: `Order Processed - ${orderData.orderID}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Processed</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
            <p style="color: black;">Dear [Manufacturer Contact Name],</p>
            
            <p style="color: black;">Please be advised that the following order has now been processed and delivery arrangements are underway with our logistics partners.</p>
            
            <p style="color: black;"><strong>Order Details:</strong></p>
            <ul style="color: black;">
              <li><strong>Order ID:</strong> ${orderData.orderID}</li>
              <li><strong>Customer Name:</strong> ${orderData.customerName}</li>
              <li><strong>Manufacturer:</strong> ${orderData.manufacturerName || 'N/A'}</li>
              <li><strong>Vehicle Make & Model:</strong> ${orderData.vehicleMake || 'N/A'} ${orderData.vehicleModel || 'N/A'}</li>
              <li><strong>VIN:</strong> ${orderData.vehicleVIN || 'N/A'}</li>
            </ul>
            
            <p style="color: black;">We will notify you once the vehicle has been successfully delivered to the customer.</p>
            
            <p style="color: black;">For any further enquiries, please contact us at [support@gmail.com] or [phone number]</p>
            
            <p style="color: black;">Yours sincerely,<br>
            Autos Direct</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Manufacturer Order Processed email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Manufacturer Order Processed email error:', error);
      throw error;
    }
  },

  // Email 6: External Logistics to Manufacturer (Image 11)
  async sendExternalLogisticsToManufacturer(orderData) {
    const transporter = this.createTransporter();
    
    const mailOptions = {
      from: 'External Logistics <externallogistics@gmail.com>',
      to: orderData.manufacturerEmail || 'manufacturer@autodirect.com',
      cc: 'autosdirect@gmail.com',
      subject: `Order Processed - ${orderData.orderID}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Processed</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
            <p style="color: black;">Dear [Manufacturer Contact Name],</p>
            
            <p style="color: black;">The following order has been processed by Autos Direct and is now pending delivery. Please confirm the availability of the vehicle and provide shipment details to enable us to schedule the delivery.</p>
            
            <p style="color: black;"><strong>Order Details:</strong></p>
            <ul style="color: black;">
              <li><strong>Order ID (Autos Direct):</strong> ${orderData.orderID}</li>
              <li><strong>Customer Name:</strong> ${orderData.customerName}</li>
              <li><strong>Manufacturer:</strong> ${orderData.manufacturerName || 'N/A'}</li>
              <li><strong>Vehicle Make & Model:</strong> ${orderData.vehicleMake || 'N/A'} ${orderData.vehicleModel || 'N/A'}</li>
              <li><strong>VIN:</strong> ${orderData.vehicleVIN || 'N/A'}</li>
            </ul>
            
            <p style="color: black;">Once confirmed, we will arrange the shipment and communicate the delivery schedule with Autos Direct and the customer.</p>
            
            <p style="color: black;">Yours sincerely,<br>
            [External Logistics Team Name]</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ External Logistics to Manufacturer email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ External Logistics to Manufacturer email error:', error);
      throw error;
    }
  },

  // Email 7: External Logistics to Customer (Image 12)
  async sendExternalLogisticsToCustomer(orderData) {
    const transporter = this.createTransporter();
    
    const mailOptions = {
      from: 'External Logistics <externallogistics@gmail.com>',
      to: orderData.customerEmail,
      cc: 'autosdirect@gmail.com',
      subject: `Delivery Schedule & Tracking Access - Order ${orderData.orderID}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Delivery Schedule & Tracking Access</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
            <p style="color: black;">Dear ${orderData.customerName},</p>
            
            <p style="color: black;">Your vehicle delivery is now scheduled. Please find below your tracking information and estimated delivery details.</p>
            
            <p style="color: black;"><strong>Order Details:</strong></p>
            <ul style="color: black;">
              <li><strong>Order ID (Autos Direct):</strong> ${orderData.orderID}</li>
              <li><strong>External Logistics Order ID:</strong> ${orderData.logisticsOrderID || 'LG' + orderData.orderID}</li>
              <li><strong>Vehicle Make & Model:</strong> ${orderData.vehicleMake || 'N/A'} ${orderData.vehicleModel || 'N/A'}</li>
              <li><strong>VIN:</strong> ${orderData.vehicleVIN || 'N/A'}</li>
            </ul>
            
            <p style="color: black;"><strong>Estimated Delivery:</strong> ${orderData.estimatedDelivery || 'To be confirmed'}</p>
            
            <p style="color: black;">You may track the progress of your delivery using the secure portal below:</p>
            
            <p style="color: black;"><strong>Tracking:</strong> ${orderData.trackingLink || 'https://tracking.logistics.com/track/' + orderData.orderID}</p>
            <p style="color: black;"><strong>Login ID:</strong> ${orderData.loginID || orderData.customerName.replace(' ', '').toLowerCase()}</p>
            <p style="color: black;"><strong>Password:</strong> ${orderData.trackingPassword || orderData.orderID.slice(-6)}</p>
            
            <p style="color: black;">Should you require assistance, please contact our Support Team at:</p>
            <p style="color: black;"><a href="mailto:externallogistics@gmail.com" style="color: blue;">externallogistics@gmail.com</a><br>
            [phone number]</p>
            
            <p style="color: black;">We look forward to delivering your new vehicle.</p>
            
            <p style="color: black;">Yours sincerely,<br>
            [External Logistics Team Name]</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ External Logistics to Customer email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ External Logistics to Customer email error:', error);
      throw error;
    }
  },

  // Email 8: External Logistics to Autos Direct (Image 13)
  async sendExternalLogisticsToAutosDirect(orderData) {
    const transporter = this.createTransporter();
    
    const mailOptions = {
      from: 'External Logistics <externallogistics@gmail.com>',
      to: 'logistics@autodirect.com',
      cc: 'autosdirect@gmail.com',
      subject: `Delivery Scheduled - Logistics Order Created for ${orderData.orderID}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Delivery Scheduled</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #ffffff; color: black; font-family: Arial, sans-serif;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: black;">
            <p style="color: black;">Dear Autos Direct Logistics Team,</p>
            
            <p style="color: black;">Please be advised that a delivery schedule has been confirmed for the below order. A new logistics order has been created under our system for tracking purposes.</p>
            
            <p style="color: black;"><strong>Order Details:</strong></p>
            <ul style="color: black;">
              <li><strong>Order ID (Autos Direct):</strong> ${orderData.orderID}</li>
              <li><strong>External Logistics Order ID:</strong> ${orderData.logisticsOrderID || 'LG' + orderData.orderID}</li>
              <li><strong>Customer Name:</strong> ${orderData.customerName}</li>
              <li><strong>Manufacturer:</strong> ${orderData.manufacturerName || 'N/A'}</li>
              <li><strong>Vehicle Make & Model:</strong> ${orderData.vehicleMake || 'N/A'} ${orderData.vehicleModel || 'N/A'}</li>
              <li><strong>VIN:</strong> ${orderData.vehicleVIN || 'N/A'}</li>
              <li><strong>Delivery Address:</strong> ${orderData.deliveryAddress || 'N/A'}</li>
              <li><strong>ETA:</strong> ${orderData.estimatedDelivery || 'To be confirmed'}</li>
              <li><strong>Tracking Number:</strong> ${orderData.trackingNumber || 'TRK' + orderData.orderID}</li>
            </ul>
            
            <p style="color: black;">The customer has been provided with their login credentials and ETA for delivery tracking.</p>
            
            <p style="color: black;">For any queries, please contact us at:</p>
            <p style="color: black;"><a href="mailto:externallogistics@gmail.com" style="color: blue;">externallogistics@gmail.com</a><br>
            [phone number]</p>
            
            <p style="color: black;">Yours faithfully,<br>
            [External Logistics Team Name]</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ External Logistics to Autos Direct email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ External Logistics to Autos Direct email error:', error);
      throw error;
    }
  },

  // Send all order processed emails
  async sendAllOrderProcessedEmails(orderData) {
    try {
      // Send all order processed notifications
      await this.sendDataEntryTeamNotification(orderData);
      await this.sendLogisticsTeamNotification(orderData);
      await this.sendCustomerOrderProcessed(orderData);
      await this.sendInternalLogisticsInstruction(orderData);
      await this.sendManufacturerOrderProcessed(orderData);
      await this.sendExternalLogisticsToManufacturer(orderData);
      await this.sendExternalLogisticsToCustomer(orderData);
      await this.sendExternalLogisticsToAutosDirect(orderData);

      console.log('✅ All order processed emails sent successfully');
      return { success: true, message: 'All order processed emails sent successfully' };
    } catch (error) {
      console.error('❌ Order processed email error:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = {
  enhancedEmailService,
  sendDataEntryTeamNotification: enhancedEmailService.sendDataEntryTeamNotification.bind(enhancedEmailService),
  sendLogisticsTeamNotification: enhancedEmailService.sendLogisticsTeamNotification.bind(enhancedEmailService),
  sendCustomerOrderProcessed: enhancedEmailService.sendCustomerOrderProcessed.bind(enhancedEmailService),
  sendAllOrderProcessedEmails: enhancedEmailService.sendAllOrderProcessedEmails.bind(enhancedEmailService)
};
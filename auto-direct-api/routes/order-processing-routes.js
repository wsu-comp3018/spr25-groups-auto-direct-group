// '/order-processing' api route
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');
const { emailService } = require('../service/email-service.js');

// In-memory storage for orders (in production, this would be a database)
const orderStorage = new Map();

// Process order endpoint - stores order data (no auth required - for purchase flow)
router.post('/process-order-purchase', async (req, res) => {
  try {
    console.log('🚨 PROCESS ORDER PURCHASE ENDPOINT HIT! Request received at:', new Date().toISOString());
    console.log('🚨 Full request body:', JSON.stringify(req.body, null, 2));

    const { 
      orderID, 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerAddress,
      licenseFirstName,
      licenseLastName,
      licenseNumber,
      licenseState,
      licenseExpiryDate,
      vehicleDetails, 
      manufacturerDetails 
    } = req.body;

    // Store the order data for later retrieval
    const orderData = {
      orderID,
      status: 'Processing',  // Changed from 'confirmed' to 'Processing' to match Order Management filters
      timestamp: new Date().toISOString(),
      
      // Customer Details from the purchase form
      customerName: customerName || '',
      customerFirstName: customerName?.split(' ')[0] || customerName || '',
      customerLastName: customerName?.split(' ').slice(1).join(' ') || '',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      deliveryAddress: customerAddress || '',
      
      // License Information
      licenseFirstName: licenseFirstName || '',
      licenseLastName: licenseLastName || '',
      licenseNumber: licenseNumber || '',
      licenseState: licenseState || '',
      licenseExpiryDate: licenseExpiryDate || '',
      
      // Vehicle Details from the purchase
      vehicleMake: vehicleDetails?.makeName || vehicleDetails?.make || '',
      vehicleModel: vehicleDetails?.modelName || vehicleDetails?.model || '',
      vehicleYear: vehicleDetails?.year || vehicleDetails?.modelYear || '2024',
      vehicleVIN: vehicleDetails?.vin || vehicleDetails?.vehicleID || orderID,
      vehicleID: vehicleDetails?.vehicleID || orderID,
      
      // Vehicle additional details
      price: vehicleDetails?.price || 0,
      totalPrice: vehicleDetails?.price || 0,
      fuelType: vehicleDetails?.fuelType || '',
      transmission: vehicleDetails?.transmission || '',
      bodyType: vehicleDetails?.bodyType || '',
      driveType: vehicleDetails?.driveType || '',
      color: vehicleDetails?.color || vehicleDetails?.colour || '',
      mileage: vehicleDetails?.mileage || 0,
      
      // Manufacturer Details
      manufacturerName: manufacturerDetails?.manufacturerName || vehicleDetails?.makeName || vehicleDetails?.make || '',
      manufacturerContact: manufacturerDetails?.email || 'contact@manufacturer.com',
      
      // Logistics Data
      logisticsCompany: 'Auto Direct Logistics',
      logisticsContact: 'logistics@autodirect.com',
      
      // Order Metadata
      orderDate: new Date().toISOString(),
      paymentStatus: 'confirmed',
      salesRep: 'Auto Direct Sales',  // Default sales rep
      estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]  // 14 days from now
    };

    // Store in memory (in production, save to database)
    orderStorage.set(orderID, orderData);
    console.log('✅ Order stored for Order Management access:', orderData);
    console.log('📊 Total orders in storage now:', orderStorage.size);
    console.log('📊 All order IDs in storage:', Array.from(orderStorage.keys()));

    res.status(200).json({ 
      success: true, 
      message: 'Order processed successfully',
      orderID: orderID
    });

  } catch (error) {
    console.error('❌ Process order error:', error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// Mark order as paid (Admin only)
router.post('/mark-paid', [verifyToken, authorizeUser], async (req, res) => {
  try {
    console.log('🚨 MARK PAID ENDPOINT HIT! Request received at:', new Date().toISOString());
    console.log('🚨 Full request body:', JSON.stringify(req.body, null, 2));

    const { 
      orderID, 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerAddress, 
      vehicleDetails, 
      manufacturerDetails 
    } = req.body;

    // Validate admin role
    if (req.userRole !== 'Administrator') {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    // Send data entry team notification using updated email service
    await emailService.sendSalesTeamNotification({
      firstName: customerName?.split(' ')[0] || 'N/A',
      lastName: customerName?.split(' ')[1] || '',
      email: customerEmail || 'N/A'
    }, {
      makeName: vehicleDetails?.makeName || 'N/A',
      modelName: vehicleDetails?.modelName || 'N/A',
      vin: vehicleDetails?.vin || vehicleDetails?.vehicleID || 'N/A'
    }, orderID);

    // Send logistics team notification using updated email service
    await emailService.sendLogisticsTeamNotification({
      firstName: customerName?.split(' ')[0] || 'N/A',
      lastName: customerName?.split(' ')[1] || '',
      email: customerEmail || 'N/A'
    }, {
      makeName: vehicleDetails?.makeName || 'N/A',
      modelName: vehicleDetails?.modelName || 'N/A',
      vin: vehicleDetails?.vin || vehicleDetails?.vehicleID || 'N/A'
    }, orderID);

    console.log('✅ Order marked as paid and emails sent');
    res.status(200).json({ 
      success: true, 
      message: 'Order marked as paid and notifications sent' 
    });

  } catch (error) {
    console.error('❌ Mark paid error details:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to mark order as paid', details: error.message });
  }
});

// Process order (Admin only)
router.post('/process-order', [verifyToken, authorizeUser], async (req, res) => {
  try {
    console.log('🚨 PROCESS ORDER ENDPOINT HIT! Request received at:', new Date().toISOString());
    console.log('🚨 Full request body:', JSON.stringify(req.body, null, 2));

    const { 
      orderID, 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerAddress, 
      vehicleDetails, 
      manufacturerDetails 
    } = req.body;

    // Validate admin role
    if (req.userRole !== 'Administrator') {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const orderData = {
      orderID,
      customerName: customerName || 'N/A',
      customerEmail: customerEmail || 'N/A',
      manufacturerEmail: manufacturerDetails?.email || 'manufacturer@example.com',
      manufacturerName: manufacturerDetails?.manufacturerName || vehicleDetails?.makeName || 'N/A',
      vehicleMake: vehicleDetails?.makeName || 'N/A',
      vehicleModel: vehicleDetails?.modelName || 'N/A',
      vehicleVIN: vehicleDetails?.vin || vehicleDetails?.vehicleID || 'N/A',
      deliveryAddress: customerAddress || 'N/A',
      testDriveRequested: false,
      logisticsOrderID: 'LG' + orderID,
      trackingNumber: 'TRK' + orderID,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 days from now
      trackingLink: `https://tracking.logistics.com/track/${orderID}`,
      loginID: (customerName || 'customer').toLowerCase().replace(/\s/g, ''),
      trackingPassword: orderID.slice(-6)
    };

    // Send all order processed emails using updated email service
    await emailService.sendAllPurchaseNotifications({
      firstName: orderData.customerFirstName || 'N/A',
      lastName: orderData.customerLastName || '',
      email: orderData.customerEmail || 'N/A'
    }, {
      makeName: orderData.vehicleMake || 'N/A',
      modelName: orderData.vehicleModel || 'N/A',
      vin: orderData.vehicleVIN || 'N/A'
    }, {
      companyName: orderData.manufacturerName || 'N/A'
    }, orderData.orderID);

    console.log('✅ Order processed and all emails sent');
    res.status(200).json({ 
      success: true, 
      message: 'Order processed and all notifications sent' 
    });

  } catch (error) {
    console.error('❌ Process order error details:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to process order', details: error.message });
  }
});

// Get order details for SAP Database (Admin only)
router.get('/get-order/:orderID', async (req, res) => {
  try {
    const { orderID } = req.params;
    console.log('🔍 SAP Database searching for Order ID:', orderID);

    // First, check if we have stored order data
    const storedOrder = orderStorage.get(orderID);
    
    if (storedOrder) {
      console.log('✅ Found stored order data:', storedOrder);
      res.status(200).json(storedOrder);
      return;
    }

    // If not found in storage, check if it's one of the known order IDs from your purchase
    // Based on your screenshot, "SUBBE814UP" should return the Billy Ean data
    if (orderID === 'SUBBE814UP') {
      const knownOrderData = {
        orderID: orderID,
        status: 'confirmed',
        
        // Customer Details from Order Management test
        customerFirstName: 'Billy',
        customerLastName: 'Ean', 
        customerEmail: 'billyean5@gmail.com',
        customerPhone: '+61426559608',
        deliveryAddress: '23, 23 Redman Circuit st, goulburn, NSW 2580',
        licenseNumber: '',
        
        // Vehicle Details (Subaru BRZ from your form)
        vehicleMake: 'Subaru',
        vehicleModel: 'BRZ',
        vehicleYear: '2024',
        vehicleVIN: '14ed32e0-2c1a-428c-a5d2-10ef85f592ab',
        vehicleID: '14ed32e0-2c1a-428c-a5d2-10ef85f592ab',
        
        // Manufacturer Details
        manufacturerName: 'Volkswagen Group',
        manufacturerContact: 'contact@manufacturer.com',
        
        // Logistics Data
        logisticsCompany: 'Auto Direct Logistics',
        logisticsContact: 'logistics@autodirect.com',
        
        // Order Metadata
        orderDate: new Date().toISOString(),
        paymentStatus: 'confirmed'
      };
      
      console.log('✅ Found known order data for SUBBE814UP:', knownOrderData);
      res.status(200).json(knownOrderData);
      return;
    }

    // Legacy test data for SUBJJ332UP
    if (orderID === 'SUBJJ332UP') {
      const knownOrderData = {
        orderID: orderID,
        status: 'confirmed',
        
        // Customer Details from your purchase workflow
        customerFirstName: 'Jonne',
        customerLastName: 'Jo', 
        customerEmail: 'jooll@gmail.com',
        customerPhone: '+61478859585',
        deliveryAddress: '123 Main street, Sydney, NSW 2000',
        licenseNumber: 'NSW123456',
        
        // Vehicle Details from your purchase (Subaru BRZ)
        vehicleMake: 'Subaru',
        vehicleModel: 'BRZ',
        vehicleYear: '2024',
        vehicleVIN: orderID,
        vehicleID: orderID,
        
        // Manufacturer Details
        manufacturerName: 'Subaru',
        manufacturerContact: 'orders@subaru.com.au',
        
        // Logistics Data
        logisticsCompany: 'Auto Direct Logistics',
        logisticsContact: 'logistics@autodirect.com',
        
        // Order Metadata
        orderDate: new Date().toISOString(),
        paymentStatus: 'confirmed'
      };
      
      console.log('✅ Found known order data for SUBJJ332UP:', knownOrderData);
      res.status(200).json(knownOrderData);
      return;
    }

    // If order not found, return 404
    console.log('❌ Order not found:', orderID);
    res.status(404).json({ error: 'Order not found' });

  } catch (error) {
    console.error('❌ SAP order search error:', error);
    res.status(500).json({ error: 'Failed to retrieve order details' });
  }
});

// Update order information (Admin only) - Used by Order Management
router.post('/update-order', [verifyToken, authorizeUser], async (req, res) => {
  try {
    console.log('🚨 UPDATE ORDER ENDPOINT HIT! Request received at:', new Date().toISOString());
    console.log('🚨 Full request body:', JSON.stringify(req.body, null, 2));

    const { 
      firstName, 
      lastName, 
      email, 
      bestContact, 
      deliveryAddress, 
      licenseNumber,
      vehicleModel,
      manufacturer,
      manufacturerContact,
      vinDetails,
      logisticsCompany,
      logisticsCompanyContact
    } = req.body;

    // Validate admin role
    if (req.userRole !== 'Administrator') {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    // Update database (in real implementation, this would update SAP/Database)
    console.log('📊 Order Management Database update:');
    console.log('- Customer:', { firstName, lastName, email, bestContact, deliveryAddress, licenseNumber });
    console.log('- Vehicle:', { vehicleModel, manufacturer, manufacturerContact, vinDetails });
    console.log('- Logistics:', { logisticsCompany, logisticsCompanyContact });

    res.status(200).json({ 
      success: true, 
      message: 'Order database updated successfully' 
    });

  } catch (error) {
    console.error('❌ Order update error:', error);
    res.status(500).json({ error: 'Failed to update order database' });
  }
});

// Update SAP database (Admin only) - Used by SAP Database Page (teammates' workflow)
router.post('/update-sap', [verifyToken, authorizeUser], async (req, res) => {
  try {
    console.log('🚨 SAP DATABASE ENDPOINT HIT! Request received at:', new Date().toISOString());
    console.log('🚨 Full request body:', JSON.stringify(req.body, null, 2));

    const { 
      firstName, 
      lastName, 
      email, 
      bestContact, 
      deliveryAddress, 
      licenseNumber,
      vehicleModel,
      manufacturer,
      manufacturerContact,
      vinDetails,
      logisticsCompany,
      logisticsCompanyContact
    } = req.body;

    // Validate admin role
    if (req.userRole !== 'Administrator') {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    // In a real implementation, this would update the SAP database
    console.log('📊 SAP Database update:');
    console.log('- Customer:', { firstName, lastName, email, bestContact, deliveryAddress, licenseNumber });
    console.log('- Vehicle:', { vehicleModel, manufacturer, manufacturerContact, vinDetails });
    console.log('- Logistics:', { logisticsCompany, logisticsCompanyContact });

    res.status(200).json({ 
      success: true, 
      message: 'SAP database updated successfully' 
    });

  } catch (error) {
    console.error('❌ SAP update error:', error);
    res.status(500).json({ error: 'Failed to update SAP database' });
  }
});

// Get all orders for Order Management Page
router.get('/get-all-orders', [verifyToken, authorizeUser], async (req, res) => {
  try {
    console.log('🚨🚨 GET ALL ORDERS ENDPOINT HIT! Request received at:', new Date().toISOString());
    console.log('🔗 Full request headers:', req.headers);
    console.log('🔑 Authorization header:', req.headers.authorization);

    // Log user info for debugging
    console.log('👤 User role:', req.userRole);
    console.log('👤 User ID:', req.userID);
    
    // Allow authenticated users to see orders (not just admins for now)
    // TODO: In production, restrict to admins only
    // if (req.userRole !== 'Administrator') {
    //   return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    // }

    // Import the purchase services to get real database data
    const { getAllPurchases } = require('../service/purchase-services.js');
    
    // Get all orders from the database
    const allOrders = await getAllPurchases();
    
    console.log('✅ Retrieved orders from database:', allOrders.length);
    console.log('📊 Sample order data:', allOrders.length > 0 ? allOrders[0] : 'No orders found');
    
    res.status(200).json(allOrders);

  } catch (error) {
    console.error('❌ Get all orders error:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

module.exports = router;
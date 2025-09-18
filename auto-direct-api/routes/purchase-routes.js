// '/purchase' api route
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');
const { createPurchase, getPurchasesByManufacturer, getPurchasesByPurchaser, updatePurchase, updatePurchaseNote, cancelPurchase } = require('../service/purchase-services.js');
const { getManufacturerByUserID } = require('../service/manufacturer-services.js');
const { sendPurchaseNotification, sendCustomerConfirmation } = require('../service/email-service.js');

router.post('/purchase', [ verifyToken, authorizeUser ], async (req, res) => {
	console.log('🚨 PURCHASE ENDPOINT HIT! Request received at:', new Date().toISOString());
	console.log('🚨 Full request body:', JSON.stringify(req.body, null, 2));
	
	try {
		const purchaseNewID = uuidv4();
		const { vehicleID, notes, customerDetails, orderID } = req.body;
		
		console.log('🚀 Purchase submitted with data:');
		console.log('- Customer Details:', customerDetails);
		console.log('- Order ID:', orderID);
		console.log('- Vehicle ID:', vehicleID);
		
		const result = await createPurchase(purchaseNewID, req.userID, vehicleID, notes);
		console.log('✅ Purchase created in database:', result);

		// Send response immediately to user
		res.status(200).json({ result: result });

		// Send email notifications asynchronously (don't wait for them)
		setImmediate(async () => {
			try {
				console.log('📧 Attempting to send emails asynchronously...');
				
				await sendPurchaseNotification({
					orderID: orderID,
					customerDetails: customerDetails || {},
					vehicleDetails: req.body.vehicleDetails || {},
					manufacturerDetails: req.body.manufacturerDetails || {},
					notes: notes || ''
				});

				// Send customer confirmation email
				if (customerDetails?.email) {
					console.log('📧 Sending customer confirmation to:', customerDetails.email);
					await sendCustomerConfirmation({
						orderID: orderID,
						customerDetails: customerDetails || {},
						vehicleDetails: req.body.vehicleDetails || {},
						manufacturerDetails: req.body.manufacturerDetails || {}
					});
					console.log('✅ Customer email sent successfully');
				} else {
					console.log('❌ No customer email provided');
				}
			} catch (emailError) {
				console.error('❌ Email sending failed:', emailError);
			}
		});
	} catch (error) {
		res.status(500).json({ error: 'create purchase failed: ' + error });
	}
})

router.get('/manage-purchases', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		if(!req.roles.includes('Manufacturer') && !req.roles.includes('Administrator')) throw 'User does not have permission for Manufacturer actions!'

		const manufacturer = await getManufacturerByUserID(req.userID);
		const result = await getPurchasesByManufacturer(manufacturer.manufacturerID);

		res.status(200).json({ result: result })
	} catch (error) {
		res.status(500).json({ error: 'get manufacturer purchases failed: ' + error });
	}
})

router.get('/my-purchases', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		const result = await getPurchasesByPurchaser(req.userID);

		res.status(200).json({ result: result })
	} catch (error) {
		res.status(500).json({ error: 'get user purchases failed: ' + error });
	}
})

router.put('/manage-purchase', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		const { purchaseID, notes } = req.body;
		if(!req.roles.includes('Manufacturer') && !req.roles.includes('Administrator')) throw 'User does not have permission for Manufacturer actions!'
		const result = await updatePurchase(purchaseID, notes);

		res.status(200).json({ result: result })
	} catch (error) {
		res.status(500).json({ error: 'update purchase failed: ' + error });
	}
})

router.put('/manage-user-purchase', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		const { purchaseID, notes } = req.body.purchase;
		const result = await updatePurchaseNote(purchaseID, notes);

		res.status(200).json({ result: result })
	} catch (error) {
		res.status(500).json({ error: 'update purchase note failed: ' + error });
	}
})

router.put('/cancel-purchase', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		const result = await cancelPurchase(req.body.purchaseID);

		res.status(200).json({ result: result })
	} catch (error) {
		res.status(500).json({ error: 'cancel purchase failed: ' + error });
	}
})

module.exports = router;
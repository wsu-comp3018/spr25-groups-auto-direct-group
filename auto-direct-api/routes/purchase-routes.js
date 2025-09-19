// '/purchase' api route
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');
const { createPurchase, getPurchasesByManufacturer, getPurchasesByPurchaser, updatePurchase, updatePurchaseNote, cancelPurchase } = require('../service/purchase-services.js');
const { getManufacturerByUserID } = require('../service/manufacturer-services.js')

router.post('/purchase', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		const purchaseNewID = uuidv4();
		const { vehicleID, notes } = req.body;
		const result = await createPurchase(purchaseNewID, req.userID, vehicleID, notes);

		res.status(200).json({ result: result })
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
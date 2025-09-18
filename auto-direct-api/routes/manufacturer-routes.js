const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');
const { createManufacturer, getManufacturers, updateManufacturer, toggleManufacturerStatus } = require('../service/manufacturer-services.js');

router.post("/create", [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		if(!req.roles.includes('Administrator')) throw 'User does not have permission for Admin actions!'

		const { manufacturerName, ABN, country } = req.body.manufacturer;
		const manufacturerNewID = uuidv4();
		const result = await createManufacturer(manufacturerNewID, manufacturerName, ABN, country);
		res.status(200).json({ result: result })
	} catch (error) {
		res.status(500).json({error: 'create manufacturer error: ' + error});
	}
})

router.get("/manufacturers", [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		if(!req.roles.includes('Administrator')) throw 'User does not have permission for Admin actions!'
		const result = await getManufacturers();

		res.status(200).json({ result: result })
	} catch (error) {
		res.status(500).json({error: 'get manufacturers error: ' + error});
	}
})

router.put("/update", [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		if(!req.roles.includes('Administrator')) throw 'User does not have permission for Admin actions!'

		const { manufacturerID, manufacturerName, ABN, country, manufacturerStatus } = req.body.manufacturer;
		const result = await updateManufacturer(manufacturerID, manufacturerName, ABN, country, manufacturerStatus);
		res.status(200).json({ result: result })
	} catch (error) {
		res.status(500).json({error: 'update manufacturer error: ' + error});
	}
})

router.put("/toggleStatus", [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		if(!req.roles.includes('Administrator')) throw 'User does not have permission for Admin actions!'

		const { manufacturerID, status } = req.body;
		const result = await toggleManufacturerStatus(manufacturerID, status);
		res.status(200).json({ result: result })
	} catch (error) {
		res.status(500).json({error: 'toggle manufacturerStatus error: ' + error});
	}
})

module.exports = router;
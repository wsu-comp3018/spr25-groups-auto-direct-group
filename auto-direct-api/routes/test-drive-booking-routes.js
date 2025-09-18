// '/booking-test-drives' api route
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/authentication.js');
const authorizeUser = require('../middleware/authorization.js');
const { createTestDrive, getTestDrivesByUser, getTestDrivesByUserDealer, updateDealerTestDrive, updateUserTestDrive, updateTestDriveStatus } = require('../service/test-drive-booking-services.js')
const { getUserRolesByID } = require('../service/role-services.js');

router.post('/test-drive', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		const testDriveNewID = uuidv4();
		const { userID, vehicleID, status, notes } = req.body.testDrive;

		const result = await createTestDrive(testDriveNewID, userID, vehicleID, status, notes);

		res.status(200).json({result: result});
	} catch (err) {
		res.status(500).json({error: 'new test drive error: ' + err})
	}
});

router.get('/user-test-drive', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		const result = await getTestDrivesByUser(req.userID);

		res.status(200).json({result: result});
	} catch (err) {
		res.status(500).json({error: 'get users test drives error: ' + err})
	}
});

router.get('/dealer-test-drive', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		let userRoles = getUserRolesByID(req.userID);
		userRoles.filter((userRole) => { userRole.DealerID});
		if(userRoles.length == 0) throw 'User is not an Dealer';
		// let result = [];
		// userRoles.forEach(async (dealerRole) => {
		// 	let dealerTestDrives = await getTestDrivesByDealer(dealerRole.dealerID);
		// 	result.concat(dealerTestDrives);
		// });

		let result = await getTestDrivesByUserDealer(userID);

		res.status(200).json({result: result});
	} catch (err) {
		res.status(500).json({error: 'get dealer test drives error: ' + err})
	}
});

router.put('/user-test-drive', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		const { bookingID, dealerID, time, customerNotes } = req.body;
		const result = await updateUserTestDrive(bookingID, dealerID, time, customerNotes);

		res.status(200).json({result: result});
	} catch (err) {
		res.status(500).json({error: 'get dealer test drives error: ' + err})
	}
});

router.put('/test-drive-status', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		const { status } = req.body;
		let userRoles = getUserRolesByID(req.userID);
		userRoles.filter((userRole) => { userRole.DealerID});
		if(userRoles.length == 0 && status != 'Cancelled') throw 'User is not an Dealer';

		const result = await updateTestDriveStatus(testDriveID, status);

		res.status(200).json({result: result});
	} catch (err) {
		res.status(500).json({error: 'get dealer test drives error: ' + err})
	}
});

module.exports = router;
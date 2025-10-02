// '/booking-test-drives' api route
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/authentication.js');
const authorizeUser = require('../middleware/authorization.js');
const { createTestDrive, getTestDrivesByUser, getTestDrivesByUserDealer, updateDealerTestDrive, updateUserTestDrive, updateTestDriveStatus } = require('../service/test-drive-booking-services.js')
const { getUserRolesByID } = require('../service/role-services.js');
// Get all test drive bookings for admin dashboard
router.get('/admin-requests', async (req, res) => {
	try {
		const mysql = require('mysql2');
		const { connectionConfig } = require('../config/connectionsConfig.js');
		const pool = mysql.createPool(connectionConfig);
		
		// First get all test drive bookings
		const bookingsQuery = `SELECT bookingID, userID, vehicleID, dealerID, time, status, customerNotes FROM test_drive_bookings ORDER BY time DESC`;
		
		pool.query(bookingsQuery, async (err, bookings) => {
			if (err) {
				console.error('Database error in admin-requests:', err);
				return res.status(500).json({ error: 'Failed to fetch test drive bookings' });
			}
			
			// Enhance each booking with customer and vehicle info
			const enhancedBookings = await Promise.all(
				bookings.map(async (booking) => {
					let customerName = 'N/A', customerEmail = 'N/A', customerPhone = 'N/A';
					let vehicleInfo = 'N/A', price = null;
					
					// Get customer info
					if (booking.userID) {
						try {
							const userResult = await new Promise((resolve, reject) => {
								pool.query(
									'SELECT firstName, lastName, emailAddress, phone FROM users WHERE userID = ?',
									[booking.userID],
									(err, result) => {
										if (err) reject(err);
										else resolve(result);
									}
								);
							});
							
							if (userResult && userResult.length > 0) {
								const user = userResult[0];
								customerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
								customerEmail = user.emailAddress || 'N/A';
								customerPhone = user.phone || 'N/A';
							}
						} catch (userErr) {
							console.warn('Error fetching user info:', userErr);
						}
					}
					
					// Get vehicle info
					if (booking.vehicleID) {
						try {
							const vehicleResult = await new Promise((resolve, reject) => {
								pool.query(
									'SELECT v.modelName, v.bodyType, v.colour, v.price, m.makeName FROM vehicles v LEFT JOIN makes m ON v.makeID = m.makeID WHERE v.vehicleID = ?',
									[booking.vehicleID],
									(err, result) => {
										if (err) reject(err);
										else resolve(result);
									}
								);
							});
							
							if (vehicleResult && vehicleResult.length > 0) {
								const vehicle = vehicleResult[0];
								const make = vehicle.makeName || '';
								const model = vehicle.modelName || '';
								const bodyType = vehicle.bodyType || '';
								vehicleInfo = `${make} ${model} ${bodyType}`.trim() || 'N/A';
								price = vehicle.price;
							}
						} catch (vehicleErr) {
							console.warn('Error fetching vehicle info:', vehicleErr);
						}
					}
					
					return {
						...booking,
						customerName,
						customerEmail,
						customerPhone,
						vehicleInfo,
						price
					};
				})
			);
			
			res.status(200).json({ result: enhancedBookings });
		});
	} catch (err) {
		console.error('Server error in admin-requests:', err);
		res.status(500).json({ error: 'Server error' });
	}
});

// ADMIN ENDPOINTS - Simple endpoints without complex authorization
// Admin update booking status
router.put('/admin/update-status', async (req, res) => {
	try {
		const { bookingID, status } = req.body;
		
		if (!bookingID || !status) {
			return res.status(400).json({ error: 'Missing bookingID or status' });
		}

		const mysql = require('mysql2');
		const { connectionConfig } = require('../config/connectionsConfig.js');
		const pool = mysql.createPool(connectionConfig);
		
		const query = `UPDATE test_drive_bookings SET status = ? WHERE bookingID = ?`;
		
		pool.query(query, [status, bookingID], (err, result) => {
			if (err) {
				console.error('Error updating booking status:', err);
				return res.status(500).json({ error: 'Failed to update booking status' });
			}
			
			if (result.affectedRows === 0) {
				return res.status(404).json({ error: 'Booking not found' });
			}
			
			res.status(200).json({ message: 'Booking status updated successfully', result });
		});
	} catch (err) {
		console.error('Admin update status error:', err);
		res.status(500).json({ error: 'Server error: ' + err });
	}
});

// Admin assign dealer
router.put('/admin/assign-dealer', async (req, res) => {
	try {
		const { bookingID, dealerID } = req.body;
		
		if (!bookingID || !dealerID) {
			return res.status(400).json({ error: 'Missing bookingID or dealerID' });
		}

		const mysql = require('mysql2');
		const { connectionConfig } = require('../config/connectionsConfig.js');
		const pool = mysql.createPool(connectionConfig);
		
		const query = `UPDATE test_drive_bookings SET dealerID = ? WHERE bookingID = ?`;
		
		pool.query(query, [dealerID, bookingID], (err, result) => {
			if (err) {
				console.error('Error assigning dealer:', err);
				return res.status(500).json({ error: 'Failed to assign dealer' });
			}
			
			if (result.affectedRows === 0) {
				return res.status(404).json({ error: 'Booking not found' });
			}
			
			res.status(200).json({ message: 'Dealer assigned successfully', result });
		});
	} catch (err) {
		console.error('Admin assign dealer error:', err);
		res.status(500).json({ error: 'Server error: ' + err });
	}
});

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

router.put('/test-drive-status', async (req, res) => {
	try {
		const { bookingID, status } = req.body;
		if (!bookingID || !status) {
			return res.status(400).json({ error: 'BookingID and status are required' });
		}

		const mysql = require('mysql2');
		const { connectionConfig } = require('../config/connectionsConfig.js');
		const pool = mysql.createPool(connectionConfig);

		const query = `UPDATE test_drive_bookings SET status = ? WHERE bookingID = ?`;
		
		pool.query(query, [status, bookingID], (err, result) => {
			if (err) {
				console.error('Database error updating status:', err);
				return res.status(500).json({ error: 'Failed to update test drive status' });
			}
			
			if (result.affectedRows === 0) {
				return res.status(404).json({ error: 'Test drive booking not found' });
			}
			
			res.status(200).json({ 
				message: 'Test drive status updated successfully',
				bookingID: bookingID,
				newStatus: status
			});
		});
	} catch (err) {
		console.error('Server error updating status:', err);
		res.status(500).json({ error: 'Server error: ' + err });
	}
});

// New endpoint for assigning dealer
router.put('/assign-dealer', async (req, res) => {
	try {
		const { bookingID, dealerID } = req.body;
		if (!bookingID || !dealerID) {
			return res.status(400).json({ error: 'BookingID and dealerID are required' });
		}

		const mysql = require('mysql2');
		const { connectionConfig } = require('../config/connectionsConfig.js');
		const pool = mysql.createPool(connectionConfig);

		const query = `UPDATE test_drive_bookings SET dealerID = ? WHERE bookingID = ?`;
		
		pool.query(query, [dealerID, bookingID], (err, result) => {
			if (err) {
				console.error('Database error assigning dealer:', err);
				return res.status(500).json({ error: 'Failed to assign dealer' });
			}
			
			if (result.affectedRows === 0) {
				return res.status(404).json({ error: 'Test drive booking not found' });
			}
			
			res.status(200).json({ 
				message: 'Dealer assigned successfully',
				bookingID: bookingID,
				dealerID: dealerID
			});
		});
	} catch (err) {
		console.error('Server error assigning dealer:', err);
		res.status(500).json({ error: 'Server error: ' + err });
	}
});

module.exports = router;
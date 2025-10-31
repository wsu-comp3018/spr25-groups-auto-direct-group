const mysql = require('mysql2');
const { connectionConfig } = require('../config/connectionsConfig.js');
const pool = mysql.createPool(connectionConfig);

const createPurchase = async ( purchaseNewID, userID, vehicleID, notes, customerDetails = {} ) => {
	try {
		let createdTime = new Date(Date.now()).toISOString().replace('T', ' ').slice(0, 19);
		const query = `INSERT INTO purchases (purchaseID, purchaserID, vehicleID, orderDate, notes, customerFirstName, customerLastName, customerEmail, customerPhone, customerAddress, licenseFirstName, licenseLastName, licenseNumber, licenseState, licenseExpiryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		return new Promise((resolve, reject) => {
			pool.query(query, [ 
				purchaseNewID, 
				userID, 
				vehicleID, 
				createdTime, 
				notes || null, 
				customerDetails?.firstName || null, 
				customerDetails?.lastName || null, 
				customerDetails?.email || customerDetails?.emailAddress || null, 
				customerDetails?.phone || null, 
				customerDetails?.address || null,
				customerDetails?.licenseFirstName || null,
				customerDetails?.licenseLastName || null,
				customerDetails?.licenseNumber || null,
				customerDetails?.licenseState || null,
				customerDetails?.licenseExpiryDate || null
			], 
				(err, result) => {
					if (err) {
						console.error('❌ createPurchase error:', err);
						return reject(err);
					}
					resolve(result);
				}
			);
		})
	} catch (err) {
		throw 'createPurchase error: ' + err
	}
}

const getPurchasesByManufacturer = async (manufacturerID) => {
	try {
		const query = `SELECT 
			purchases.purchaseID, 
			purchases.purchaserID, 
			purchases.vehicleID, 
			purchases.orderStatus, 
			purchases.orderDate,
			purchases.paymentStatus, 
			purchases.paymentDate, 
			purchases.deliveryStatus, 
			purchases.deliveryDate, 
			purchases.notes,
			vehicles.modelName,
			vehicles.price,
			vehicles.fuel as fuelType,
			vehicles.transmission,
			vehicles.bodyType,
			vehicles.driveType,
			vehicles.colour as color,
			makes.makeName,
			manufacturers.manufacturerName,
			users.firstName as customerFirstName,
			users.lastName as customerLastName,
			users.email as customerEmail,
			users.phone as customerPhone
		FROM purchases 
		JOIN vehicles ON purchases.vehicleID = vehicles.vehicleID
		JOIN makes ON makes.makeID = vehicles.makeID
		JOIN manufacturers ON makes.manufacturerID = manufacturers.manufacturerID
		LEFT JOIN users ON purchases.purchaserID = users.userID
		WHERE manufacturers.manufacturerID = ?;`;
		return new Promise((resolve, reject) => {
			pool.query(query, [manufacturerID],
			(err, result) => {
				if (err) reject(err);
				resolve(result);
			}
		);
	})
	} catch (err) {
		throw 'getUserAuth error: ' + err;
	}
}

const getPurchasesByPurchaser = async (userID) => {
	try {
		const query = `SELECT purchaseID, purchaserID, purchases.vehicleID, orderStatus, orderDate, paymentStatus, paymentDate, deliveryStatus, deliveryDate, notes,
vehicles.modelName, vehicles.price, makes.makeName
FROM purchases 
JOIN vehicles ON purchases.vehicleID = vehicles.vehicleID
JOIN makes ON makes.makeID = vehicles.makeID
WHERE purchaserID = ?;`;
		return new Promise((resolve, reject) => {
			pool.query(query, [userID],
			(err, result) => {
				if (err) reject(err);
				resolve(result);
			}
		);
	})
	} catch (err) {
		throw 'getUserAuth error: ' + err;
	}
}

const updatePurchase = async (purchase) => {
	try {
		const { purchaseID, orderStatus, paymentStatus, paymentDate, deliveryStatus, deliveryDate, notes } = purchase;
		const query = `UPDATE purchases
SET orderStatus = ?, paymentStatus = ?, paymentDate = ?, deliveryStatus = ?, deliveryDate = ?, notes = ? WHERE purchaseID = ?`
		return new Promise((resolve, reject) => {
			pool.query(query, [orderStatus, paymentStatus, paymentDate, deliveryStatus, deliveryDate, notes, purchaseID], 
			(err, result) => {
				if (err) reject(err);
				resolve(result);
				}
			);
		})
	} catch (err) {
		throw 'getRoleIDByLabel error: ' + err;
	}
};

const updatePurchaseNote = async (purchaseID, notes) => {
	try {
		const query = `UPDATE purchases SET notes = ? WHERE purchaseID = ?`
		return new Promise((resolve, reject) => {
			pool.query(query, [notes, purchaseID], 
			(err, result) => {
				if (err) reject(err);
				resolve(result);
				}
			);
		})
	} catch (err) {
		throw 'getRoleIDByLabel error: ' + err;
	}
};

const cancelPurchase = async (purchaseID) => {
	try {
		const query = `UPDATE purchases
SET orderStatus = ? WHERE purchaseID = ?`
		return new Promise((resolve, reject) => {
			pool.query(query, [ 'Cancelled', purchaseID ], 
			(err, result) => {
				if (err) reject(err);
				resolve(result);
				}
			);
		})
	} catch (err) {
		throw 'getRoleIDByLabel error: ' + err;
	}
};

// Get all purchases with full vehicle and customer details for Order Management
const getAllPurchases = async () => {
	try {
		const query = `SELECT 
			purchases.purchaseID as orderID, 
			purchases.purchaserID, 
			purchases.vehicleID, 
			purchases.orderStatus as status, 
			purchases.orderDate,
			purchases.paymentStatus, 
			purchases.paymentDate, 
			purchases.deliveryStatus, 
			purchases.deliveryDate, 
			purchases.notes,
			vehicles.modelName,
			vehicles.price,
			vehicles.fuel as fuelType,
			vehicles.transmission,
			vehicles.bodyType,
			vehicles.driveType,
			vehicles.colour as color,
			makes.makeName,
			manufacturers.manufacturerName,
			COALESCE(purchases.customerFirstName, users.firstName) as customerFirstName,
			COALESCE(purchases.customerLastName, users.lastName) as customerLastName,
			COALESCE(purchases.customerEmail, users.emailAddress) as customerEmail,
			COALESCE(purchases.customerPhone, users.phone) as customerPhone,
			CONCAT(COALESCE(purchases.customerFirstName, users.firstName), ' ', COALESCE(purchases.customerLastName, users.lastName)) as customerName,
			purchases.licenseFirstName,
			purchases.licenseLastName,
			purchases.licenseNumber,
			purchases.licenseState,
			purchases.licenseExpiryDate,
			DATE_FORMAT(DATE_ADD(purchases.orderDate, INTERVAL 14 DAY), '%Y-%m-%d') as estimatedDelivery
		FROM purchases 
		JOIN vehicles ON purchases.vehicleID = vehicles.vehicleID
		JOIN makes ON makes.makeID = vehicles.makeID
		JOIN manufacturers ON makes.manufacturerID = manufacturers.manufacturerID
		LEFT JOIN users ON purchases.purchaserID = users.userID
		ORDER BY purchases.orderDate DESC;`;
		return new Promise((resolve, reject) => {
			pool.query(query, [],
			(err, result) => {
				if (err) {
					console.error('❌ Database query error in getAllPurchases:', err);
					reject(err);
					return;
				}
				
				console.log('📊 Raw database results:', result.length, 'purchases found');
				if (result.length > 0) {
					console.log('📊 Sample raw data:', result[0]);
				}
				
				// Transform the data to match the expected format for Order Management
				const transformedResult = result.map(row => {
					const transformed = {
						orderID: row.orderID,
						customerName: row.customerName,
						customerFirstName: row.customerFirstName,
						customerLastName: row.customerLastName,
						customerEmail: row.customerEmail,
						customerPhone: row.customerPhone,
						licenseFirstName: row.licenseFirstName,
						licenseLastName: row.licenseLastName,
						licenseNumber: row.licenseNumber,
						licenseState: row.licenseState,
						licenseExpiryDate: row.licenseExpiryDate,
						vehicleMake: row.makeName,
						vehicleModel: row.modelName,
						vehicleYear: '2024', // Default year since not in DB
						vehicleVIN: row.orderID, // Use orderID as VIN placeholder since VIN not in DB
						price: row.price,
						totalPrice: row.price,
						fuelType: row.fuelType,
						transmission: row.transmission,
						bodyType: row.bodyType,
						driveType: row.driveType,
						color: row.color,
						mileage: 0, // Default since not in DB
						status: row.status,
						orderDate: row.orderDate,
						paymentStatus: row.paymentStatus,
						estimatedDelivery: row.estimatedDelivery,
						salesRep: 'Auto Direct Sales',
						manufacturerName: row.manufacturerName
					};
					console.log('📊 Transformed row - Price:', row.price, '-> totalPrice:', transformed.totalPrice);
					return transformed;
				});
				
				console.log('✅ Returning', transformedResult.length, 'transformed purchases');
				resolve(transformedResult);
			}
		);
	})
	} catch (err) {
		console.error('❌ getAllPurchases error:', err);
		throw 'getAllPurchases error: ' + err;
	}
};

module.exports = { createPurchase, getPurchasesByManufacturer, getPurchasesByPurchaser, updatePurchase, updatePurchaseNote, cancelPurchase, getAllPurchases };
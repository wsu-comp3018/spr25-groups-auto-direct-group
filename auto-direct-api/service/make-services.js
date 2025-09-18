const mysql = require('mysql2');
const { connectionConfig } = require('../config/connectionsConfig.js');
const pool = mysql.createPool(connectionConfig);

const getMakeID = async (makeName) => {
	try {
		const query = `SELECT makeID FROM makes WHERE makes.makeName = ?`
		return new Promise((resolve, reject) => {
			pool.query(query, [makeName], 
			(err, result) => {
				if (err) {reject(err)};
				resolve(result[0].makeID);
				}
			);
		})
	} catch (err) {
		throw 'error while querying makes: ' + err;
	}
};

const getAllMakes = async () => {
	try {
		const query = `SELECT * FROM makes`
		return new Promise((resolve, reject) => {
			pool.query(query,
			(err, result) => {
				if (err) {reject(err)};
				resolve(result);
				}
			);
		})
	} catch (err) {
		throw 'error while querying makes: ' + err;
	}
};

const getMakeByName = async (makeName) => {
	try {
		const query = `SELECT makeID, manufacturerID, makeName FROM makes WHERE makes.makeName = ?`
		return new Promise((resolve, reject) => {
			pool.query(query, [makeName], 
			(err, result) => {
				if (err) {reject(err)};
				resolve(result[0]);
				}
			);
		})
	} catch (err) {
		throw 'error while querying makes: ' + err;
	}
};

module.exports = { getMakeID, getAllMakes, getMakeByName };
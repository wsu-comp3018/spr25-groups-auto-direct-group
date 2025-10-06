const mysql = require('mysql2')
const { connectionConfig } = require('../config/connectionsConfig');

//Establish Connection to the DB
const connectDB = async () => {
	const pool = mysql.createPool(connectionConfig);

	pool.getConnection((err, connection) => {
		if (err) {
			console.log({ error: err.message });
			return;
		}

		console.log("Connected to MySQL database");
		connection.release();
	});
};

//return connection object
module.exports = connectDB;
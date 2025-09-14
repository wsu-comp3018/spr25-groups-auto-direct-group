const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/connectionsConfig');

function verifyToken(req, res, next) {
	const token = req.header('Authorization');
	if (!token) throw 'Authentication error: no token';
	try {
		const decoded = jwt.verify(token, jwtKey);
		req.userID = decoded.userId;

		next();
	} catch (error) {
		res.status(401).json(error);
	}
};

module.exports = verifyToken;
const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/connectionsConfig');

function verifyToken(req, res, next) {
	let token = req.header('Authorization');
	if (!token) {
		return res.status(401).json({ error: 'Authentication error: no token' });
	}
	
	// Handle Bearer token format
	if (token.startsWith('Bearer ')) {
		token = token.slice(7);
	}
	
	try {
		const decoded = jwt.verify(token, jwtKey);
		req.userID = decoded.userId;
		req.user = { userID: decoded.userId }; // For compatibility
		next();
	} catch (error) {
		console.error('Token verification error:', error);
		res.status(401).json({ error: 'Invalid token' });
	}
}

module.exports = verifyToken;
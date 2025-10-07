const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/connectionsConfig');

function verifyToken(req, res, next) {
<<<<<<< HEAD
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
=======
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
>>>>>>> a57902b17af21a76552d2abc26b963df679bf99f

module.exports = verifyToken;
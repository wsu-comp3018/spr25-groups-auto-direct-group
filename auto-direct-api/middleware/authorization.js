const { getUserAuth } = require('../service/role-services.js')

async function authorizeUser(req, res, next) {
	try {
		const roles = await getUserAuth(req.userID);
		if (!roles) throw 'Authorization error: no user roles';
		req.roles = roles.map((row) => row.label);

		next();
	} catch (error) {
		res.status(500).json({ error });
	}
};

module.exports = authorizeUser;
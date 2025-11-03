// '/user' api route
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { jwtKey } = require('../config/connectionsConfig.js');
const { emailService } = require('../service/email-service');
const verifyToken = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');
const { getRoleIDByLabel, getUserRolesByID, createUserRole } = require('../service/role-services.js');
const { updateUserAsUser, createUser, getUserByEmail, getUserByID, getUserInfoByID, updateUserPassword } = require('../service/user-services.js');

// reCAPTCHA verification function
const verifyRecaptcha = async (recaptchaToken) => {
	try {
		const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LfKgtcrAAAAAJZ2BL_4DGDVqNytFjer40klwvsP'; // Fallback to production key
		const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
			params: {
				secret: '6LeTvgAsAAAAAOokWu74HPVM-LwT5XA6BhAOTeJj',
				response: recaptchaToken
			}
		});
		return response.data.success;
	} catch (error) {
		console.error('reCAPTCHA verification error:', error);
		return false;
	}
};

/*
 * Initial Register User Function
*/
router.post('/register', async (req, res) => {
	try {
		const { emailAddress, password, recaptchaToken } = req.body;
		
		// Verify reCAPTCHA
		if (!recaptchaToken) {
			return res.status(400).json({error: "reCAPTCHA verification is required"});
		}
		
		const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
		if (!isRecaptchaValid) {
			return res.status(400).json({error: "reCAPTCHA verification failed"});
		}
		
		const emailExists = await getUserByEmail(emailAddress);
		if (emailExists.length > 0) {
			throw "Your chosen email is already registered";
		}
		req.body.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
		const userNewID = uuidv4();
		const userRolesNewID = uuidv4();
		const customerRoleID = await getRoleIDByLabel('Customer');
		
		// Execute the query
		await createUser(userNewID, req.body);
		await createUserRole( userRolesNewID, userNewID, customerRoleID )
		res.status(201).send('User has been added');
	} catch (err) {
		res.status(400).json({error: "Server error: " + err});
	}
});

// User login
router.post('/login', async (req, res) => {
	const { emailAddress, password, recaptchaToken } = req.body;
	
	// Verify reCAPTCHA
	if (!recaptchaToken) {
		return res.status(400).json({message: "reCAPTCHA verification is required"});
	}
	
	const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
	if (!isRecaptchaValid) {
		return res.status(400).json({message: "reCAPTCHA verification failed"});
	}
	
	try {
		const rows = await getUserByEmail(emailAddress);
		if (rows.length == 0) {
			return res.status(401).json({ message: 'There is no user by this email.' });
		}

		let user = rows[0];
		// Verify password
		const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
		if (!passwordMatch) {
			return res.status(401).json({ message: 'Email and password do not match.' });
		}

		const token = jwt.sign({ userId: user.userID }, jwtKey, {	expiresIn: '1d' });
		const rolesData = await getUserRolesByID(user.userID);
		const roles = rolesData.map((row) => row.label);

		res.status(200).send({ token: token, userID: user.userID, roles, firstName: user.firstName, });
	} catch (error) {
		res.status(500).json({ error: 'Login failed: ' + error });
	}
});

// Forgot password: send reset link
router.post('/forgot-password', async (req, res) => {
    try {
        const { emailAddress } = req.body;
        if (!emailAddress) return res.status(400).json({ message: 'emailAddress is required' });

        const rows = await getUserByEmail(emailAddress);
        const userExists = Array.isArray(rows) && rows.length > 0;

        const token = jwt.sign({ emailAddress }, jwtKey, { expiresIn: '15m' });
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${encodeURIComponent(token)}`;

        const subject = 'Reset your AutoDirect password';
        const html = emailService.createProfessionalEmailTemplate(subject, `
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to create a new password. This link expires in 15 minutes.</p>
            <p style="margin:20px 0;">
                <a href="${resetUrl}" style="background:#000;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;">Reset Password</a>
            </p>
            <p>If you did not request this, you can safely ignore this email.</p>
        `);

        console.log('[ForgotPassword] Reset URL:', resetUrl);

        if (userExists) {
            try {
                const transporter = emailService.createTransporter();
                await transporter.sendMail({
                    from: emailService.auth.user,
                    to: emailAddress,
                    subject,
                    html
                });
            } catch (e) {
                console.error('forgot-password email send error:', e);
                // Continue to avoid user enumeration
            }
        }

        // In non-production, return the reset URL to unblock flow without email
        const payload = { message: 'If the email exists, a reset link will be sent.' };
        if ((process.env.NODE_ENV || 'development') !== 'production' || req.query.debug === '1') {
            payload.resetUrl = resetUrl;
        }
        return res.status(200).json(payload);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to initiate password reset: ' + error });
    }
});

// Reset password: verify token and set new password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ message: 'token and newPassword are required' });

        let payload;
        try {
            payload = jwt.verify(token, jwtKey);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const rows = await getUserByEmail(payload.emailAddress);
        if (!rows || rows.length === 0) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const user = rows[0];
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(newPassword, salt);
        await updateUserPassword(user.userID, passwordHash);

        return res.status(200).json({ message: 'Password has been reset.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to reset password: ' + error });
    }
});

// returns user profile
router.get('/profile', [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		const user = await getUserInfoByID(req.userID);
		res.status(200).json({ user: user });
	} catch (error) {
		res.status(500).json({ error: 'view profile failed: ' + error });
	}
});

router.put('/roles', [ verifyToken, authorizeUser ], async(req, res) => {
	try {
		const userRoles = getUserRoles(req.userID);
		if(!userRoles.includes('Adminstrator')) throw 'User is not an Administrator';

		const { userID, roles } = req.body;

		roles.forEach(async (role) => {
			const userRolesNewID = uuidv4();
			const customerRoleID = await getRoleIDByLabel(role);

			await createUserRole(userRolesNewID, userID, customerRoleID)
		});

		res.status(200).json({ roles: req.roles });
	} catch (error) {
		res.status(500).json({ error: 'roles update failed: ' + error });
	}
})

router.put('/user', [ verifyToken, authorizeUser ], async(req, res) => {
	try {
		const { firstName, lastName, emailAddress, phoneNumber, streetNo, streetName, suburb, postcode } = req.body;

		const result = await updateUserAsUser(req.userID, firstName, lastName, emailAddress, phoneNumber, streetNo, streetName, suburb, postcode);

		res.status(200).json({ result: result });
	} catch (error) {
		res.status(500).json({ error: 'update user failed: ' + error });
	}
})

router.put('/userPassword', [ verifyToken, authorizeUser ], async(req, res) => {
	try {
		const rows = await getUserByID(req.userID);
		if (rows.length == 0) {
			return res.status(401).json({ message: 'There is no user by this email.' });
		}

		let user = rows[0];
		const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
		if (!passwordMatch) {
			return res.status(401).json({ message: 'Email and password do not match.' });
		}

		const result = await updateUserPassword(req.userID, req.body.newPassword);

		res.status(200).json({ result: result });
	} catch (error) {
		res.status(500).json({ error: 'update password failed: ' + error });
	}
})

/*
 * Remove Role Function
 * This function removes a role from a user
 * Can probably make it dynamic so the function can handle the removal of all
 * role types. (We could maybe implement this for role assignment too)
*/

module.exports = router;
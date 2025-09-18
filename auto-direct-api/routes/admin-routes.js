const express = require('express');
const router = express.Router();
const mysql = require('mysql2')
const { connectionConfig } = require('../config/connectionsConfig.js');
const pool = mysql.createPool(connectionConfig);
const { v4: uuidv4 } = require('uuid');

const verifyToken = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');
const { createUserRole, getAllUserRoles, getRoles, getUserRolesByID, deleteUserRoleByUserIDAndLabel } = require('../service/role-services.js');
const { getAllUsers, updateUser, disableUserByUserID } = require('../service/user-services.js');
/*
* Retrieve all Employees Function
* This function returns all Employees of Auto's Direct. It will primarily be used
* for Advice Request Assignment.
*/
router.get('/advice-requests/employees', (req, res) => {
    const allEmployeesQuery = `SELECT u.userID, u.firstName, u.lastName
    FROM users AS u
    JOIN user_roles AS ur ON u.userID = ur.userID
    WHERE ur.roleID = 'f717e308-64de-4a7a-a050-892221e982bf'`;

    pool.query(allEmployeesQuery, (err, result) => {
        if (err) {
            console.error('Error retrieving employees:', err);
            return res.status(500).send('Server unable to retrieve employees');
        }
        console.log("Query result:", result);
        res.status(200).json(result);
    })
});

/*
* View All  Unassigned Advice Requests Function
*
*/

router.get('/advice-requests/unassigned', (req, res) => {
    const searchQuery = req.query.search || '';
    const queryParams = [];
    let conditions = [];

    let unassignedRequestsQuery = `SELECT ar.requestID, ar.requesterID, ar.employeeID, ar.vehicleID,
            ar.status, ar.description, ar.submittedAt, u.firstName, u.lastName, u.emailAddress, u.phone, v.modelName, m.makeName
        FROM advice_requests AS ar
        JOIN Users AS u ON ar.requesterID = u.userID
        JOIN Vehicles AS v ON ar.vehicleID = v.vehicleID
        JOIN Makes AS m ON v.makeID = m.makeID`;

    conditions.push(`ar.employeeID IS NULL`);
    conditions.push(`ar.status ='Pending'`);

    // Handle the search entry

    if (searchQuery) {
        conditions.push(`u.emailAddress LIKE ?`);
        queryParams.push(`%${searchQuery}%`);
    }

    if (conditions.length > 0) {
        unassignedRequestsQuery += ` WHERE ` + conditions.join(' AND ');
    }

    unassignedRequestsQuery += ';'; // Janky but need to do this in case we've got the extra details

    pool.query(unassignedRequestsQuery, queryParams, (err, result) => {
        if (err) {
            console.error('Error retrieving unassigned advice requests: ', err);
            return res.status(500).send('Server unable to retrieve unassigned advice requests');
        }
        console.log("Query result (unassigned):", result);
        res.json(result);
    });
});

/*
 * View All In Progress Requests Function
 * This function returns all of the advice requests that have been submitted by
 * customers.
*/

router.get('/advice-requests/in-progress', (req, res) => {
    const searchQuery = req.query.search || '';
    const queryParams = [];
    let conditions = [];

    let inProgressRequestsQuery = `SELECT ar.requestID, ar.requesterID, ar.employeeID, ar.vehicleID,
            ar.status, ar.description, ar.submittedAt, u.firstName, u.lastName, u.emailAddress, u.phone, v.modelName, m.makeName
        FROM advice_requests AS ar
        JOIN Users AS u ON ar.requesterID = u.userID
        JOIN Vehicles AS v ON ar.vehicleID = v.vehicleID
        JOIN Makes AS m ON v.makeID = m.makeID`;

    conditions.push(`ar.status ='In Progress'`);

    // Handle the search entry

    if (searchQuery) {
        conditions.push(`u.emailAddress LIKE ?`);
        queryParams.push(`%${searchQuery}%`);
    }

    if (conditions.length > 0) {
        inProgressRequestsQuery += ` WHERE ` + conditions.join(' AND ');
    }
    inProgressRequestsQuery += ';'; // Janky but need to do this in case we've got the extra details

    pool.query(inProgressRequestsQuery, queryParams, (err, result) => {
        if (err) {
            console.error('Error retrieving in-progress advice requests: ', err);
            return res.status(500).send('Server unable to retrieve in-progress advice requests');
        }
        console.log("Query result (in-progress):", result);
        res.json(result);
    });
});

/*
 * View AllCompleted Requests Function
 * This function returns all of the advice requests that have been submitted by
 * customers.
*/

router.get('/advice-requests/completed', (req, res) => {
    const searchQuery = req.query.search || '';
    const queryParams = [];
    let conditions = [];

    let completedRequestsQuery = `SELECT ar.requestID, ar.requesterID, ar.employeeID, ar.vehicleID,
            ar.status, ar.description, ar.submittedAt, u.firstName, u.lastName, u.emailAddress, u.phone, v.modelName, m.makeName
        FROM advice_requests AS ar
        JOIN Users AS u ON ar.requesterID = u.userID
        JOIN Vehicles AS v ON ar.vehicleID = v.vehicleID
        JOIN Makes AS m ON v.makeID = m.makeID`;

    conditions.push(`ar.status ='Completed'`);

    // Handle the search entry

    if (searchQuery) {
        conditions.push(`u.emailAddress LIKE ?`);
        queryParams.push(`%${searchQuery}%`);
    }

    if (conditions.length > 0) {
        completedRequestsQuery += ` WHERE ` + conditions.join(' AND ');
    }
    completedRequestsQuery += ';'; // Janky but need to do this in case we've got the extra details

    pool.query(completedRequestsQuery, queryParams, (err, result) => {
        if (err) {
            console.error('Error retrieving completed advice requests: ', err);
            return res.status(500).send('Server unable to retrieve completed advice requests');
        }
        console.log("Query result (completed):", result);
        res.json(result);
    });
});
	
/*
 * Assign Advice Request Function
 * This function assigns an advice request to an employee
*/
router.post('/advice-requests/assign/', [ verifyToken, authorizeUser ], async (req, res) => {
    const {requestID} = req.body;
    const {employeeID} = req.body;

    const pickUpQuery = `UPDATE advice_requests SET employeeID = ?, status = 
    'In Progress' WHERE requestID = ?`;
    
    pool.query(pickUpQuery, [employeeID, requestID], (err, result) => {
        if (err) {
            console.error('Error picking up advice request: ', err);
            return res.status(500).send('Server unable to allocate advice request');
        }
        console.log("Query result:", result);
        res.status(200).json(result);
    });
});

/*
 * View Advice Request Function
 * This returns details of a singular advice request
*/
router.get('/advice-requests/:id', (req, res) => {
    const {id} = req.params;

    const getRequestQuery = `SELECT * FROM advice_requests WHERE requestID = ?`;

    pool.query(getRequestQuery, [id], (err, result) => {
        if (err) {
            console.error('Error retrieving advice request: ', err);
            return res.status(500).send('Server unable to retrieve advice request');
        }
        console.log("Query result:", result);
        res.status(200).json(result);
    });
});

/*
 * Function for Employees to retrieve their In Progress Requests
 */
router.get('/my-requests/in-progress', (req, res) => {
    const searchQuery = req.query.search || '';
    const employeeID = req.query.userID;
    const queryParams = [];
    let conditions = [];

    let inProgressRequestsQuery = `SELECT ar.requestID, ar.requesterID, ar.employeeID, ar.vehicleID,
                ar.status, ar.description, ar.submittedAt, u.firstName, u.lastName, u.emailAddress, u.phone, v.modelName, m.makeName
            FROM advice_requests AS ar
            JOIN Users AS u ON ar.requesterID = u.userID
            JOIN Vehicles AS v ON ar.vehicleID = v.vehicleID
            JOIN Makes AS m ON v.makeID = m.makeID`;

    conditions.push(`ar.status ='In Progress'`);

    if (employeeID) {
        conditions.push(`ar.employeeID = ?`);
        queryParams.push(employeeID);
    }

    // Handle the searching

    if (searchQuery) {
        conditions.push(`u.emailAddress LIKE ?`);
        queryParams.push(`%${searchQuery}%`);
    }

    if (conditions.length > 0) {
        inProgressRequestsQuery += ` WHERE ` + conditions.join(' AND ');
    }
    inProgressRequestsQuery += ';'; // Janky but need to do this in case we've got the extra details

    pool.query(inProgressRequestsQuery, queryParams, (err, result) => {
        if (err) {
            console.error('Error retrieving in-progress advice requests: ', err);
            return res.status(500).send('Server unable to retrieve in-progress advice requests');
        }
        console.log("Query result (in-progress):", result);
        res.json(result);
    });
});

/*
 * Function for Employee to view all their completed requests
 */
router.get('/my-requests/completed', (req, res) => {
    const searchQuery = req.query.search || '';
    const employeeID = req.query.userID;
    const queryParams = [];
    let conditions = [];

    let completedRequestsQuery = `SELECT ar.requestID, ar.requesterID, ar.employeeID, ar.vehicleID,
                ar.status, ar.description, ar.submittedAt, u.firstName, u.lastName, u.emailAddress, u.phone, v.modelName, m.makeName
            FROM advice_requests AS ar
            JOIN Users AS u ON ar.requesterID = u.userID
            JOIN Vehicles AS v ON ar.vehicleID = v.vehicleID
            JOIN Makes AS m ON v.makeID = m.makeID`;

    conditions.push(`ar.status ='Completed'`);

    if (employeeID) {
        conditions.push(`ar.employeeID = ?`);
        queryParams.push(employeeID);
    }

    // Handle the searching

    if (searchQuery) {
        conditions.push(`u.emailAddress LIKE ?`);
        queryParams.push(`%${searchQuery}%`);
    }

    if (conditions.length > 0) {
        completedRequestsQuery += ` WHERE ` + conditions.join(' AND ');
    }
    completedRequestsQuery += ';'; // Janky but need to do this in case we've got the extra details

    pool.query(completedRequestsQuery, queryParams, (err, result) => {
        if (err) {
            console.error('Error retrieving completed advice requests: ', err);
            return res.status(500).send('Server unable to retrieve completed advice requests');
        }
        console.log("Query result (completed):", result);
        res.json(result);
    });
});

/*
 * Close Advice Request Function
 * This function closes an advice request
*/
router.post('/my-requests/close/', async (req, res) => {
    const { requestID, closeNotes } = req.body;
    const dateTime = new Date();
    const formattedDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');

    const closeQuery = `UPDATE advice_requests SET status = 'Completed', closureNotes = ?, closedAt = ? WHERE requestID = ?`;

    pool.query(closeQuery, [closeNotes, formattedDateTime, requestID], (err, result) => {
        if (err) {
            console.error('Error closing advice request: ', err);
            return res.status(500).send('Server unable to close advice request');
        }
        console.log("Query result:", result);
        res.status(200).json({ message: "Advice request closed successfully", requestID: requestID });
    });
});

/*
* Manage Vehicles - Return all vehicles function
*

router.get('/manage-vehicles', (req, res) => {

    const allVehiclesQuery = `SELECT v.*, vi.path AS mainImage, m.makeName FROM vehicles v
    LEFT JOIN (SELECT vehicle, path FROM vehicle_images WHERE imageOrder = 1
    ) vi ON v.vehicleID = vi.vehicle
     JOIN Makes m ON v.make = m.makeID`;

    pool.query(allVehiclesQuery, (err, result) => {
        if (err) {
            console.error('Error retrieving vehicles: ', err);
            return res.status(500).send('Server unable to retrieve vehicles');
        }
        console.log("Query result:", result);
        res.status(200).json(result);
    });
});

*/

// -------- Manage Users --------

//get users and roles
router.get("/users", [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		if(!req.roles.includes('Administrator')) throw 'User does not have permission for Admin actions!'
		
		const users = await getAllUsers();
		const usersRoles = await getAllUserRoles();
		resUsers = users.map((user) => {
			let userRoles = usersRoles.filter((role) => role.userID == user.userID)
			user.roles = userRoles.map((roles) => roles.label);

			return user;
		});

		res.status(200).json({users: resUsers});
	} catch (err) {
		res.status(500).json({error: 'get users error: ' + err})
	}
});

//update user and roles
router.put("/updateUser", [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		if(!req.roles.includes('Administrator')) throw 'User does not have permission for Admin actions!'

		const { userID, firstName, lastName, emailAddress, phone, roles: changedUserRoles, user_status } = req.body.user;
		const allRoles = await getRoles();

		let currentUserRoles = await getUserRolesByID(userID);
		currentUserRoles = currentUserRoles.map((role) => role.label);
		let deleteRoles = currentUserRoles.filter(x => !changedUserRoles.includes(x));
		let addedRoles = changedUserRoles.filter(x => !currentUserRoles.includes(x));

		if(deleteRoles.length > 0) {
			deleteRoles.forEach( async (roleLabel) => {
				let deleteRole = allRoles.find((role) => role.label == roleLabel)
				await deleteUserRoleByUserIDAndLabel(userID, deleteRole.roleID)
			});
		}

		if(addedRoles.length > 0) {
			addedRoles.forEach( async (roleLabel) => {
				const newUserRoleID = uuidv4();
				const addRole = allRoles.find((role) => role.label == roleLabel)
				await createUserRole( newUserRoleID, userID, addRole.roleID );
			});
		}

		const query = await updateUser(userID, firstName, lastName, emailAddress, phone, user_status);
		res.status(200).json({message: query})
	} catch (err) {
		res.status(500).json({error: 'update user and roles failure: ' + err})
	}
});

//delete user
router.put("/disableUser", [ verifyToken, authorizeUser ], async (req, res) => {
	try {
		if(!req.roles.includes('Administrator')) throw 'User does not have permission for Admin actions!'

		const { userID } = req.body;
		const result = await disableUserByUserID(userID);
		res.status(200).json({message: result});
	} catch (err) {
		res.status(500).json({error: 'disable user roles failure: ' + err})
	}
});

module.exports = router;
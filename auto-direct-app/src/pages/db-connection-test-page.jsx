/*
* This page is purely to test the connection to the database. It will display
* all users.
* THIS MUST BE DELETED BEFORE HANDOVER
*/

import React, { useEffect, useState } from "react";

const DbConnectionTestPage = () => {
	const [users, setUsers] = useState([]);

	// Get the daya via the API

	useEffect(() => {
		fetch("/api/db-connection-test")
			.then((res) => res.json())
			.then((data) => setUsers(data))
			.catch((err) => console.error("Error fetching users:", err));
	}, []);

	// Display it to table

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4 text-black">DB Test - Users List</h1>
			<table className="w-full border">
				<thead>
					<tr className="bg-gray-200">
						<th className="p-2 border text-black">Name</th>
						<th className="p-2 border text-black">Email</th>
						<th className="p-2 border text-black">Phone</th>
						<th className="p-2 border text-black">Address</th>
						<th className="p-2 border text-black">Super Secret PW</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.userID} className="hover:bg-gray-100">
							<td className="p-2 border text-black">{user.firstName} {user.lastName}</td>
							<td className="p-2 border text-black">{user.emailAddress}</td>
							<td className="p-2 border text-black">{user.phone}</td>
							<td className="p-2 border text-black">
								{user.streetNo} {user.streetName}, {user.suburb} {user.postcode}
							</td>
							<td className="p-2 border text-black">{user.passwordHash}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DbConnectionTestPage;


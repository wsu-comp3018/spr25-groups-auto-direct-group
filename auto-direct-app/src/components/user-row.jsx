import { useState } from 'react'
import RolesModal from '../components/roles-modal'

const UserRow = ({userData, handleSave, handleDelete}) => {
	const [user, setUser] = useState(userData);
	const [isEditing, setIsEditing] = useState(false);

	const handleChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handleRolesChange = (roles) => {
		setUser({ ...user, roles: roles });
	}

	const toggleEdit = () => {setIsEditing(!isEditing)};

	const handleSaveClick = () => {
		toggleEdit();
		handleSave(user);
	}

	const handleDeleteClick = () => {
		handleDelete(user.userID)
	}

	return (
		<tr
			key={user.userID}
			className="border-b border-gray-200 hover:bg-gray-50 transition"
		>
			{isEditing ? (
			<>
				<td className="py-3 px-4">
				<input
					name="firstName"
					value={user.firstName}
					onChange={handleChange}
					className="border px-2 py-1 rounded w-full"
				/>
				</td>
				<td className="py-3 px-4">
				<input
					name="lastName"
					value={user.lastName}
					onChange={handleChange}
					className="border px-2 py-1 rounded w-full"
				/>
				</td>
				<td className="py-3 px-4">
				<input
					name="emailAddress"
					value={user.emailAddress}
					onChange={handleChange}
					className="border px-2 py-1 rounded w-full"
				/>
				</td>
				<td className="py-3 px-4">
				<input
					name="phone"
					value={user.phone}
					onChange={handleChange}
					className="border px-2 py-1 rounded w-full"
				/>
				</td>
				{/* <td className="py-3 px-4">
					<select
						value={user.role}
						onChange={handleChange}
						className="border px-2 py-1 rounded w-full"
					>
						<option value="Administrator">Administrator</option>
						<option value="Manufacturer">Manufacturer</option>
						<option value="Employee">Employee</option>
						<option value="Customer">Customer</option>
					</select>
				</td> */}
				<RolesModal u={user} handleRolesChange={handleRolesChange}/>
				<td className="py-3 px-4">
					<select
						value={user.user_status}
						onChange={handleChange}
						className="border px-2 py-1 rounded w-full"
					>
						<option value="Active">Active</option>
						<option value="Inactive">Inactive</option>
					</select>
				</td>
				<td className="py-3 px-4">
				{new Date(user.createdTime).toLocaleString()}
				</td>
				<td className="py-3 px-4 text-right flex gap-2 justify-end">
				<button
					onClick={() => handleSaveClick()}
					className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
				>
					Save
				</button>
				<button
					onClick={() => toggleEdit()}
					className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
				>
					Cancel
				</button>
				</td>
			</>
			) : (
			<>
				<td className="py-3 px-4">{user.firstName}</td>
				<td className="py-3 px-4">{user.lastName}</td>
				<td className="py-3 px-4">{user.emailAddress}</td>
				<td className="py-3 px-4">{user.phone}</td>
				<td className="py-3 px-4">{user.roles}</td>
				<td className="py-3 px-4">{user.user_status}</td>
				<td className="py-3 px-4">
				{new Date(user.createdTime).toLocaleString()}
				</td>
				<td className="py-3 px-4 text-right flex gap-2 justify-end">
				<button
					onClick={() => toggleEdit()}
					className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
				>
					Edit
				</button>
				<button
					onClick={() => handleDeleteClick()}
					className="text-sm border px-3 py-1 rounded text-red-600 hover:bg-red-50"
				>
					Delete
				</button>
				</td>
			</>
			)}
		</tr>
	);
}

export default UserRow;
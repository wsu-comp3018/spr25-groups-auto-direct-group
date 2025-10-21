import { useState } from 'react'
import RolesModal from '../components/roles-modal'

const UserRow = ({userData, handleSave, handleDelete, handleReactivate}) => {
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

	const handleReactivateClick = () => {
		handleReactivate(user.userID)
	}

	return (
		<tr
			key={user.userID}
			className={`border-b border-gray-200 hover:bg-gray-50 transition ${
				user.user_status === 'Inactive' ? 'bg-gray-100 opacity-75' : ''
			}`}
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
					className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
				>
					Save
				</button>
				<button
					onClick={() => toggleEdit()}
					className="text-sm bg-white text-black border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
				>
					Cancel
				</button>
				</td>
			</>
			) : (
			<>
				<td className="py-3 px-4">{user.firstName}</td>
				<td className="py-3 px-4">{user.lastName}</td>
				<td className="py-3 px-4">
					{user.emailAddress.includes('.del') ? (
						<span className="text-gray-500 italic">
							{user.emailAddress.split('.del')[0]} (deleted)
						</span>
					) : (
						user.emailAddress
					)}
				</td>
				<td className="py-3 px-4">{user.phone}</td>
				<td className="py-3 px-4">{user.roles}</td>
				<td className="py-3 px-4">
					<span className={`px-2 py-1 rounded text-xs font-medium ${
						user.user_status === 'Active' 
							? 'bg-gray-200 text-black' 
							: 'bg-gray-400 text-white'
					}`}>
						{user.user_status}
					</span>
				</td>
				<td className="py-3 px-4">
				{new Date(user.createdTime).toLocaleString()}
				</td>
				<td className="py-3 px-4 text-right flex gap-2 justify-end">
				<button
					onClick={() => toggleEdit()}
					className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
				>
					Edit
				</button>
				{user.user_status === 'Inactive' ? (
					<button
						onClick={() => handleReactivateClick()}
						className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
					>
						Reactivate
					</button>
				) : (
					<button
						onClick={() => handleDeleteClick()}
						className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
					>
						Delete
					</button>
				)}
				</td>
			</>
			)}
		</tr>
	);
}

export default UserRow;
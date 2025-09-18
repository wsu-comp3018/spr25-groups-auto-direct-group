
import { useState, useEffect } from "react";

const RolesModal = ({u, handleRolesChange}) => {
	const [showRolesModal, setShowRolesModal] = useState(false);
	const [user, setUser] = useState(u);
	const roles = ["Customer", "Administrator", "Manufacturer", "Employee"];
	// const [userRoles, setUserRoles] = useState(userR || []);

	const handleChangeCheck = (e) => {
		let newRoles = user.roles.includes(e.target.value) ? user.roles.filter((x) => x !== e.target.value) : [...user.roles, e.target.value];
		
		handleRolesChange(newRoles);
		setUser({ ...user, roles: newRoles });
	}
	
	return (
		<td 
			className="flex items-center justify-center">
				<button
					className="font-semibold px-2 py-1 border-2 border-blue-500 rounded"
					onClick={() => {setShowRolesModal(true)}}>
						{user.roles}
					</button>
			
			{ showRolesModal && (
				<div
					className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
					onClick={() => {setShowRolesModal(false)}}
				>
					<div
						className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="text-xl font-bold mb-4">User Roles</h3>
						
              			<div className="space-y-1 max-h-20 overflow-y-auto">
						{ ["Customer", "Administrator", "Manufacturer", "Employee"].map((role, idx) => (
							<label key={idx} className="flex items-center">
								<input
									type="checkbox"
									value={role}
									checked={user.roles.includes(role)}
									className="mr-2"
									onChange={handleChangeCheck}
								/>
								<span className="text-gray-700 text-2x1">{role}</span>
							</label>
						))}
						</div>
					</div>
				</div>
			)}
		</td>
	)
}

export default RolesModal;

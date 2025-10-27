import { useState } from "react";

const manufacturerRow = ({manufacturerData, handleSave, handleToggleStatus, cancelAdd}) => {
	const [m, setM] = useState(manufacturerData);
	const [isEditing, setIsEditing] = useState(manufacturerData.edit);
	const [newM, setNewM] = useState(manufacturerData.edit);

	const handleChange = (e) => {
		setM({ ...m, [e.target.name]: e.target.value });
	};

	const toggleEdit = () => {newM ? cancelAdd(m.manufacturerID) : setIsEditing(!isEditing)};

	const handleSaveClick = () => {
		setIsEditing(!isEditing);
		handleSave(m, newM);
	}

	const handleToggleStatusClick = (e) => {
		setM({ ...m, [e.target.name]: e.target.value });
		handleToggleStatus(m);
	}
	return (
		<tr
		key={m.manufacturerID}
		className="border-b border-gray-200 hover:bg-gray-50 transition"
		>
			{isEditing ? (
			<>
				<td className="py-3 px-4">
				<input
					name="manufacturerName"
					value={m.manufacturerName}
					onChange={handleChange}
					className="border p-1 w-full rounded text-sm"
					placeholder="Name"
				/>
				</td>
				<td className="py-3 px-4">
				<input
					name="country"
					value={m.country}
					onChange={handleChange}
					className="border p-1 w-full rounded text-sm"
					placeholder="Country"
				/>
				</td>
				<td className="py-3 px-4">
				<input
					name="ABN"
					value={m.ABN}
					onChange={handleChange}
					className="border p-1 w-full rounded text-sm"
					placeholder="ABN"
				/>
				</td>
				<td className="py-3 px-4">
				<select
					name="manufacturerStatus"
					value={m.status}
					onChange={handleChange}
					className="border p-1 w-full rounded text-sm"
				>
					<option value="Active">Active</option>
					<option value="Inactive">Inactive</option>
				</select>
				</td>
				<td className="py-3 px-4">
				<div className="flex gap-2 justify-center">
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
				</div>
				</td>
			</>
			) : (
			<>
				<td className="py-3 px-4">{m.manufacturerName}</td>
				<td className="py-3 px-4">{m.country}</td>
				<td className="py-3 px-4">{m.ABN}</td>
				<td className="py-3 px-4">{m.manufacturerStatus}</td>
				<td className="py-3 px-4">
				<div className="flex gap-2 justify-center">
				<button
					onClick={() => toggleEdit()}
					className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
				>
					Edit
				</button>
				<button
					name="manufacturerStatus"
					value={ m.manufacturerStatus == "Active" ? "Inactive" : "Active"}
					onClick={(e) => handleToggleStatusClick(e)}
					className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
				>
					{ m.manufacturerStatus == "Active" ? "Disable" : "Enable"}
				</button>
				</div>
				</td>
			</>
			)}
		</tr>
	)
}

export default manufacturerRow;
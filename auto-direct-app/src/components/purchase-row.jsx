import { useState } from "react";
import moment from 'moment';

const purchasesRow = ({purchaseData, handleSave, handleCancel, cancelAdd}) => {
	const [p, setP] = useState(purchaseData);
	const [isEditing, setIsEditing] = useState(purchaseData.edit);

	const handleChange = (e) => {
		setP({ ...p, [e.target.name]: e.target.value });
	};

	const toggleEdit = () => {setIsEditing(!isEditing)};

	const handleSaveClick = () => {
		toggleEdit();
		handleSave(p);
	}

	const handleCancelClick = (e) => {
		setP({ ...p, [e.target.name]: e.target.value });
		handleCancel(p);
	}
	return (
		<tr
		key={p.manufacturerID}
		className="border-b border-gray-200 hover:bg-gray-50 transition"
		>
		<td className="py-3 px-4">{p.modelName}</td>
		<td className="py-3 px-4">{p.makeName}</td>
		<td className="py-3 px-4">{p.price}</td>
		<td className="py-3 px-4">{p.orderStatus}</td>
		<td className="py-3 px-4">{moment(p.orderDate).format('DD-MM-YYYY')}</td>
		<td className="py-3 px-4">{p.paymentStatus}</td>
		<td className="py-3 px-4">{p.deliveryStatus}</td>
		{isEditing ? (
			<>
			<td className="py-3 px-4">
				<input
					name="notes"
					value={p.notes}
					onChange={handleChange}
					className="border p-1 w-full rounded text-sm"
				/>
			</td>
			<td className="py-3 px-4 text-right flex gap-2 justify-end">
				<button
					onClick={() => handleSaveClick()}
					className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
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
			<td className="py-3 px-4">{p.notes}</td>
			<td className="py-3 px-4 text-right flex gap-2 justify-end">
			<button
				onClick={() => toggleEdit()}
				className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
			>
				Edit
			</button>
			{ p.orderStatus == "Cancelled" ? ( <> </> ) : ( <button
				name="orderStatus"
				value="Cancelled"
				onClick={(e) => handleCancelClick(e)}
				className="text-sm border px-3 py-1 rounded hover:bg-gray-100 text-red-600"
			>
				Cancel Purchase
			</button>
			)}
			</td>
			</>
			
		)}
		</tr>
	)
}

export default purchasesRow;
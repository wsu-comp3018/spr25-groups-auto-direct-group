import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import PurchaseRow from "../components/purchase-row";
import api from "../data/api-calls";

function UserPurchasePage() {
  const [purchases, setPurchases] = useState([]);

	useEffect(() => {
		const token = Cookies.get("auto-direct-token");
		fetch(api + '/purchases/my-purchases', {method: 'GET', headers: {'Authorization': token} })
			.then((res) => { return res.json() })
			.then((data) => { 
				setPurchases(data.result);
			});
	}, []);

	const handleSaveClick = (p) => {
		const token = Cookies.get("auto-direct-token");
		fetch(api + '/purchases/manage-user-purchase', {method: 'PUT', headers: {"Content-Type": "application/json", 'Authorization': token}, 
			body: JSON.stringify({purchase: p})})
		.then((res) => { 
			let data = res.json(); 
			if (res.status != 200) window.toast.error('Error adding: ' + data.error);
		});
	};

	const handleCancel = (newP) => {
		const confirmed = window.confirm(
			"Are you sure you want to cancel this purchase?"
		);
		if (!confirmed) return;
		const token = Cookies.get("auto-direct-token");
		fetch(api + '/purchases/cancel-purchase', 
			{
				method: 'PUT', 
				headers: {"Content-Type": "application/json", "Authorization": token}, 
				body: JSON.stringify({purchaseID: newP.purchaseID}) 
			})
		.then((res) => {
			let data = res.json();
			if(res.status != 200) { 
				window.toast.error('Cancel purchase failed: ' + data.error);
				return;
			}

			setPurchases((prev) => prev.map(p => p.purchaseID == newP.purchaseID ? newP : p));
		});
	};

	return (
		<div className="p-8 max-w-7xl mx-auto pt-20">
			<h2 className="text-3xl font-bold mb-6 text-gray-800">
				Manage My Purchases
			</h2>

			<div className="overflow-x-auto">
				<table className="min-w-full border-collapse text-left text-sm text-gray-700">
					<thead>
						<tr className="border-b border-gray-300">
						<th className="py-3 px-4 font-medium">VehicleName</th>
						<th className="py-3 px-4 font-medium">Make</th>
						<th className="py-3 px-4 font-medium">Price</th>
						<th className="py-3 px-4 font-medium">Order Status</th>
						<th className="py-3 px-4 font-medium">Order Date</th>
						<th className="py-3 px-4 font-medium">Paid</th>
						<th className="py-3 px-4 font-medium">Delivered</th>
						<th className="py-3 px-4 font-medium">Notes</th>
						<th className="py-3 px-4 font-medium text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						{purchases.map((p) => (
							<PurchaseRow purchaseData={p} handleSave={handleSaveClick} handleCancel={handleCancel} key={p.purchaseID}/>
						))}
					</tbody>
				</table>
			</div> 
		</div>
	);
}

export default UserPurchasePage;

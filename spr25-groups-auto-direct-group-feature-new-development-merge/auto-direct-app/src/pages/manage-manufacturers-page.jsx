import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import ManufacturerRow from "../components/manufacturer-row"
import api from "../data/api-calls";

function ManageManufacturersPage() {
  const [manufacturers, setManufacturers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

	useEffect(() => {
		const token = Cookies.get("auto-direct-token");
		fetch(api + '/manufacturer/manufacturers', {method: 'GET', headers: {'Authorization': token} })
			.then((res) => { return res.json() })
			.then((data) => { 
				const dbData = data.result.map(m => { return { ...m, edit: false }});
				setManufacturers(dbData);
			});
	}, []);

	const handleSaveClick = (m, isNew) => {
		const token = Cookies.get("auto-direct-token");
		if (isNew) {
			fetch(api + '/manufacturer/create', {method: 'POST', headers: {"Content-Type": "application/json", 'Authorization': token}, 
				body: JSON.stringify({manufacturer: m})})
			.then((res) => { 
				let data = res.json(); 
				if (res.status != 200) window.alert('error adding: ' + data.error);
			});
		} else {
			fetch(api + '/manufacturer/update', {method: 'PUT', headers: {"Content-Type": "application/json", 'Authorization': token}, 
				body: JSON.stringify({manufacturer: m})})
			.then((res) => { 
				let data = res.json(); 
				if (res.status != 200) window.alert('error adding: ' + data.error);
			});
		}
	};

	const handleAdd = () => {
		setManufacturers([
			...manufacturers,
			{ manufacturerID: "", manufacturerName: "", ABN: "", country: "", manufacturerStatus: "Active", edit: true },
		]);
	};

	const cancelAdd = (id) => {
		setManufacturers((prev) => prev.filter(m => m.manufacturerID != id));
	}

	const toggleStatus = (newM) => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this user?"
		);
		if (!confirmed) return;
		const token = Cookies.get("auto-direct-token");
		fetch(api + '/manufacturer/toggleStatus', 
			{
				method: 'PUT', 
				headers: {"Content-Type": "application/json", "Authorization": token}, 
				body: JSON.stringify({manufacturerID: newM.manufacturerID, status: newM.manufacturerStatus}) 
			})
		.then((res) => {
			let data = res.json();
			if(res.status != 200) { 
				window.alert('toggle status failed ' + data.error);
				return;
			}

			setManufacturers((prev) => prev.map(m => m.manufacturerID == newM.manufacturerID ? newM : m));
		});
	};

  let filteredManufacturers =
    filterStatus === "All"
      ? manufacturers
      : manufacturers.filter((m) => m.manufacturerStatus === filterStatus);

  return (
    <div className="p-8 max-w-7xl mx-auto pt-20">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Manage Manufacturers
      </h2>

      {/* Filter + Add Manufacturer Row */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-3">
          {["All", "Active", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`text-sm px-4 py-2 rounded border hover:bg-gray-100 ${
                filterStatus === status ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded border hover:bg-gray-100"
          >
            <span className="text-xl leading-none">＋</span> Add Manufacturer
          </button>
        </div>
      </div>

		<div className="overflow-x-auto">
			<table className="min-w-full border-collapse text-left text-sm text-gray-700">
				<thead>
					<tr className="border-b border-gray-300">
					<th className="py-3 px-4 font-medium">Name</th>
					<th className="py-3 px-4 font-medium">Country</th>
					<th className="py-3 px-4 font-medium">ABN</th>
					<th className="py-3 px-4 font-medium">Status</th>
					<th className="py-3 px-4 font-medium text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredManufacturers.map((m) => (
						<ManufacturerRow manufacturerData={m} handleSave={handleSaveClick} handleToggleStatus={toggleStatus} cancelAdd={cancelAdd} key={m.manufacturerID}/>
					))}
				</tbody>
			</table>
		</div> 

      
    </div>
  );
}

export default ManageManufacturersPage;

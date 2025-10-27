import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../data/api-calls";

function ApproveVehiclesPage() {
  const navigate = useNavigate();

  const [pendingList, setPendingList] = useState([]);
  const [approvedList, setApprovedList] = useState([]);
  const [editingCarId, setEditingCarId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filterStatus, setFilterStatus] = useState("All");

  /*
	useEffect(() => {
		const pending = JSON.parse(localStorage.getItem("pendingCars")) || [];
		const approved = JSON.parse(localStorage.getItem("cars")) || [];
		setPendingList(pending);
		setApprovedList(approved);
	}, []);
  */

  useEffect(() => {
    fetch(api + "/vehicle/manage-vehicles")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        return res.json();
      })
      .then((data) => {
        // Split vehicles by approval status
        const pending = data.filter((car) => car.status === "Pending");
        const approved = data.filter((car) => car.status === "Approved");

        setPendingList(pending);
        setApprovedList(approved);
      })
      .catch((error) => {
        console.error("Error fetching vehicles:", error);
      });
  }, []);

  const updateLocalStorage = (pending, approved) => {
    localStorage.setItem("pendingCars", JSON.stringify(pending));
    localStorage.setItem("cars", JSON.stringify(approved));
  };

  const handleApprove = (car) => {
    const updatedPending = pendingList.filter((c) => c.id !== car.id);
    const updatedApproved = [...approvedList, car];
    setPendingList(updatedPending);
    setApprovedList(updatedApproved);
    updateLocalStorage(updatedPending, updatedApproved);
    window.toast.success(`Approved: ${car.modelName || car.name}`);
  };

  const handleReject = (car) => {
    const updatedPending = pendingList.filter((c) => c.id !== car.id);
    setPendingList(updatedPending);
    updateLocalStorage(updatedPending, approvedList);
    window.toast.success(`Rejected: ${car.modelName || car.name}`);
  };

  const handleEdit = (car) => {
    setEditingCarId(car.id);
    setEditData({ ...car });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    const updatedPending = pendingList.map((car) =>
      car.id === editingCarId ? { ...editData, id: editingCarId } : car
    );
    setPendingList(updatedPending);
    updateLocalStorage(updatedPending, approvedList);
    setEditingCarId(null);
    window.toast.success("Car details updated.");
  };

  const allCars = [
    ...pendingList.map((car) => ({ ...car, status: "Pending" })),
    ...approvedList.map((car) => ({ ...car, status: "Approved" })),
  ];

  const filteredCars =
    filterStatus === "All"
      ? allCars
      : allCars.filter((car) => car.status === filterStatus);

  return (
    <div className="p-8 max-w-7xl mx-auto pt-20">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Vehicles</h2>

      {/* Filter + Add Vehicle Row */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-3">
          {["All", "Pending", "Approved"].map((status) => (
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

        {/* Add Vehicle Button */}
        <button
          onClick={() => navigate("/add-vehicle")}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded border hover:bg-gray-100"
        >
          <span className="text-xl leading-none">＋</span> Add Vehicle
        </button>
      </div>

      {filteredCars.length === 0 ? (
        <p className="text-gray-500">No cars found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm text-gray-700">
            <thead>
              <tr className="bg-black text-white">
                <th className="py-3 px-6 font-medium text-center">Model Name</th>
                <th className="py-3 px-6 font-medium text-center">Make</th>
                <th className="py-3 px-6 font-medium text-center">Price</th>
                <th className="py-3 px-6 font-medium text-center">Transmission</th>
                <th className="py-3 px-6 font-medium text-center">Body Type</th>
                <th className="py-3 px-6 font-medium text-center">Fuel</th>
                <th className="py-3 px-6 font-medium text-center">Drive Type</th>
                <th className="py-3 px-6 font-medium text-center">Cylinders</th>
                <th className="py-3 px-6 font-medium text-center">Doors</th>
                <th className="py-3 px-6 font-medium text-center">Colour</th>
                <th className="py-3 px-6 font-medium text-center">Status</th>
                <th className="py-3 px-6 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr
                  key={car.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  {editingCarId === car.id ? (
                    <>
                      <td className="py-3 px-4">
                        <label
                          htmlFor={`modelName-${car.id}`}
                          className="sr-only"
                        >
                          Model Name
                        </label>
                        <input
                          id={`modelName-${car.id}`}
                          name="modelName"
                          value={editData.modelName || ""}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Model Name"
                          aria-label="Model Name"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label htmlFor={`make-${car.id}`} className="sr-only">
                          Make
                        </label>
                        <input
                          id={`make-${car.id}`}
                          name="make"
                          value={editData.make || ""}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Make"
                          aria-label="Make"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label htmlFor={`price-${car.id}`} className="sr-only">
                          Price
                        </label>
                        <input
                          id={`price-${car.id}`}
                          name="price"
                          value={editData.price || ""}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Price"
                          aria-label="Price"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label
                          htmlFor={`transmission-${car.id}`}
                          className="sr-only"
                        >
                          Transmission
                        </label>
                        <input
                          id={`transmission-${car.id}`}
                          name="transmission"
                          value={editData.transmission || ""}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Transmission"
                          aria-label="Transmission"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label
                          htmlFor={`bodyType-${car.id}`}
                          className="sr-only"
                        >
                          Body Type
                        </label>
                        <input
                          id={`bodyType-${car.id}`}
                          name="bodyType"
                          value={editData.bodyType || ""}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Body Type"
                          aria-label="Body Type"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label htmlFor={`fuel-${car.id}`} className="sr-only">
                          Fuel
                        </label>
                        <input
                          id={`fuel-${car.id}`}
                          name="fuel"
                          value={editData.fuel || ""}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Fuel"
                          aria-label="Fuel"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label
                          htmlFor={`driveType-${car.id}`}
                          className="sr-only"
                        >
                          Drive Type
                        </label>
                        <input
                          id={`driveType-${car.id}`}
                          name="driveType"
                          value={editData.driveType || ""}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Drive Type"
                          aria-label="Drive Type"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label
                          htmlFor={`cylinders-${car.id}`}
                          className="sr-only"
                        >
                          Cylinders
                        </label>
                        <input
                          id={`cylinders-${car.id}`}
                          name="cylinders"
                          value={editData.cylinders || ""}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Cylinders"
                          aria-label="Cylinders"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label htmlFor={`doors-${car.id}`} className="sr-only">
                          Doors
                        </label>
                        <input
                          id={`doors-${car.id}`}
                          name="doors"
                          value={editData.doors || ""}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Doors"
                          aria-label="Doors"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label htmlFor={`colour-${car.id}`} className="sr-only">
                          Colour
                        </label>
                        <input
                          id={`colour-${car.id}`}
                          name="colour"
                          value={editData.colour || ""}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Colour"
                          aria-label="Colour"
                        />
                      </td>
                      <td className="py-3 px-4">{car.status}</td>
                      <td className="py-3 px-4 text-right flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCarId(null)}
                          className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4">{car.modelName}</td>
                      <td className="py-3 px-4">{car.make}</td>
                      <td className="py-3 px-4">${car.price}</td>
                      <td className="py-3 px-4">{car.transmission}</td>
                      <td className="py-3 px-4">{car.bodyType}</td>
                      <td className="py-3 px-4">{car.fuel}</td>
                      <td className="py-3 px-4">{car.driveType}</td>
                      <td className="py-3 px-4">{car.cylinders}</td>
                      <td className="py-3 px-4">{car.doors}</td>
                      <td className="py-3 px-4">{car.colour}</td>
                      <td className="py-3 px-4">{car.status}</td>
                      <td className="py-3 px-4 text-right flex gap-2">
                        {car.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(car)}
                              className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(car)}
                              className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ApproveVehiclesPage;

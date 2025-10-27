import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropzone from "../components/Dropzone";
import api from "../data/api-calls";

function ManageVehiclesPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState(null);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [originalFiles, setOriginalFiles] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showEditVehicleForm, setShowEditVehicleForm] = useState(false);
  const [editVehicleForm, setEditVehicleForm] = useState({
    vehicleID: "",
    makeName: "",
    modelName: "",
    bodyType: "",
    fuelType: "",
    driveType: "",
    cylinders: "",
    doors: "",
    transmission: "",
    colour: "",
    price: "",
    description: "",
  });
  const [originalVehicleValues, setOriginalVehicleValues] = useState({
    vehicleID: "",
    makeName: "",
    modelName: "",
    bodyType: "",
    fuelType: "",
    driveType: "",
    cylinders: "",
    doors: "",
    transmission: "",
    colour: "",
    price: "",
    description: "",
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [showEditedConfirmation, setShowEditedConfirmation] = useState(false);
  const handleEditConfirmation = async () => {
    setShowEditedConfirmation(true);
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditVehicleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (car) => {
    try {
      const response = await fetch(
        api + `/vehicle/vehicle-information/${car.vehicleID}`
      );
      if (!response.ok) throw new Error("Vehicle not found");
      const data = await response.json();

      const { vehicle, images } = data;

      setEditVehicleForm({
        vehicleID: vehicle.vehicleID,
        makeName: vehicle.makeName || "",
        modelName: vehicle.modelName || "",
        bodyType: vehicle.bodyType || "",
        fuelType: vehicle.fuel || "",
        driveType: vehicle.driveType || "",
        cylinders: vehicle.cylinders || "",
        doors: vehicle.doors || "",
        transmission: vehicle.transmission || "",
        colour: vehicle.colour || "",
        price: vehicle.price || "",
        description: vehicle.description || "",
      });

      setOriginalVehicleValues({
        vehicleID: vehicle.vehicleID,
        makeName: vehicle.makeName || "",
        modelName: vehicle.modelName || "",
        bodyType: vehicle.bodyType || "",
        fuelType: vehicle.fuel || "",
        driveType: vehicle.driveType || "",
        cylinders: vehicle.cylinders || "",
        doors: vehicle.doors || "",
        transmission: vehicle.transmission || "",
        colour: vehicle.colour || "",
        price: vehicle.price || "",
        description: vehicle.description || "",
      });

      const transformedImages = images.map((image, index) => ({
        id: image.imageID,
        imageID: image.imageID,
        preview: api + "/vehicle-images/" + image.path,
        path: image.path,
        imageOrder: image.imageOrder,
        isExisting: true,
        name: image.path.split("/").pop(),
      }));

      setFiles(transformedImages);
      setOriginalFiles(transformedImages);
      setShowEditVehicleForm(true);
    } catch (err) {
      console.error("Failed to fetch vehicle info:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const vehicleID = editVehicleForm.vehicleID;
    const formData = new FormData();

    // Check for changes to the Vehicle attributes and prepare them
    const updatedVehicleFields = {};
    for (const key in editVehicleForm) {
      if (
        key !== "vehicleID" &&
        editVehicleForm[key] !== originalVehicleValues[key]
      ) {
        updatedVehicleFields[key] = editVehicleForm[key];
      }
    }

    if (Object.keys(updatedVehicleFields).length > 0) {
      formData.append("vehicleUpdates", JSON.stringify(updatedVehicleFields));
    }

    // Check for images that have been deleted and prepare them
    const imagesToDelete = originalFiles.filter(
      (originalFile) =>
        !files.some((currentFile) => currentFile.id === originalFile.id)
    );

    if (imagesToDelete.length > 0) {
      const dataToDelete = imagesToDelete.map((image) => ({
        imageID: image.imageID,
        path: image.path,
      }));
      formData.append("imagesToDelete", JSON.stringify(dataToDelete));
    }

    // Check for images that have been added and prepare them. Retrived from Dropzone
    const newFiles = files.filter((file) => !file.isExisting);

    newFiles.forEach((file) => {
      formData.append("newImages", file);
    });

    // Check for Image Order Changes and prepare them
    const currentImageOrder = files.map((file, index) => ({
      imageID: file.imageID || null,
      path: file.path || null,
      name: file.name, // Important for the newly uploaded file matching
      order: index,
      isExisting: file.isExisting,
    }));

    const originalOrderIDs = originalFiles.map((f) => f.id);
    const currentOrderIDs = files.map((f) => f.id);
    const orderChanged =
      originalOrderIDs.length !== currentOrderIDs.length ||
      originalOrderIDs.some((id, i) => id !== currentOrderIDs[i]);

    if (orderChanged || newFiles.length > 0 || imagesToDelete.length > 0) {
      formData.append("imageOrderUpdates", JSON.stringify(currentImageOrder));
    }

    try {
      const response = await fetch(
        api + `/vehicle/edit-vehicle/${vehicleID}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update vehicle.");
      }

      const result = await response.json();
      console.log("Vehicle updated successfully:", result);
      setShowEditVehicleForm(false);
      handleEditConfirmation();
      //window.location.reload();
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  useEffect(() => {
    fetch(api + "/vehicle/manage-vehicles")
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  // Search logic for the search bar

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchVehicles = async (term = "") => {
    try {
      const url = term
        ? api + `/vehicle/manage-vehicles?q=${encodeURIComponent(
            term
          )}`
        : api + "/vehicle/manage-vehicles";
      const res = await fetch(url);
      const data = await res.json();
      setCars(data);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setCars([]);
    }
  };

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      fetchVehicles(search);
    }, 300); // Allow time for the user to type before searching

    setSearchTimeout(timeoutId);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [search]);

  // Actions logic

  const handleApprove = async (car) => {
    console.log("Approving:", car);
    try {
      const response = await fetch(
        api + `/vehicle/manage-vehicles/approve/${car.vehicleID}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to approve vehicle");
      }

      const result = response.json();
      console.log("Server response:", result);
      window.location.reload();
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const handleReject = async (car) => {
    console.log("Rejecting:", car);
    try {
      const response = await fetch(
        api + `/vehicle/manage-vehicles/reject/${car.vehicleID}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to reject vehicle");
      }

      const result = response.json();
      console.log("Server response:", result);
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting:", error);
    }
  };

  const handleDelete = (car) => {
    setCarToDelete(car);
    setShowDeleteConfirmation(true);
  };

  // New functions for confirming or canceling deletion
  const confirmDelete = async () => {
    if (!carToDelete) return;

    console.log("Confirmed Deleting:", carToDelete);
    try {
      const response = await fetch(
        api + `/vehicle/manage-vehicles/delete/${carToDelete.vehicleID}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete vehicle");
      }

      const result = await response.json();
      console.log("Vehicle deleted:", result);
      setShowDeleteConfirmation(false);
      setCarToDelete(null);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting:", error);
      setShowDeleteConfirmation(false);
      setCarToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Close the modal
    setCarToDelete(null); // Clear the car to delete
  };

  const filteredCars =
    filterStatus === "All"
      ? cars
      : cars?.filter((car) => car.approvalStatus === filterStatus);

  return (
    <div className="p-8 max-w-7xl mx-auto pt-20">
      <h2 className="text-3xl font-bold mb-6 text-black">Manage Vehicles</h2>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-3">
          {["All", "Pending Approval", "Approved", "Denied"].map(
            (approvalStatus) => (
              <button
                key={approvalStatus}
                onClick={() => setFilterStatus(approvalStatus)}
                className={`text-sm px-4 py-2 rounded hover:bg-gray-800 transition ${
                  filterStatus === approvalStatus
                    ? "bg-black text-white font-semibold"
                    : "bg-white text-black border border-gray-300"
                }`}
              >
                {approvalStatus}
              </button>
            )
          )}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search Vehicles"
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:outline-none"
          />
          <button
            onClick={() => navigate("/add-vehicle")}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            <span className="text-xl leading-none">＋</span> Add Vehicle
          </button>
        </div>
      </div>

      {cars === null ? (
        <p>Loading...</p>
      ) : filteredCars.length === 0 ? (
        <p className="text-gray-500">No cars found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-black text-white">
                <th className="py-3 px-6 font-medium text-center">Make</th>
                <th className="py-3 px-6 font-medium text-center">Model Name</th>
                <th className="py-3 px-6 font-medium text-center">Price</th>
                <th className="py-3 px-6 font-medium text-center">Transmission</th>
                <th className="py-3 px-6 font-medium text-center">Body Type</th>
                <th className="py-3 px-6 font-medium text-center">Fuel</th>
                <th className="py-3 px-6 font-medium text-center">Drive Type</th>
                <th className="py-3 px-6 font-medium text-center">Cylinders</th>
                <th className="py-3 px-6 font-medium text-center">Doors</th>
                <th className="py-3 px-6 font-medium text-center">Colour</th>
                <th className="py-3 px-6 font-medium text-center">Status</th>
                <th className="py-3 px-6 font-medium text-center w-[320px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr
                  key={car.vehicleID}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <>
                    <td className="py-3 px-4">{car.makeName}</td>
                    <td className="py-3 px-4">{car.modelName}</td>
                    <td className="py-3 px-4">${car.price}</td>
                    <td className="py-3 px-4">{car.transmission}</td>
                    <td className="py-3 px-4">{car.bodyType}</td>
                    <td className="py-3 px-4">{car.fuel}</td>
                    <td className="py-3 px-4">{car.driveType}</td>
                    <td className="py-3 px-4">{car.cylinders}</td>
                    <td className="py-3 px-4">{car.doors}</td>
                    <td className="py-3 px-4">{car.colour}</td>
                    <td className="py-3 px-4">{car.approvalStatus}</td>
                    <td className="py-3 px-4 w-[320px]">
                      <div className="flex items-center justify-center gap-2">
                      {car.approvalStatus === "Pending Approval" && (
                        <>
                          <button
                            onClick={() => handleApprove(car)}
                            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(car)}
                            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(car)}
                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car)}
                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition text-xs"
                      >
                        Delete
                      </button>
                      </div>
                    </td>
                  </>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditVehicleForm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setShowEditVehicleForm(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-6">Edit Vehicle</h2>
            <form
              onSubmit={handleEditSubmit}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div>
                <label
                  htmlFor="vehicleID"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Vehicle ID
                </label>
                <input
                  id="vehicleID"
                  type="text"
                  name="vehicleID"
                  value={editVehicleForm.vehicleID}
                  required
                  className="w-full border p-3 rounded bg-gray-100 text-gray-600"
                  readOnly
                />
              </div>

              <div>
                <label
                  htmlFor="makeName"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Make Name
                </label>
                <input
                  id="makeName"
                  type="text"
                  name="makeName"
                  value={editVehicleForm.makeName}
                  required
                  className="w-full border p-3 rounded bg-gray-100 text-gray-600"
                  readOnly
                />
              </div>

              <div>
                <label
                  htmlFor="modelName"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Model Name
                </label>
                <input
                  id="modelName"
                  type="text"
                  name="modelName"
                  placeholder="Model Name"
                  value={editVehicleForm.modelName}
                  onChange={handleEditChange}
                  required
                  className="w-full border p-3 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="bodyType"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Body Type
                </label>
                <select
                  id="bodyType"
                  name="bodyType"
                  value={editVehicleForm.bodyType}
                  onChange={handleEditChange}
                  required
                  className="w-full border p-3 rounded"
                >
                  <option value="">Select Body Type</option>
                  <option value="Cab Chassis">Cab Chassis</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Ute">Ute</option>
                  <option value="Van">Van</option>
                  <option value="Wagon">Wagon</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="fuelType"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Fuel Type
                </label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={editVehicleForm.fuelType}
                  onChange={handleEditChange}
                  required
                  className="w-full border p-3 rounded"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Petrol">Petrol</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="driveType"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Drive Type
                </label>
                <select
                  id="driveType"
                  name="driveType"
                  value={editVehicleForm.driveType}
                  onChange={handleEditChange}
                  required
                  className="w-full border p-3 rounded"
                >
                  <option value="">Select Drive Type</option>
                  <option value="4x2">4x2</option>
                  <option value="4x4">4x4</option>
                  <option value="Front Wheel Drive">Front Wheel Drive</option>
                  <option value="Rear Wheel Drive">Rear Wheel Drive</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="cylinders"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Cylinders
                </label>
                <input
                  id="cylinders"
                  type="number"
                  name="cylinders"
                  placeholder="Cylinders (e.g. 4)"
                  value={editVehicleForm.cylinders}
                  onChange={handleEditChange}
                  required
                  className="w-full border p-3 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="doors"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Doors
                </label>
                <input
                  id="doors"
                  type="number"
                  name="doors"
                  placeholder="Doors (e.g. 4)"
                  value={editVehicleForm.doors}
                  onChange={handleEditChange}
                  required
                  className="w-full border p-3 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="transmission"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Transmission
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  value={editVehicleForm.transmission}
                  onChange={handleEditChange}
                  required
                  className="w-full border p-3 rounded"
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="colour"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Colour
                </label>
                <select
                  id="colour"
                  name="colour"
                  value={editVehicleForm.colour}
                  onChange={handleEditChange}
                  required
                  className="w-full border p-3 rounded"
                >
                  <option value="">Select Colour</option>
                  <option value="Black">Black</option>
                  <option value="Blue">Blue</option>
                  <option value="Gold">Gold</option>
                  <option value="Green">Green</option>
                  <option value="Grey">Grey</option>
                  <option value="Orange">Orange</option>
                  <option value="Red">Red</option>
                  <option value="Silver">Silver</option>
                  <option value="White">White</option>
                  <option value="Yellow">Yellow</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  name="price"
                  placeholder="Price (e.g., 45000.00)"
                  value={editVehicleForm.price}
                  onChange={handleEditChange}
                  required
                  className="w-full border p-3 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  placeholder="Enter additional information about the vehicle"
                  value={editVehicleForm.description}
                  onChange={handleEditChange}
                  required
                  className="w-full border p-3 rounded"
                />
              </div>

              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                {
                  <Dropzone
                    className="p-16 mt-10 border border-neutral-200"
                    files={files}
                    setFiles={setFiles}
                  />
                }
              </div>

              <button
                type="submit"
                className="bg-black text-white text-lg font-semibold px-6 py-3 rounded hover:bg-gray-800 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={cancelDelete}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Delete Vehicle
            </h3>
            <p className="mb-3 text-gray-700">
              Are you sure you want to delete this vehicle?
            </p>
            <small className="text-gray-700">
              Vehicle ID: {carToDelete?.vehicleID}
            </small>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Edit Submitted Modal - try to make only appear for manufacturers, not staff */}
      {showEditedConfirmation && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => window.location.reload()}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Vehicle Changes Submitted!
            </h3>
            <img
              src="../../public/assets/pendingapproval.png"
              alt="Pending Approval"
              title="Pendign Approval"
              className="w-12 h-12 mx-auto mb-3"
            />
            <p className="mb-3 text-gray-700">
              Your vehicle changes have now been submitted and are pending approval by Auto's Direct.
              Once they have been approved. The vehicle will be visible on the platform again.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 transition mx-auto"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}      
    </div>
  );
}

export default ManageVehiclesPage;

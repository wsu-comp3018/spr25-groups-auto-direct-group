import React, { useState, useEffect } from "react";
import api from "../data/api-calls";

function ManageDealershipsPage() {
  // State for all dealerships
  const [dealerships, setDealerships] = useState([]);

  // State for manufacturers
  const [manufacturers, setManufacturers] = useState([]);

  // State for tracking which dealership is being edited
  const [editingId, setEditingId] = useState(null);

  // State for storing editable dealership data
  const [editData, setEditData] = useState({
    dealerName: "",
    address: "",
  });

  // Toggle for showing the "Add Dealership" modal
  const [showAddDealerForm, setShowAddDealerForm] = useState(false);

  // Form data for adding a new dealership
  const [addDealerForm, setAddDealerForm] = useState({
    dealerName: "",
    address: "",
    manufacturerID: "",
  });

  // Loading states
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingManufacturers, setIsLoadingManufacturers] = useState(false);

  // Fetch manufacturers from the database
  const fetchManufacturers = async () => {
    setIsLoadingManufacturers(true);
    try {
      const response = await fetch(
        api + "/manage-dealerships/manufacturers-simple"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.manufacturers && data.manufacturers.length > 0) {
        setManufacturers(data.manufacturers);
      } else {
        throw new Error("No manufacturers returned from API");
      }
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      window.toast.error(
        "Failed to load manufacturers from database. Please refresh the page."
      );
      setManufacturers([]);
    } finally {
      setIsLoadingManufacturers(false);
    }
  };

  // Fetch all dealerships from the backend on load
  const fetchDealerships = async () => {
    try {
      const response = await fetch(
        api + "/manage-dealerships/manage"
      );
      const data = await response.json();
      setDealerships(data.dealerships || []);
    } catch (error) {
      console.error("Error fetching dealerships:", error);
    }
  };

  // Load dealerships and manufacturers on initial render
  useEffect(() => {
    fetchDealerships();
    fetchManufacturers();
  }, []);

  // Helper function to format address from dealership data
  const formatAddress = (dealership) => {
    // If the full address exists, use it, otherwise construct from components
    if (dealership.fullAddress) {
      return dealership.fullAddress;
    }

    const parts = [
      dealership.streetNo,
      dealership.streetName,
      dealership.suburb,
      dealership.postcode,
    ].filter(Boolean);

    return parts.join(" ");
  };

  // Get manufacturer name by ID
  const getManufacturerName = (manufacturerID) => {
    const manufacturer = manufacturers.find(
      (m) => m.manufacturerID === manufacturerID
    );
    return manufacturer
      ? manufacturer.manufacturerName
      : `Unknown Manufacturer (${manufacturerID?.substring(0, 8)}...)`;
  };

  // Prepare selected dealership data for editing
  const handleEdit = (dealership) => {
    setEditingId(dealership.dealerID);
    setEditData({
      dealerName: dealership.dealerName,
      address: formatAddress(dealership),
    });
  };

  // Handle input changes while editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Save updated dealership data
  const handleSaveEdit = async () => {
    if (!editData.dealerName.trim() || !editData.address.trim()) {
      window.toast.error("Please fill in both name and address fields");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        api + `/manage-dealerships/update/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editData.dealerName,
            address: editData.address,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Refresh the dealership list to get updated data
        await fetchDealerships();
        setEditingId(null);
        window.toast.success("Dealership updated successfully!");
      } else {
        window.toast.error(data.error || "Error updating dealership");
      }
    } catch (error) {
      console.error("Error updating dealership:", error);
      window.toast.error("Error updating dealership");
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Submit a new dealership to the backend
  const handleAddDealer = async () => {
    if (
      !addDealerForm.dealerName.trim() ||
      !addDealerForm.address.trim() ||
      !addDealerForm.manufacturerID
    ) {
      window.toast.error("Please fill in all required fields");
      return;
    }

    setIsAdding(true);

    try {
      const payload = {
        dealerName: addDealerForm.dealerName,
        address: addDealerForm.address,
        manufacturerID: addDealerForm.manufacturerID,
      };

      const response = await fetch(
        api + "/manage-dealerships/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await fetchDealerships(); // refresh list
        setShowAddDealerForm(false); // close modal
        setAddDealerForm({
          dealerName: "",
          address: "",
          manufacturerID: "",
        });
        window.toast.success("Dealership added successfully!");
      } else {
        console.error("Server error:", data);

        // Show detailed error with available manufacturers
        let errorMessage = `Error: ${data.error}`;
        if (data.availableManufacturers) {
          errorMessage += "\n\nAvailable manufacturers:";
          data.availableManufacturers.forEach((m) => {
            errorMessage += `\n- ${m.manufacturerName}: ${m.manufacturerID}`;
          });
        }
        window.toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Network error adding dealership:", error);
      window.toast.error("Network error adding dealership. Check your connection.");
    } finally {
      setIsAdding(false);
    }
  };

  // Delete a dealership by ID
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this dealership?")) {
      try {
        const response = await fetch(
          api + `/manage-dealerships/delete/${id}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          // Remove from local state
          setDealerships(dealerships.filter((d) => d.dealerID !== id));
          if (editingId === id) setEditingId(null);
          window.toast.success("Dealership deleted successfully!");
        } else {
          const data = await response.json();
          window.toast.error(data.error || "Error deleting dealership");
        }
      } catch (error) {
        console.error("Error deleting dealership:", error);
        window.toast.error("Error deleting dealership");
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pt-20">
      <h2 className="text-3xl font-bold mb-6 text-black">
        Manage Dealerships
      </h2>

      {/* Add button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowAddDealerForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50"
          disabled={manufacturers.length === 0}
        >
          <span className="text-xl leading-none">＋</span> Add Dealership
        </button>
      </div>

      {/* Warning if no manufacturers */}
      {manufacturers.length === 0 && (
        <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-black font-medium">Cannot add dealerships</p>
          <p className="text-gray-700 text-sm">
            Manufacturers failed to load from database. Please refresh the page
            or check your server connection.
          </p>
        </div>
      )}

      {/* Dealership Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="py-3 px-6 font-medium text-center">Name</th>
              <th className="py-3 px-6 font-medium text-center">Address</th>
              <th className="py-3 px-6 font-medium text-center">Manufacturer</th>
              <th className="py-3 px-6 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dealerships.map((d) => (
              <tr
                key={d.dealerID}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                {editingId === d.dealerID ? (
                  <>
                    {/* Edit mode inputs */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor={`edit-name-${d.dealerID}`}
                          className="text-xs font-medium text-gray-600"
                        >
                          Name:
                        </label>
                        <input
                          id={`edit-name-${d.dealerID}`}
                          name="dealerName"
                          value={editData.dealerName}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Dealership Name"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor={`edit-address-${d.dealerID}`}
                          className="text-xs font-medium text-gray-600"
                        >
                          Address:
                        </label>
                        <input
                          id={`edit-address-${d.dealerID}`}
                          name="address"
                          value={editData.address}
                          onChange={handleEditChange}
                          className="border p-1 w-full rounded text-sm"
                          placeholder="Full Address (e.g., 123 Main St, Sydney NSW 2000)"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {getManufacturerName(d.manufacturerID)}
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={isUpdating}
                        className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800 disabled:opacity-50"
                      >
                        {isUpdating ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="text-sm bg-white text-black border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    {/* Normal mode display */}
                    <td className="py-3 px-4">{d.dealerName}</td>
                    <td className="py-3 px-4">{formatAddress(d)}</td>
                    <td className="py-3 px-4">
                      {getManufacturerName(d.manufacturerID)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(d)}
                        className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d.dealerID)}
                        className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                      >
                        Delete
                      </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Dealership Modal */}
      {showAddDealerForm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => !isAdding && setShowAddDealerForm(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Add New Dealership</h3>

            {/* Dealership Name */}
            <div className="mb-3">
              <label
                htmlFor="add-dealer-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dealership Name
              </label>
              <input
                id="add-dealer-name"
                name="dealerName"
                value={addDealerForm.dealerName}
                onChange={(e) =>
                  setAddDealerForm({
                    ...addDealerForm,
                    dealerName: e.target.value,
                  })
                }
                placeholder="Enter dealership name"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            {/* Full Address */}
            <div className="mb-3">
              <label
                htmlFor="add-dealer-address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Address
              </label>
              <textarea
                id="add-dealer-address"
                name="address"
                value={addDealerForm.address}
                onChange={(e) =>
                  setAddDealerForm({
                    ...addDealerForm,
                    address: e.target.value,
                  })
                }
                placeholder="123 Main Street, Sydney NSW 2000, Australia"
                className="w-full border p-2 rounded h-20 resize-none focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            {/* Manufacturer dropdown */}
            <div className="mb-4">
              <label
                htmlFor="add-dealer-manufacturer"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Manufacturer
              </label>
              <select
                id="add-dealer-manufacturer"
                name="manufacturerID"
                value={addDealerForm.manufacturerID}
                onChange={(e) => {
                  setAddDealerForm({
                    ...addDealerForm,
                    manufacturerID: e.target.value,
                  });
                }}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-black focus:outline-none"
                required
                disabled={isLoadingManufacturers || manufacturers.length === 0}
              >
                <option value="">
                  {isLoadingManufacturers
                    ? "Loading manufacturers..."
                    : manufacturers.length === 0
                    ? "No manufacturers available"
                    : "Select Manufacturer"}
                </option>
                {manufacturers.map((manufacturer) => (
                  <option
                    key={manufacturer.manufacturerID}
                    value={manufacturer.manufacturerID}
                  >
                    {manufacturer.manufacturerName}
                  </option>
                ))}
              </select>
            </div>

            {/* Help message */}
            <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded">
              <strong>Address Tips:</strong>
              <ul className="list-disc list-inside mt-1 text-xs">
                <li>
                  Include street number, street name, suburb, state, and
                  postcode
                </li>
                <li>Example: "123 Collins Street, Sydney NSW 2000"</li>
                <li>The more specific, the better for accurate mapping</li>
              </ul>
            </div>

            {/* Modal buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddDealerForm(false)}
                disabled={isAdding}
                className="px-4 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDealer}
                disabled={
                  isAdding ||
                  isLoadingManufacturers ||
                  manufacturers.length === 0
                }
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "Add Dealership"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDealershipsPage;

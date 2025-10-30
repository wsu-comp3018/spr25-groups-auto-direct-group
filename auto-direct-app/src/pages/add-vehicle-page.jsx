import { useState, useEffect } from "react";
import Dropzone from "../components/Dropzone";
import { useNavigate } from "react-router-dom";
import api from "../data/api-calls";

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const [makes, setMakes] = useState([]);
  const [files, setFiles] = useState([]);
  const [showSubmittedConfirmation, setShowSubmittedConfirmation] = useState(false);
  const handleConfirmation = async () => {
    setShowSubmittedConfirmation(true);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      window.toast.error("Please upload at least one image.");
      return;
    }

    const submittedData = new FormData();

    // Add form fields except images
    for (const key in formData) {
      submittedData.append(key, formData[key]);
    }

    // Add image files
    files.forEach((file) => {
      submittedData.append("images", file);
    });

    // Add image order
    const imageOrder = files.map((file, index) => ({
      name: file.name,
      order: index,
    }));

    submittedData.append("imageOrder", JSON.stringify(imageOrder));

    try {
      const response = await fetch(
        api + "/vehicle/add-vehicle",
        {
          method: "POST",
          body: submittedData,
        }
      );

      if (response.ok) {
        handleConfirmation();

        // Reset form
        setFormData({
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
        setFiles([]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    fetch(api + "/vehicle/makes")
      .then((res) => res.json())
      .then((data) => {
        setMakes(data.makes);
      });
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 pt-15">
      <h2 className="text-3xl font-bold mb-6">Add New Vehicle</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <label
            htmlFor="makeName"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Make Name
          </label>
          <select
            id="makeName"
            name="makeName"
            value={formData.makeName}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          >
            <option value="">Select Make Name</option>
            {makes.map((make, i) => (
              <option value={make.makeName} key={i}>
                {make.makeName}
              </option>
            ))}
          </select>
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
            value={formData.modelName}
            onChange={handleChange}
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
            value={formData.bodyType}
            onChange={handleChange}
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
            value={formData.fuelType}
            onChange={handleChange}
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
            value={formData.driveType}
            onChange={handleChange}
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
            value={formData.cylinders}
            onChange={handleChange}
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
            value={formData.doors}
            onChange={handleChange}
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
            value={formData.transmission}
            onChange={handleChange}
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
            value={formData.colour}
            onChange={handleChange}
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
            placeholder="Price (e.g., $45000.00)"
            value={formData.price}
            onChange={handleChange}
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
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Images
          </label>
          <Dropzone
            className="p-16 mt-10 border border-neutral-200"
            files={files}
            setFiles={setFiles}
          />
        </div>

        <button
          type="submit"
          className={`bg-black text-white text-lg font-semibold px-6 py-3 rounded-md hover:bg-gray-700 transition shadow-md`}
        >
          Add Vehicle
        </button>
      </form>

    {/* Vehicle Submitted Modal */}
      {showSubmittedConfirmation && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => navigate("/manage-vehicles")}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Vehicle Submitted!
            </h3>
            <img
              src="../../public/assets/pendingapproval.png"
              alt="Pending Approval"
              title="Pendign Approval"
              className="w-12 h-12 mx-auto mb-3"
            />
            <p className="mb-3 text-gray-700">
              Your vehicle has now been submitted and is pending approval by Auto's Direct. Once
              it has been approved. It will be visible on the platform.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => navigate("/manage-vehicles")}
                className="px-4 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-700 transition shadow-md mx-auto"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}       
    </div>
  );
};

export default AddVehiclePage;

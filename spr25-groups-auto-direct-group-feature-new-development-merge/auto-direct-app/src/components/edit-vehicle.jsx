import React, { useEffect, useState } from 'react';
import Dropzone from './Dropzone'; // Adjust the path if needed

function EditVehicleForm({ vehicleID }) {

    const [files, setFiles] = useState([]);
    const [editData, setEditData] = useState({
        makeName: '',
        modelName: '',
        bodyType: '',
        fuelType: '',
        driveType: '',
        cylinders: '',
        doors: '',
        transmission: '',
        colour: '',
        price: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const fetchVehicleInfo = async () => {
    try {
        const response = await fetch(`/vehicle-information/${vehicleID}`);
        if (!response.ok) throw new Error('Vehicle not found');
        const data = await response.json();

        const { vehicle, images } = data;

        // Populate vehicle fields
        setEditData({
            makeName: vehicle.makeName || '',
            modelName: vehicle.modelName || '',
            bodyType: vehicle.bodyType || '',
            fuelType: vehicle.fuelType || '',
            driveType: vehicle.driveType || '',
            cylinders: vehicle.cylinders || '',
            doors: vehicle.doors || '',
            transmission: vehicle.transmission || '',
            colour: vehicle.colour || '',
            price: vehicle.price || '',
            description: vehicle.description || ''
        });

        // Transform image data into Dropzone-compatible files
        const transformedImages = images.map((img, index) => ({
            id: index,
            preview: img.path,
            path: img.path,
            mageOrder: img.imageOrder,
            isFromServer: true  // Custom flag to distinguish uploaded vs existing
        }));

        setFiles(transformedImages);

    } catch (err) {
        console.error('Failed to fetch vehicle info:', err);
    }
  };

  if (vehicleID) {
    fetchVehicleInfo();
  }
}, [vehicleID]);    

  return (
    <div className="max-w-xl mx-auto p-6 pt-15">
      <h2 className="text-3xl font-bold mb-6">Edit Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <select
          name="makeName"
          value={editData.makeName}
          readOnly
          required
          className="w-full border p-3 rounded bg-gray-100 text-gray-600"
        >
        </select>

        <input
          type="text"
          name="modelName"
          placeholder="Model Name"
          value={editData.modelName}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <select
          name="bodyType"
          value={editData.bodyType}
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

        <select
          name="fuelType"
          value={editData.fuelType}
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

        <select
          name="driveType"
          value={editData.driveType}
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

        <input
          type="number"
          name="cylinders"
          placeholder="Cylinders (e.g. 4)"
          value={editData.cylinders}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="doors"
          placeholder="Doors (e.g. 4)"
          value={editData.doors}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <select
          name="transmission"
          value={editData.transmission}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        >
          <option value="">Select Transmission</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>

        <select
          name="colour"
          value={editData.colour}
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

        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price (e.g., $45000.00)"
          value={editData.price}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="description"
          placeholder="Enter additional information about the vehicle"
          value={editData.description}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Images
          </label>
          {<Dropzone className="p-16 mt-10 border border-neutral-200" files={files} setFiles={setFiles} />}
        </div>

        <button
          type="submit"
          className={`bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-md transition shadow-md`}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditVehicleForm;

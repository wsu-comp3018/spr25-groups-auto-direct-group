import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import getImageUrl from "../components/getImageUrl";
import VehicleCategories from "../components/VehicleCategories";
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import api from "../data/api-calls";

function HomePage() {
  const [makes, setMakes] = useState([]);
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [selectedDriveTypes, setSelectedDriveTypes] = useState([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);

  const driveTypeOptions = ['4x2', '4x4', 'Front Wheel Drive', 'Rear Wheel Drive'];
  const bodyTypeOptions = ['Cab Chassis', 'Convertible', 'Coupe', 'Hatchback', 'Sedan', 'SUV', 'Ute', 'Van', 'Wagon'];
  const transmissionOptions = ['Automatic', 'Manual'];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        // Utilise Simon's getMakes service/API
        const response = await fetch(api + "/vehicle/makes");
        if (!response.ok) {
          throw new Error(`Error retrieving Makes: ${response.status}`);
        }
        const data = await response.json();
        const makesArray = data.makes; // Converts JSON Object to array
        
        setMakes(makesArray);
      } catch (error) {
        console.error("Failed to fetch Makes:", error);
        setMakes([]); // Show all vehicles if theres an error
      }
    };

    fetchMakes();
  }, []);

  const makeOptions = makes.map(make => make.makeName);

  const handleMakeChange = (newSelectedMakes) => {
    setSelectedMakes(newSelectedMakes);
    console.log('Selected Makes:', newSelectedMakes);
  }

  const handleDriveTypeChange = (newSelectedDriveTypes) => {
    setSelectedDriveTypes(newSelectedDriveTypes);
    console.log('Selected Drive Types:', newSelectedDriveTypes);
  }

  const handleBodyTypeChange = (newSelectedBodyTypes) => {
    setSelectedBodyTypes(newSelectedBodyTypes);
    console.log('Selected Body Types:', newSelectedBodyTypes);
  };

  const handleTransmissionChange = (newSelectedTransmissions) => {
    setSelectedTransmissions(newSelectedTransmissions);
    console.log('Selected Transmissions:', newSelectedTransmissions);
  };

  const handleShowCars = () => {
    const params = new URLSearchParams();

    if (selectedMakes.length > 0) {
      params.append('make', selectedMakes.join(','));
    }

    if (selectedDriveTypes.length > 0) {
      params.append('driveType', selectedDriveTypes.join(','));
    }

    if (selectedBodyTypes.length > 0) {
      params.append('bodyType', selectedBodyTypes.join(','));
    }

    if (selectedTransmissions.length > 0) {
      params.append('transmission', selectedTransmissions.join(','));
    }

    // Construct the URL for the browse page with query parameters
    navigate(`/browse?${params.toString()}`);
  };  

  return (
    <div className="pt-1">
      {/* Banner Section */}
      <section
        className="w-full bg-cover bg-center text-white py-40 text-center"
        style={{
          backgroundImage: `url(${getImageUrl("../../public/assets/LEXUSLFA.jpg")})`,
        }}
      >
        <div className="max-w-5xl mx-auto p-6 bg-opacity-40 rounded-lg bg-black/70">
          <h2 className="text-4xl font-bold mb-4">Welcome to Autos Direct</h2>
          <p className="text-lg mb-6">
            Find your perfect car today with vibrant choices and sleek designs.
          </p>
        </div>
      </section>
      {/* Search Panel just below banner, with negative margin */}
      <div className="relative z-20 -mt-16 flex justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-wrap md:flex-nowrap gap-4 items-end justify-between w-[80%] max-w-5xl">
          <MultiSelectDropdown
            label="Make"
            options={makeOptions}
            selectedValues={selectedMakes}
            onChange={handleMakeChange}
          />
          <MultiSelectDropdown
            label="Drive Type"
            options={driveTypeOptions}
            selectedValues={selectedDriveTypes}
            onChange={handleDriveTypeChange}
          />
          <MultiSelectDropdown
            label="Body Type"
            options={bodyTypeOptions}
            selectedValues={selectedBodyTypes}
            onChange={handleBodyTypeChange}
          />
          <MultiSelectDropdown
            label="Transmission"
            options={transmissionOptions}
            selectedValues={selectedTransmissions}
            onChange={handleTransmissionChange}
          />
          <button className="bg-black hover:bg-gray-700 text-white font-semibold rounded-lg px-8 py-3 transition min-w-[180px]" onClick={handleShowCars}>
            Show cars
          </button>
        </div>
      </div>
      <VehicleCategories />
    </div>
  );
}

export default HomePage;

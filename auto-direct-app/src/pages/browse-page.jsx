import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import Cookies from "js-cookie";
import api from "../data/api-calls";
import MakeFilterModal from "../components/MakeFilterModal";
import PriceFilterModal from "../components/PriceFilterModal";
import TransmissionFilterModal from "../components/TransmissionFilterModal";
import BodyTypeFilterModal from "../components/BodyTypeFilterModal";
import DriveTypeFilterModal from "../components/DriveTypeFilterModal";
import FuelFilterModal from "../components/FuelFilterModal";
import FilterPills from "../components/FilterPills";

// Hardcoded options for filters (edit these to what you want available by default)
const TRANSMISSION_OPTIONS = ["Automatic", "Manual"];
const BODY_TYPE_OPTIONS = [
  "Cab Chassis",
  "Convertible",
  "Coupe",
  "Hatchback",
  "Sedan",
  "SUV",
  "Ute",
  "Van",
  "Wagon",
];
const FUEL_OPTIONS = ["Petrol", "Diesel", "Hybrid", "Electric"];
const DRIVE_TYPE_OPTIONS = [
  "4x2",
  "4x4",
  "Front Wheel Drive",
  "Rear Wheel Drive",
];

// Helper function to truncate text by character count
const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

function BrowsePage() {
  const [cars, setCars] = useState([]);
  const [makeFilter, setMakeFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState([]);
  const [transmissionFilter, setTransmissionFilter] = useState([]);
  const [bodyTypeFilter, setBodyTypeFilter] = useState([]);
  const [driveTypeFilter, setDriveTypeFilter] = useState([]);
  const [fuelFilter, setFuelFilter] = useState([]);
  const userID = Cookies.get("auto-direct-userID");
  const token = Cookies.get("auto-direct-token");
  const [makeExpanded, setMakeExpanded] = useState(false);
  const [priceExpanded, setPriceExpanded] = useState(false);
  const [transmissionExpanded, setTransmissionExpanded] = useState(false);
  const [bodyTypeExpanded, setBodyTypeExpanded] = useState(false);
  const [driveTypeExpanded, setDriveTypeExpanded] = useState(false);
  const [fuelExpanded, setFuelExpanded] = useState(false);


  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    transmissions: [],
    bodyTypes: [],
    fuels: [],
    driveTypes: [],
  });

  const [favourites, setFavourites] = useState([]);
  const [isSavingId, setIsSavingId] = useState(null);

  const handleToggleFavourite = async (vehicleID) => {
    if (!token || !userID) {
      console.log("A user must be signed in to save a car", userID);
      return;
    }

    const isCurrentlyFavourite = favourites.includes(vehicleID);
    let route;
    let method;
    let bodyData = { userID, vehicleID };

    // Handle route dpeending on if the vehicle is a favourite or not
    if (isCurrentlyFavourite) {
      route = api + `/vehicle/save-vehicle/remove`;
      method = "POST";
    } else {
      route = api + `/vehicle/save-vehicle/add`;
      method = "POST";
    }

    try {
      const response = await fetch(route, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        console.warn("Toggle favourite returned status:", response.status);
      }

      setFavourites((prev) =>
        isCurrentlyFavourite
          ? prev.filter((x) => x !== vehicleID)
          : [...prev, vehicleID]
      );
      console.log(`Vehicle saved successfully.`);

      // Navigate to Saved Cars when the action was a save (not remove)
      if (!isCurrentlyFavourite) {
        navigate('/saved-cars');
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
      // If user attempted to save, still navigate; backend may have already saved previously
      if (!isCurrentlyFavourite) {
        navigate('/saved-cars');
      }
    }
  };

  // Toggle save/unsave via heart on browse without redirect
  const handleSaveViaHeart = async (vehicleID) => {
    if (!token || !userID) {
      window.toast.warning("Please sign in to save vehicles.");
      return;
    }
    if (isSavingId) return;
    setIsSavingId(vehicleID);
    try {
      if (favourites.includes(vehicleID)) {
        const res = await fetch(api + "/vehicle/save-vehicle/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({ userID, vehicleID })
        });
        if (!res.ok) console.warn("Unsave status:", res.status);
        setFavourites((prev) => prev.filter((x) => x !== vehicleID));
      } else {
        const res = await fetch(api + "/vehicle/save-vehicle/add", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({ userID, vehicleID })
        });
        if (!res.ok) console.warn("Save status:", res.status);
        setFavourites((prev) => (prev.includes(vehicleID) ? prev : [...prev, vehicleID]));
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSavingId(null);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Get parameters, split by comma, and set initial filter states
    setMakeFilter(queryParams.get("make")?.split(",").filter(Boolean) || []);
    setPriceFilter(queryParams.get("price")?.split(",").filter(Boolean) || []);
    setTransmissionFilter(
      queryParams.get("transmission")?.split(",").filter(Boolean) || []
    );
    setBodyTypeFilter(
      queryParams.get("bodyType")?.split(",").filter(Boolean) || []
    );
    setFuelFilter(queryParams.get("fuel")?.split(",").filter(Boolean) || []);
    setDriveTypeFilter(
      queryParams.get("driveType")?.split(",").filter(Boolean) || []
    );

    fetch(api + "/vehicle/browse-vehicles")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFilterOptions({
          makes: [...new Set(data.map((car) => car.makeName))].sort(),
          transmissions: [
            ...new Set([
              ...TRANSMISSION_OPTIONS,
              ...data.map((car) => car.transmission).filter(Boolean),
            ]),
          ].sort(),
          bodyTypes: [
            ...new Set([
              ...BODY_TYPE_OPTIONS,
              ...data.map((car) => car.bodyType).filter(Boolean),
            ]),
          ].sort(),
          fuels: [
            ...new Set([
              ...FUEL_OPTIONS,
              ...data.map((car) => car.fuel).filter(Boolean),
            ]),
          ].sort(),
          driveTypes: [
            ...new Set([
              ...DRIVE_TYPE_OPTIONS,
              ...data.map((car) => car.driveType).filter(Boolean),
            ]),
          ].sort(),
        });
      })
      .catch((err) =>
        console.error("Unable to dynamically fetch filter options:", err)
      );
  }, [location.search]);

  // Get the vehicles based on the selected filter criteria in the URL
  const fetchCars = useCallback(async () => {
    try {
      // Build the URL directly from the current location.search
      const url = api + `/vehicle/browse-vehicles${location.search}`;
      const res = await fetch(url);
      const data = await res.json();
      setCars(data);
      setCurrentPage(1); // Send user to page 1 if they change filters
    } catch (err) {
      console.error("Failed to fetch vehicles with filters:", err);
    }
  }, [location.search]);

  // Get the user's favourited vehicles on load

  const fetchUserFavourites = useCallback(async () => {
    if (!token || !userID) {
      // if a user isn't signed in, favourites will be empty
      setFavourites([]);
      return;
    }

    try {
      const res = await fetch(api + "/vehicle/saved-vehicles/", {
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Failed to fetch user favourites");
        }
      }
      const returnedSaves = await res.json();

      // Pull ID's from the API result to populate favourites
      const favouriteIDs = returnedSaves.map((car) => car.vehicleID);
      setFavourites(favouriteIDs);
    } catch (err) {
      console.error("Failed to fetch user favourites:", err);
      setFavourites([]);
    }
  }, [token, userID]);

  useEffect(() => {
    fetchCars();
    fetchUserFavourites();
  }, [fetchCars, fetchUserFavourites]);

  // Helper to toggle values and update URL
  const toggleFilter = (value, filterName, currentFilterState) => {
    const queryParams = new URLSearchParams(location.search);
    let newFilterState;

    if (currentFilterState.includes(value)) {
      newFilterState = currentFilterState.filter((x) => x !== value);
    } else {
      newFilterState = [...currentFilterState, value];
    }

    if (newFilterState.length > 0) {
      queryParams.set(filterName, newFilterState.join(","));
    } else {
      queryParams.delete(filterName);
    }

    // Update the URL according to filters
    navigate(`?${queryParams.toString()}`);
  };

  // Helper to update make filter and URL
  const handleMakeFilterChange = (newMakeFilter) => {
    setMakeFilter(newMakeFilter);
    
    const queryParams = new URLSearchParams(location.search);
    if (newMakeFilter.length > 0) {
      queryParams.set('make', newMakeFilter.join(","));
    } else {
      queryParams.delete('make');
    }
    
    // Update the URL according to filters
    navigate(`?${queryParams.toString()}`);
  };

  // Helper to update price filter and URL
  const handlePriceFilterChange = (newPriceFilter) => {
    setPriceFilter(newPriceFilter);
    
    const queryParams = new URLSearchParams(location.search);
    if (newPriceFilter.length > 0) {
      queryParams.set('price', newPriceFilter.join(","));
    } else {
      queryParams.delete('price');
    }
    
    navigate(`?${queryParams.toString()}`);
  };

  // Helper to update transmission filter and URL
  const handleTransmissionFilterChange = (newTransmissionFilter) => {
    setTransmissionFilter(newTransmissionFilter);
    
    const queryParams = new URLSearchParams(location.search);
    if (newTransmissionFilter.length > 0) {
      queryParams.set('transmission', newTransmissionFilter.join(","));
    } else {
      queryParams.delete('transmission');
    }
    
    navigate(`?${queryParams.toString()}`);
  };

  // Helper to update body type filter and URL
  const handleBodyTypeFilterChange = (newBodyTypeFilter) => {
    setBodyTypeFilter(newBodyTypeFilter);
    
    const queryParams = new URLSearchParams(location.search);
    if (newBodyTypeFilter.length > 0) {
      queryParams.set('bodyType', newBodyTypeFilter.join(","));
    } else {
      queryParams.delete('bodyType');
    }
    
    navigate(`?${queryParams.toString()}`);
  };

  // Helper to update drive type filter and URL
  const handleDriveTypeFilterChange = (newDriveTypeFilter) => {
    setDriveTypeFilter(newDriveTypeFilter);
    
    const queryParams = new URLSearchParams(location.search);
    if (newDriveTypeFilter.length > 0) {
      queryParams.set('driveType', newDriveTypeFilter.join(","));
    } else {
      queryParams.delete('driveType');
    }
    
    navigate(`?${queryParams.toString()}`);
  };

  // Helper to update fuel filter and URL
  const handleFuelFilterChange = (newFuelFilter) => {
    setFuelFilter(newFuelFilter);
    
    const queryParams = new URLSearchParams(location.search);
    if (newFuelFilter.length > 0) {
      queryParams.set('fuel', newFuelFilter.join(","));
    } else {
      queryParams.delete('fuel');
    }
    
    navigate(`?${queryParams.toString()}`);
  };

  // Individual filter remove functions for pills
  const removeMakeFilter = (makeToRemove) => {
    const newMakeFilter = makeFilter.filter(make => make !== makeToRemove);
    handleMakeFilterChange(newMakeFilter);
  };

  const removePriceFilter = (priceToRemove) => {
    const newPriceFilter = priceFilter.filter(price => price !== priceToRemove);
    handlePriceFilterChange(newPriceFilter);
  };

  const removeTransmissionFilter = (transmissionToRemove) => {
    const newTransmissionFilter = transmissionFilter.filter(transmission => transmission !== transmissionToRemove);
    handleTransmissionFilterChange(newTransmissionFilter);
  };

  const removeBodyTypeFilter = (bodyTypeToRemove) => {
    const newBodyTypeFilter = bodyTypeFilter.filter(bodyType => bodyType !== bodyTypeToRemove);
    handleBodyTypeFilterChange(newBodyTypeFilter);
  };

  const removeDriveTypeFilter = (driveTypeToRemove) => {
    const newDriveTypeFilter = driveTypeFilter.filter(driveType => driveType !== driveTypeToRemove);
    handleDriveTypeFilterChange(newDriveTypeFilter);
  };

  const removeFuelFilter = (fuelToRemove) => {
    const newFuelFilter = fuelFilter.filter(fuel => fuel !== fuelToRemove);
    handleFuelFilterChange(newFuelFilter);
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setMakeFilter([]);
    setPriceFilter([]);
    setTransmissionFilter([]);
    setBodyTypeFilter([]);
    setDriveTypeFilter([]);
    setFuelFilter([]);
    
    // Clear URL parameters
    navigate('/browse');
  };

  // Pagination logic
  const totalPages = Math.ceil(cars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = cars.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 pt-20 max-w-7xl mx-auto text-black">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6  space-y-5 sticky top-24 border-r border-gray-200 ">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Filter Vehicles
            </h2>
            
            {/* Filter Pills */}
            <FilterPills
              makeFilter={makeFilter}
              priceFilter={priceFilter}
              transmissionFilter={transmissionFilter}
              bodyTypeFilter={bodyTypeFilter}
              driveTypeFilter={driveTypeFilter}
              fuelFilter={fuelFilter}
              onRemoveMake={removeMakeFilter}
              onRemovePrice={removePriceFilter}
              onRemoveTransmission={removeTransmissionFilter}
              onRemoveBodyType={removeBodyTypeFilter}
              onRemoveDriveType={removeDriveTypeFilter}
              onRemoveFuel={removeFuelFilter}
              onClearAll={clearAllFilters}
            />
            
            {/* Make Filter - Popup Trigger */}
            <div>
              <button
                onClick={() => setMakeExpanded(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Make</span>
                <div className="flex items-center space-x-2">

                  {makeFilter.length > 0 && (
                    <span className="text-xs text-gray-500">{makeFilter.length}</span>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                
                </div>
              </button>
            </div>
            {/* Price Filter - Popup Trigger */}
            <div>
              <button
                onClick={() => setPriceExpanded(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Price</span>
                <div className="flex items-center space-x-2">
                  {priceFilter.length > 0 && (
                    <span className="text-xs text-gray-500">{priceFilter.length}</span>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
            {/* Transmission Filter - Popup Trigger */}
            <div>
              <button
                onClick={() => setTransmissionExpanded(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Transmission</span>
                <div className="flex items-center space-x-2">
                  {transmissionFilter.length > 0 && (
                    <span className="text-xs text-gray-500">{transmissionFilter.length}</span>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
            {/* Body Type Filter - Popup Trigger */}
            <div>
              <button
                onClick={() => setBodyTypeExpanded(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Body Type</span>
                <div className="flex items-center space-x-2">
                  {bodyTypeFilter.length > 0 && (
                  <span className="text-xs text-gray-500">{bodyTypeFilter.length}</span>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
            {/* Drive Type Filter - Popup Trigger */}
            <div>
              <button
                onClick={() => setDriveTypeExpanded(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Drive Type</span>
                <div className="flex items-center space-x-2">
                  {driveTypeFilter.length > 0 && (
                    <span className="text-xs text-gray-500">{driveTypeFilter.length}</span>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
            
            {/* Fuel Filter - Popup Trigger */}
            <div>
              <button
                onClick={() => setFuelExpanded(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Fuel Type</span>
                <div className="flex items-center space-x-2">
                  {fuelFilter.length > 0 && (
                    <span className="text-xs text-gray-500">{fuelFilter.length}</span>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </aside>
        {/* Vehicle Listings */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]">
            {paginatedCars.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-lg my-auto">
                No cars found. Please adjust your filters.
              </div>
            ) : (
              paginatedCars.map((car) => (
                <div
                  key={car.vehicleID}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transform hover:scale-[1.02] transition duration-300 flex flex-col h-[370px] relative"
                >
                  {/* Heart icon in upper right */}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveViaHeart(car.vehicleID); }}
                    disabled={isSavingId === car.vehicleID}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full border transition ${
                      favourites.includes(car.vehicleID) ? 'bg-red-100 border-red-400 hover:bg-red-200' : 'bg-white border-gray-200 hover:bg-gray-100'
                    } ${isSavingId === car.vehicleID ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Save to favourites"
                    title={favourites.includes(car.vehicleID) ? 'Saved' : 'Save to favourites'}
                  >
                    <Heart className={`w-5 h-5 ${favourites.includes(car.vehicleID) ? 'text-red-600 fill-red-600' : 'text-gray-600'}`} />
                  </button>
                  
                  <Link
                    to={`/car/${car.vehicleID}`}
                    className="relative w-full h-56 overflow-hidden"
                  >
                    <img
                      src={api + `/vehicle-images/${car.mainImage}`}
                      alt={car.modelName}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                    />
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {`${car.makeName} ${car.modelName}`}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {truncateText(car.description, 35)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {car.bodyType}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {car.transmission}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {car.fuel}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-xl font-bold">
                        {new Intl.NumberFormat("en-AU", {
                          style: "currency",
                          currency: "AUD",
                        }).format(car.price)}
                      </p>
                      {/* Test drive button */}
                      <button
                        onClick={() =>
                          navigate(`/car/${car.vehicleID}`, {
                            state: { car, testDriveClicked: true },
                          })
                        }
                        className="bg-black text-white hover:bg-white hover:text-black text-sm px-3 py-1 rounded shadow-sm flex items-center"
                      >
                        Test Drive
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* page Controls with arrows */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
              >
                &#171;
              </button>
              <span className="text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
              >
                &#187;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Make Filter Popup Modal */}
      {makeExpanded && (
        <div 
          className="fixed inset-0 z-50 overflow-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)'
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Make</h3>
                <button
                  onClick={() => setMakeExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Search bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search make..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
              </div>
              
                  {/* Options list */}
                  <div className="max-h-80 overflow-y-auto">
                    {(() => {
                      // Group makes by first letter
                      const groupedMakes = filterOptions.makes.reduce((acc, make) => {
                        const firstLetter = make.charAt(0).toUpperCase();
                        if (!acc[firstLetter]) {
                          acc[firstLetter] = [];
                        }
                        acc[firstLetter].push(make);
                        return acc;
                      }, {});

                      // Sort the letters
                      const sortedLetters = Object.keys(groupedMakes).sort();

                      return sortedLetters.map((letter) => (
                        <div key={letter}>
                          {/* Letter heading */}
                          <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 text-left">({letter})</h4>
                          </div>
                          
                          {/* Makes for this letter */}
                          {groupedMakes[letter].map((make, idx) => (
                            <button
                              key={idx}
                              onClick={() => toggleFilter(make, "make", makeFilter)}
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 border-2 rounded ${
                                  makeFilter.includes(make) 
                                    ? 'bg-black border-black' 
                                    : 'border-gray-300'
                                } flex items-center justify-center`}>
                                  {makeFilter.includes(make) && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{make}</span>
                              </div>
                              <button className="w-6 h-6 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </button>
                          ))}
                        </div>
                      ));
                    })()}
                  </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => handleMakeFilterChange([])}
                  className="text-sm text-black hover:text-gray-700 font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={() => setMakeExpanded(false)}
                  className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Filter Popup Modal */}
      {priceExpanded && (
        <div 
          className="fixed inset-0 z-50 overflow-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)'
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Price</h3>
                <button
                  onClick={() => setPriceExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Options list */}
              <div className="max-h-80 overflow-y-auto">
                {[
                  { label: "Under $30,000", value: "30000" },
                  { label: "Under $50,000", value: "50000" },
                  { label: "Under $70,000", value: "70000" },
                  { label: "Under $100,000", value: "100000" },
                  { label: "Above $100,000", value: "above100000" },
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleFilter(opt.value, "price", priceFilter)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border-2 rounded ${
                        priceFilter.includes(opt.value) 
                          ? 'bg-black border-black' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {priceFilter.includes(opt.value) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                    </div>
                    <button className="w-6 h-6 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </button>
                ))}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setPriceFilter([])}
                  className="text-sm text-black hover:text-gray-700 font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={() => setPriceExpanded(false)}
                  className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transmission Filter Popup Modal */}
      {transmissionExpanded && (
        <div 
          className="fixed inset-0 z-50 overflow-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)'
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Transmission</h3>
                <button
                  onClick={() => setTransmissionExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Options list */}
              <div className="max-h-80 overflow-y-auto">
                {filterOptions.transmissions.map((transmission, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleFilter(transmission, "transmission", transmissionFilter)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border-2 rounded ${
                        transmissionFilter.includes(transmission) 
                          ? 'bg-black border-black' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {transmissionFilter.includes(transmission) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{transmission}</span>
                    </div>
                    <button className="w-6 h-6 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </button>
                ))}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <button
                  className="text-sm text-black hover:text-gray-700 font-medium"
                  onClick={() => setTransmissionFilter([])}
                >
                  Clear
                </button>
                <button
                  onClick={() => setTransmissionExpanded(false)}
                  className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Body Type Filter Popup Modal */}
      {bodyTypeExpanded && (
        <div 
          className="fixed inset-0 z-50 overflow-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)'
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Body Type</h3>
                <button
                  onClick={() => setBodyTypeExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Options list */}
              <div className="max-h-80 overflow-y-auto">
                {filterOptions.bodyTypes.map((bodyType, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleFilter(bodyType, "bodyType", bodyTypeFilter)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border-2 rounded ${
                        bodyTypeFilter.includes(bodyType) 
                          ? 'bg-black border-black' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {bodyTypeFilter.includes(bodyType) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{bodyType}</span>
                    </div>
                    <button className="w-6 h-6 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </button>
                ))}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setBodyTypeFilter([])}
                  className="text-sm text-black hover:text-gray-700 font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={() => setBodyTypeExpanded(false)}
                  className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drive Type Filter Popup Modal */}
      {driveTypeExpanded && (
        <div 
          className="fixed inset-0 z-50 overflow-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)'
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Drive Type</h3>
                <button
                  onClick={() => setDriveTypeExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Options list */}
              <div className="max-h-80 overflow-y-auto">
                {filterOptions.driveTypes.map((driveType, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleFilter(driveType, "driveType", driveTypeFilter)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border-2 rounded ${
                        driveTypeFilter.includes(driveType) 
                          ? 'bg-black border-black' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {driveTypeFilter.includes(driveType) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{driveType}</span>
                    </div>
                    <button className="w-6 h-6 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </button>
                ))}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setDriveTypeFilter([])}
                  className="text-sm text-black hover:text-gray-700 font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={() => setDriveTypeExpanded(false)}
                  className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fuel Filter Popup Modal */}
      {fuelExpanded && (
        <div 
          className="fixed inset-0 z-50 overflow-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)'
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Fuel Type</h3>
                <button
                  onClick={() => setFuelExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Options list */}
              <div className="max-h-80 overflow-y-auto">
                {filterOptions.fuels.map((fuel, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleFilter(fuel, "fuel", fuelFilter)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border-2 rounded ${
                        fuelFilter.includes(fuel) 
                          ? 'bg-black border-black' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {fuelFilter.includes(fuel) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{fuel}</span>
                    </div>
                    <button className="w-6 h-6 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </button>
                ))}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setFuelFilter([])}
                  className="text-sm text-black hover:text-gray-700 font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={() => setFuelExpanded(false)}
                  className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowsePage;

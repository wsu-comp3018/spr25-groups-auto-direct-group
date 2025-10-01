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
const PRICE_OPTIONS = [
  { label: "Under $30,000", value: "30000" },
  { label: "Under $50,000", value: "50000" },
  { label: "Under $70,000", value: "70000" },
  { label: "Under $100,000", value: "100000" },
  { label: "Above $100,000", value: "above-100000" },
];
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
  const [transmissionExpanded, setTransmissionExpanded] = useState(false);
  const [bodyTypeExpanded, setBodyTypeExpanded] = useState(false);
  const [isMakeModalOpen, setIsMakeModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isTransmissionModalOpen, setIsTransmissionModalOpen] = useState(false);
  const [isBodyTypeModalOpen, setIsBodyTypeModalOpen] = useState(false);
  const [isDriveTypeModalOpen, setIsDriveTypeModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);


  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    transmissions: [],
    bodyTypes: [],
    fuels: [],
    driveTypes: [],
  });

  const [favourites, setFavourites] = useState([]);

  const handleToggleFavourite = async (vehicleID) => {
    const isCurrentlyFavourite = favourites.includes(vehicleID);

    if (token && userID) {
      // User is signed in - use API
      let route;
      let method;
      let bodyData = { userID, vehicleID };

      // Handle route depending on if the vehicle is a favourite or not
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
          throw new Error("Unable to toggle favourite");
        }

        setFavourites((prev) =>
          isCurrentlyFavourite
            ? prev.filter((x) => x !== vehicleID)
            : [...prev, vehicleID]
        );
        console.log(`Vehicle saved successfully.`);
      } catch (error) {
        console.error("Error toggling favourite:", error);
      }
    } else {
      // Guest user - use localStorage
      const guestFavourites = JSON.parse(localStorage.getItem('guestFavourites') || '[]');
      
      if (isCurrentlyFavourite) {
        // Remove from favourites
        const updatedFavourites = guestFavourites.filter((id) => id !== vehicleID);
        localStorage.setItem('guestFavourites', JSON.stringify(updatedFavourites));
        setFavourites(updatedFavourites);
      } else {
        // Add to favourites
        const updatedFavourites = [...guestFavourites, vehicleID];
        localStorage.setItem('guestFavourites', JSON.stringify(updatedFavourites));
        setFavourites(updatedFavourites);
      }
      console.log(`Vehicle ${isCurrentlyFavourite ? 'removed from' : 'added to'} guest favourites.`);
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
          makes: [...new Set(data.map((car) => car.makeName))],
          transmissions: [
            ...new Set([
              ...TRANSMISSION_OPTIONS,
              ...data.map((car) => car.transmission).filter(Boolean),
            ]),
          ],
          bodyTypes: [
            ...new Set([
              ...BODY_TYPE_OPTIONS,
              ...data.map((car) => car.bodyType).filter(Boolean),
            ]),
          ],
          fuels: [
            ...new Set([
              ...FUEL_OPTIONS,
              ...data.map((car) => car.fuel).filter(Boolean),
            ]),
          ],
          driveTypes: [
            ...new Set([
              ...DRIVE_TYPE_OPTIONS,
              ...data.map((car) => car.driveType).filter(Boolean),
            ]),
          ],
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
    if (token && userID) {
      // User is signed in - fetch from API
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
    } else {
      // Guest user - load from localStorage
      const guestFavourites = JSON.parse(localStorage.getItem('guestFavourites') || '[]');
      setFavourites(guestFavourites);
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
            
            {/* Make Filter */}
            <div>
              <button
                onClick={() => setIsMakeModalOpen(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">Make</span>
                  <span className="text-sm text-gray-500">
                    {makeFilter.length === 0 
                      ? "All makes" 
                      : makeFilter.length === 1 
                        ? makeFilter[0] 
                        : `${makeFilter.length} selected`
                    }
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {/* Price Filter */}
            <div>
              <button
                onClick={() => setIsPriceModalOpen(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">Price</span>
                  <span className="text-sm text-gray-500">
                    {priceFilter.length === 0 
                      ? "All prices" 
                      : priceFilter.length === 1 
                        ? PRICE_OPTIONS.find(opt => opt.value === priceFilter[0])?.label || priceFilter[0]
                        : `${priceFilter.length} selected`
                    }
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {/* Transmission Filter */}
            <div>
              <button
                onClick={() => setIsTransmissionModalOpen(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">Transmission</span>
                  <span className="text-sm text-gray-500">
                    {transmissionFilter.length === 0 
                      ? "All transmissions" 
                      : transmissionFilter.length === 1 
                        ? transmissionFilter[0] 
                        : `${transmissionFilter.length} selected`
                    }
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {/* Body Type Filter */}
            <div>
              <button
                onClick={() => setIsBodyTypeModalOpen(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">Body Type</span>
                  <span className="text-sm text-gray-500">
                    {bodyTypeFilter.length === 0 
                      ? "All body types" 
                      : bodyTypeFilter.length === 1 
                        ? bodyTypeFilter[0] 
                        : `${bodyTypeFilter.length} selected`
                    }
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {/* Drive Type Filter */}
            <div>
              <button
                onClick={() => setIsDriveTypeModalOpen(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">Drive Type</span>
                  <span className="text-sm text-gray-500">
                    {driveTypeFilter.length === 0 
                      ? "All drive types" 
                      : driveTypeFilter.length === 1 
                        ? driveTypeFilter[0] 
                        : `${driveTypeFilter.length} selected`
                    }
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {/* Fuel Filter */}
            <div>
              <button
                onClick={() => setIsFuelModalOpen(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">Fuel Type</span>
                  <span className="text-sm text-gray-500">
                    {fuelFilter.length === 0 
                      ? "All fuel types" 
                      : fuelFilter.length === 1 
                        ? fuelFilter[0] 
                        : `${fuelFilter.length} selected`
                    }
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transform hover:scale-[1.02] transition duration-300 flex flex-col h-[370px]"
                >
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
                      <div className="flex items-center space-x-2 px-1">
                        {/* Favourite button */}
                        <button
                          onClick={() => handleToggleFavourite(car.vehicleID)}
                          className={`p-2
                                  ${
                                    favourites.includes(car.vehicleID)
                                      ? "border-red-400"
                                      : "border-gray-200"
                                  }`}
                          aria-label="Favourite"
                        >
                          <Heart
                            className={`w-5 h-5 transition
                              ${
                                favourites.includes(car.vehicleID)
                                  ? "text-red-600 fill-red-600"
                                  : "text-gray-500"
                              }`}
                            fill={
                              favourites.includes(car.vehicleID)
                                ? "currentColour"
                                : "none"
                            }
                          />
                        </button>
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

      {/* Filter Modals */}
      <MakeFilterModal
        isOpen={isMakeModalOpen}
        onClose={() => setIsMakeModalOpen(false)}
        makes={filterOptions.makes}
        selectedMakes={makeFilter}
        onSelectionChange={handleMakeFilterChange}
      />
      
      <PriceFilterModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        priceOptions={PRICE_OPTIONS}
        selectedPrices={priceFilter}
        onSelectionChange={handlePriceFilterChange}
      />
      
      <TransmissionFilterModal
        isOpen={isTransmissionModalOpen}
        onClose={() => setIsTransmissionModalOpen(false)}
        transmissions={filterOptions.transmissions}
        selectedTransmissions={transmissionFilter}
        onSelectionChange={handleTransmissionFilterChange}
      />
      
      <BodyTypeFilterModal
        isOpen={isBodyTypeModalOpen}
        onClose={() => setIsBodyTypeModalOpen(false)}
        bodyTypes={filterOptions.bodyTypes}
        selectedBodyTypes={bodyTypeFilter}
        onSelectionChange={handleBodyTypeFilterChange}
      />
      
      <DriveTypeFilterModal
        isOpen={isDriveTypeModalOpen}
        onClose={() => setIsDriveTypeModalOpen(false)}
        driveTypes={filterOptions.driveTypes}
        selectedDriveTypes={driveTypeFilter}
        onSelectionChange={handleDriveTypeFilterChange}
      />
      
      <FuelFilterModal
        isOpen={isFuelModalOpen}
        onClose={() => setIsFuelModalOpen(false)}
        fuels={filterOptions.fuels}
        selectedFuels={fuelFilter}
        onSelectionChange={handleFuelFilterChange}
      />
    </div>
  );
}

export default BrowsePage;

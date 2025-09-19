import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import Cookies from "js-cookie";
import api from "../data/api-calls";

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
  const [transmissionExpanded, setTransmissionExpanded] = useState(false);
  const [bodyTypeExpanded, setBodyTypeExpanded] = useState(false);


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
      alert("Please sign in to save vehicles.");
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
            {/* Make Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Make</p>
              <div className="space-y-1 max-h-50 overflow-y-auto">
                {filterOptions.makes.map((make, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={makeFilter.includes(make)}
                      onChange={() => toggleFilter(make, "make", makeFilter)}
                    />
                    <span className="text-gray-700">{make}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Price Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Price</p>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {[
                  { label: "Under $30,000", value: "30000" },
                  { label: "Under $50,000", value: "50000" },
                  { label: "Under $70,000", value: "70000" },
                ].map((opt, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={priceFilter.includes(opt.value)}
                      onChange={() =>
                        toggleFilter(opt.value, "price", priceFilter)
                      }
                    />
                    <span className="text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Transmission Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Transmission
              </p>
                  <div className="space-y-1 max-h-50 overflow-y-auto">
                    {(transmissionExpanded ? filterOptions.transmissions : filterOptions.transmissions.slice(0, 5)).map((type, idx) => (
                      <label key={idx} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={transmissionFilter.includes(type)}
                          onChange={() => toggleFilter(type, "transmission", transmissionFilter)}
                        />
                        <span className="text-gray-700">{type}</span>
                      </label>
                    ))}
                    {filterOptions.transmissions.length > 5 && (
                      <button
                        className="flex items-center text-sm text-blue-600 hover:underline mt-1"
                        onClick={() => setTransmissionExpanded((prev) => !prev)}
                        type="button"
                      >
                        {transmissionExpanded ? (
                          <>
                            Show Less
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 15l-7-7-7 7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            Show More
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
            </div>
            {/* Body Type Filter */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Body Type
            </p>
            <div className="space-y-1 overflow-y-auto">
              {(bodyTypeExpanded
                ? filterOptions.bodyTypes
                : filterOptions.bodyTypes.slice(0, 5)
              ).map((type, idx) => (
                <label key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={bodyTypeFilter.includes(type)}
                    onChange={() =>
                      toggleFilter(type, "bodyType", bodyTypeFilter)
                    }
                  />
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
              {filterOptions.bodyTypes.length > 5 && (
                <button
                  className="flex items-center text-sm text-black-600 hover:underline mt-1"
                  onClick={() => setBodyTypeExpanded((prev) => !prev)}
                  type="button"
                >
                  {bodyTypeExpanded ? (
                    <>
                      Show Less
                      {/* Up Arrow */}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 15l-7-7-7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Show More
                      {/* Down Arrow */}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
            {/* Drive Type Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Drive Type
              </p>
              <div className="space-y-1  overflow-y-auto">
                {filterOptions.driveTypes.map((type, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={driveTypeFilter.includes(type)}
                      onChange={() =>
                        toggleFilter(type, "driveType", driveTypeFilter)
                      }
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Fuel Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Fuel Type
              </p>
              <div className="space-y-1  overflow-y-auto">
                {filterOptions.fuels.map((type, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={fuelFilter.includes(type)}
                      onChange={() => toggleFilter(type, "fuel", fuelFilter)}
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
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
                        {/* New Save Heart (browse) */}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveViaHeart(car.vehicleID); }}
                          disabled={isSavingId === car.vehicleID}
                          className={`p-2 rounded-full border transition ${
                            favourites.includes(car.vehicleID) ? 'bg-red-100 border-red-400 hover:bg-red-200' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                          } ${isSavingId === car.vehicleID ? 'opacity-50 cursor-not-allowed' : ''}`}
                          aria-label="Save to favourites"
                          title={favourites.includes(car.vehicleID) ? 'Saved' : 'Save to favourites'}
                        >
                          <Heart className={`w-5 h-5 ${favourites.includes(car.vehicleID) ? 'text-red-600 fill-red-600' : 'text-gray-600'}`} />
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
    </div>
  );
}

export default BrowsePage;

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import Cookies from 'js-cookie';
import api from "../data/api-calls";

function SavedCarsPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const userID = Cookies.get("auto-direct-userID");
  const token = Cookies.get('auto-direct-token');
  const [favourites, setFavourites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Comparison state
  const [compareVehicles, setCompareVehicles] = useState([]); // array of car objects
  const [compareNotes, setCompareNotes] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Retrieved saved cars for th user

  useEffect(() => {
    const fetchSavedCars = async () => {
      try {

        if (!token) {
          setCars([]);
          return;
        }

        const res = await fetch(api + "/vehicle/saved-vehicles/", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();
        setCars(data);
        setFavourites(data.map(car => car.vehicleID));

      } catch (err) {
        console.error("Failed to fetch saved vehicles:", err);
        setCars([]);
      }
    };

    fetchSavedCars();
  }, []);

  // Clicking the heart unsaves the vehicle and reloads the page

  const handleToggleFavourite = async (vehicleID) => {
    if (!userID) {
      console.warn("User ID not found. Cannot remove favourite.");
      return;
    }

    if (!token) {
      console.warn("Auth token not found. Cannot remove favourite.");
      return;
    }

    try {
      const route = api + `/vehicle/save-vehicle/remove`;
      const method = 'POST';

      const response = await fetch(route, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userID, vehicleID })
      });

      if (!response.ok) {
        throw new Error("Error unsaving vehicle");
      }

      console.log(`Vehicle ${vehicleID} successfully removed.`);
      window.location.reload();

    } catch (error) {
      console.error('Error removing favourite:', error);
    }
  };


  // Pagination logic
  const totalPages = Math.ceil(cars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = cars.slice(startIndex, startIndex + itemsPerPage);

  // Drag and Drop helpers
  const handleDragStart = (e, vehicleID) => {
    e.dataTransfer.setData('text/plain', vehicleID);
  };

  const handleDropToCompare = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const vehicleID = e.dataTransfer.getData('text/plain');
    if (!vehicleID) return;
    const carToAdd = cars.find(c => c.vehicleID === vehicleID);
    if (!carToAdd) return;
    setCompareVehicles(prev => {
      if (prev.some(c => c.vehicleID === vehicleID)) return prev;
      if (prev.length >= 3) return prev; // max 3
      return [...prev, carToAdd];
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (compareVehicles.length < 3) setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const removeFromCompare = (vehicleID) => {
    setCompareVehicles(prev => prev.filter(c => c.vehicleID !== vehicleID));
  };

  const sendComparisonRequest = async () => {
    if (compareVehicles.length < 2 || compareVehicles.length > 3) {
      window.toast.warning('Please add 2 or 3 vehicles to compare.');
      return;
    }
    
    try {
      // Use the same token source as the rest of the page (cookies)
      const authToken = token; // Already defined at the top using Cookies.get('auto-direct-token')
      const currentUserID = userID; // Already defined at the top using Cookies.get("auto-direct-userID")
      
      if (!authToken) {
        window.toast.warning('Please log in to submit a comparison request.');
        return;
      }

      const comparisonData = {
        primaryVehicleID: compareVehicles[0].vehicleID,
        secondaryVehicleID: compareVehicles[1]?.vehicleID || null,
        tertiaryVehicleID: compareVehicles[2]?.vehicleID || null,
        requestType: 'Vehicle Comparison',
        customerNotes: compareNotes || `Comparison request for: ${compareVehicles.map(c => `${c.makeName} ${c.modelName}`).join(', ')}`
      };

      const res = await fetch(api + '/vehicle-comparison/submit-comparison', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(comparisonData)
      });

      const result = await res.json();
      
      if (!res.ok) {
        console.error('Backend error:', result);
        throw new Error(result.error || `Server returned ${res.status}: ${res.statusText}`);
      }
      
      window.toast.success('Thank you! Your vehicle comparison request has been submitted and our team will prepare a detailed comparison for you.');
      setCompareVehicles([]);
      setCompareNotes("");
    } catch (err) {
      console.error('Comparison request error:', err);
      window.toast.error(`Could not send comparison request: ${err.message}. Please check console for details.`);
    }
  };

  return (
    <div className="p-8 pt-20 max-w-7xl mx-auto text-black">
    <div className="mb-6">
      <h2 className="text-3xl font-bold">My Saved Cars</h2>
      <p className="text-sm text-gray-500 mt-1">Easily revisit your favourites and request a professional comparison.</p>
    </div>
      <div className="grid grid-cols-1">
        {/* Vehicle Listings */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[420px]">
            {paginatedCars.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-lg my-auto">
                You haven't saved any vehicles yet! You can save a vehicle by selecting the heart icon in the listing.
                <div className="mt-3">
                  <Link to="/browse" className="inline-block px-4 py-2 rounded border border-black text-black hover:bg-black hover:text-white text-sm">Browse Cars</Link>
                </div>
              </div>
            ) : (
              paginatedCars.map(car => (
                <div
                  key={car.vehicleID}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transform hover:scale-[1.02] transition duration-300 flex flex-col h-[370px]"
                  draggable
                  onDragStart={(e) => handleDragStart(e, car.vehicleID)}
                >
                  <Link to={`/car/${car.vehicleID}`} className="relative w-full h-56 overflow-hidden">
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
                    <p className="text-sm text-gray-500 mb-3">{car.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{car.bodyType}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{car.transmission}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{car.fuel}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-xl font-bold">
                        {new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(car.price)}
                      </p>
                      <div className="flex items-center space-x-2 px-1">
                        {/* Favourite button */}
                        <button
                          onClick={() => handleToggleFavourite(car.vehicleID)}
                          className={`p-2`}
                        >
                          <Heart
                            className={`w-5 h-5 transition
                              ${favourites.includes(car.vehicleID) 
                                ? 'text-red-600 fill-red-600' 
                                : 'text-gray-500'}`}
                            fill={favourites.includes(car.vehicleID) ? "currentColour" : "none"}
                          />
                        </button>
                        {/* Test drive button */}
                        <button
                          onClick={() => navigate(`/car/${car.vehicleID}`, { state: { car, testDriveClicked: true } })}
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
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
              >
                &#187;
              </button>
            </div>
          )}

          {/* Vehicle Comparison Section */}
          <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Vehicle Comparison</h3>
                <p className="text-sm text-gray-500">Drag cars into this box to compare up to 3 vehicles, then send to our experts.</p>
              </div>
              <div className="text-xs text-gray-600">{compareVehicles.length} / 3 selected</div>
            </div>
            <div className="p-5">
              {/* Drop Area */}
              <div
                onDrop={handleDropToCompare}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`min-h-[140px] rounded-md border-2 border-dashed flex flex-col gap-3 p-4 transition-colors ${
                  compareVehicles.length >= 3 ? 'border-gray-300 bg-gray-50' : isDragOver ? 'border-black bg-gray-100' : 'border-gray-300 bg-gray-50'
                }`}
              >
                {compareVehicles.length === 0 ? (
                  <div className="text-gray-500 text-sm">Drop saved vehicles here…</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {compareVehicles.map(cv => (
                      <div key={cv.vehicleID} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1">
                        <img src={api + `/vehicle-images/${cv.mainImage}`} alt={cv.modelName} className="w-10 h-8 object-cover rounded" />
                        <span className="text-sm text-gray-800">{cv.makeName} {cv.modelName}</span>
                        <button onClick={() => removeFromCompare(cv.vehicleID)} className="text-xs text-gray-500 hover:text-black">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  className="mt-3 w-full min-h-[100px] border border-gray-300 rounded p-2 text-sm bg-white"
                  placeholder="Add any notes or priorities (e.g. safety, towing, tech)"
                  value={compareNotes}
                  onChange={(e) => setCompareNotes(e.target.value)}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Pick 2–3 vehicles. Drag from your saved cars above.</span>
                <button
                  onClick={sendComparisonRequest}
                  disabled={compareVehicles.length < 2 || compareVehicles.length > 3}
                  className={`text-sm px-4 py-1.5 rounded border ${
                    compareVehicles.length < 2 || compareVehicles.length > 3
                      ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-white hover:text-black border-black'
                  }`}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedCarsPage;
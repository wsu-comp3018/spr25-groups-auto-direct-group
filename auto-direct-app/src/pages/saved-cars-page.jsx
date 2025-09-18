import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import Cookies from 'js-cookie';
import api from "../data/api-calls";

function SavedCarsPage() {
  const [cars, setCars] = useState([]);
  const userID = Cookies.get("auto-direct-userID");
  const token = Cookies.get('auto-direct-token');
  const [favourites, setFavourites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
            'Authorization': token
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
          'Authorization': token
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

  return (
    <div className="p-8 pt-20 max-w-7xl mx-auto text-black">
    <h2 className="text-3xl font-bold mb-6">My Saved Cars</h2>
      <div className="grid grid-cols-1">
        {/* Vehicle Listings */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]">
            {paginatedCars.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-lg my-auto">
                You haven't saved any vehicles yet! You can save a vehicle by selecting the heart icon in the listing.
              </div>
            ) : (
              paginatedCars.map(car => (
                <div
                  key={car.vehicleID}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transform hover:scale-[1.02] transition duration-300 flex flex-col h-[370px]"
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
        </div>
      </div>
    </div>
  );
}

export default SavedCarsPage;
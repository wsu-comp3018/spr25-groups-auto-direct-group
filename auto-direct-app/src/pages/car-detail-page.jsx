import { useState, useEffect } from "react";
import { useParams } from "react-router";
import cars from "../data/carData";
import getImageUrl from "../components/getImageUrl";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../data/api-calls";

import BookingTestDrive from "./booking-test-drive";

function CarDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [car, setCar] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const userID = Cookies.get("auto-direct-userID");
  const token = Cookies.get("auto-direct-token");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Toggle save/unsave via heart, silent and without redirect
  const handleSaveViaHeart = async () => {
    if (!token || !userID) {
      window.toast.warning('Please sign in to save vehicles.');
      return;
    }
    if (!car?.vehicleID || isSaving) return;
    setIsSaving(true);
    try {
      if (favourites.includes(car.vehicleID)) {
        // Unsave
        const res = await fetch(api + `/vehicle/save-vehicle/remove`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': token },
          body: JSON.stringify({ userID, vehicleID: car.vehicleID })
        });
        if (!res.ok) {
          console.warn('Unsave response status:', res.status);
        }
        setFavourites((prev) => prev.filter((x) => x !== car.vehicleID));
      } else {
        // Save
        const res = await fetch(api + `/vehicle/save-vehicle/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': token },
          body: JSON.stringify({ userID, vehicleID: car.vehicleID })
        });
        if (!res.ok) {
          console.warn('Save response status:', res.status);
        }
        setFavourites((prev) => (prev.includes(car.vehicleID) ? prev : [...prev, car.vehicleID]));
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // State for modals
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAdviceForm, setShowAdviceForm] = useState(false);
  const [adviceForm, setAdviceForm] = useState({
    message: "",
  });
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({ email: "", notes: "" });

  // Fetch car info on mount or when ID changes
  useEffect(() => {
    fetch(api + `/vehicle/vehicle-information/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data.vehicle);
        setImages(data.images);
      })
      .catch((err) => console.error("Error fetching car:", err));
  }, [id]);

  // Fetch the if the vehicle has been saved by the user
  useEffect(() => {
    const fetchSavedVehicles = async () => {
      if (token && userID) {
        // Only fetch if user is logged in and userID is available
        try {
          const savedVehiclesRes = await fetch(
            api + `/vehicle/saved-vehicles/`,
            {
              headers: {
                Authorization: token,
                UserID: userID,
              },
            }
          );
          if (!savedVehiclesRes.ok) {
            // Log a warning if saved vehicles can't be fetched (e.g., token invalid, user not found)
            console.warn(
              "Could not fetch saved vehicles for initial favorite state. User might not be logged in or token is invalid.",
              savedVehiclesRes.status
            );
            setFavourites([]); // Ensure favorites are empty if fetch fails
            return;
          }
          const savedVehiclesData = await savedVehiclesRes.json();
          // Assuming savedVehiclesData is an array of objects, each with a vehicleID
          setFavourites(savedVehiclesData.map((sv) => sv.vehicleID));
        } catch (err) {
          console.error("Error fetching initial saved vehicles:", err);
          setFavourites([]);
        }
      } else {
        setFavourites([]); // No user, no token, or no userID, so no favorites
      }
    };

    fetchSavedVehicles();
  }, [userID, token]);

  useEffect(() => {
    if (location.state && location.state.testDriveClicked) {
      setShowBookingForm(true);
    }
  }, [location.state]);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
      if (isLightboxOpen) {
        if (e.key === "ArrowLeft") {
          handlePrev();
        } else if (e.key === "ArrowRight") {
          handleNext();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, currentImageIndex, images.length]);

  if (!car) return <div className="p-8">Car not found.</div>;

  // Format car.price for AUD
  const priceFormat = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(car.price);

  const handlePrev = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const handleThumbnailClick = (i) => setCurrentImageIndex(i);

  // Removed separate Save button - heart icon handles save and navigation

  // Open lightbox when clicking main image
  const handleImageClick = () => {
    setIsLightboxOpen(true);
  };

  // Removed old booking handlers, will use booking-test-drive component

  // Advice handlers
  const handleAdviceChange = (e) => {
    const { name, value } = e.target;
    setAdviceForm((p) => ({ ...p, [name]: value }));
  };
  const handleAdviceSubmit = (e) => {
    e.preventDefault();

    const adviceResponse = fetch(
      api + "/vehicle/request-advice",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester: userID,
          vehicleID: id,
          description: adviceForm.message,
        }),
      }
    );
    window.toast.success("Thank you! Your request for advice has been sent.");
    setAdviceForm({
      message: "",
    });
    setShowAdviceForm(false);
  };

  // Purchase handlers
  const handlePurchaseChange = (e) => {
    const { name, value } = e.target;
    setPurchaseForm((p) => ({ ...p, [name]: value }));
  };
  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    setPurchaseForm({ email: "" });
	
	fetch(api + '/purchases/purchase', {
		method: 'POST', 
		headers: {"Content-Type": "application/json", 'Authorization': token}, 
		body: JSON.stringify({vehicleID: car.vehicleID, notes: purchaseForm.notes})
	})
	.then((res) => {
		let data = res.json();
		if(res.status != 200) { 
			window.toast.error('Purchase error: ' + data.error);
			return;
		}
	})
    window.toast.success(
      `Thank you! We'll contact you at ${purchaseForm.email} to complete your purchase.`
    );
    setShowPurchaseForm(false);
  };

  const similarCars = cars
    .filter((c) => c.id !== car.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="p-8 max-w-6xl mx-auto pt-20 space-y-16">
        <div className="relative mb-3 flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 px-2 py-2 bg-white  hover:bg-gray-100 transition text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
        </div>
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image Carousel */}
        <div className="relative w-full">
          <img
            src={api + `/vehicle-images/${images[currentImageIndex]?.path}`}
            alt={car.name}
            className="w-full h-[400px] object-cover rounded-xl shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handleImageClick}
          />
          <button
            onClick={handlePrev}
            className="absolute top-0 left-0 w-[10%] h-full flex items-center justify-start hover:bg-black/10 transition"
          >
            <div className="bg-white/60 rounded-full p-2 m-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </button>
          <button
            onClick={handleNext}
            className="absolute top-0 right-0 w-[10%] h-full flex items-center justify-end hover:bg-black/10 transition"
          >
            <div className="bg-white/60 rounded-full p-2 m-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={api + `/vehicle-images/${img.path}`}
                alt={`Thumb ${idx + 1}`}
                onClick={() => handleThumbnailClick(idx)}
                className={`w-20 h-14 object-cover rounded cursor-pointer border ${
                  idx === currentImageIndex
                    ? "border-blue-500 ring-2 ring-blue-400"
                    : "border-gray-300 hover:border-gray-500"
                } transition`}
              />
            ))}
          </div>
        </div>

        {/* Car Info + Actions */}
        <div className="pt-4 space-y-4 text-left">
          <div className="flex items-center justify-between">
            {/* Title */}
            <h2 className="text-4xl font-bold text-gray-900">
              {`${car.makeName} ${car.modelName}`}
            </h2>
            {/* New Save Heart */}
            <button
              onClick={handleSaveViaHeart}
              disabled={isSaving}
              type="button"
              className={`p-2 rounded-full border transition ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} ${favourites.includes(car.vehicleID) ? 'bg-red-100 border-red-400' : 'border-gray-200'}`}
              aria-label="Save to favourites"
              title="Save to favourites"
            >
              <Heart className={`w-6 h-6 ${favourites.includes(car.vehicleID) ? 'text-red-600 fill-red-600' : 'text-gray-700'}`}/>
            </button>
          </div>

          <p className="text-md text-black leading-relaxed">
            {car.description}
          </p>

          <p className="text-3xl text-black font-bold mt-4">{priceFormat}</p>

          <div className="mt-8 space-y-4">
            {[
              { label: "Transmission", value: car.transmission },
              { label: "Drive Type", value: car.driveType },
              { label: "Body Type", value: car.bodyType },
            ].map((it, i) => (
              <div key={i} className="flex justify-between border-b pb-2">
                <span className="text-gray-500">{it.label}</span>
                <span className="font-medium text-gray-800">
                  {it.value || "N/A"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-1 flex-wrap">
            <button
              onClick={() => {
                // Set vehicle field to car's full name before opening modal
                if (car) {
                  window.selectedCarName = `${car.makeName || ""} ${car.modelName || ""}`.trim();
                }
                setShowBookingForm(true);
              }}
              className="bg-transparent border-2 border-black text-black font-semibold py-2 px-6 rounded-lg  transition hover:bg-black hover:text-white flex-1"
            >
              Book Test Drive
            </button>
            <button
              onClick={() => setShowAdviceForm(true)}
              className="bg-transparent border-2 border-black text-black font-semibold py-2 px-6 rounded-lg  transition hover:bg-black hover:text-white flex-1"
            >
              Request Advice
            </button>
            <button
              onClick={() => setShowPurchaseForm(true)}
              className="bg-black border-2 border-black text-white font-semibold py-2 px-6 rounded-lg  transition hover:bg-black hover:text-white flex-1"
            >
              Purchase
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-7xl max-h-full p-4">
            {/* Close button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-6 -right-6 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Main lightbox image */}
            <img
              src={api + `/vehicle-images/${images[currentImageIndex]?.path}`}
              alt={car.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation arrows for lightbox */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Thumbnail navigation in lightbox */}
            {images.length > 1 && (
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex max-w-max w-full gap-2 px-4">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={api + `/vehicle-images/${img.path}`}
                    alt={`Thumb ${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailClick(idx);
                    }}
                    className={`w-16 h-12 object-cover rounded cursor-pointer border-2 transition ${
                      idx === currentImageIndex
                        ? "border-white opacity-100"
                        : "border-transparent opacity-60 hover:opacity-80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overview */}
      <div className="border border-gray-50 rounded-md p-6 bg-white">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Vehicle Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          {[
            { label: "Make", value: car.makeName, icon: "make.svg" },
            { label: "Model Name", value: car.modelName, icon: "model.svg" },
            { label: "Body Type", value: car.bodyType, icon: "body.svg" },
            { label: "Fuel", value: car.fuel, icon: "fuel.svg" },
            { label: "Drive Type", value: car.driveType, icon: "drive.svg" },
            { label: "Cylinders", value: car.cylinders, icon: "engine.svg" },
            { label: "Doors", value: car.doors, icon: "doors.svg" },
            {
              label: "Transmission",
              value: car.transmission,
              icon: "transmission.svg",
            },
          ].map((it, i) => (
            <div key={i} className="flex items-center">
              <div className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center mr-2">
                <img
                  src={getImageUrl(`../../public/assets/icons/${it.icon}`)}
                  alt={it.label}
                  className="w-5 h-5"
                />
              </div>
              <span className="font-normal text-gray-800">{it.label}:</span>
              <span className="ml-auto font-medium text-gray-700">
                {it.value || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Test Drive Booking Modal */}

      {/* Booking Modal - replaced with booking-test-drive component */}
      {showBookingForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-3" onClick={() => setShowBookingForm(false)}>
          <div className="bg-transparent w-full max-w-3xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Integrate booking-test-drive component, pass car and thumbnail */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-none">
              <BookingTestDrive
                car={car}
                thumbnailPath={images[currentImageIndex]?.path || images[0]?.path}
                onClose={() => setShowBookingForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Advice Modal */}
      {showAdviceForm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setShowAdviceForm(false)}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-semibold text-center mb-8">
              Ask a question about {car.makeName} {car.modelName}
            </h3>
            <form onSubmit={handleAdviceSubmit} className="space-y-5">
              <textarea
                name="message"
                rows={4}
                required
                value={adviceForm.message}
                onChange={handleAdviceChange}
                placeholder="Ask a question about this vehicle and a friendly staff member from Auto's Direct will get back to you shortly."
                className="w-full border rounded p-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdviceForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded hover:bg-white hover:text-black border font-semibold text-lg"
                >
                  Send
                </button>
              </div>
            </form>
            <div className="text-xs text-gray-500 mt-4">
              Disclaimer: By clicking the 'Send Message' button you acknowledge
              you have read and agree to abide by the Auto Direct{" "}
              <Link to="#" className="text-blue-600 underline">
                Privacy Policy
              </Link>
              . When you use this enquiry form your contact details will be
              forwarded to the seller so they can contact you directly.
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseForm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setShowPurchaseForm(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Purchase Vehicle</h3>
            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              <textarea
                name="notes"
                value={purchaseForm.notes || ""}
                onChange={handlePurchaseChange}
                placeholder="Additional notes (optional)"
                className="w-full border p-2 rounded min-h-[250px] "
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPurchaseForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded hover:bg-white hover:text-black border font-semibold text-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarDetailPage;

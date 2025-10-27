import { useState, useEffect } from "react";
import { useParams } from "react-router";
import cars from "../data/carData";
import getImageUrl from "../components/getImageUrl";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../data/api-calls";
import PurchaseStepper from "../components/PurchaseStepper";
import { autoFillForm, fieldMappings } from "../utils/autoFillUtils";
import PurchaseConfirmationModal from "../components/PurchaseConfirmationModal";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { toast } from 'react-toastify';

import BookingTestDrive from "./booking-test-drive";

function CarDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [car, setCar] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dealerships, setDealerships] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [manufacturerDetails, setManufacturerDetails] = useState(null);
  const [loadingManufacturerDetails, setLoadingManufacturerDetails] = useState(false);
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
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    customerNotes: "",
    date: "",
  });
  const [showAdviceForm, setShowAdviceForm] = useState(false);
  const [adviceForm, setAdviceForm] = useState({
    message: "",
  });
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [orderID, setOrderID] = useState("");
  const [showPurchaseConfirmation, setShowPurchaseConfirmation] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [showAdminPayment, setShowAdminPayment] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({ 
    // Contact information
    firstName: "",
    lastName: "",
    email: "", 
    confirmEmail: "",
    phone: "+61 ",
    // Address
    streetNumber: "",
    streetName: "",
    suburb: "",
    state: "",
    postcode: "",
    // License Details
    licenseNumber: "",
    licenseName: "",
    // Purchase options
    paymentMethod: "",
    financing: false,
    tradeIn: false,
    // Additional notes
    notes: "" 
  });
  
  // Field validation state
  const [fieldErrors, setFieldErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    confirmEmail: false,
    phone: false,
    streetNumber: false,
    streetName: false,
    suburb: false,
    state: false,
    postcode: false,
    licenseNumber: false,
    licenseName: false,
    paymentMethod: false
  });
  
  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone) => {
    // Remove spaces and check if it starts with +61 and has proper length
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Should have +61 prefix and then 9 more digits (total 12 characters)
    return cleanPhone.startsWith('+61') && cleanPhone.length >= 12;
  };
  
  const validatePostcode = (postcode) => {
    const postcodeRegex = /^\d{4}$/;
    return postcodeRegex.test(postcode);
  };
  
  const validateLicenseNumber = (licenseNumber) => {
    return licenseNumber.length >= 5; // Minimum 5 characters for license
  };
  
  const validateRequired = (value) => {
    return value.trim().length > 0;
  };
  
  // Step-based validation functions
  const validateCurrentStep = () => {
    const errors = {};
    
    switch (currentPurchaseStep) {
      case 2: // Contact Information
        errors.firstName = !validateRequired(purchaseForm.firstName);
        errors.lastName = !validateRequired(purchaseForm.lastName);
        errors.email = !purchaseForm.email || !validateEmail(purchaseForm.email);
        errors.confirmEmail = !purchaseForm.confirmEmail || !validateEmail(purchaseForm.confirmEmail) || purchaseForm.email !== purchaseForm.confirmEmail;
        errors.phone = !purchaseForm.phone || !validatePhone(purchaseForm.phone);
        errors.streetNumber = !purchaseForm.streetNumber || isNaN(purchaseForm.streetNumber);
        errors.streetName = !validateRequired(purchaseForm.streetName);
        errors.suburb = !validateRequired(purchaseForm.suburb);
        errors.state = !validateRequired(purchaseForm.state);
        errors.postcode = !purchaseForm.postcode || !validatePostcode(purchaseForm.postcode);
        errors.licenseNumber = !purchaseForm.licenseNumber || !validateLicenseNumber(purchaseForm.licenseNumber);
        errors.licenseName = !validateRequired(purchaseForm.licenseName);
        break;
      case 3: // Purchase Options
        errors.paymentMethod = !purchaseForm.paymentMethod;
        break;
      default:
        // No validation needed for other steps
        break;
    }
    
    return errors;
  };
  
  const validateAllSteps = () => {
    const errors = {};
    
    // Contact Information
    errors.firstName = !validateRequired(purchaseForm.firstName);
    errors.lastName = !validateRequired(purchaseForm.lastName);
    errors.email = !purchaseForm.email || !validateEmail(purchaseForm.email);
    errors.confirmEmail = !purchaseForm.confirmEmail || !validateEmail(purchaseForm.confirmEmail) || purchaseForm.email !== purchaseForm.confirmEmail;
    errors.phone = !purchaseForm.phone || !validatePhone(purchaseForm.phone);
    errors.streetNumber = !purchaseForm.streetNumber || isNaN(purchaseForm.streetNumber);
    errors.streetName = !validateRequired(purchaseForm.streetName);
    errors.suburb = !validateRequired(purchaseForm.suburb);
    errors.state = !validateRequired(purchaseForm.state);
    errors.postcode = !purchaseForm.postcode || !validatePostcode(purchaseForm.postcode);
    errors.licenseNumber = !purchaseForm.licenseNumber || !validateLicenseNumber(purchaseForm.licenseNumber);
    errors.licenseName = !validateRequired(purchaseForm.licenseName);
    
    // Purchase Options
    errors.paymentMethod = !purchaseForm.paymentMethod;
    
    return errors;
  };
  
  // Purchase stepper state
  const [currentPurchaseStep, setCurrentPurchaseStep] = useState(1);
  const [purchaseSteps] = useState([
    { title: "Vehicle Review", description: "Confirm vehicle details" },
    { title: "Contact Information", description: "Your contact details" },
    { title: "Purchase Options", description: "Payment & financing" },
    { title: "Manufacturer Details", description: "Vehicle specifications" },
    { title: "Additional Notes", description: "Special requests" },
    { title: "Confirmation", description: "Review & submit" }
  ]);

  // Fetch manufacturers for mapping makeID to manufacturerID
  const fetchManufacturers = async () => {
    try {
      const response = await fetch(
        api + "/manage-dealerships/manufacturers-simple"
      );
      const data = await response.json();
      setManufacturers(data.manufacturers || []);
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  // Fetch dealerships from backend
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

  // Fetch detailed manufacturer information
  const fetchManufacturerDetails = async (makeID) => {
    if (!makeID) return;
    
    setLoadingManufacturerDetails(true);
    try {
      const response = await fetch(
        api + `/manage-dealerships/manufacturer-by-make/${makeID}`,
        {
          headers: {
            'Authorization': token
          }
        }
      );
      const data = await response.json();
      if (response.ok) {
        setManufacturerDetails(data.manufacturer || null);
      } else {
        console.error("Error fetching manufacturer details:", data.error);
      }
    } catch (error) {
      console.error("Error fetching manufacturer details:", error);
    } finally {
      setLoadingManufacturerDetails(false);
    }
  };

  // Fetch car info, dealerships, and manufacturers on mount or when ID changes
  useEffect(() => {
    fetch(api + `/vehicle/vehicle-information/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data.vehicle);
        setImages(data.images);
      })
      .catch((err) => console.error("Error fetching car:", err));

    fetchDealerships();
    fetchManufacturers();
  }, [id]);

  // Handle navigation state for completed purchase
  useEffect(() => {
    if (location.state?.purchaseCompleted) {
      setIsPurchased(true); // Set purchased state so button shows "Process Payment"
      if (location.state?.orderID) {
        setOrderID(location.state.orderID);
      }
      // Restore purchase form data if available
      if (location.state?.purchaseFormData) {
        console.log('🔄 Restoring purchase form data:', location.state.purchaseFormData);
        setPurchaseForm(location.state.purchaseFormData);
      }
      // Clear the state so it doesn't trigger again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch manufacturer details when reaching step 4
  useEffect(() => {
    if (currentPurchaseStep === 4 && car) {
      // Use the makeID from the vehicle to fetch manufacturer details
      if (car?.makeID) {
        fetchManufacturerDetails(car.makeID);
      }
    }
  }, [currentPurchaseStep, car]);

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
      handleTestDriveClick();
    }
  }, [location.state]);

  // Handle test drive button click with auto-fill
  const handleTestDriveClick = async () => {
    setShowBookingForm(true);
    // Auto-fill the test drive form with user data
    await autoFillForm(setBookingForm, fieldMappings.testDrive);
  };

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

  // Booking handlers
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((p) => ({ ...p, [name]: value }));
  };
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your test drive has been booked.");
    setBookingForm({ name: "", email: "", phone: "", customerNotes: "" });
    setShowBookingForm(false);
  };

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
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Special handling for phone field to preserve +61 prefix
    if (name === 'phone') {
      if (!newValue.startsWith('+61')) {
        newValue = '+61 ' + newValue.replace(/^\+?61\s*/, '');
      }
    }
    
    setPurchaseForm((p) => ({ 
      ...p, 
      [name]: newValue 
    }));
    
    // Clear field error when user starts typing (optional - provides immediate feedback when they fix the field)
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  // Purchase button click handler with authentication check
  const handlePurchaseClick = () => {
    // Debug authentication state
    console.log('🔍 Purchase click - Authentication check:');
    console.log('👤 UserID from cookie:', userID);
    console.log('🔑 Token from cookie:', token ? token.substring(0, 20) + '...' : null);
    console.log('🍪 All cookies:', document.cookie);
    
    // Check if user is logged in
    if (!token || !userID) {
      // User is not logged in, show toast and redirect to register page
      console.log('❌ Authentication failed - redirecting to register');
      toast.error(
        <div>
          Please create an account or{' '}
          <span 
            onClick={() => navigate("/login")} 
            style={{ 
              color: '#3b82f6', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              fontWeight: 'bold'
            }}
          >
            log in
          </span>
          {' '}to make a purchase.
        </div>
      );
      navigate("/register");
      return;
    }
    
    console.log('✅ Authentication passed - proceeding with purchase');
    
    // Check if car data exists
    if (!car) {
      toast.error("Vehicle data not available");
      return;
    }
    
    // User is logged in, open purchase flow page in a new window/tab
    console.log('Car data available:', car);
    console.log('Car vehicleID:', car?.vehicleID);
    
    if (!car?.vehicleID) {
      toast.error("Vehicle ID not available");
      return;
    }
    
    // Open purchase flow in new window/tab with car ID as URL parameter
    const purchaseUrl = `/purchase-flow?vehicleId=${car.vehicleID}`;
    console.log('Opening purchase URL:', purchaseUrl);
    const newWindow = window.open(purchaseUrl, '_blank');
    
    // Check if popup was blocked
    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
      // Popup was blocked, fall back to same tab navigation
      toast.warning("Popup blocked by browser. Opening purchase page in current tab.");
      navigate(`/purchase-flow?vehicleId=${car.vehicleID}`);
    }
  };

  // Handle moving from payment instructions to admin payment
  const handleNextStep = () => {
    console.log('🔄 Moving to admin payment step with purchase form data:', purchaseForm);
    console.log('📊 Customer data being passed:', {
      name: `${purchaseForm.firstName || ''} ${purchaseForm.lastName || ''}`.trim(),
      email: purchaseForm.email || '',
      phone: purchaseForm.phone || '',
      address: `${purchaseForm.streetNumber || ''} ${purchaseForm.streetName || ''}, ${purchaseForm.suburb || ''}, ${purchaseForm.state || ''} ${purchaseForm.postcode || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '').trim()
    });
    setShowPaymentInstructions(false);
    setShowAdminPayment(true);
  };

  // Purchase step navigation
  const nextPurchaseStep = () => {
    if (currentPurchaseStep < purchaseSteps.length) {
      setCurrentPurchaseStep(currentPurchaseStep + 1);
    }
  };

  const prevPurchaseStep = () => {
    if (currentPurchaseStep > 1) {
      setCurrentPurchaseStep(currentPurchaseStep - 1);
    }
  };

  const resetPurchaseForm = () => {
    setCurrentPurchaseStep(1);
    setPurchaseForm({
      firstName: "",
      lastName: "",
      email: "", 
      confirmEmail: "",
      phone: "+61 ",
      streetNumber: "",
      streetName: "",
      suburb: "",
      state: "",
      postcode: "",
      licenseNumber: "",
      licenseName: "",
      paymentMethod: "",
      financing: false,
      tradeIn: false,
      notes: "" 
    });
  };

  // Generate 10-digit order ID
  const generateOrderID = () => {
    // Get 3 letters from car make (e.g., "BRZ" -> "BRZ")
    const makeLetters = car?.makeName?.substring(0, 3).toUpperCase() || "CAR";
    
    // Get initials from customer name (e.g., "John Doe" -> "JD")
    const firstInitial = purchaseForm.firstName?.charAt(0).toUpperCase() || "J";
    const lastInitial = purchaseForm.lastName?.charAt(0).toUpperCase() || "D";
    
    // Generate 3-digit order number (random for now, could be sequential)
    const orderNumber = Math.floor(100 + Math.random() * 900); // 100-999
    
    // Get last 2 letters from manufacturer (e.g., "Volkswagen Group" -> "UP")
    const manufacturerName = manufacturerDetails?.manufacturerName || car?.makeName || "Unknown";
    const lastTwoLetters = manufacturerName.replace(/\s+/g, '').slice(-2).toUpperCase() || "CO";
    
    return `${makeLetters}${firstInitial}${lastInitial}${orderNumber}${lastTwoLetters}`;
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    
    if (currentPurchaseStep < purchaseSteps.length) {
      // Validate current step before proceeding
      const stepErrors = validateCurrentStep();
      
      if (Object.values(stepErrors).some(error => error)) {
        // Update field errors to show red outlines
        setFieldErrors(prev => ({ ...prev, ...stepErrors }));
        return;
      }
      
      // Clear any previous errors and proceed to next step
      setFieldErrors(prev => ({ ...prev, ...stepErrors }));
      nextPurchaseStep();
      return;
    }

    // Final submission - validate all required fields
    const allErrors = validateAllSteps();
    console.log('🧪 Form validation results:', allErrors);
    
    if (Object.values(allErrors).some(error => error)) {
      console.log('❌ Form validation failed, not submitting');
      setFieldErrors(allErrors);
      return;
    }

    console.log('✅ Form validation passed, submitting purchase...');
    console.log('📋 Purchase form data:', purchaseForm);
    console.log('🚗 Car data:', car);
    console.log('🏭 Manufacturer details:', manufacturerDetails);

    // Submit the form
    const newOrderID = generateOrderID();
    console.log('🆔 Generated Order ID:', newOrderID);
    
    const requestData = {
      vehicleID: car.vehicleID, 
      notes: purchaseForm.notes,
      orderID: newOrderID,
      customerDetails: {
        firstName: purchaseForm.firstName,
        lastName: purchaseForm.lastName,
        email: purchaseForm.email,
        phone: purchaseForm.phone,
        streetNumber: purchaseForm.streetNumber,
        streetName: purchaseForm.streetName,
        suburb: purchaseForm.suburb,
        state: purchaseForm.state,
        postcode: purchaseForm.postcode
      },
      vehicleDetails: {
        makeID: car.makeID,
        makeName: car.makeName,
        modelName: car.modelName,
        year: car.year,
        price: car.price,
        fuelType: car.fuelType,
        transmission: car.transmission,
        bodyType: car.bodyType,
        driveType: car.driveType,
        color: car.color,
        mileage: car.mileage
      },
      manufacturerDetails: manufacturerDetails
    };
    
    console.log('📤 Sending request to API:', requestData);
    
    fetch(api + '/purchases/purchase', {
      method: 'POST', 
      headers: {"Content-Type": "application/json", 'Authorization': token}, 
      body: JSON.stringify(requestData)
    })
    .then((res) => {
      console.log('📨 Received response from API:', res);
      console.log('📨 Response status:', res.status);
      
      let data = res.json();
      if(res.status != 200) { 
        console.log('❌ API returned error status:', res.status);
        window.alert('purchase error failed ' + data.error);
        return;
      }
      
      console.log('✅ Purchase successful!');
      // Navigate to purchase vehicle page with order data
      navigate('/purchase-vehicle', {
        state: {
          orderID: newOrderID,
          customerName: `${purchaseForm.firstName} ${purchaseForm.lastName}`,
          purchaseFormData: purchaseForm, // Pass complete form data
          vehicleDetails: {
            vehicleID: car.vehicleID,
            makeID: car.makeID,
            makeName: car.makeName,
            modelName: car.modelName,
            year: car.year,
            price: car.price,
            fuelType: car.fuelType,
            transmission: car.transmission,
            bodyType: car.bodyType,
            driveType: car.driveType,
            color: car.color,
            mileage: car.mileage
          },
          manufacturerDetails: manufacturerDetails
        }
      });
      resetPurchaseForm();
    })
    .catch((error) => {
      console.error('❌ Purchase submission error:', error);
      window.alert('An error occurred while submitting your purchase request. Please try again.');
    });
  };

  // Render purchase step content
  const renderPurchaseStepContent = () => {
    switch(currentPurchaseStep) {
      case 1: // Vehicle Review
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800">Vehicle Overview</h4>
            {car && (
              <div className="space-y-4">
                {/* Primary Vehicle Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-3">Basic Information</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Make & Model</p>
                      <p className="font-medium">{car.makeName} {car.modelName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-medium">{car.yearMade || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-medium text-green-600 text-lg">${car.price?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Colour</p>
                      <p className="font-medium">{car.colour || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-3">Technical Specifications</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Body Type</p>
                      <p className="font-medium">{car.bodyType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Transmission</p>
                      <p className="font-medium">{car.transmission || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fuel Type</p>
                      <p className="font-medium">{car.fuel || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Drive Type</p>
                      <p className="font-medium">{car.driveType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cylinders</p>
                      <p className="font-medium">{car.cylinders || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Doors</p>
                      <p className="font-medium">{car.doors || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Contact Information
        return (
          <div className="space-y-4 p-1">
            <h4 className="text-lg font-semibold text-gray-800">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={purchaseForm.firstName}
                  onChange={handlePurchaseChange}
                  className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                    fieldErrors.firstName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="John"
                />
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">First name is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={purchaseForm.lastName}
                  onChange={handlePurchaseChange}
                  className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                    fieldErrors.lastName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Smith"
                />
                {fieldErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">Last name is required</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={purchaseForm.email}
                onChange={handlePurchaseChange}
                className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                  fieldErrors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="john.smith@example.com"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Email Address
              </label>
              <input
                type="email"
                name="confirmEmail"
                value={purchaseForm.confirmEmail}
                onChange={handlePurchaseChange}
                className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                  fieldErrors.confirmEmail
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="john.smith@example.com"
              />
              {fieldErrors.confirmEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {!validateEmail(purchaseForm.confirmEmail) ? 'Please enter a valid email address' : 'Email addresses do not match'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={purchaseForm.phone}
                onChange={handlePurchaseChange}
                className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                  fieldErrors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="+61 4XX XXX XXX"
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid phone number (minimum 10 digits)</p>
              )}
            </div>

            {/* Address Section */}
            <div className="mt-6">
              <h5 className="text-md font-semibold text-gray-800 mb-4">Address</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Number
                  </label>
                  <input
                    type="text"
                    name="streetNumber"
                    value={purchaseForm.streetNumber}
                    onChange={handlePurchaseChange}
                    className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                      fieldErrors.streetNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="123"
                  />
                  {fieldErrors.streetNumber && (
                    <p className="text-red-500 text-sm mt-1">Please enter a valid street number</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Name
                  </label>
                  <input
                    type="text"
                    name="streetName"
                    value={purchaseForm.streetName}
                    onChange={handlePurchaseChange}
                    className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                      fieldErrors.streetName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Main Street"
                  />
                  {fieldErrors.streetName && (
                    <p className="text-red-500 text-sm mt-1">Street name is required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suburb
                  </label>
                  <input
                    type="text"
                    name="suburb"
                    value={purchaseForm.suburb}
                    onChange={handlePurchaseChange}
                    className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                      fieldErrors.suburb
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Sydney"
                  />
                  {fieldErrors.suburb && (
                    <p className="text-red-500 text-sm mt-1">Suburb is required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Territory
                  </label>
                  <select
                    name="state"
                    value={purchaseForm.state}
                    onChange={handlePurchaseChange}
                    className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                      fieldErrors.state
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select State/Territory</option>
                    <option value="NSW">New South Wales</option>
                    <option value="VIC">Victoria</option>
                    <option value="QLD">Queensland</option>
                    <option value="WA">Western Australia</option>
                    <option value="SA">South Australia</option>
                    <option value="TAS">Tasmania</option>
                    <option value="NT">Northern Territory</option>
                    <option value="ACT">Australian Capital Territory</option>
                  </select>
                  {fieldErrors.state && (
                    <p className="text-red-500 text-sm mt-1">State/Territory is required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postcode
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    value={purchaseForm.postcode}
                    onChange={handlePurchaseChange}
                    className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                      fieldErrors.postcode
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="2000"
                  />
                  {fieldErrors.postcode && (
                    <p className="text-red-500 text-sm mt-1">Please enter a valid 4-digit postcode</p>
                  )}
                </div>
              </div>
            </div>

            {/* License Details Section */}
            <div className="mt-6">
              <h5 className="text-md font-semibold text-gray-800 mb-4">License Details</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={purchaseForm.licenseNumber}
                    onChange={handlePurchaseChange}
                    className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                      fieldErrors.licenseNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="12345678"
                  />
                  {fieldErrors.licenseNumber && (
                    <p className="text-red-500 text-sm mt-1">License number must be at least 5 characters</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Name
                  </label>
                  <input
                    type="text"
                    name="licenseName"
                    value={purchaseForm.licenseName}
                    onChange={handlePurchaseChange}
                    className={`w-full border p-3 rounded focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                      fieldErrors.licenseName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Full Name on License"
                  />
                  {fieldErrors.licenseName && (
                    <p className="text-red-500 text-sm mt-1">License name is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Purchase Options
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800">Purchase Options</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Payment Method
              </label>
              <div className="grid grid-cols-1 gap-4">
                {/* Cash Payment Option */}
                <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                  purchaseForm.paymentMethod === 'cash'
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : fieldErrors.paymentMethod
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <div className="flex items-start">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={purchaseForm.paymentMethod === 'cash'}
                      onChange={handlePurchaseChange}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="text-lg font-medium text-gray-900">💰</span>
                        <span className="ml-2 text-base font-semibold text-gray-900">Cash Payment</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Pay the full amount upfront. No interest charges or monthly payments.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Financing Option */}
                <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                  purchaseForm.paymentMethod === 'financing'
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : fieldErrors.paymentMethod
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <div className="flex items-start">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="financing"
                      checked={purchaseForm.paymentMethod === 'financing'}
                      onChange={handlePurchaseChange}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="text-lg font-medium text-gray-900">🏦</span>
                        <span className="ml-2 text-base font-semibold text-gray-900">Financing</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Spread payments over time with competitive interest rates and flexible terms.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              
              {fieldErrors.paymentMethod && (
                <p className="text-red-500 text-sm mt-3 flex items-center">
                  <span className="mr-1">⚠️</span>
                  Please select a payment method
                </p>
              )}
            </div>
          </div>
        );

      case 4: // Manufacturer Details
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800">Manufacturer Details</h4>

            {loadingManufacturerDetails ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading manufacturer details...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Vehicle Model and Manufacturer Address - Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      value={car?.modelName || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer Address
                    </label>
                    <input
                      type="text"
                      value=""
                      placeholder="2000 Sydney Road 2000 NSW"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>

                {/* VIN Details and Manufacturer - Middle Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VIN Details
                    </label>
                    <input
                      type="text"
                      value=""
                      placeholder="JT2EL43T0P0346451"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={manufacturerDetails?.manufacturerName || car?.makeName || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>

                {/* Logistics Company and Manufacturer Contact - Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logistics Company
                    </label>
                    <input
                      type="text"
                      value=""
                      placeholder="Auto Direct Logistics"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer Contact
                    </label>
                    <input
                      type="text"
                      value=""
                      placeholder="0404040404"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>

                {/* Logistics Company Contact - Single Row */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logistics Company contact
                  </label>
                  <input
                    type="text"
                    value=""
                    placeholder="0421212121"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                <strong>Disclaimer:</strong> By clicking the 'Create Order' button you acknowledge you have read and agree to abide by the Auto Direct{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
                  Privacy Policy
                </a>
                . When you use this enquiry form your contact details will be forwarded to the seller so they can contact you directly.
              </p>
            </div>
          </div>
        );

      case 5: // Additional Notes
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Additional Notes</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests or Questions
              </label>
              <textarea
                name="notes"
                value={purchaseForm.notes}
                onChange={handlePurchaseChange}
                placeholder="Any special requests, questions, or additional information..."
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px]"
                rows={4}
              />
            </div>
          </div>
        );

      case 6: // Confirmation
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Customer Detail Summary</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Vehicle</p>
                  <p className="text-gray-600">{car?.makeName} {car?.modelName} ({car?.yearMade})</p>
                  <p className="text-green-600 font-medium">${car?.price?.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700 mb-1">Contact Information</p>
                  <p className="text-gray-600">{purchaseForm.firstName} {purchaseForm.lastName}</p>
                  <p className="text-gray-600">{purchaseForm.email}</p>
                  <p className="text-gray-600">{purchaseForm.phone}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-700 mb-1">Address</p>
                  <p className="text-gray-600">{purchaseForm.streetNumber} {purchaseForm.streetName}</p>
                  <p className="text-gray-600">{purchaseForm.suburb} {purchaseForm.postcode}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-700 mb-1">License Details</p>
                  <p className="text-gray-600">License Number: {purchaseForm.licenseNumber}</p>
                  <p className="text-gray-600">License Name: {purchaseForm.licenseName}</p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700 mb-1">Payment Method</p>
                  <p className="text-gray-600">{purchaseForm.paymentMethod}</p>
                  {purchaseForm.financing && <p className="text-gray-600">• Interested in financing</p>}
                  {purchaseForm.tradeIn && <p className="text-gray-600">• Has trade-in vehicle</p>}
                </div>
                
                {purchaseForm.notes && (
                  <div className="sm:col-span-2">
                    <p className="font-medium text-gray-700 mb-1">Notes</p>
                    <p className="text-gray-600">{purchaseForm.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Manufacturer Details Summary - Separate Section */}
            <h4 className="text-lg font-semibold text-gray-800">Manufacturer Details Summary</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Vehicle Model</p>
                  <p className="text-gray-600">{car?.modelName || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Manufacturer</p>
                  <p className="text-gray-600">{manufacturerDetails?.manufacturerName || car?.makeName || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">VIN Details</p>
                  <p className="text-gray-600">JT2EL43T0P0346451</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Manufacturer Address</p>
                  <p className="text-gray-600">2000 Sydney Road 2000 NSW</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Manufacturer Contact</p>
                  <p className="text-gray-600">0404040404</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Logistics Company</p>
                  <p className="text-gray-600">Auto Direct Logistics</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-medium text-gray-700 mb-1">Logistics Contact</p>
                  <p className="text-gray-600">0421212121</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
              By submitting this purchase request, you acknowledge that a dealer representative will contact you to finalize the purchase details.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const similarCars = cars
    .filter((c) => c.id !== car.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Get manufacturerID for the vehicle - handle makeName to manufacturerID mapping
  const getManufacturerIDForVehicle = () => {
    // Method 1: If car has manufacturerID directly
    if (car?.manufacturerID) {
      return car.manufacturerID;
    }

    // Method 2: Since manufacturers endpoint is failing, hardcode the mapping for now
    // This maps makeName to the correct manufacturerID from your database
    const makeNameToManufacturerMapping = {
      Mitsubishi: "59a87656-618a-4683-9f9b-bbf61047fb87",
      "General Motors": "5444c7e1-4e87-48d2-9adf-45430fa3ceb0",
      Volkswagen: "61332e03-d464-4db7-ae9d-1e7020bb7c47",
    };

    if (car?.makeName) {
      const manufacturerID = makeNameToManufacturerMapping[car.makeName];
      if (manufacturerID) {
        return manufacturerID;
      }
    }

    // Method 3: If manufacturers loaded successfully, find by make name
    if (car?.makeName && manufacturers.length > 0) {
      const matchingManufacturer = manufacturers.find(
        (m) =>
          m.manufacturerName
            .toLowerCase()
            .includes(car.makeName.toLowerCase()) ||
          car.makeName.toLowerCase().includes(m.manufacturerName.toLowerCase())
      );

      if (matchingManufacturer) {
        return matchingManufacturer.manufacturerID;
      }
    }

    return null;
  };

  // Filter dealerships to only show those matching the car's manufacturer
  const vehicleManufacturerID = getManufacturerIDForVehicle();
  const manufacturerDealerships = vehicleManufacturerID
    ? dealerships.filter(dealer => dealer.manufacturerID === vehicleManufacturerID)
    : [];

  // Show success page if order was submitted
  if (showSuccessPage) {
    return (
      <div className="p-8 max-w-4xl mx-auto pt-20">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Confirmed!</h1>
          
          <div className="space-y-4 text-gray-700 leading-relaxed max-w-2xl mx-auto text-left">
            <p>
              <strong>Thank you for your order, {purchaseForm.firstName} {purchaseForm.lastName}.</strong> A unique 10-digit Order ID, <strong className="text-blue-600">{orderID}</strong>, has been generated, and detailed instructions have been sent to your registered email address.
            </p>

            <p>
              To complete your purchase, please make a direct bank transfer to the manufacturer using the account details provided. Please be sure to include your Order ID as the payment reference.
            </p>

            <p>
              Once your payment is confirmed, you will receive a notification with updates regarding delivery and logistics.
            </p>

            <p>
              If you also requested a test drive, our Test Drive Team will contact you directly to schedule a suitable appointment.
            </p>

            <p>
              For any inquiries, please contact our Customer Service Team at{' '}
              <a href="mailto:autodirectsupport@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                autodirectsupport@gmail.com
              </a>{' '}
              or <strong>0444 444 444</strong>.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
            >
              Back to Vehicles
            </button>
            <button
              onClick={() => {
                setShowSuccessPage(false);
                setOrderID("");
              }}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              View Vehicle Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Results</span>
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4 relative group">
              <img
                src={api + `/vehicle-images/${images[currentImageIndex]?.path}`}
                alt={car.name}
                className="w-full h-[500px] object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={handleImageClick}
              />
              {/* Navigation Overlay */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 mb-8">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={api + `/vehicle-images/${img.path}`}
                  alt={`Thumb ${idx + 1}`}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`w-24 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    idx === currentImageIndex
                      ? "border-black shadow-lg ring-2 ring-gray-400 ring-opacity-50"
                      : "border-transparent hover:border-gray-300 opacity-75 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            {/* Vehicle Overview Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                Vehicle Overview
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: "Make", value: car.makeName, icon: "make.svg" },
                  { label: "Model Name", value: car.modelName, icon: "model.svg" },
                  { label: "Body Type", value: car.bodyType, icon: "body.svg" },
                  { label: "Fuel", value: car.fuel, icon: "fuel.svg" },
                  { label: "Drive Type", value: car.driveType, icon: "drive.svg" },
                  { label: "Cylinders", value: car.cylinders, icon: "engine.svg" },
                  { label: "Doors", value: car.doors, icon: "doors.svg" },
                  { label: "Transmission", value: car.transmission, icon: "transmission.svg" },
                ].map((it, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-3 shadow-sm">
                      <img
                        src={getImageUrl(`../../public/assets/icons/${it.icon}`)}
                        alt={it.label}
                        className="w-8 h-8"
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{it.label}</span>
                    <span className="text-sm font-bold text-gray-900">{it.value || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Info & Actions */}
          <div className="space-y-6">
            {/* Price & Favourite */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{car.makeName}</p>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {car.modelName}
                  </h1>
                </div>
                <button
                  onClick={handleSaveViaHeart}
                  className={`p-3 rounded-full transition-all shadow-sm ${
                    favourites.includes(car.vehicleID)
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                  aria-label="Favourite"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      favourites.includes(car.vehicleID)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </button>
              </div>

              {car.description && (
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  {car.description}
                </p>
              )}

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-2">Price</p>
                <p className="text-4xl font-bold text-gray-900">{priceFormat}</p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-1 gap-3 mb-8">
                {[
                  { label: "Transmission", value: car.transmission },
                  { label: "Drive Type", value: car.driveType },
                  { label: "Body Type", value: car.bodyType },
                ].map((it, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">{it.label}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {it.value || "N/A"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePurchaseClick}
                  className="w-full bg-black text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Purchase Vehicle
                </button>
                <button
                  onClick={() => {
                    if (car) {
                      window.selectedCarName = `${car.makeName || ""} ${car.modelName || ""}`.trim();
                    }
                    setShowBookingForm(true);
                  }}
                  className="w-full bg-white border-2 border-gray-800 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Book Test Drive
                </button>
                <button
                  onClick={() => setShowAdviceForm(true)}
                  className="w-full bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Request Advice
                </button>
              </div>
            </div>
          </div>
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
          onClick={() => {
            setShowPurchaseForm(false);
            resetPurchaseForm();
          }}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[600px] flex overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Stepper Column */}
            <PurchaseStepper 
              currentStep={currentPurchaseStep} 
              steps={purchaseSteps}
            />
            
            {/* Right Content Column */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6 px-6 pt-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {purchaseSteps[currentPurchaseStep - 1]?.title}
                </h3>
                <button
                  onClick={() => {
                    setShowPurchaseForm(false);
                    resetPurchaseForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              {/* Step Content */}
              <div className="flex-1 overflow-y-auto px-6">
                <form onSubmit={handlePurchaseSubmit} className="h-full flex flex-col">
                  <div className="flex-1">
                    {renderPurchaseStepContent()}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 mt-6 border-t border-gray-200 px-6 pb-6">
                    <div>
                      {currentPurchaseStep > 1 && (
                        <button
                          type="button"
                          onClick={prevPurchaseStep}
                          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Back
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPurchaseForm(false);
                          resetPurchaseForm();
                        }}
                        className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                      >
                        {currentPurchaseStep === purchaseSteps.length ? 'Submit Purchase Request' : 'Next'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      <PurchaseConfirmationModal
        isOpen={showPurchaseConfirmation}
        onClose={() => setShowPurchaseConfirmation(false)}
        orderID={orderID}
        customerName={`${purchaseForm.firstName} ${purchaseForm.lastName}`}
        vehicleDetails={car}
        onProcessPayment={() => {
          setShowPurchaseConfirmation(false);
          setShowPaymentInstructions(true);
        }}
      />

    </>
  );
}

export default CarDetailPage;

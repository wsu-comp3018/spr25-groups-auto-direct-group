import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import api from "../data/api-calls";
import PurchaseStepper from "../components/PurchaseStepper";
import PurchaseConfirmationModal from "../components/PurchaseConfirmationModal";
import PaymentInstructionsModal from "../components/PaymentInstructionsModal";
import AdminPaymentModal from "../components/AdminPaymentModal";
import getImageUrl from "../components/getImageUrl";
import { autoFillForm, fieldMappings } from "../utils/autoFillUtils";

function PurchaseFlowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  
  // Get car data from sessionStorage (new tab) or navigation state (same tab)
  const [car, setCar] = useState(null);
  
  useEffect(() => {
    console.log('PurchaseFlowPage useEffect - checking for car data');
    console.log('location.state:', location.state);
    console.log('URL search params:', location.search);
    
    // First try to get data from navigation state (same tab scenario)
    if (location.state?.car) {
      console.log('Found car data in location.state:', location.state.car);
      setCar(location.state.car);
      return;
    }
    
    // Then try to get vehicle ID from URL parameters (new tab scenario)
    const urlParams = new URLSearchParams(location.search);
    const vehicleId = urlParams.get('vehicleId');
    console.log('Vehicle ID from URL:', vehicleId);
    
    if (vehicleId) {
      // Fetch car data from API using vehicle ID
      fetchCarData(vehicleId);
    } else {
      console.log('No vehicle ID found in URL or location.state');
      alert("No vehicle selected for purchase");
      navigate('/browse');
    }
  }, [navigate, location.state, location.search]);
  
  // Function to fetch car data from API
  const fetchCarData = async (vehicleId) => {
    console.log('Fetching car data for vehicle ID:', vehicleId);
    try {
      const response = await fetch(api + `/vehicle/vehicle-information/${vehicleId}`);
      const data = await response.json();
      console.log('Fetched car data:', data);
      
      if (response.ok && data.vehicle) {
        console.log('Setting car data:', data.vehicle);
        console.log('Car properties:', Object.keys(data.vehicle));
        setCar(data.vehicle);
      } else {
        console.error('Error fetching car data:', data.error);
        alert("Error loading vehicle data");
        navigate('/browse');
      }
    } catch (error) {
      console.error('Error fetching car data:', error);
      alert("Error loading vehicle data");
      navigate('/browse');
    }
  };

  // Authentication
  const userID = Cookies.get("auto-direct-userID");
  const token = Cookies.get("auto-direct-token");

  // Debug authentication at component load
  console.log('🍪 Cookie values at component load:');
  console.log('👤 UserID from cookie:', userID);
  console.log('🔑 Token from cookie:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('🍪 All cookies:', document.cookie);

  // Purchase stepper state
  const [currentPurchaseStep, setCurrentPurchaseStep] = useState(1);
  const [purchaseSteps] = useState([
    { title: "Vehicle Review", description: "Confirm vehicle details" },
    { title: "Contact Information", description: "Your contact details" },
    { title: "Purchase Options", description: "Payment & financing" },
    { title: "Manufacturer Details", description: "Vehicle specifications" },
    { title: "Additional Notes", description: "Special requests" },
    { title: "Confirmation", description: "Review & submit" },
    { title: "Payment Instructions", description: "Bank transfer details" },
    { title: "Payment Details", description: "Complete your payment" }
  ]);

  // Form states
  const [purchaseForm, setPurchaseForm] = useState({
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
    licenseFirstName: "",
    licenseLastName: "",
    licenseNumber: "",
    licenseState: "",
    licenseExpiryDate: "",
    financingOption: "cash",
    loanTerm: "36",
    downPayment: "",
    notes: ""
  });

  const [manufacturers, setManufacturers] = useState([]);
  const [manufacturerDetails, setManufacturerDetails] = useState(null);
  const [loadingManufacturerDetails, setLoadingManufacturerDetails] = useState(false);

  // Modal states
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPaymentInstructionsModal, setShowPaymentInstructionsModal] = useState(false);
  const [showAdminPaymentModal, setShowAdminPaymentModal] = useState(false);
  const [generatedOrderID, setGeneratedOrderID] = useState("");

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    nameOfManufacturer: '',
    accountNumber: '',
    accountName: '',
    paymentReference: ''
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
    licenseFirstName: false,
    licenseLastName: false,
    licenseNumber: false,
    licenseState: false,
    licenseExpiryDate: false
  });

  // Fetch manufacturers on component mount
  useEffect(() => {
    fetchManufacturers();
  }, []);

  // Auto-fill form with user profile data when logged in
  useEffect(() => {
    autoFillForm(setPurchaseForm, fieldMappings.purchase);
  }, [userID, token]); // Re-run if authentication state changes

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

  // Fetch manufacturer details when car data and manufacturers are available
  useEffect(() => {
    if (car && manufacturers.length > 0) {
      console.log('Triggering manufacturer details fetch');
      fetchManufacturerDetails();
    }
  }, [car, manufacturers]);

  const fetchManufacturerDetails = async () => {
    console.log('fetchManufacturerDetails called');
    console.log('car:', car);
    console.log('manufacturers:', manufacturers);
    
    if (!car || manufacturers.length === 0) {
      console.log('Missing car or manufacturers data');
      return;
    }

    setLoadingManufacturerDetails(true);
    try {
      // Use manufacturerID directly from car data if available
      const manufacturerID = car.manufacturerID;
      const makeId = car.makeID || car.makeid || car.make_id;
      const makeName = car.makeName || car.make;
      
      console.log('Looking for manufacturer with manufacturerID:', manufacturerID, 'makeID:', makeId, 'or makeName:', makeName);
      
      // Try to find manufacturer by manufacturerID first (most reliable)
      let manufacturer = null;
      if (manufacturerID) {
        manufacturer = manufacturers.find(m => m.manufacturerID === manufacturerID);
      }
      
      // Fallback to makeID or name matching if manufacturerID lookup fails
      if (!manufacturer && makeId) {
        manufacturer = manufacturers.find(m => m.makeID === makeId);
      }
      if (!manufacturer && makeName) {
        manufacturer = manufacturers.find(m => 
          m.name?.toLowerCase() === makeName.toLowerCase() ||
          m.manufacturerName?.toLowerCase() === makeName.toLowerCase()
        );
      }
      
      console.log('Found manufacturer:', manufacturer);
      
      if (manufacturer) {
        const response = await fetch(
          api + `/manage-dealerships/manufacturers/${manufacturer.manufacturerID}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log('Manufacturer details response:', data);
          setManufacturerDetails(data.manufacturer || null);
        } else {
          console.error('Failed to fetch manufacturer details:', response.status);
          // Create fallback manufacturer data from the found manufacturer
          setManufacturerDetails({
            manufacturerID: manufacturer.manufacturerID,
            manufacturerName: manufacturer.manufacturerName,
            country: manufacturer.country || 'Unknown',
            ABN: manufacturer.ABN || 'Not provided'
          });
        }
      } else {
        console.log('No manufacturer found for this vehicle');
        // Create fallback manufacturer data using the make name
        setManufacturerDetails({
          manufacturerID: manufacturerID || 'unknown',
          manufacturerName: makeName || 'Unknown Manufacturer',
          country: 'Unknown',
          ABN: 'Not provided'
        });
      }
    } catch (error) {
      console.error("Error fetching manufacturer details:", error);
      setManufacturerDetails(null);
    } finally {
      setLoadingManufacturerDetails(false);
    }
  };

  // Google Places Autocomplete
  useEffect(() => {
    console.log('🗺️ Google Places useEffect triggered');
    console.log('🗺️ Current step:', currentPurchaseStep);
    console.log('🗺️ addressInputRef.current:', addressInputRef.current);
    console.log('🗺️ window.google available:', !!window.google);
    
    // Only initialize on step 2 (Contact Information)
    if (currentPurchaseStep !== 2) {
      console.log('⚠️ Not on contact information step');
      return;
    }
    
    if (!window.google) {
      console.log('⚠️ Google Maps API not loaded yet');
      return;
    }

    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (!addressInputRef.current) {
        console.log('⚠️ Address input ref still not found after delay');
        return;
      }

      try {
        console.log('✅ Initializing Google Places Autocomplete');
        const autocomplete = new window.google.maps.places.Autocomplete(
          addressInputRef.current,
          {
            componentRestrictions: { country: 'au' }, // Restrict to Australia
            fields: ['address_components', 'formatted_address'],
            types: ['address']
          }
        );

        console.log('✅ Autocomplete initialized successfully');

      autocomplete.addListener('place_changed', () => {
        console.log('📍 Place changed event fired');
        const place = autocomplete.getPlace();
        console.log('📍 Selected place:', place);
        
        if (!place.address_components) {
          console.log('⚠️ No address components found');
          return;
        }

      let streetNumber = '';
      let streetName = '';
      let suburb = '';
      let state = '';
      let postcode = '';

      place.address_components.forEach(component => {
        const types = component.types;
        
        if (types.includes('street_number')) {
          streetNumber = component.long_name;
        }
        if (types.includes('route')) {
          streetName = component.long_name;
        }
        if (types.includes('locality') || types.includes('postal_town')) {
          suburb = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          // Convert full state name to abbreviation
          const stateMap = {
            'New South Wales': 'NSW',
            'Victoria': 'VIC',
            'Queensland': 'QLD',
            'Western Australia': 'WA',
            'South Australia': 'SA',
            'Tasmania': 'TAS',
            'Australian Capital Territory': 'ACT',
            'Northern Territory': 'NT'
          };
          state = stateMap[component.long_name] || component.short_name;
        }
        if (types.includes('postal_code')) {
          postcode = component.long_name;
        }
      });

      console.log('📍 Parsed address:', { streetNumber, streetName, suburb, state, postcode });

      // Update form with parsed address
      setPurchaseForm(prev => ({
        ...prev,
        streetNumber,
        streetName,
        suburb,
        state,
        postcode
      }));

      // Clear any errors for address fields
      setFieldErrors(prev => ({
        ...prev,
        streetNumber: false,
        streetName: false,
        suburb: false,
        state: false,
        postcode: false
      }));
        });

        autocompleteRef.current = autocomplete;
      } catch (error) {
        console.error('❌ Error initializing Google Places Autocomplete:', error);
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timeoutId);
      if (autocompleteRef.current && window.google) {
        try {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        } catch (error) {
          console.error('❌ Error cleaning up autocomplete:', error);
        }
      }
    };
  }, [currentPurchaseStep]);

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
      licenseFirstName: "",
      licenseLastName: "",
      licenseNumber: "",
      licenseState: "",
      licenseExpiryDate: "",
      financingOption: "cash",
      loanTerm: "36",
      downPayment: "",
      notes: ""
    });
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setPurchaseForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?61\s?[2-9]\d{8}$|^0[2-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePostcode = (postcode) => {
    const postcodeRegex = /^\d{4}$/;
    return postcodeRegex.test(postcode);
  };

  const validateLicenseNumber = (licenseNumber) => {
    if (!licenseNumber || licenseNumber.trim().length === 0) {
      return false;
    }
    
    // Remove spaces and convert to uppercase for validation
    const cleanLicense = licenseNumber.replace(/\s/g, '').toUpperCase();
    
    // Check minimum length (5 characters)
    if (cleanLicense.length < 5) {
      return false;
    }
    
    // Check maximum length (typically 10 characters for Australian licenses)
    if (cleanLicense.length > 10) {
      return false;
    }
    
    // Must contain only letters and numbers
    const licenseRegex = /^[A-Z0-9]+$/;
    return licenseRegex.test(cleanLicense);
  };

  const validateLicenseState = (licenseState) => {
    const validStates = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
    return licenseState && validStates.includes(licenseState);
  };

  const validateRequired = (value) => {
    return value && value.toString().trim().length > 0;
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
        errors.licenseFirstName = !validateRequired(purchaseForm.licenseFirstName);
        errors.licenseLastName = !validateRequired(purchaseForm.licenseLastName);
        errors.licenseNumber = !validateLicenseNumber(purchaseForm.licenseNumber);
        errors.licenseState = !validateLicenseState(purchaseForm.licenseState);
        errors.licenseExpiryDate = !validateRequired(purchaseForm.licenseExpiryDate);
        break;
      default:
        // No validation needed for other steps
        break;
    }
    
    return errors;
  };

  // Handle moving to next step
  const handleNextStep = async () => {
    console.log('🔥 handleNextStep called, currentStep:', currentPurchaseStep, 'totalSteps:', purchaseSteps.length);
    console.log('🔍 Condition check: currentStep < totalSteps?', currentPurchaseStep < purchaseSteps.length);
    
    // If we're on step 2 (Contact Information), validate the form first
    if (currentPurchaseStep === 2) {
      const stepErrors = validateCurrentStep();
      
      if (Object.values(stepErrors).some(error => error)) {
        // Update field errors to show red outlines
        setFieldErrors(prev => ({ ...prev, ...stepErrors }));
        return;
      }
      
      // Clear any previous errors and proceed to next step
      setFieldErrors(prev => ({ ...prev, ...stepErrors }));
    }

    if (currentPurchaseStep === 6) {
      // Step 6 is Confirmation - process the purchase and move to Payment Instructions
      console.log('🚀 Confirmation step - processing purchase and moving to Payment Instructions');
      await handleConfirmPurchase();
      setCurrentPurchaseStep(prev => prev + 1);
    } else if (currentPurchaseStep < purchaseSteps.length) {
      console.log('⏭️ Moving to next step:', currentPurchaseStep + 1);
      setCurrentPurchaseStep(prev => prev + 1);
    } else {
      // Final step (Payment Details) - complete the flow
      console.log('🎉 Purchase flow completed!');
      toast.success("Purchase completed! You will receive confirmation shortly.");
      
      // Navigate back to homepage after a brief delay
      setTimeout(() => {
        console.log('🔄 Navigating back to homepage after purchase completion');
        navigate('/');
      }, 2000);
    }
  };  // Handle moving to previous step
  const handlePrevStep = () => {
    if (currentPurchaseStep > 1) {
      setCurrentPurchaseStep(prev => prev - 1);
    }
  };

  // Generate 10-digit order ID like the old system
  const generateOrderID = () => {
    // Get 3 letters from car make (e.g., "Toyota" -> "TOY")
    const makeLetters = car?.make?.substring(0, 3).toUpperCase() || car?.makeName?.substring(0, 3).toUpperCase() || "CAR";
    
    // Get initials from customer name (e.g., "John Doe" -> "JD")
    const firstInitial = purchaseForm.firstName?.charAt(0).toUpperCase() || "J";
    const lastInitial = purchaseForm.lastName?.charAt(0).toUpperCase() || "D";
    
    // Generate 3-digit order number (random for now, could be sequential)
    const orderNumber = Math.floor(100 + Math.random() * 900); // 100-999
    
    // Get last 2 letters from manufacturer (e.g., "Toyota Motor Corporation" -> "ON")
    const manufacturerName = manufacturerDetails?.name || manufacturerDetails?.manufacturerName || car?.makeName || "Unknown";
    const lastTwoLetters = manufacturerName.replace(/\s+/g, '').slice(-2).toUpperCase() || "CO";
    
    return `${makeLetters}${firstInitial}${lastInitial}${orderNumber}${lastTwoLetters}`;
  };

  // Handle final purchase confirmation
  const handleConfirmPurchase = async () => {
    console.log('🚀 Starting purchase submission...');
    console.log('🔐 Token check:', token ? 'Token exists' : 'No token');
    console.log('👤 UserID check:', userID ? 'UserID exists' : 'No userID');
    console.log('🔑 Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'null');
    
    // Check authentication
    if (!token || !userID) {
      toast.error("You must be logged in to complete your purchase. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    
    try {
      // Generate order ID like the old system
      const newOrderID = generateOrderID();
      console.log('🆔 Generated Order ID:', newOrderID);
      console.log('📧 Customer email for confirmation:', purchaseForm.email);

      // Format data exactly like the old purchase progress
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
          postcode: purchaseForm.postcode,
          licenseNumber: purchaseForm.licenseNumber,
          licenseState: purchaseForm.licenseState,
          licenseFirstName: purchaseForm.licenseFirstName,
          licenseLastName: purchaseForm.licenseLastName
        },
        vehicleDetails: {
          vehicleID: car.vehicleID,
          makeID: car.makeID || car.makeid,
          makeName: car.make || car.makeName,
          modelName: car.model || car.modelName,
          year: car.year || car.modelYear,
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
      console.log('🌐 API URL:', api + "/purchases/purchase");
      console.log('🔑 Authorization header:', token?.substring(0, 20) + '...');

      const response = await fetch(api + "/purchases/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token  // Send raw token, not "Bearer <token>"
        },
        body: JSON.stringify(requestData)
      });

      console.log('📨 Received response from API:', response);
      console.log('📨 Response status:', response.status);

      if (response.status === 200) {
        console.log('✅ Purchase successful!');
        setGeneratedOrderID(newOrderID);
        
        // IMPORTANT: Also send order data to Order Management system
        try {
          console.log('📋 Sending order data to Order Management system...');
          const orderProcessingResponse = await fetch(api + "/order-processing/process-order-purchase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              orderID: newOrderID,
              customerName: `${purchaseForm.firstName} ${purchaseForm.lastName}`,
              customerEmail: purchaseForm.email,
              customerPhone: purchaseForm.phone,
              customerAddress: `${purchaseForm.streetNumber} ${purchaseForm.streetName}, ${purchaseForm.suburb}, ${purchaseForm.state} ${purchaseForm.postcode}`,
              vehicleDetails: {
                vehicleID: car.vehicleID,
                makeID: car.makeID || car.makeid,
                makeName: car.make || car.makeName,
                modelName: car.model || car.modelName,
                year: car.year || car.modelYear,
                price: car.price,
                fuelType: car.fuelType,
                transmission: car.transmission,
                bodyType: car.bodyType,
                driveType: car.driveType,
                color: car.color || car.colour,
                mileage: car.mileage,
                vin: car.vin || car.vehicleID
              },
              manufacturerDetails: manufacturerDetails
            })
          });

          if (orderProcessingResponse.ok) {
            console.log('✅ Order data sent to Order Management system successfully!');
          } else {
            console.log('⚠️ Failed to send order data to Order Management system, but purchase still successful');
          }
        } catch (orderError) {
          console.error('❌ Error sending order data to Order Management:', orderError);
          console.log('⚠️ Order Management integration failed, but purchase still successful');
        }
        
        // Store order ID and set up payment form for next steps
        setGeneratedOrderID(newOrderID);
        setPaymentForm({
          nameOfManufacturer: manufacturerDetails?.manufacturerName || 'Volkswagen Group',
          accountNumber: '',
          accountName: '',
          paymentReference: newOrderID
        });
        
        toast.success("Purchase request submitted successfully! Please complete payment instructions.");
      } else {
        const data = await response.json();
        console.log('❌ API returned error status:', response.status);
        throw new Error(data.error || "Failed to submit purchase request");
      }
    } catch (error) {
      console.error("❌ Purchase submission error:", error);
      toast.error(`Failed to submit purchase request: ${error.message}`);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentPurchaseStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              {car ? (
                <>
                  {/* Basic Information Section */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-6 text-center">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <h5 className="text-gray-600 mb-2">Make & Model</h5>
                        <p>{car.make || car.makeName || 'N/A'} {car.model || car.modelName || ''}</p>
                      </div>
                      <div className="text-center">
                        <h5 className="text-gray-600 mb-2">Year</h5>
                        <p>{car.year || car.modelYear || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <h5 className="text-gray-600 mb-2">Price</h5>
                        <p className="text-green-600">${car.price?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <h5 className="text-gray-600 mb-2">Colour</h5>
                        <p>{car.colour || car.color || car.exteriorColor || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specifications Section */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-6 text-center">Technical Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <h5 className="text-gray-600 mb-2">Body Type</h5>
                        <p>{car.bodyType || car.body_type || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <h5 className="text-gray-600 mb-2">Transmission</h5>
                        <p>{car.transmission || car.transmissionType || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <h5 className="text-gray-600 mb-2">Fuel Type</h5>
                        <p>{car.fuelType || car.fuel || car.fuelSystem || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <h5 className="text-gray-600 mb-2">Drive Type</h5>
                        <p>{car.driveType || car.drive_type || car.drivetrain || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <h5 className="text-gray-600 mb-2">Cylinders</h5>
                        <p>{car.cylinders || car.engineCylinders || car.cylinderCount || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <h5 className="text-gray-600 mb-2">Doors</h5>
                        <p>{car.doors || car.doorCount || car.numberOfDoors || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg text-gray-600">Loading vehicle details...</p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={purchaseForm.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">First name is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={purchaseForm.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Smith"
                />
                {fieldErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">Last name is required</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={purchaseForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john.smith@example.com"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Email Address
              </label>
              <input
                type="email"
                value={purchaseForm.confirmEmail}
                onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.confirmEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john.smith@example.com"
              />
              {fieldErrors.confirmEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {!purchaseForm.confirmEmail ? 'Please confirm your email address' : 
                  !validateEmail(purchaseForm.confirmEmail) ? 'Please enter a valid email address' : 
                  'Email addresses do not match'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={purchaseForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+61 4XX XXX XXX"
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid Australian phone number</p>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Address</h4>
              
              {/* Google Places Autocomplete */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Address
                </label>
                <input
                  ref={addressInputRef}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Start typing your address..."
                />
                <p className="text-xs text-gray-500 mt-1">Start typing to search and select your address</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Number
                  </label>
                  <input
                    type="text"
                    value={purchaseForm.streetNumber}
                    onChange={(e) => handleInputChange('streetNumber', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.streetNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123"
                  />
                  {fieldErrors.streetNumber && (
                    <p className="text-red-500 text-sm mt-1">Please enter a valid street number</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Name
                  </label>
                  <input
                    type="text"
                    value={purchaseForm.streetName}
                    onChange={(e) => handleInputChange('streetName', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.streetName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Main Street"
                  />
                  {fieldErrors.streetName && (
                    <p className="text-red-500 text-sm mt-1">Street name is required</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suburb
                  </label>
                  <input
                    type="text"
                    value={purchaseForm.suburb}
                    onChange={(e) => handleInputChange('suburb', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.suburb ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Suburb"
                  />
                  {fieldErrors.suburb && (
                    <p className="text-red-500 text-sm mt-1">Suburb is required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Territory
                  </label>
                  <select
                    value={purchaseForm.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select State/Territory</option>
                    <option value="NSW">New South Wales</option>
                    <option value="VIC">Victoria</option>
                    <option value="QLD">Queensland</option>
                    <option value="WA">Western Australia</option>
                    <option value="SA">South Australia</option>
                    <option value="TAS">Tasmania</option>
                    <option value="ACT">Australian Capital Territory</option>
                    <option value="NT">Northern Territory</option>
                  </select>
                  {fieldErrors.state && (
                    <p className="text-red-500 text-sm mt-1">Please select a state or territory</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  value={purchaseForm.postcode}
                  onChange={(e) => handleInputChange('postcode', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.postcode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="4000"
                  maxLength="4"
                />
                {fieldErrors.postcode && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid 4-digit postcode</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">License Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License First Name
                  </label>
                  <input
                    type="text"
                    value={purchaseForm.licenseFirstName}
                    onChange={(e) => handleInputChange('licenseFirstName', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.licenseFirstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="First name on license"
                  />
                  {fieldErrors.licenseFirstName && (
                    <p className="text-red-500 text-sm mt-1">License first name is required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Last Name
                  </label>
                  <input
                    type="text"
                    value={purchaseForm.licenseLastName}
                    onChange={(e) => handleInputChange('licenseLastName', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.licenseLastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Last name on license"
                  />
                  {fieldErrors.licenseLastName && (
                    <p className="text-red-500 text-sm mt-1">License last name is required</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={purchaseForm.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your license number"
                  />
                  {fieldErrors.licenseNumber && (
                    <p className="text-red-500 text-sm mt-1">Please enter a valid license number (5-10 characters, letters and numbers only)</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License State
                  </label>
                  <select
                    value={purchaseForm.licenseState}
                    onChange={(e) => handleInputChange('licenseState', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.licenseState ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select License State</option>
                    <option value="NSW">New South Wales</option>
                    <option value="VIC">Victoria</option>
                    <option value="QLD">Queensland</option>
                    <option value="WA">Western Australia</option>
                    <option value="SA">South Australia</option>
                    <option value="TAS">Tasmania</option>
                    <option value="ACT">Australian Capital Territory</option>
                    <option value="NT">Northern Territory</option>
                  </select>
                  {fieldErrors.licenseState && (
                    <p className="text-red-500 text-sm mt-1">Please select a valid Australian state or territory</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Expiry Date
                </label>
                <input
                  type="date"
                  value={purchaseForm.licenseExpiryDate}
                  onChange={(e) => handleInputChange('licenseExpiryDate', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.licenseExpiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.licenseExpiryDate && (
                  <p className="text-red-500 text-sm mt-1">License expiry date is required</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Financing Option
              </label>
              <select
                value={purchaseForm.financingOption}
                onChange={(e) => handleInputChange('financingOption', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Cash Purchase</option>
                <option value="finance">Finance</option>
                <option value="lease">Lease</option>
              </select>
            </div>

            {purchaseForm.financingOption !== 'cash' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term (months)
                  </label>
                  <select
                    value={purchaseForm.loanTerm}
                    onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment ($)
                  </label>
                  <input
                    type="number"
                    value={purchaseForm.downPayment}
                    onChange={(e) => handleInputChange('downPayment', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 4:
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
                      value={car?.model || car?.modelName || ''}
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
                      value={manufacturerDetails?.address || ""}
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
                      value={car?.vin || ""}
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
                      value={manufacturerDetails?.name || manufacturerDetails?.manufacturerName || car?.make || car?.makeName || ''}
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
                      value="Auto Direct Logistics"
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
                      value={manufacturerDetails?.phone || ""}
                      placeholder="0404040404"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>

                {/* Logistics Company Contact - Single Row */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logistics Company Contact
                  </label>
                  <input
                    type="text"
                    value="0421212121"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                <strong>Disclaimer:</strong> By clicking the 'Next' button you acknowledge you have read and agree to abide by the Auto Direct{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms-conditions" className="text-blue-600 hover:text-blue-800 underline">
                  Terms & Conditions
                </a>.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={purchaseForm.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special requests or additional information..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">
                Please review all information before submitting your purchase request.
              </p>
            </div>
            
            {/* Complete Purchase Summary */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-8">
              {/* Vehicle Summary */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p><span className="font-medium text-gray-700">Make & Model:</span> <span className="text-gray-900">{car?.make || car?.makeName || 'N/A'} {car?.model || car?.modelName || 'N/A'}</span></p>
                  <p><span className="font-medium text-gray-700">Year:</span> <span className="text-gray-900">{car?.year || car?.modelYear || 'N/A'}</span></p>
                  <p><span className="font-medium text-gray-700">Price:</span> <span className="text-gray-900 font-semibold">${car?.price?.toLocaleString() || 'N/A'}</span></p>
                  <p><span className="font-medium text-gray-700">Color:</span> <span className="text-gray-900">{car?.colour || car?.color || car?.exteriorColor || 'N/A'}</span></p>
                  <p><span className="font-medium text-gray-700">Body Type:</span> <span className="text-gray-900">{car?.bodyType || car?.body_type || 'N/A'}</span></p>
                  <p><span className="font-medium text-gray-700">Transmission:</span> <span className="text-gray-900">{car?.transmission || car?.transmissionType || 'N/A'}</span></p>
                  <p><span className="font-medium text-gray-700">Fuel Type:</span> <span className="text-gray-900">{car?.fuelType || car?.fuel || car?.fuelSystem || 'N/A'}</span></p>
                  <p><span className="font-medium text-gray-700">Drive Type:</span> <span className="text-gray-900">{car?.driveType || car?.drive_type || car?.drivetrain || 'N/A'}</span></p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{purchaseForm.firstName} {purchaseForm.lastName}</span></p>
                  <p><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-900">{purchaseForm.email}</span></p>
                  <p><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-900">{purchaseForm.phone}</span></p>
                  <p><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-900">{purchaseForm.streetNumber} {purchaseForm.streetName}, {purchaseForm.suburb}, {purchaseForm.state} {purchaseForm.postcode}</span></p>
                </div>
                
                <div className="mt-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-3">License Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <p><span className="font-medium text-gray-600">License Name:</span> <span className="text-gray-900">{purchaseForm.licenseFirstName} {purchaseForm.licenseLastName}</span></p>
                    <p><span className="font-medium text-gray-600">License Number:</span> <span className="text-gray-900">{purchaseForm.licenseNumber}</span></p>
                    <p><span className="font-medium text-gray-600">License State:</span> <span className="text-gray-900">{purchaseForm.licenseState}</span></p>
                    <p><span className="font-medium text-gray-600">Expiry Date:</span> <span className="text-gray-900">{purchaseForm.licenseExpiryDate}</span></p>
                  </div>
                </div>
              </div>

              {/* Purchase Options */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Purchase Options</h4>
                <div className="space-y-3">
                  <p><span className="font-medium text-gray-700">Financing Option:</span> <span className="text-gray-900 capitalize">{purchaseForm.financingOption}</span></p>
                  {purchaseForm.financingOption !== 'cash' && (
                    <div className="space-y-3">
                      <p><span className="font-medium text-gray-700">Loan Term:</span> <span className="text-gray-900">{purchaseForm.loanTerm} months</span></p>
                      {purchaseForm.downPayment && (
                        <p><span className="font-medium text-gray-700">Down Payment:</span> <span className="text-gray-900">${purchaseForm.downPayment}</span></p>
                      )}
                    </div>
                  )}
                  {purchaseForm.notes && (
                    <div className="mt-6">
                      <p><span className="font-medium text-gray-700">Additional Notes:</span></p>
                      <p className="text-gray-900 italic mt-2">{purchaseForm.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                <strong>Disclaimer:</strong> By clicking the 'Submit Purchase Request' button you acknowledge you have read and agree to abide by the Auto Direct{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms-conditions" className="text-blue-600 hover:text-blue-800 underline">
                  Terms & Conditions
                </a>.
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <p className="text-green-800 font-medium">✅ Order Confirmed - ID: {generatedOrderID}</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Instructions</h3>
            
            {/* Payment Form - All fields are READ-ONLY */}
            <div className="space-y-6 mb-8">
              {/* Name of Manufacturer and BSB Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Name of Manufacturer
                  </label>
                  <input
                    type="text"
                    value="Volkswagen Group"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <div className="flex justify-end mb-2">
                    <span className="text-sm font-medium text-gray-600">BSB</span>
                  </div>
                  <input
                    type="text"
                    value="062-000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-center text-gray-700 cursor-not-allowed"
                    readOnly
                    disabled
                  />
                </div>
              </div>

              {/* Account Number and Account Name Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value="1234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value="Auto Direct Pty Ltd"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                    readOnly
                    disabled
                  />
                </div>
              </div>

              {/* Payment Reference */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Payment Reference
                </label>
                <input
                  type="text"
                  value={generatedOrderID}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Vehicle Overview */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Overview</h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Make:</span>
                  <span className="font-medium ml-auto">{car?.make || car?.makeName}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Model:</span>
                  <span className="font-medium ml-auto">{car?.model || car?.modelName}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Price:</span>
                  <span className="font-medium ml-auto">${car?.price?.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Color:</span>
                  <span className="font-medium ml-auto">{car?.color || car?.colour || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <p className="text-blue-800 font-medium">Complete Your Payment</p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{generatedOrderID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{car?.make || car?.makeName} {car?.model || car?.modelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{purchaseForm.firstName} {purchaseForm.lastName}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-4">
                  <span>Total Amount:</span>
                  <span>${car?.price?.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Payment Instructions:</strong> Please transfer the full amount to the account details provided in the previous step. 
                  Use your Order ID "{generatedOrderID}" as the payment reference to ensure proper processing.
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">Once payment is completed, you will receive:</p>
                <div className="grid grid-cols-2 gap-4 text-left text-gray-600 max-w-2xl mx-auto">
                  <div>Payment confirmation email</div>
                  <div>Order processing notification</div>
                  <div>Delivery tracking information</div>
                  <div>Contact from our delivery team</div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 rounded p-4">
              <p className="text-sm text-red-700">
                <strong>Important:</strong> Payment must include the Order ID "{generatedOrderID}" as reference. 
                Incomplete payments may result in processing delays.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Purchase Vehicle</h1>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8" style={{minHeight: '600px'}}>
          {/* Left Stepper Column */}
          <PurchaseStepper 
            currentStep={currentPurchaseStep} 
            steps={purchaseSteps}
          />
          
          {/* Right Content Column */}
          <div className="flex-1 flex flex-col">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentPurchaseStep - 1) / (purchaseSteps.length - 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ 
                    width: `${Math.max(0, ((currentPurchaseStep - 1) / (purchaseSteps.length - 1)) * 100)}%` 
                  }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {purchaseSteps[currentPurchaseStep - 1]?.title}
              </h3>
              <p className="text-gray-600 mt-2">
                {purchaseSteps[currentPurchaseStep - 1]?.description}
              </p>
            </div>
            
            {/* Step Content */}
            <div className="flex-1 overflow-y-auto px-4">
              {renderStepContent()}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center py-6 mt-8 border-t">
              <button
                onClick={handlePrevStep}
                disabled={currentPurchaseStep === 1}
                className={`px-8 py-3 font-medium transition ${
                  currentPurchaseStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                ← Previous
              </button>
              
              <button
                onClick={() => {
                  console.log('🔥 Button clicked!');
                  console.log('📊 Current step:', currentPurchaseStep);
                  console.log('📊 Total steps:', purchaseSteps.length);
                  console.log('🎯 Is final step?', currentPurchaseStep === purchaseSteps.length);
                  handleNextStep();
                }}
                className="px-8 py-3 bg-black text-white font-medium hover:bg-gray-900 transition"
              >
                {currentPurchaseStep === purchaseSteps.length ? 'Complete Purchase' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showConfirmationModal && (
        <PurchaseConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          orderID={generatedOrderID}
          customerName={`${purchaseForm.firstName} ${purchaseForm.lastName}`}
          vehicleDetails={car}
          manufacturerDetails={manufacturerDetails}
          purchaseFormData={purchaseForm}
        />
      )}

      {showPaymentInstructionsModal && (
        <PaymentInstructionsModal
          isOpen={showPaymentInstructionsModal}
          onClose={() => setShowPaymentInstructionsModal(false)}
          orderID={generatedOrderID}
          manufacturerDetails={manufacturerDetails}
          vehicleDetails={car}
          onNext={() => {
            setShowPaymentInstructionsModal(false);
            setShowAdminPaymentModal(true);
          }}
          onBack={() => {
            // Just close the payment instructions modal to return to the Purchase Vehicle Form
            console.log('🔙 Closing payment instructions to return to Purchase Vehicle Form');
            setShowPaymentInstructionsModal(false);
          }}
        />
      )}

      {showAdminPaymentModal && (
        <AdminPaymentModal
          isOpen={showAdminPaymentModal}
          onClose={() => {
            setShowAdminPaymentModal(false);
            navigate('/');
          }}
          orderID={generatedOrderID}
          customerData={{
            name: `${purchaseForm.firstName} ${purchaseForm.lastName}`,
            email: purchaseForm.email
          }}
          vehicleData={car}
          manufacturerData={manufacturerDetails}
        />
      )}
    </div>
  );
}

export default PurchaseFlowPage;
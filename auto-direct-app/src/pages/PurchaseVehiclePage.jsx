import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../data/api-calls';

const PurchaseVehiclePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data passed from the confirmation step
  const { 
    orderID, 
    customerName = "John Doe", 
    purchaseFormData,
    vehicleDetails,
    manufacturerDetails 
  } = location.state || {};

  // State for vehicle categories with real data
  const [vehicleCategories, setVehicleCategories] = useState([]);
  
<<<<<<< HEAD
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
=======
>>>>>>> a57902b17af21a76552d2abc26b963df679bf99f
  // Fetch real vehicle data from API
  useEffect(() => {
    const fetchVehicleCategories = async () => {
      try {
        const response = await fetch(api + "/vehicle/browse-vehicles");
        if (response.ok) {
          const vehicles = await response.json();
          
          // Group vehicles by category/body type and get representative images
          const categories = [
            {
              name: "Everyday and Convenience",
              description: "Cars that give you the freedom for everyday living",
              bodyTypes: ["Hatchback", "Sedan"],
              vehicle: vehicles.find(v => ["Hatchback", "Sedan"].includes(v.bodyType))
            },
            {
              name: "Families and Road Trippers", 
              description: "Cars that give you the space to move people or pack heavy",
              bodyTypes: ["SUV", "Wagon"],
              vehicle: vehicles.find(v => ["SUV", "Wagon"].includes(v.bodyType))
            },
            {
              name: "Work and Play",
              description: "Tough and rugged for both work and fun play on the weekend", 
              bodyTypes: ["Ute", "Truck"],
              vehicle: vehicles.find(v => ["Ute", "Truck"].includes(v.bodyType))
            },
            {
              name: "Environmentally Conscious",
              description: "Electric and hybrid cars with the environment in mind",
              bodyTypes: ["Electric", "Hybrid"],
              vehicle: vehicles.find(v => v.fuelType === "Electric" || v.fuelType === "Hybrid")
            }
          ];
          
          setVehicleCategories(categories);
        }
      } catch (error) {
        console.error("Failed to fetch vehicle categories:", error);
        // Fallback to static data if API fails
        setVehicleCategories([
          {
            name: "Everyday and Convenience",
            description: "Cars that give you the freedom for everyday living",
            vehicle: { mainImage: "images-1748525162487-593468754.jpg" }
          },
          {
            name: "Families and Road Trippers", 
            description: "Cars that give you the space to move people or pack heavy",
            vehicle: { mainImage: "images-1748525162488-652785063.jpg" }
          },
          {
            name: "Work and Play",
            description: "Tough and rugged for both work and fun play on the weekend",
            vehicle: { mainImage: "images-1748525162489-301950156.png" }
          },
          {
            name: "Environmentally Conscious",
            description: "Electric and hybrid cars with the environment in mind",
            vehicle: { mainImage: "images-1748525162496-568069999.jpg" }
          }
        ]);
      }
    };
    
    fetchVehicleCategories();
  }, []);

  const handleClose = () => {
    // Navigate back to car detail page with purchase completed state
    navigate('/car/' + (vehicleDetails?.vehicleID || '1'), {
      state: {
        purchaseCompleted: true,
        orderID: orderID,
        manufacturerDetails: manufacturerDetails,
        vehicleDetails: vehicleDetails,
        purchaseFormData: purchaseFormData // Pass back the form data
      }
    });
  };

  const handleCategoryClick = (category) => {
    // Navigate to browse page with filter applied
    navigate('/browse', { 
      state: { 
        filterBy: category.bodyTypes 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
<<<<<<< HEAD
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold">A</span>
=======
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">AD</span>
>>>>>>> a57902b17af21a76552d2abc26b963df679bf99f
            </div>
            <span className="font-bold text-lg">Autos Direct</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="/browse" className="text-gray-600 hover:text-gray-900">Browse Cars</a>
            <a href="/saved" className="text-gray-600 hover:text-gray-900">Saved Cars</a>
          </nav>
          
<<<<<<< HEAD
          <button className="p-2 text-gray-600 hover:text-gray-900">
=======
          <button className="p-2">
>>>>>>> a57902b17af21a76552d2abc26b963df679bf99f
            <div className="w-6 h-6">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
<<<<<<< HEAD
        <h1 className="text-3xl font-bold text-center mb-4">Purchase Vehicle Form</h1>
        
        {/* Green Checkmark and Order ID */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-green-600">Order Confirmed - ID: {orderID || 'BRZPM479QP'}</span>
          </div>
        </div>
=======
        <h1 className="text-3xl font-bold text-center mb-8">Purchase Vehicle Form</h1>
>>>>>>> a57902b17af21a76552d2abc26b963df679bf99f
        
        {/* Main Form Box */}
        <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-white">
          <div className="space-y-4 text-gray-700">
            <p>
              Thank you for your order, <span className="font-semibold">{customerName}</span>. 
              A unique 10-digit Order ID, <span className="font-bold text-blue-600">{orderID || 'BRZPM479QP'}</span>, 
              has been generated, and detailed instructions have been sent to your registered email address.
            </p>
            
            <p>
<<<<<<< HEAD
              To complete your purchase, please make a direct bank transfer to the manufacturer using the 
              account details provided. Please be sure to include your Order ID as the payment reference.
=======
              To complete your purchase, please click "View Payment Instructions" below to proceed with 
              the payment process. You'll find detailed bank transfer information and payment steps.
>>>>>>> a57902b17af21a76552d2abc26b963df679bf99f
            </p>
            
            <p>
              Once your payment is confirmed, you will receive a notification with updates regarding 
              delivery and logistics.
            </p>
            
            <p>
              If you also requested a test drive, our Test Drive Team will contact you directly to schedule 
              a suitable appointment.
            </p>
            
            <p>
              For any inquiries, please contact our Customer Service Team at{' '}
              <a href="mailto:autodirectsupport@gmail.com" className="text-blue-600 hover:underline">
                autodirectsupport@gmail.com
              </a>{' '}
              or <span className="font-semibold">0444 444 444</span>.
            </p>
          </div>
        </div>

<<<<<<< HEAD
        {/* Close Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
=======
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => navigate('/payment-instructions', {
              state: {
                orderID,
                customerName,
                purchaseFormData,
                vehicleDetails,
                manufacturerDetails
              }
            })}
            className="bg-black border-2 border-black text-white font-semibold py-2 px-6 rounded-lg transition hover:bg-black hover:text-white"
          >
            View Payment Instructions
          </button>
          <button
            onClick={handleClose}
            className="bg-transparent border-2 border-black text-black font-semibold py-2 px-6 rounded-lg transition hover:bg-black hover:text-white"
>>>>>>> a57902b17af21a76552d2abc26b963df679bf99f
          >
            Close
          </button>
        </div>

        {/* Discover vehicles section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Discover vehicles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleCategories.map((category, index) => (
              <div key={index} className="text-center group cursor-pointer" onClick={() => handleCategoryClick(category)}>
                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                  <div className="w-full h-32 rounded-lg mb-3 overflow-hidden">
                    {category.vehicle?.mainImage ? (
                      <img 
                        src={`${api}/vehicle-images/${category.vehicle.mainImage}`}
                        alt={`${category.name} Car`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.target.src = '/assets/sedan.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                </div>
                <h4 className="font-semibold text-sm mb-2 text-gray-800">{category.name}</h4>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed px-2">{category.description}</p>
                <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200">
                  See them all →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-gray-500">
            © 2025 Autos Direct. All rights reserved. | 
            <a href="#" className="hover:underline ml-1">Contact</a> | 
            <a href="#" className="hover:underline ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:underline ml-1">Glossary</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PurchaseVehiclePage;
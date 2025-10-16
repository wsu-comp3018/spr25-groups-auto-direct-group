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
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Fetch real vehicle data from API
  useEffect(() => {
    const fetchVehicleCategories = async () => {
      try {
        const response = await fetch(api + "/vehicle/browse-vehicles");
        if (response.ok) {
          const vehicles = await response.json();
          
          // Group vehicles by category (simplified)
          const categories = [
            {
              name: "Everyday and Convenience",
              description: "Cars that give you the freedom for everyday living",
              vehicle: vehicles.find(v => v.bodyType === "Sedan" || v.bodyType === "Hatchback") || vehicles[0]
            },
            {
              name: "Families and Road Trippers", 
              description: "Cars that give you the space to move people or pack heavy",
              vehicle: vehicles.find(v => v.bodyType === "SUV" || v.bodyType === "Wagon") || vehicles[1]
            },
            {
              name: "Work and Play",
              description: "Tough and rugged for both work and fun play on the weekend",
              vehicle: vehicles.find(v => v.bodyType === "Ute" || v.bodyType === "Truck") || vehicles[2]
            },
            {
              name: "Environmentally Conscious",
              description: "Electric and hybrid cars with the environment in mind",
              vehicle: vehicles.find(v => v.fuelType === "Electric" || v.fuelType === "Hybrid") || vehicles[3]
            }
          ];
          
          setVehicleCategories(categories);
        } else {
          console.log('Failed to fetch vehicles, using fallback data');
          // Fallback data with placeholder images
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
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        // Fallback data with placeholder images
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
    // Navigate to payment instructions page
    navigate('/payment-instructions', {
      state: {
        orderID: orderID,
        customerName: customerName,
        purchaseFormData: purchaseFormData,
        vehicleDetails: vehicleDetails,
        manufacturerDetails: manufacturerDetails
      }
    });
  };

  const handleCategoryClick = (category) => {
    // Navigate to browse page with filter applied
    navigate('/browse', { 
      state: { filterByCategory: category.name } 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">AD</span>
            </div>
            <span className="font-bold text-lg">Autos Direct</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="/browse" className="text-gray-600 hover:text-gray-900">Browse Cars</a>
            <a href="/saved-cars" className="text-gray-600 hover:text-gray-900">Saved Cars</a>
          </nav>
          
          <button className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
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
        
        {/* Main Form Box */}
        <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-white">
          <div className="space-y-4 text-gray-700">
            <p>
              Thank you for your order, <span className="font-semibold">{customerName}</span>. 
              A unique 10-digit Order ID, <span className="font-bold text-blue-600">{orderID || 'BRZPM479QP'}</span>, 
              has been generated, and detailed instructions have been sent to your registered email address.
            </p>
            
            <p>
              To complete your purchase, please make a direct bank transfer to the manufacturer using the 
              account details provided. Please be sure to include your Order ID as the payment reference.
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

        {/* Close Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div>

        {/* Discover vehicles section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Discover vehicles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleCategories.map((category, index) => (
              <div 
                key={index} 
                className="text-center cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition-colors"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="bg-gray-200 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
                  {category.vehicle?.mainImage ? (
                    <img 
                      src={`${api}/uploads/${category.vehicle.mainImage}`} 
                      alt={category.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="text-gray-500 text-sm" style={{ display: category.vehicle?.mainImage ? 'none' : 'flex' }}>
                    No Image
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">{category.name}</p>
                <p className="text-xs text-gray-600 mb-2">{category.description}</p>
                <button className="text-xs text-blue-600 hover:underline">
                  See them all →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-xs text-gray-500">
            © 2025 Autos Direct. All rights reserved. | Contact | Privacy Policy | Glossary
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PurchaseVehiclePage;
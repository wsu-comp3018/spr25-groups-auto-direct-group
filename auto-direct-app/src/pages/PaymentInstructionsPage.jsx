import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentInstructionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data passed from the car detail page
  const { 
    orderID, 
    customerName = "John Doe", 
    purchaseFormData,
    vehicleDetails,
    manufacturerDetails 
  } = location.state || {};

  const [paymentForm, setPaymentForm] = useState({
    nameOfManufacturer: manufacturerDetails?.manufacturerName || 'BSB',
    accountNumber: '',
    accountName: '',
    paymentReference: orderID || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    // Navigate to payment details page
    navigate('/payment-details', {
      state: {
        orderID,
        customerName,
        purchaseFormData,
        vehicleDetails,
        manufacturerDetails,
        paymentForm
      }
    });
  };

  const handleBack = () => {
    // Navigate back to Purchase Vehicle Form page
    console.log('🔙 Navigating back to Purchase Vehicle Form');
    navigate('/purchase-vehicle', {
      state: {
        orderID: orderID,
        customerName: customerName,
        purchaseFormData: purchaseFormData,
        vehicleDetails: vehicleDetails,
        manufacturerDetails: manufacturerDetails
      }
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
          
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Instructions</h1>
          <div className="text-lg font-medium text-gray-700 mb-6">
            Order ID: <span className="text-blue-600 font-bold">#{orderID}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
          <div className="space-y-6 mb-8">
            {/* Name of Manufacturer and BSB Row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Name of Manufacturer
                </label>
                <input
                  type="text"
                  name="nameOfManufacturer"
                  value={paymentForm.nameOfManufacturer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <div className="flex justify-end mb-2">
                  <span className="text-sm font-medium text-gray-600">BSB</span>
                </div>
                <input
                  type="text"
                  value="BSB"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-center"
                  readOnly
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
                  name="accountNumber"
                  value={paymentForm.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={paymentForm.accountName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter account name"
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
                name="paymentReference"
                value={paymentForm.paymentReference}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Vehicle Overview */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Vehicle Overview</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex items-center">
              <span className="text-gray-600 w-4 h-4 mr-3">🚗</span>
              <span className="text-gray-600 mr-2">Make:</span>
              <span className="font-medium ml-auto">{vehicleDetails?.makeName || 'Subaru'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-4 h-4 mr-3">📋</span>
              <span className="text-gray-600 mr-2">Model Name:</span>
              <span className="font-medium ml-auto">{vehicleDetails?.modelName || 'BRZ'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-4 h-4 mr-3">🚙</span>
              <span className="text-gray-600 mr-2">Body Type:</span>
              <span className="font-medium ml-auto">{vehicleDetails?.bodyType || 'Coupe'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-4 h-4 mr-3">⛽</span>
              <span className="text-gray-600 mr-2">Fuel:</span>
              <span className="font-medium ml-auto">{vehicleDetails?.fuelType || 'Petrol'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-4 h-4 mr-3">🔄</span>
              <span className="text-gray-600 mr-2">Drive Type:</span>
              <span className="font-medium ml-auto">{vehicleDetails?.driveType || 'Rear Wheel Drive'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-4 h-4 mr-3">🔧</span>
              <span className="text-gray-600 mr-2">Cylinders:</span>
              <span className="font-medium ml-auto">4</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-4 h-4 mr-3">🚪</span>
              <span className="text-gray-600 mr-2">Doors:</span>
              <span className="font-medium ml-auto">2</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-4 h-4 mr-3">⚙️</span>
              <span className="text-gray-600 mr-2">Transmission:</span>
              <span className="font-medium ml-auto">{vehicleDetails?.transmission || 'Manual'}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded">
          <div className="flex">
            <div>
              <p className="text-sm text-red-700">
                <span className="font-semibold text-red-800">Disclaimer:</span> Payments must be made in full and must include the unique identifier (Order ID) quoted in the reference section when transferring funds. Failure to include the correct identifier may result in delays in processing your order. Please note that incomplete payments may result in non fulfillment of your order. Delivery times are subject to shipment allocation and may vary.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 transition-colors font-semibold"
          >
            Back to Vehicle Details
          </button>
          <button
            onClick={handleNext}
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-semibold"
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-gray-500">
            © 2025 Autos Direct. All rights reserved. | 
            <a href="/contact" className="hover:underline ml-1">Contact</a> | 
            <a href="/privacy-policy" className="hover:underline ml-1">Privacy Policy</a> | 
            <a href="/glossary" className="hover:underline ml-1">Glossary</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentInstructionsPage;
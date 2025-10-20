import React, { useState } from 'react';

const PaymentInstructionsModal = ({ 
  isOpen, 
  onClose, 
  orderID, 
  manufacturerDetails,
  vehicleDetails,
  onNext,
  onBack
}) => {
  const [paymentForm, setPaymentForm] = useState({
    nameOfManufacturer: manufacturerDetails?.manufacturerName || 'BSB',
    accountNumber: '',
    accountName: '',
    paymentReference: orderID || ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-3xl w-full mx-4 relative max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Instructions</h2>
          <div className="text-sm font-medium text-gray-700 mb-6">
            Order ID #{orderID}
          </div>
        </div>

        {/* Payment Form */}
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

        {/* Vehicle Overview */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Vehicle Overview</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
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
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack || onClose}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded hover:bg-gray-300 transition-colors font-semibold"
          >
            Back to Vehicle Details
          </button>
          <button
            onClick={onNext}
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-semibold"
          >
            Next
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 border-t pt-4">
          © 2025 Autos Direct. All rights reserved. | Contact | Privacy Policy | Glossary
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructionsModal;
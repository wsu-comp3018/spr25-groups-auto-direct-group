import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../data/api-calls';
import Cookies from 'js-cookie';

const PaymentDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data passed from the payment instructions page
  const { 
    orderID, 
    customerName = "John Doe", 
    purchaseFormData,
    vehicleDetails,
    manufacturerDetails,
    paymentForm
  } = location.state || {};

  const [paymentDetails, setPaymentDetails] = useState({
    customerName: '',
    emailAddress: '',
    mobileNumber: '',
    deliveryAddress: '',
    paymentDetails: ''
  });

  const token = Cookies.get("auto-direct-token");

  // Update payment details when component loads
  useEffect(() => {
    if (purchaseFormData) {
      const fullAddress = `${purchaseFormData.streetNumber || ''} ${purchaseFormData.streetName || ''}, ${purchaseFormData.suburb || ''}, ${purchaseFormData.state || ''} ${purchaseFormData.postcode || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '').trim();
      
      setPaymentDetails({
        customerName: customerName || '',
        emailAddress: purchaseFormData.email || '',
        mobileNumber: purchaseFormData.phone || '',
        deliveryAddress: fullAddress,
        paymentDetails: ''
      });
    }
  }, [customerName, purchaseFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    // Navigate back to payment instructions page
    navigate('/payment-instructions', {
      state: {
        orderID,
        customerName,
        purchaseFormData,
        vehicleDetails,
        manufacturerDetails
      }
    });
  };

  const handleMarkAsPaid = async () => {
    console.log('💰 Marking as paid - sending data:', {
      orderID,
      customerName,
      customerEmail: purchaseFormData?.email,
      customerPhone: purchaseFormData?.phone,
      customerAddress: paymentDetails.deliveryAddress,
      vehicleDetails,
      manufacturerDetails
    });
    
    // Send email in background
    try {
      const response = await fetch(api + '/order-processing/mark-paid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderID,
          customerName,
          customerEmail: purchaseFormData?.email,
          customerPhone: purchaseFormData?.phone,
          customerAddress: paymentDetails.deliveryAddress,
          vehicleDetails,
          manufacturerDetails
        })
      });

      if (response.ok) {
        console.log('✅ Order marked as paid successfully - emails sent');
      } else {
        const errorData = await response.text();
        console.log('⚠️ Mark as paid had issues but continuing:', errorData);
      }
    } catch (error) {
      console.log('⚠️ Background email processing had issues:', error);
    }

    // Navigate to success page (existing purchase vehicle page)
    navigate('/purchase-vehicle', {
      state: {
        orderID,
        customerName,
        purchaseFormData,
        vehicleDetails,
        manufacturerDetails
      }
    });
  };

  const handleProceedWithOrder = async () => {
    console.log('🚀 Proceeding with order - sending data:', {
      orderID,
      customerName,
      customerEmail: purchaseFormData?.email,
      customerPhone: purchaseFormData?.phone,
      customerAddress: paymentDetails.deliveryAddress,
      vehicleDetails,
      manufacturerDetails
    });
    
    // Send email in background
    try {
      const response = await fetch(api + '/order-processing/process-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderID,
          customerName,
          customerEmail: purchaseFormData?.email,
          customerPhone: purchaseFormData?.phone,
          customerAddress: paymentDetails.deliveryAddress,
          vehicleDetails,
          manufacturerDetails
        })
      });

      if (response.ok) {
        console.log('✅ Order processed successfully - emails sent');
      } else {
        const errorData = await response.text();
        console.log('⚠️ Order processing had issues but continuing:', errorData);
      }
    } catch (error) {
      console.log('⚠️ Background email processing had issues:', error);
    }

    // Navigate to browse page after successful order
    navigate('/browse');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment</h1>
        </div>

        {/* Order Details */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Details:</h3>
          <p className="text-gray-600">Order ID: <span className="font-semibold text-blue-600">#{orderID}</span></p>
        </div>

        {/* Payment Form */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={paymentDetails.customerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="emailAddress"
                value={paymentDetails.emailAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={paymentDetails.mobileNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <input
                type="text"
                name="deliveryAddress"
                value={paymentDetails.deliveryAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Details
              </label>
              <textarea
                name="paymentDetails"
                value={paymentDetails.paymentDetails}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payment details or notes..."
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mb-8">
          <button
            onClick={handleBack}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 transition-colors font-semibold"
          >
            Back to Payment Instructions
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleMarkAsPaid}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 transition-colors font-semibold"
            >
              Mark as Paid
            </button>
            <button
              onClick={handleProceedWithOrder}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors font-semibold"
            >
              Proceed with Order
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-gray-500 border-t pt-4">
          <p>
            <strong>Disclaimer:</strong> By clicking the 'Create Order' button you acknowledge you have read and agree to abide by the Auto 
            Direct <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>. When you use this enquiry form your contact details will be forwarded to the seller so they can contact 
            you directly.
          </p>
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

export default PaymentDetailsPage;
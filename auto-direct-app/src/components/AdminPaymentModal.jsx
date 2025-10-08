import React, { useState, useEffect } from 'react';
import api from '../data/api-calls';
import Cookies from 'js-cookie';

const AdminPaymentModal = ({ 
  isOpen, 
  onClose, 
  orderID,
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  vehicleDetails,
  manufacturerDetails,
  onMarkAsPaid,
  onProceedWithOrder 
}) => {
  const [paymentDetails, setPaymentDetails] = useState({
    customerName: '',
    emailAddress: '',
    mobileNumber: '',
    deliveryAddress: '',
    paymentDetails: ''
  });

  const token = Cookies.get("auto-direct-token");

  // Update payment details when props change
  useEffect(() => {
    if (isOpen) {
      console.log('📝 AdminPaymentModal props received:', {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress
      });
      
      setPaymentDetails({
        customerName: customerName || '',
        emailAddress: customerEmail || '',
        mobileNumber: customerPhone || '',
        deliveryAddress: customerAddress || '',
        paymentDetails: ''
      });
    }
  }, [isOpen, customerName, customerEmail, customerPhone, customerAddress]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarkAsPaid = async () => {
    console.log('💰 Marking as paid - sending data:', {
      orderID,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      vehicleDetails,
      manufacturerDetails
    });
    
    // Close modal immediately and redirect to main page
    onClose();
    window.location.href = '/';
    
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
          customerEmail,
          customerPhone,
          customerAddress,
          vehicleDetails,
          manufacturerDetails
        })
      });

      if (response.ok) {
        console.log('✅ Order marked as paid successfully - emails sent');
      } else {
        const errorData = await response.text();
        console.log('⚠️ Mark as paid had issues but continuing silently:', errorData);
      }
    } catch (error) {
      console.log('⚠️ Background email processing had issues but continuing silently:', error);
    }
  };

  const handleProceedWithOrder = async () => {
    console.log('🚀 Proceeding with order - sending data:', {
      orderID,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      vehicleDetails,
      manufacturerDetails
    });
    
    // Close modal immediately and redirect to main page
    onClose();
    window.location.href = '/';
    
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
          customerEmail,
          customerPhone,
          customerAddress,
          vehicleDetails,
          manufacturerDetails
        })
      });

      if (response.ok) {
        console.log('✅ Order processed successfully - emails sent');
      } else {
        const errorData = await response.text();
        console.log('⚠️ Order processing had issues but continuing silently:', errorData);
      }
    } catch (error) {
      console.log('⚠️ Background email processing had issues but continuing silently:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full mx-4 relative border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Details:</h3>
          <p className="text-gray-600">Order ID: <span className="font-semibold">{orderID}</span></p>
        </div>

        {/* Payment Form */}
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

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 gap-4">
          <button
            onClick={handleMarkAsPaid}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors font-semibold flex-1"
          >
            Mark as Paid
          </button>
          <button
            onClick={handleProceedWithOrder}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors font-semibold flex-1"
          >
            Proceed with Order
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            <strong>Disclaimer:</strong> By clicking the 'Create Order' button you acknowledge you have read and agree to abide by the Auto 
            Direct <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>. When you use this enquiry form your contact details will be forwarded to the seller so they can contact 
            you directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentModal;
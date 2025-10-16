import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Clean Order Management Page with Auto-Fill Functionality
const OrderManagementPageClean = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Form state for customer details
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bestContact: '',
    deliveryAddress: '',
    licenseNumber: '',
    vehicleModel: '',
    manufacturer: '',
    manufacturerContact: '',
    vinDetails: '',
    logisticsCompany: '',
    logisticsCompanyContact: '',
    orderStatus: '',
    salesRep: '',
    financingStatus: '',
    estimatedDelivery: '',
    trackingNumber: ''
  });

  // Search state
  const [selectedOrderID, setSelectedOrderID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderFound, setOrderFound] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Toast notification function
  const showToast = (message, type = 'info') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Test order data for fallback
  const getTestOrderByID = (orderID) => {
    const testOrders = {
      'SUBBE814UP': {
        orderID: 'SUBBE814UP',
        customerName: 'John Smith',
        customerFirstName: 'John',
        customerLastName: 'Smith',
        customerEmail: 'john.smith@email.com',
        customerPhone: '+1 (555) 123-4567',
        deliveryAddress: '123 Main Street, City, State 12345',
        licenseNumber: 'DL123456789',
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        vehicleVIN: '1HGBH41JXMN109186',
        status: 'Processing',
        salesRep: 'Mike Johnson',
        financingStatus: 'Approved',
        estimatedDelivery: '2025-11-15',
        manufacturerName: 'Toyota Motors',
        logisticsCompany: 'Auto Direct Logistics'
      },
      'SUBJJ332UP': {
        orderID: 'SUBJJ332UP',
        customerName: 'Sarah Davis',
        customerFirstName: 'Sarah',
        customerLastName: 'Davis',
        customerEmail: 'sarah.davis@email.com',
        customerPhone: '+1 (555) 987-6543',
        deliveryAddress: '456 Oak Avenue, Town, State 67890',
        licenseNumber: 'DL987654321',
        vehicleMake: 'Honda',
        vehicleModel: 'Civic',
        vehicleVIN: '2HGFC2F59HH123456',
        status: 'Confirmed',
        salesRep: 'Lisa Chen',
        financingStatus: 'Pending',
        estimatedDelivery: '2025-12-01',
        manufacturerName: 'Honda Manufacturing',
        logisticsCompany: 'Auto Direct Logistics'
      },
      'SUBAS562UP': {
        orderID: 'SUBAS562UP',
        customerName: 'Michael Brown',
        customerFirstName: 'Michael',
        customerLastName: 'Brown',
        customerEmail: 'michael.brown@email.com',
        customerPhone: '+1 (555) 456-7890',
        deliveryAddress: '789 Pine Road, Village, State 54321',
        licenseNumber: 'DL456789123',
        vehicleMake: 'Ford',
        vehicleModel: 'F-150',
        vehicleVIN: '1FTFW1ET5DKE12345',
        status: 'Delivered',
        salesRep: 'Tom Wilson',
        financingStatus: 'Complete',
        estimatedDelivery: '2025-10-20',
        manufacturerName: 'Ford Motor Company',
        logisticsCompany: 'Auto Direct Logistics'
      }
    };
    return testOrders[orderID] || null;
  };

  // Auto-fill function - this is your main functionality!
  const handleQuickOrderSearch = async () => {
    if (!selectedOrderID.trim()) {
      showToast('Please enter an Order ID', 'warning');
      return;
    }

    setIsLoading(true);
    setOrderFound(false);
    setOrderNotFound(false);
    setSearchAttempted(false);
    
    console.log('🔍 Quick Order Search:', selectedOrderID);

    try {
      const token = Cookies.get("auto-direct-token");
      
      // Try to get real data from API first
      const response = await fetch(`${api}/order-processing/get-order/${selectedOrderID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const orderData = await response.json();
        console.log('✅ Order found via API:', orderData);
        
        // AUTO-FILL ALL CUSTOMER DETAILS
        setFormData({
          firstName: orderData.customerFirstName || '',
          lastName: orderData.customerLastName || '', 
          email: orderData.customerEmail || '',
          bestContact: orderData.customerPhone || '',
          deliveryAddress: orderData.deliveryAddress || '',
          licenseNumber: orderData.licenseNumber || '',
          vehicleModel: `${orderData.vehicleMake || ''} ${orderData.vehicleModel || ''}`.trim(),
          manufacturer: orderData.manufacturerName || orderData.vehicleMake || '',
          manufacturerContact: orderData.manufacturerContact || 'contact@manufacturer.com',
          vinDetails: orderData.vehicleVIN || orderData.vehicleID || '',
          logisticsCompany: orderData.logisticsCompany || 'Auto Direct Logistics',
          logisticsCompanyContact: orderData.logisticsContact || 'logistics@autodirect.com',
          orderStatus: orderData.status?.toLowerCase() || 'pending',
          salesRep: orderData.salesRep || 'Unassigned',
          financingStatus: orderData.financingStatus || 'pending',
          estimatedDelivery: orderData.estimatedDelivery || '',
          trackingNumber: orderData.trackingNumber || `TRK${selectedOrderID.slice(-6)}`
        });
        
        setOrderFound(true);
        setSearchAttempted(true);
        showToast(`Order ${selectedOrderID} found! All customer details auto-filled.`, 'success');
        
      } else {
        // Fallback to test data
        const testOrder = getTestOrderByID(selectedOrderID);
        if (testOrder) {
          // AUTO-FILL WITH TEST DATA
          setFormData({
            firstName: testOrder.customerFirstName || '',
            lastName: testOrder.customerLastName || '',
            email: testOrder.customerEmail || '',
            bestContact: testOrder.customerPhone || '',
            deliveryAddress: testOrder.deliveryAddress || '',
            licenseNumber: testOrder.licenseNumber || '',
            vehicleModel: `${testOrder.vehicleMake || ''} ${testOrder.vehicleModel || ''}`.trim(),
            manufacturer: testOrder.manufacturerName || '',
            manufacturerContact: 'contact@manufacturer.com',
            vinDetails: testOrder.vehicleVIN || '',
            logisticsCompany: testOrder.logisticsCompany || 'Auto Direct Logistics',
            logisticsCompanyContact: 'logistics@autodirect.com',
            orderStatus: testOrder.status?.toLowerCase() || 'pending',
            salesRep: testOrder.salesRep || 'Unassigned',
            financingStatus: testOrder.financingStatus || 'pending',
            estimatedDelivery: testOrder.estimatedDelivery || '',
            trackingNumber: `TRK${selectedOrderID.slice(-6)}`
          });
          
          setOrderFound(true);
          setSearchAttempted(true);
          showToast(`Order ${selectedOrderID} found (test data)! Details auto-filled.`, 'success');
        } else {
          setOrderNotFound(true);
          setSearchAttempted(true);
          showToast(`Order ${selectedOrderID} not found. Please check the Order ID.`, 'error');
        }
      }
    } catch (error) {
      console.error('❌ Quick search error:', error);
      
      // Fallback to test data on error
      const testOrder = getTestOrderByID(selectedOrderID);
      if (testOrder) {
        // AUTO-FILL WITH TEST DATA ON ERROR
        setFormData({
          firstName: testOrder.customerFirstName || '',
          lastName: testOrder.customerLastName || '',
          email: testOrder.customerEmail || '',
          bestContact: testOrder.customerPhone || '',
          deliveryAddress: testOrder.deliveryAddress || '',
          licenseNumber: testOrder.licenseNumber || '',
          vehicleModel: `${testOrder.vehicleMake || ''} ${testOrder.vehicleModel || ''}`.trim(),
          manufacturer: testOrder.manufacturerName || '',
          manufacturerContact: 'contact@manufacturer.com',
          vinDetails: testOrder.vehicleVIN || '',
          logisticsCompany: testOrder.logisticsCompany || 'Auto Direct Logistics',
          logisticsCompanyContact: 'logistics@autodirect.com',
          orderStatus: testOrder.status?.toLowerCase() || 'pending',
          salesRep: testOrder.salesRep || 'Unassigned',
          financingStatus: testOrder.financingStatus || 'pending',
          estimatedDelivery: testOrder.estimatedDelivery || '',
          trackingNumber: `TRK${selectedOrderID.slice(-6)}`
        });
        
        setOrderFound(true);
        setSearchAttempted(true);
        showToast(`Order ${selectedOrderID} found (offline)! Details auto-filled.`, 'success');
      } else {
        setOrderNotFound(true);
        setSearchAttempted(true);
        showToast(`Order ${selectedOrderID} not found. Please check the Order ID.`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-gray-600 hover:text-black"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold text-black mb-4">Professional Order Management</h1>
          <p className="text-gray-600 text-lg">Search by Order ID to auto-fill all customer details instantly</p>
        </div>

        {/* Quick Order Lookup Section */}
        <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-2 flex items-center">
            <svg className="w-6 h-6 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Quick Order Lookup & Auto-Fill
          </h2>
          <p className="text-gray-600 mb-4">Enter an Order ID to automatically fill all customer details and information.</p>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
              <input
                type="text"
                value={selectedOrderID}
                onChange={(e) => {
                  setSelectedOrderID(e.target.value);
                  setOrderFound(false);
                  setOrderNotFound(false);
                  setSearchAttempted(false);
                }}
                placeholder="Enter Order ID (e.g., SUBBE814UP, SUBJJ332UP)"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleQuickOrderSearch()}
              />
            </div>
            <button
              onClick={handleQuickOrderSearch}
              disabled={isLoading}
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center text-lg font-medium"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              {isLoading ? 'Searching...' : 'Search & Auto-Fill'}
            </button>
          </div>

          {/* Search Results */}
          {searchAttempted && (
            <div className="mt-4">
              {orderFound && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 font-medium">Order Found! All customer details have been auto-filled below.</span>
                  </div>
                </div>
              )}
              {orderNotFound && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 font-medium">Order not found. Please check the Order ID and try again.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customer Details Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-6">Customer Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Customer first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Customer last name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="customer@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                name="bestContact"
                value={formData.bestContact}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Full delivery address"
              />
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Driver's license number"
              />
            </div>

            {/* Vehicle Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="e.g., Toyota Camry"
              />
            </div>

            {/* VIN Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">VIN Number</label>
              <input
                type="text"
                name="vinDetails"
                value={formData.vinDetails}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Vehicle identification number"
              />
            </div>

            {/* Order Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
              <select
                name="orderStatus"
                value={formData.orderStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default OrderManagementPageClean;
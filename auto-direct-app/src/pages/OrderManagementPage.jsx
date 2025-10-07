import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../data/api-calls';
import Cookies from 'js-cookie';
import { useToast } from '../components/Toast';

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  
  const [formData, setFormData] = useState({
    // Customer Details
    firstName: '',
    lastName: '',
    email: '',
    bestContact: '',
    deliveryAddress: '',
    licenseNumber: '',
    
    // Vehicle Details
    vehicleModel: '',
    manufacturer: '',
    manufacturerContact: '',
    vinDetails: '',
    
    // Logistics Data
    logisticsCompany: '',
    logisticsCompanyContact: ''
  });

  const [selectedOrderID, setSelectedOrderID] = useState(''); 
  const [searchOrderID, setSearchOrderID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderFound, setOrderFound] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to search and auto-fill order data
  const handleSearchOrder = async () => {
    if (!searchOrderID.trim()) {
      console.log('❌ No Order ID entered');
      return;
    }

    setIsLoading(true);
    setOrderFound(false);
    setOrderNotFound(false);
    setSearchAttempted(false);
    
    console.log('🔍 Searching for Order ID:', searchOrderID);

    try {
      const token = Cookies.get("auto-direct-token");
      
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      // First try to get order data from storage (orders created from forms)
      const orderResponse = await fetch(api + `/order-processing/get-order/${searchOrderID}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let orderData = null;
      
      if (orderResponse.ok) {
        orderData = await orderResponse.json();
        console.log('✅ Found order in storage:', orderData);
      } else {
        // If not found in storage, try to fetch from database (existing orders)
        console.log('⚠️ Order not found in storage, checking database...');
        const dbResponse = await fetch(api + `/purchases/search/${searchOrderID}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (dbResponse.ok) {
          orderData = await dbResponse.json();
          console.log('✅ Found order in database:', orderData);
        }
      }

      if (orderData) {
        console.log('✅ Order found, auto-filling form');
        
        setFormData({
          firstName: orderData.customerFirstName || orderData.customerName?.split(' ')[0] || '',
          lastName: orderData.customerLastName || orderData.customerName?.split(' ').slice(1).join(' ') || '',
          email: orderData.customerEmail || '',
          bestContact: orderData.customerPhone || '',
          deliveryAddress: orderData.deliveryAddress || '',
          licenseNumber: orderData.licenseNumber || '',
          vehicleModel: `${orderData.vehicleMake || ''} ${orderData.vehicleModel || ''}`.trim(),
          manufacturer: orderData.manufacturerName || orderData.vehicleMake || '',
          manufacturerContact: orderData.manufacturerContact || 'contact@manufacturer.com',
          vinDetails: orderData.vehicleVIN || orderData.vehicleID || '',
          logisticsCompany: orderData.logisticsCompany || 'Auto Direct Logistics',
          logisticsCompanyContact: orderData.logisticsContact || 'logistics@autodirect.com'
        });
        
        setSelectedOrderID(searchOrderID);
        setOrderFound(true);
        setSearchAttempted(true);
      } else {
        console.log('❌ Order not found anywhere');
        setOrderNotFound(true);
        setSearchAttempted(true);
        setOrderFound(false);
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      console.log('❌ Order not found - using fallback to show not found');
      setOrderNotFound(true);
      setSearchAttempted(true);
      setOrderFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleManagePayment = () => {
    console.log('💰 Managing payment for order:', selectedOrderID);
    // Navigate to payment management or open payment modal
    alert('Payment management functionality - redirect to payment processing');
  };

  const handleProcessOrder = async () => {
    if (!selectedOrderID) {
      alert('Please search and select an order first');
      return;
    }

    setIsProcessing(true);
    const token = Cookies.get("auto-direct-token");
    
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      setIsProcessing(false);
      return;
    }
    
    try {
      console.log('🚀 Processing order:', selectedOrderID);
      console.log('🔑 Token found:', token ? 'Yes' : 'No');
      console.log('📋 Order data being processed:', formData);

      console.log('📧 Processing order directly with email notifications...');
        
      // Prepare comprehensive email data for all stakeholders
        const emailOrderData = {
          orderID: selectedOrderID,
          customerFirstName: formData.firstName,
          customerLastName: formData.lastName,
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          customerEmail: formData.email,
          customerPhone: formData.bestContact,
          deliveryAddress: formData.deliveryAddress,
          licenseNumber: formData.licenseNumber,
          vehicleMake: formData.manufacturer,
          vehicleModel: formData.vehicleModel.replace(formData.manufacturer, '').trim(),
          manufacturerName: formData.manufacturer,
          manufacturerContact: formData.manufacturerContact,
          vehicleVIN: formData.vinDetails,
          vehicleID: formData.vinDetails,
          testDriveRequested: false,
          logisticsCompany: formData.logisticsCompany,
          logisticsContact: formData.logisticsCompanyContact,
          // Additional tracking and delivery info
          trackingNumber: `AD${selectedOrderID}${Math.floor(Math.random() * 1000)}`,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 days from now
          internalOrderRef: selectedOrderID
        };

      // Send comprehensive notifications to all parties using the process-order endpoint
      try {
        console.log('📧 Processing order and sending notifications to all stakeholders...');
        console.log('📋 Order processing data:', emailOrderData);
        
        const processResponse = await fetch(api + '/order-processing/process-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(emailOrderData)
        });

        if (processResponse.ok) {
          console.log('✅ Order processed and emails sent silently to all stakeholders');
          console.log('📧 Silent email dispatch completed for:');
          console.log('  👤 Customer:', emailOrderData.customerEmail);
          console.log('  🏢 Manufacturer:', emailOrderData.manufacturerContact);
          console.log('  🚛 Logistics (Internal):', 'logistics@autodirect.com');
          console.log('  🚛 Logistics (External):', emailOrderData.logisticsContact);
          console.log('  💼 Data Entry Team:', 'dataentry@autodirect.com');
          
          // Show professional success toast and navigate back
          showToast('Order processed successfully!', 'success');
          setTimeout(() => navigate(-1), 2000); // Wait for toast to show before navigating
          
        } else {
          const errorText = await processResponse.text();
          console.error('❌ Order processing failed:', processResponse.status, errorText);
          alert(`Failed to process order: ${processResponse.status} - ${errorText}`);
        }
      } catch (processError) {
        console.error('❌ Order processing had issues:', processError);
        alert('Failed to process order. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error processing order:', error);
      alert('An error occurred while processing the order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order Management Dashboard</h1>
          <p className="text-gray-600 mt-2">Search and manage customer orders, update details, and process payments</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Order by ID</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
              <input
                type="text"
                value={searchOrderID}
                onChange={(e) => setSearchOrderID(e.target.value)}
                placeholder="Enter 10-digit Order ID (e.g., SUBJ590UP)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearchOrder}
                disabled={isLoading}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Search Results */}
          {searchAttempted && (
            <div className="mt-4">
              {orderFound && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Order found! Form has been auto-filled with order details.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {orderNotFound && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        Order ID "{searchOrderID}" not found. Please check the ID and try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Details Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Best Contact</label>
                <input
                  type="text"
                  name="bestContact"
                  value={formData.bestContact}
                  onChange={handleInputChange}
                  placeholder="Enter best contact method"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Enter full delivery address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="Enter license number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Vehicle & Logistics Details */}
          <div className="space-y-8">
            {/* Vehicle Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    placeholder="Enter vehicle model"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    placeholder="Enter manufacturer name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer Contact</label>
                  <input
                    type="text"
                    name="manufacturerContact"
                    value={formData.manufacturerContact}
                    onChange={handleInputChange}
                    placeholder="Enter manufacturer contact"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN Details</label>
                  <input
                    type="text"
                    name="vinDetails"
                    value={formData.vinDetails}
                    onChange={handleInputChange}
                    placeholder="Enter VIN details"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Logistics Data */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Logistics Data</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logistics Company</label>
                  <input
                    type="text"
                    name="logisticsCompany"
                    value={formData.logisticsCompany}
                    onChange={handleInputChange}
                    placeholder="Enter logistics company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logistics Company Contact</label>
                  <input
                    type="text"
                    name="logisticsCompanyContact"
                    value={formData.logisticsCompanyContact}
                    onChange={handleInputChange}
                    placeholder="Enter logistics company contact"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleManagePayment}
            disabled={!orderFound}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Manage Payment
          </button>
          <button
            onClick={handleProcessOrder}
            disabled={!orderFound || isProcessing}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Processing...
              </span>
            ) : (
              'Process Order'
            )}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            <strong>Disclaimer:</strong> By clicking the 'Process Order' button you acknowledge you have read 
            and agree to abide by the Auto Direct <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>. 
            When you use this system your contact details will be forwarded to the seller so they can contact you directly.
          </p>
        </div>
        
        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default OrderManagementPage;
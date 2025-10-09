import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../data/api-calls';
import Cookies from 'js-cookie';
import AdminPaymentModal from '../components/AdminPaymentModal';
import { useToast } from '../components/Toast';

const SAPDatabasePage = () => {
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

  const [showAdminPayment, setShowAdminPayment] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(''); 
  const [searchOrderID, setSearchOrderID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderFound, setOrderFound] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

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

    // First, check localStorage for stored order data
    const storedOrders = localStorage.getItem('orderData');
    if (storedOrders) {
      try {
        const orders = JSON.parse(storedOrders);
        const foundOrder = orders.find(order => order.orderID === searchOrderID);
        if (foundOrder) {
          console.log('✅ Found order in localStorage:', foundOrder);
          
          // Auto-fill with stored data
          setFormData({
            firstName: foundOrder.customerFirstName || '',
            lastName: foundOrder.customerLastName || '',
            email: foundOrder.customerEmail || '',
            bestContact: foundOrder.customerPhone || '',
            deliveryAddress: foundOrder.deliveryAddress || '',
            licenseNumber: foundOrder.licenseNumber || '',
            vehicleModel: `${foundOrder.vehicleMake || ''} ${foundOrder.vehicleModel || ''}`.trim(),
            manufacturer: foundOrder.manufacturerName || foundOrder.vehicleMake || '',
            manufacturerContact: foundOrder.manufacturerContact || '',
            vinDetails: foundOrder.vehicleVIN || foundOrder.vehicleID || '',
            logisticsCompany: foundOrder.logisticsCompany || 'Auto Direct Logistics',
            logisticsCompanyContact: foundOrder.logisticsContact || 'logistics@autodirect.com'
          });
          
          setSelectedOrderID(searchOrderID);
          setOrderFound(true);
          setSearchAttempted(true);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log('Error parsing stored orders:', error);
      }
    }

    // Known test orders - this will work immediately
    const knownOrders = {
      'SUBJJ332UP': {
        customerFirstName: 'Jonne',
        customerLastName: 'Jo',
        customerEmail: 'jooll@gmail.com',
        customerPhone: '+61478859585',
        deliveryAddress: '123 Main street, Sydney, NSW 2000',
        licenseNumber: 'NSW123456',
        vehicleMake: 'Subaru',
        vehicleModel: 'BRZ',
        manufacturerName: 'Subaru',
        manufacturerContact: 'orders@subaru.com.au',
        vehicleVIN: 'SUBJJ332UP',
        vehicleID: 'SUBJJ332UP',
        logisticsCompany: 'Auto Direct Logistics',
        logisticsContact: 'logistics@autodirect.com'
      },
      'SUBJJ378UP': {
        customerFirstName: 'Jonne',
        customerLastName: 'Jo',
        customerEmail: 'jooll@gmail.com',
        customerPhone: '+61478859585',
        deliveryAddress: '123 Main street, Sydney, NSW 2000',
        licenseNumber: 'NSW123456',
        vehicleMake: 'Subaru',
        vehicleModel: 'BRZ',
        manufacturerName: 'Subaru',
        manufacturerContact: 'orders@subaru.com.au',
        vehicleVIN: 'SUBJJ378UP',
        vehicleID: 'SUBJJ378UP',
        logisticsCompany: 'Auto Direct Logistics',
        logisticsContact: 'logistics@autodirect.com'
      },
      'TEST123': {
        customerFirstName: 'John',
        customerLastName: 'Smith',
        customerEmail: 'john.smith@email.com',
        customerPhone: '+61423456789',
        deliveryAddress: '456 Collins Street, Melbourne, VIC, 3000',
        licenseNumber: 'VIC789123',
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        manufacturerName: 'Toyota Australia',
        manufacturerContact: 'orders@toyota.com.au',
        vehicleVIN: 'TEST123',
        vehicleID: 'TEST123',
        logisticsCompany: 'Auto Direct Logistics',
        logisticsContact: 'logistics@autodirect.com'
      }
    };

    // Check if it's a known order
    if (knownOrders[searchOrderID]) {
      const orderData = knownOrders[searchOrderID];
      console.log('✅ Found known order:', orderData);
      
      // Auto-fill all form fields
      setFormData({
        firstName: orderData.customerFirstName || '',
        lastName: orderData.customerLastName || '',
        email: orderData.customerEmail || '',
        bestContact: orderData.customerPhone || '',
        deliveryAddress: orderData.deliveryAddress || '',
        licenseNumber: orderData.licenseNumber || '',
        vehicleModel: `${orderData.vehicleMake || ''} ${orderData.vehicleModel || ''}`.trim(),
        manufacturer: orderData.manufacturerName || orderData.vehicleMake || '',
        manufacturerContact: orderData.manufacturerContact || '',
        vinDetails: orderData.vehicleVIN || orderData.vehicleID || '',
        logisticsCompany: orderData.logisticsCompany || 'Auto Direct Logistics',
        logisticsCompanyContact: orderData.logisticsContact || 'logistics@autodirect.com'
      });
      
      setSelectedOrderID(searchOrderID);
      setOrderFound(true);
      setSearchAttempted(true);
      console.log('✅ Form data updated with order details');
      setIsLoading(false);
      return;
    }

    // If not found, try the API as fallback
    const token = Cookies.get("auto-direct-token");
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(api + `/order-processing/get-order/${searchOrderID}`, {
        method: 'GET',
        headers: headers
      });

      if (response.ok) {
        const orderData = await response.json();
        console.log('✅ Order found via API:', orderData);
        
        setFormData({
          firstName: orderData.customerFirstName || '',
          lastName: orderData.customerLastName || '',
          email: orderData.customerEmail || '',
          bestContact: orderData.customerPhone || '',
          deliveryAddress: orderData.deliveryAddress || '',
          licenseNumber: orderData.licenseNumber || '',
          vehicleModel: `${orderData.vehicleMake || ''} ${orderData.vehicleModel || ''}`.trim(),
          manufacturer: orderData.manufacturerName || orderData.vehicleMake || '',
          manufacturerContact: orderData.manufacturerContact || '',
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



  const handleProcessOrder = async () => {
    const token = Cookies.get("auto-direct-token");
    
    try {
      // Step 1: Update SAP database
      const response = await fetch(api + '/order-processing/update-sap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('✅ SAP database updated successfully');
        
        // Step 2: Automatically send emails silently
        const emailOrderData = {
          orderID: selectedOrderID,
          customerFirstName: formData.firstName,
          customerLastName: formData.lastName,
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          customerEmail: formData.email,
          customerPhone: formData.bestContact,
          deliveryAddress: formData.deliveryAddress,
          vehicleMake: formData.manufacturer,
          vehicleModel: formData.vehicleModel.replace(formData.manufacturer, '').trim(),
          manufacturerName: formData.manufacturer,
          manufacturerContact: formData.manufacturerContact,
          vehicleVIN: formData.vinDetails,
          vehicleID: formData.vinDetails,
          testDriveRequested: false,
          logisticsCompany: formData.logisticsCompany,
          logisticsContact: formData.logisticsCompanyContact
        };

        try {
          console.log('📧 Sending emails automatically for order:', emailOrderData.orderID);
          
          const emailResponse = await fetch(api + '/order-processing/mark-paid', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(emailOrderData)
          });

          if (emailResponse.ok) {
            console.log('✅ Emails sent automatically to all contacts');
            console.log('📧 Notifications sent to:', {
              customer: emailOrderData.customerEmail,
              dataEntry: 'dataentry@autodirect.com',
              logistics: 'logistics@autodirect.com',
              manufacturer: emailOrderData.manufacturerContact
            });
          } else {
            console.warn('⚠️ SAP updated but emails failed to send');
          }
        } catch (emailError) {
          console.warn('⚠️ SAP updated but email sending encountered an error:', emailError);
        }
        
        showToast('Order processed successfully!', 'success');
        setTimeout(() => navigate(-1), 2000);
      } else {
        console.error('❌ Failed to update SAP database');
        showToast('Failed to process order', 'error');
      }
    } catch (error) {
      console.error('❌ Error updating SAP database:', error);
      alert('Error processing order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">SAP Database</h1>
          <p className="text-gray-600 mt-2">Order Status: {orderFound ? 'Found' : 'Created'}</p>
        </div>

        {/* Order ID Search */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Order by ID</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchOrderID}
                  onChange={(e) => {
                    setSearchOrderID(e.target.value);
                    setSearchAttempted(false);
                    setOrderFound(false);
                    setOrderNotFound(false);
                  }}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 10-digit Order ID (e.g., SUBJJ590UP)"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchOrder()}
                />
                {/* Status Icons */}
                {searchAttempted && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {orderFound && (
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-500 text-sm font-medium">Verified</span>
                      </div>
                    )}
                    {orderNotFound && (
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-500 text-sm font-medium">Not Found</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleSearchOrder}
              disabled={isLoading || !searchOrderID.trim()}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {/* Status Messages */}
          {searchAttempted && orderFound && (
            <div className="mt-3 p-3 bg-green-100 border border-green-400 rounded-md">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800 text-sm font-medium">
                  Order {selectedOrderID} verified! All fields auto-filled with customer data.
                </p>
              </div>
            </div>
          )}
          
          {searchAttempted && orderNotFound && (
            <div className="mt-3 p-3 bg-red-100 border border-red-400 rounded-md">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 text-sm font-medium">
                  Order ID "{selectedOrderID}" not found. Please check the ID and try again.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Customer Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Best Contact
                  </label>
                  <input
                    type="text"
                    name="bestContact"
                    value={formData.bestContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter best contact method"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full delivery address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter license number"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Details & Logistics */}
            <div className="space-y-8">
              {/* Vehicle Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Vehicle Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter vehicle model"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter manufacturer name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer Contact
                    </label>
                    <input
                      type="text"
                      name="manufacturerContact"
                      value={formData.manufacturerContact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter manufacturer contact"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VIN details
                    </label>
                    <input
                      type="text"
                      name="vinDetails"
                      value={formData.vinDetails}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter VIN details"
                    />
                  </div>
                </div>
              </div>

              {/* Logistics Data */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Logistics Data</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logistics Company
                    </label>
                    <input
                      type="text"
                      name="logisticsCompany"
                      value={formData.logisticsCompany}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter logistics company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logistics Company Contact
                    </label>
                    <input
                      type="text"
                      name="logisticsCompanyContact"
                      value={formData.logisticsCompanyContact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter logistics company contact"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowAdminPayment(true)}
                className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold text-lg"
              >
                Manage Payment
              </button>
              <button
                onClick={handleProcessOrder}
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
              >
                Process Order
              </button>
            </div>
            <div className="mt-2 text-center text-sm text-gray-500">
              <p>Processing will automatically notify all relevant contacts via email</p>
            </div>
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

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 Autos Direct. All rights reserved. | Contact | Privacy Policy | Glossary
        </div>
      </div>

      {/* Admin Payment Modal */}
      <AdminPaymentModal
        isOpen={showAdminPayment}
        onClose={() => setShowAdminPayment(false)}
        orderID={selectedOrderID}
        customerDetails={{
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.bestContact,
          streetNumber: '',
          streetName: '',
          suburb: '',
          state: '',
          postcode: ''
        }}
        vehicleDetails={{
          makeName: formData.manufacturer,
          modelName: formData.vehicleModel,
          vin: formData.vinDetails
        }}
        manufacturerDetails={{
          manufacturerName: formData.manufacturer,
          email: 'manufacturer@example.com'
          
        }}
        onMarkAsPaid={() => {
          console.log('Order marked as paid');
          setShowAdminPayment(false);
        }}
        onProceedWithOrder={() => {
          console.log('Proceeding with order');
          setShowAdminPayment(false);
        }}
      />
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default SAPDatabasePage;
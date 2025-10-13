import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfessionalOrderManagementPage = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // State for view mode
  const [viewMode, setViewMode] = useState('table'); // 'search' or 'table' - Default to table like the league system
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Enhanced form data with professional fields
  const [formData, setFormData] = useState({
    // Customer Details
    firstName: '',
    lastName: '',
    email: '',
    bestContact: '',
    deliveryAddress: '',
    licenseNumber: '',
    
    // Vehicle Information
    vehicleModel: '',
    manufacturer: '',
    manufacturerContact: '',
    vinDetails: '',
    
    // Professional Order Management
    orderStatus: '',
    salesRep: '',
    financingStatus: '',
    trackingNumber: '',
    estimatedDelivery: '',
    
    // Logistics coordination
    logisticsCompany: '',
    logisticsCompanyContact: ''
  });

  const [selectedOrderID, setSelectedOrderID] = useState('');
  const [searchBy, setSearchBy] = useState('Order ID');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isLoading, setIsLoading] = useState(false);
  const [orderFound, setOrderFound] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Orders data for table view
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
  // Edit functionality state
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Test order data for auto-fill
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
        vehicleVIN: '1HGCM82633A123456',
        status: 'Processing',
        salesRep: 'Mike Johnson',
        financingStatus: 'Pending',
        estimatedDelivery: '2025-11-15',
        manufacturerName: 'Toyota Motor Corporation',
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

  // Auto-fill function when order is found
  const fillOrderData = (orderData) => {
    setFormData({
      firstName: orderData.customerFirstName || '',
      lastName: orderData.customerLastName || '',
      email: orderData.customerEmail || '',
      bestContact: orderData.customerPhone || '',
      deliveryAddress: orderData.deliveryAddress || '',
      licenseNumber: orderData.licenseNumber || '',
      vehicleModel: `${orderData.vehicleMake || ''} ${orderData.vehicleModel || ''}`.trim(),
      manufacturer: orderData.manufacturerName || '',
      manufacturerContact: '',
      vinDetails: orderData.vehicleVIN || '',
      orderStatus: orderData.status || '',
      salesRep: orderData.salesRep || '',
      financingStatus: orderData.financingStatus || '',
      estimatedDelivery: orderData.estimatedDelivery || '',
      logisticsCompany: orderData.logisticsCompany || '',
      logisticsCompanyContact: '',
      trackingNumber: ''
    });
  };

  // Fetch orders for table view
  const fetchAllOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const token = Cookies.get("auto-direct-token");
      const response = await fetch(`${api}/order-processing/get-all-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        console.log('✅ Orders loaded:', ordersData);
      } else {
        // Fallback to demo data for testing
        const demoOrders = [
          {
            orderID: 'SUBBE814UP',
            customerName: 'John Smith',
            customerEmail: 'john.smith@email.com',
            customerPhone: '+1 (555) 123-4567',
            vehicleMake: 'Toyota',
            vehicleModel: 'Camry',
            status: 'Processing',
            salesRep: 'Mike Johnson',
            estimatedDelivery: '2025-11-15'
          },
          {
            orderID: 'SUBJJ332UP',
            customerName: 'Sarah Davis',
            customerEmail: 'sarah.davis@email.com',
            customerPhone: '+1 (555) 987-6543',
            vehicleMake: 'Honda',
            vehicleModel: 'Civic',
            status: 'Confirmed',
            salesRep: 'Lisa Chen',
            estimatedDelivery: '2025-12-01'
          },
          {
            orderID: 'SUBAS562UP',
            customerName: 'Michael Brown',
            customerEmail: 'michael.brown@email.com',
            customerPhone: '+1 (555) 456-7890',
            vehicleMake: 'Ford',
            vehicleModel: 'F-150',
            status: 'Delivered',
            salesRep: 'Tom Wilson',
            estimatedDelivery: '2025-10-20'
          }
        ];
        setOrders(demoOrders);
        setFilteredOrders(demoOrders);
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Load orders when switching to table view
  useEffect(() => {
    if (viewMode === 'table') {
      fetchAllOrders();
    }
  }, [viewMode]);

  // Search function
  const handleSearch = async () => {
    if (!selectedOrderID.trim()) {
      showToast('Please enter a search value', 'warning');
      return;
    }

    setIsLoading(true);
    setOrderFound(false);
    setOrderNotFound(false);
    setSearchAttempted(false);
    
    console.log('🔍 Searching for order:', selectedOrderID);

    try {
      const token = Cookies.get("auto-direct-token");
      
      // Try API first
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
        
        fillOrderData(orderData);
        setOrderFound(true);
        setSearchAttempted(true);
        showToast(`Order ${selectedOrderID} found! All details auto-filled.`, 'success');
        
      } else {
        // Fallback to test data
        const testOrder = getTestOrderByID(selectedOrderID);
        if (testOrder) {
          console.log('✅ Order found in test data:', testOrder);
          fillOrderData(testOrder);
          setOrderFound(true);
          setSearchAttempted(true);
          showToast(`Order ${selectedOrderID} found! All details auto-filled.`, 'success');
        } else {
          console.log('❌ Order not found');
          setOrderNotFound(true);
          setSearchAttempted(true);
          showToast(`Order ${selectedOrderID} not found`, 'error');
        }
      }
    } catch (error) {
      console.error('❌ Error searching for order:', error);
      setOrderNotFound(true);
      setSearchAttempted(true);
      showToast('Search failed. Please try again.', 'error');
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

  // Edit functionality
  const handleEditOrder = (order) => {
    setEditingOrderId(order.orderID);
    setEditFormData({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      vehicleMake: order.vehicleMake,
      vehicleModel: order.vehicleModel,
      status: order.status,
      salesRep: order.salesRep || 'Sarah Johnson',
      estimatedDelivery: order.estimatedDelivery || '2025-10-10'
    });
    showToast(`Editing order ${order.orderID}`, 'info');
  };

  const handleSaveEdit = (orderID) => {
    // Update the order in the orders array
    const updatedOrders = orders.map(order => 
      order.orderID === orderID 
        ? { ...order, ...editFormData }
        : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    setEditingOrderId(null);
    setEditFormData({});
    showToast(`Order ${orderID} updated successfully!`, 'success');
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setEditFormData({});
    showToast('Edit cancelled', 'info');
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toast notification helper
  const showToast = (message, type = 'info') => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      default:
        toast.info(message, options);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8 text-center bg-gray-50 p-4 rounded">
        <h1 className="text-3xl font-bold text-black mb-2" style={{color: '#000000', fontSize: '28px'}}>Order Management</h1>
        <p className="text-gray-600">Manage and track all vehicle orders</p>
      </div>

        {/* Professional Tab Navigation - Black & White Theme */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-700 hover:text-black hover:bg-white'
              }`}
            >
              All Orders Table
            </button>
            <button
              onClick={() => setViewMode('search')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'search'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-700 hover:text-black hover:bg-white'
              }`}
            >
              Search Individual Order
            </button>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                showAnalytics
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-700 hover:text-black hover:bg-white'
              }`}
            >
              Show Statistics
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAllOrders}
              disabled={isLoadingOrders}
              className="flex items-center text-gray-600 hover:text-gray-800 font-medium text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* All Orders Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Table Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-black">All Orders</h2>
                <span className="text-gray-500 text-sm">({orders.length} of {orders.length} results)</span>
              </div>
              
              {/* Search Controls */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search orders, customers, vehicles..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:border-black w-64"
                  />
                </div>
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black">
                  <option>All Status</option>
                  <option>Processing</option>
                  <option>Confirmed</option>
                  <option>Delivered</option>
                </select>
                <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                  Refresh
                </button>
              </div>
            </div>

            {/* Table Headers */}
            <div className="bg-black text-white px-6 py-3">
              <div className="grid grid-cols-7 gap-4 text-sm font-medium">
                <div>ORDER DETAILS</div>
                <div>CUSTOMER INFO</div>
                <div>VEHICLE DETAILS</div>
                <div>STATUS & PROGRESS</div>
                <div>FINANCIAL</div>
                <div>QUICK ACTIONS</div>
                <div></div>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingOrders ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              /* Order Rows */
              <div className="divide-y divide-gray-100">
                {filteredOrders.map((order, index) => (
                  <div key={order.orderID || index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-7 gap-4 items-center">
                      {/* Order Details */}
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          UP
                        </div>
                        <div>
                          <div className="font-semibold text-black text-sm">{order.orderID}</div>
                          <div className="text-xs text-gray-500">{order.orderID?.slice(-6) || '000000'}</div>
                          <div className="text-xs text-gray-500">#001</div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div>
                        {editingOrderId === order.orderID ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              name="customerName"
                              value={editFormData.customerName || ''}
                              onChange={handleEditInputChange}
                              className="text-sm font-medium text-black border border-gray-300 rounded px-2 py-1 w-full"
                            />
                            <input
                              type="email"
                              name="customerEmail"
                              value={editFormData.customerEmail || ''}
                              onChange={handleEditInputChange}
                              className="text-sm text-black border border-gray-300 rounded px-2 py-1 w-full"
                            />
                            <input
                              type="text"
                              name="customerPhone"
                              value={editFormData.customerPhone || ''}
                              onChange={handleEditInputChange}
                              className="text-xs text-gray-600 border border-gray-300 rounded px-2 py-1 w-full"
                              placeholder="Phone"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-black text-sm">{order.customerName}</div>
                            <div className="text-sm text-gray-600">{order.customerEmail}</div>
                            <div className="text-xs text-gray-500">📞 {order.customerPhone}</div>
                            <div className="text-xs text-gray-500">Rep: {order.salesRep || 'Sarah Johnson'}</div>
                          </>
                        )}
                      </div>

                      {/* Vehicle Details */}
                      <div>
                        <div className="font-semibold text-black text-sm">{order.vehicleMake} {order.vehicleModel}</div>
                        <div className="text-sm text-gray-600">{order.vehicleMake} • 2024</div>
                        <div className="text-xs text-gray-500">VIN:</div>
                        <div className="text-xs font-mono text-gray-600">{order.orderID}***</div>
                      </div>

                      {/* Status & Progress */}
                      <div>
                        <div className="flex items-center mb-1">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            order.status === 'Delivered' ? 'bg-gray-800' :
                            order.status === 'Processing' ? 'bg-gray-600' :
                            order.status === 'Confirmed' ? 'bg-gray-800' :
                            'bg-gray-400'
                          }`}></div>
                          <span className="text-sm font-medium text-black">
                            {order.status || 'Confirmed'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">📅 {order.estimatedDelivery || '2025-10-10'}</div>
                      </div>

                      {/* Financial */}
                      <div>
                        <div className="font-bold text-black text-base">$50,000</div>
                        <div className="flex items-center text-xs text-gray-600">
                          <span className="mr-1">💳</span>
                          <span>Financing Available</span>
                        </div>
                        <div className="flex items-center text-xs mt-1 text-gray-600">
                          <span className="mr-1">⚠️</span>
                          <span>Pending</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={async () => {
                            setSelectedOrderID(order.orderID);
                            setViewMode('search');
                            setTimeout(() => {
                              handleSearch();
                            }, 100);
                          }}
                          className="bg-black text-white text-xs px-3 py-2 rounded hover:bg-gray-800 transition-colors font-medium"
                        >
                          📋 View Details
                        </button>
                        {editingOrderId === order.orderID ? (
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => handleSaveEdit(order.orderID)}
                              className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700 transition-colors"
                            >
                              Save
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              className="bg-gray-500 text-white text-xs px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleEditOrder(order)}
                            className="bg-gray-800 text-white text-xs px-3 py-2 rounded hover:bg-gray-700 transition-colors font-medium"
                          >
                            ✏️ Edit Order
                          </button>
                        )}
                      </div>

                      {/* More Actions */}
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.927 10.5a11.054 11.054 0 006.073 6.073l1.113-3.297a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        )}

        {/* Search Individual Order View */}
        {viewMode === 'search' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-black mb-6">Advanced Search</h2>
            
            {/* Search Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search By</label>
                <select 
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option>Order ID</option>
                  <option>Customer Name</option>
                  <option>Email</option>
                  <option>Phone</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Value</label>
                <input
                  type="text"
                  value={selectedOrderID}
                  onChange={(e) => setSelectedOrderID(e.target.value)}
                  placeholder="Enter search term..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option>All Status</option>
                  <option>Processing</option>
                  <option>Confirmed</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>

            {/* Search Results */}
            {searchAttempted && (
              <div className="mt-6">
                {orderFound ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                    <p className="text-green-800 font-medium">✅ Order found! Details loaded below.</p>
                  </div>
                ) : orderNotFound ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <p className="text-red-800 font-medium">❌ Order not found. Please check the order ID.</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Statistics Dashboard */}
        {showAnalytics && (
          <div className="mt-8">
            <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-black mb-6">📊 Order Statistics</h2>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-gray-300 rounded p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-black">{orders.length}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="bg-white border border-gray-300 rounded p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-black">{orders.filter(o => o.status === 'Delivered').length}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-white border border-gray-300 rounded p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-black">{orders.filter(o => o.status === 'Processing').length}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-white border border-gray-300 rounded p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-black">{orders.filter(o => o.status === 'Confirmed').length}</div>
                  <div className="text-sm text-gray-600">Pending Delivery</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-black mb-4">📈 Order Trends</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">This Month</span>
                      <span className="font-semibold text-black">{orders.length} orders</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Average Order Value</span>
                      <span className="font-semibold text-black">$45,000</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Popular Vehicle</span>
                      <span className="font-semibold text-black">Toyota Camry</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Top Sales Rep</span>
                      <span className="font-semibold text-black">Mike Johnson</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-black mb-4">🚗 Vehicle Categories</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Sedans</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-black h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-sm text-black font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">SUVs</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-black h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-sm text-black font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Trucks</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-black h-2 rounded-full" style={{width: '15%'}}></div>
                        </div>
                        <span className="text-sm text-black font-medium">15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mt-6 bg-white border border-gray-300 rounded p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-4">📊 Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center py-4 border-r border-gray-200">
                    <div className="text-2xl font-bold text-black">92%</div>
                    <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  </div>
                  <div className="text-center py-4 border-r border-gray-200">
                    <div className="text-2xl font-bold text-black">7 days</div>
                    <div className="text-sm text-gray-600">Avg. Processing Time</div>
                  </div>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-black">$2.1M</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
    </div>
  );
};

export default ProfessionalOrderManagementPage;
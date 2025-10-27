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
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [dateFilter, setDateFilter] = useState('Date: Today');
  const [quickSearch, setQuickSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderFound, setOrderFound] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Orders data for table view
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // Show 10 orders per page
  
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
    console.log('🔄 fetchAllOrders called');
    console.log('🌐 API URL:', `${api}/order-processing/get-all-orders`);
    
    try {
      const token = Cookies.get("auto-direct-token");
      console.log('🔑 Token from cookies:', token ? token.substring(0, 20) + '...' : 'No token found');
      
      const response = await fetch(`${api}/order-processing/get-all-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token  // Send raw token like PurchaseFlowPage does
        }
      });
      
      console.log('📨 API Response status:', response.status);
      console.log('📨 API Response headers:', response.headers);

      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        console.log('✅ Orders loaded from API:', ordersData);
      } else {
        console.log('❌ API call failed with status:', response.status);
        const errorText = await response.text();
        console.log('❌ API error response:', errorText);
        console.log('🔑 Token used:', token ? token.substring(0, 20) + '...' : 'No token');
        
        // Fallback to demo data for testing
        console.log('📋 Using demo data as fallback');
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

  // Filter orders by status and quick search
  useEffect(() => {
    if (orders.length > 0) {
      let filtered = orders;
      
      // Filter by status
      if (statusFilter !== 'Status: All' && statusFilter !== 'All') {
        filtered = filtered.filter(order => order.status === statusFilter);
      }
      
      // Filter by quick search (search in order ID, customer name, vehicle)
      if (quickSearch.trim()) {
        const searchLower = quickSearch.toLowerCase();
        filtered = filtered.filter(order => 
          order.orderID?.toLowerCase().includes(searchLower) ||
          order.customerName?.toLowerCase().includes(searchLower) ||
          order.customerEmail?.toLowerCase().includes(searchLower) ||
          order.vehicleMake?.toLowerCase().includes(searchLower) ||
          order.vehicleModel?.toLowerCase().includes(searchLower) ||
          `${order.vehicleMake} ${order.vehicleModel}`.toLowerCase().includes(searchLower)
        );
      }
      
      setFilteredOrders(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [statusFilter, quickSearch, orders]);

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
          'Authorization': token  // Send raw token like PurchaseFlowPage does
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
      <div className="mb-8 text-center bg-gray-50 p-6 rounded">
        <h1 className="text-3xl font-bold text-black mb-2" style={{color: '#000000', fontSize: '32px', lineHeight: '1.3', paddingTop: '8px'}}>Order Management</h1>
        <p className="text-gray-600">Manage and track all vehicle orders</p>
      </div>

      {/* Main Content with Overview Sidebar */}
      <div className="flex gap-8">
        {/* Left Side - Main Content */}
        <div className="flex-1">
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
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
          </div>
        </div>

        {/* All Orders Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Table Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-black">All Orders</h2>
                <span className="text-gray-500 text-sm">({filteredOrders.length} of {orders.length} results)</span>
              </div>
              
              {/* Search Controls */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    placeholder="Quick Search"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:border-black w-64"
                  />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option>Status: All</option>
                  <option>Processing</option>
                  <option>Confirmed</option>
                  <option>Delivered</option>
                </select>
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option>Date: Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>All Time</option>
                </select>
                <button 
                  onClick={fetchAllOrders}
                  disabled={isLoadingOrders}
                  className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {isLoadingOrders ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Table Headers */}
            <div className="bg-black text-white px-6 py-3">
              <div className="grid gap-4 text-sm font-medium" style={{ gridTemplateColumns: '1.2fr 1.2fr 1fr 0.8fr 0.8fr 1fr 1fr' }}>
                <div>ORDER DETAILS</div>
                <div>CUSTOMER INFO</div>
                <div>VEHICLE DETAILS</div>
                <div>STATUS</div>
                <div>PROGRESS</div>
                <div>FINANCIAL</div>
                <div>QUICK ACTIONS</div>
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
                {filteredOrders
                  .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
                  .map((order, index) => (
                  <div key={order.orderID || index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '1.2fr 1.2fr 1fr 0.8fr 0.8fr 1fr 1fr' }}>
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
                            <div className="text-xs text-gray-500">{order.customerPhone}</div>
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

                      {/* Status */}
                      <div>
                        {editingOrderId === order.orderID ? (
                          <select
                            name="status"
                            value={editFormData.status || order.status}
                            onChange={handleEditInputChange}
                            className="text-sm font-medium text-black border border-gray-300 rounded px-2 py-1 w-full"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              order.status === 'Delivered' ? 'bg-gray-800' :
                              order.status === 'Processing' ? 'bg-blue-500' :
                              order.status === 'Confirmed' ? 'bg-green-500' :
                              'bg-gray-400'
                            }`}></div>
                            <span className="text-sm font-medium text-black">
                              {order.status || 'Confirmed'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="text-sm text-gray-500">{order.estimatedDelivery || '2025-10-10'}</div>
                      </div>

                      {/* Financial */}
                      <div>
                        <div className="font-bold text-black text-base">${order.totalPrice || order.price || '50,000'}</div>
                        <div className="text-xs text-gray-600">
                          {order.financingOption === 'cash' || order.financingOption === 'Cash Purchase' ? 'Cash Payment' : 
                           order.financingOption === 'finance' || order.financingOption === 'Finance' ? 'Financing Available' :
                           order.financingOption === 'lease' || order.financingOption === 'Lease' ? 'Lease Agreement' :
                           order.paymentType === 'Cash Purchase' ? 'Cash Payment' :
                           order.paymentType === 'Finance' ? 'Financing Available' :
                           order.paymentType === 'Lease' ? 'Lease Agreement' :
                           'Payment Pending'}
                        </div>
                        {editingOrderId === order.orderID ? (
                          <select
                            name="paymentStatus"
                            value={editFormData.paymentStatus || order.paymentStatus || order.financingStatus || 'Pending'}
                            onChange={handleEditInputChange}
                            className="text-xs mt-1 text-gray-600 border border-gray-300 rounded px-2 py-1 w-full"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Failed">Failed</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        ) : (
                          <div className="text-xs mt-1 text-gray-600">
                            {order.paymentStatus || order.financingStatus || 'Pending'}
                          </div>
                        )}
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
                          View Details
                        </button>
                        {editingOrderId === order.orderID ? (
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => handleSaveEdit(order.orderID)}
                              className="bg-black text-white text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors"
                            >
                              Save
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              className="bg-white text-black text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleEditOrder(order)}
                            className="bg-black text-white text-xs px-3 py-2 rounded hover:bg-gray-800 transition-colors font-medium"
                          >
                            Edit
                          </button>
                        )}
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

            {/* Pagination Controls */}
            {filteredOrders.length > ordersPerPage && (
              <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} results
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ‹
                  </button>

                  {/* Page Numbers */}
                  {(() => {
                    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
                    const pageNumbers = [];
                    const maxVisiblePages = 5;
                    
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    
                    if (endPage - startPage < maxVisiblePages - 1) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    // First page
                    if (startPage > 1) {
                      pageNumbers.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pageNumbers.push(
                          <span key="ellipsis1" className="px-2 text-gray-500">...</span>
                        );
                      }
                    }

                    // Middle pages
                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`px-3 py-1 rounded border ${
                            currentPage === i
                              ? 'bg-black text-white border-black'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }

                    // Last page
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pageNumbers.push(
                          <span key="ellipsis2" className="px-2 text-gray-500">...</span>
                        );
                      }
                      pageNumbers.push(
                        <button
                          key={totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                          className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          {totalPages}
                        </button>
                      );
                    }

                    return pageNumbers;
                  })()}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredOrders.length / ordersPerPage)))}
                    disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === Math.ceil(filteredOrders.length / ordersPerPage)
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ›
                  </button>
                </div>
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
              className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 disabled:bg-gray-400"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>

            {/* Search Results */}
            {searchAttempted && orderNotFound && (
              <div className="mt-6">
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <p className="text-red-800 font-medium">❌ Order not found. Please check the order ID.</p>
                </div>
              </div>
            )}

            {/* Customer Details Form - Show when order is found */}
            {orderFound && (
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-black mb-4">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      name="bestContact"
                      value={formData.bestContact}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-black mb-4">Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VIN Details</label>
                    <input
                      type="text"
                      name="vinDetails"
                      value={formData.vinDetails}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                    <input
                      type="text"
                      name="orderStatus"
                      value={formData.orderStatus}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-black mb-4">Order Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Representative</label>
                    <input
                      type="text"
                      name="salesRep"
                      value={formData.salesRep}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery</label>
                    <input
                      type="date"
                      name="estimatedDelivery"
                      value={formData.estimatedDelivery}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logistics Company</label>
                    <input
                      type="text"
                      name="logisticsCompany"
                      value={formData.logisticsCompany}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>

        {/* Right Side - Overview Statistics Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-gray-50 rounded-lg p-8 sticky top-8 min-h-screen">
            <h3 className="text-xs font-semibold text-gray-500 mb-8 uppercase">OVERVIEW</h3>

            {/* Statistics - Vertical Layout */}
            <div className="space-y-10">
              {/* Orders Today */}
              <div>
                <div className="text-gray-500 text-xs mb-3">Orders Today</div>
                <div className="text-6xl font-bold text-black">{filteredOrders.length}</div>
              </div>

              {/* Pending Orders */}
              <div>
                <div className="text-gray-500 text-xs mb-3">Pending Orders</div>
                <div className="text-6xl font-bold text-black">
                  {filteredOrders.filter(o => o.status === 'Processing').length}
                </div>
              </div>

              {/* Delivered */}
              <div>
                <div className="text-gray-500 text-xs mb-3">Delivered</div>
                <div className="text-6xl font-bold text-black">
                  {filteredOrders.filter(o => o.status === 'Delivered').length}
                  <span className="text-base text-red-500 ml-2">-3%</span>
                </div>
              </div>

              {/* Cancelled */}
              <div>
                <div className="text-gray-500 text-xs mb-3">Cancelled</div>
                <div className="text-6xl font-bold text-black">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <ToastContainer />
    </div>
  );
};

export default ProfessionalOrderManagementPage;
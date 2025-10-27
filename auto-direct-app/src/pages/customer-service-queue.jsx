import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Car, User, Clock, Filter, Search, Eye, FileText, Calendar, CheckCircle, XCircle, UserPlus } from "lucide-react";

// Backend base for finance routes (where our comparison data endpoint is)
const API_BASE = "http://localhost:3000/finance";

function CustomerServiceQueue() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [dealerInput, setDealerInput] = useState("");
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState(null);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now - date;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch both test drive requests and vehicle comparison requests
      const [testDriveResponse, comparisonResponse] = await Promise.all([
        fetch('http://localhost:3000/test-drive/admin-requests'),
        fetch('http://localhost:3000/vehicle-comparison/admin-comparisons')
      ]);

      const testDriveData = await testDriveResponse.json();
      const comparisonData = await comparisonResponse.json();

      let allRequests = [];

      // Add test drive requests
      if (testDriveData.success && testDriveData.requests) {
        const testDriveRequests = testDriveData.requests.map(request => ({
          ...request,
          requestType: 'Test Drive',
          timeOwned: formatTimeAgo(request.created_at)
        }));
        allRequests = [...allRequests, ...testDriveRequests];
      }

      // Add vehicle comparison requests
      if (comparisonData.success && comparisonData.requests) {
        const comparisonRequests = comparisonData.requests.map(request => ({
          ...request,
          requestType: 'Vehicle Comparison',
          timeOwned: formatTimeAgo(request.created_at)
        }));
        allRequests = [...allRequests, ...comparisonRequests];
      }

      // Sort by creation date (newest first)
      allRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setRequests(allRequests);
    } catch (err) {
      console.error('Error fetching customer service requests:', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.name.toLowerCase().includes(search.toLowerCase()) ||
                         request.email.toLowerCase().includes(search.toLowerCase()) ||
                         request.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || request.requestType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'Comparison':
        return 'bg-gray-200 text-black';
      case 'Test Drive':
        return 'bg-gray-300 text-black';
      case 'General Inquiry':
        return 'bg-gray-100 text-black';
      default:
        return 'bg-gray-100 text-black';
    }
  };

  const handleAssignDealer = async (request) => {
    if (!dealerInput.trim()) {
      window.toast.error("Please enter a Dealer ID");
      return;
    }
    
    setActionLoading(true);
    try {
      // Determine the correct endpoint based on request type
      const endpoint = request.requestType === 'Test Drive' 
        ? 'http://localhost:3000/test-drive/admin/assign-dealer'
        : 'http://localhost:3000/vehicle-comparison/admin/assign-dealer';

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          requestID: request.id, 
          dealerID: dealerInput.trim()
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.toast.success(`Dealer ${dealerInput} assigned successfully!`);
        fetchRequests();
        setSelectedRequest(null);
        setDealerInput("");
      } else {
        window.toast.error(`Error: ${data.message || 'Failed to assign dealer'}`);
      }
    } catch (err) {
      console.error('Error assigning dealer:', err);
      window.toast.error('Network error. Please try again.');
    }
    setActionLoading(false);
  };

  const handleMarkCompleted = async (request) => {
    if (!confirm("Are you sure you want to mark this request as completed?")) {
      return;
    }
    
    setActionLoading(true);
    try {
      // Determine the correct endpoint based on request type
      const endpoint = request.requestType === 'Test Drive' 
        ? 'http://localhost:3000/test-drive/admin/mark-completed'
        : 'http://localhost:3000/vehicle-comparison/admin/mark-completed';

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          requestID: request.id
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.toast.success("Request marked as completed!");
        fetchRequests();
        setSelectedRequest(null);
      } else {
        window.toast.error(`Error: ${data.message || 'Failed to update status'}`);
      }
    } catch (err) {
      console.error('Error marking completed:', err);
      window.toast.error('Network error. Please try again.');
    }
    setActionLoading(false);
  };

  const handleCancelRequest = async (request) => {
    if (!confirm("Are you sure you want to cancel this request?")) {
      return;
    }
    
    setActionLoading(true);
    try {
      // Determine the correct endpoint based on request type
      const endpoint = request.requestType === 'Test Drive' 
        ? 'http://localhost:3000/test-drive/admin/cancel-request'
        : 'http://localhost:3000/vehicle-comparison/admin/cancel-request';

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          requestID: request.id
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.toast.success("Request cancelled successfully!");
        fetchRequests();
        setSelectedRequest(null);
      } else {
        window.toast.error(`Error: ${data.message || 'Failed to cancel request'}`);
      }
    } catch (err) {
      console.error('Error cancelling request:', err);
      window.toast.error('Network error. Please try again.');
    }
    setActionLoading(false);
  };

  const viewRequest = async (req) => {
    setSelectedRequest(req);
    setDealerInput("");
    setSelectedVehicleInfo(null);
    if (req.vehicle_info) {
      // Set vehicle info from the request data
      setSelectedVehicleInfo({
        make: req.vehicle_info.split(' ')[0] || 'Unknown',
        model: req.vehicle_info.split(' ').slice(1).join(' ') || 'Model'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black flex items-center gap-3 mb-2">
                <FileText className="text-black" size={32} />
                Customer Service Queue
              </h1>
              <p className="text-gray-600">Manage vehicle comparisons and customer inquiries</p>
            </div>
          </div>
          <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg border">
            <div className="text-sm text-gray-600 font-medium">Total Requests</div>
            <div className="text-2xl font-bold text-black">{requests.length}</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or vehicle..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none appearance-none bg-white"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Comparison">Comparison</option>
                  <option value="Test Drive">Test Drive</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="py-3 px-6 font-medium text-center">Customer</th>
                  <th className="py-3 px-6 font-medium text-center">Vehicle(s)</th>
                  <th className="py-3 px-6 font-medium text-center">Request Type</th>
                  <th className="py-3 px-6 font-medium text-center">Time Owned</th>
                  <th className="py-3 px-6 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3">Loading customer service requests...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">No customer service requests found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.name}</div>
                            <div className="text-sm text-gray-500">{request.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.vehicle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.requestType)}`}>
                          {request.requestType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.timeOwned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                          }}
                          className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors mr-2"
                        >
                          View Request
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User size={20} />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-gray-900">{selectedRequest.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedRequest.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{selectedRequest.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Request Type</label>
                        <p className="text-gray-900">{selectedRequest.requestType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Car size={20} />
                      Vehicle Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Vehicle</label>
                        <p className="text-gray-900">{selectedRequest.vehicle}</p>
                      </div>
                      {selectedVehicleInfo && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Make</label>
                            <p className="text-gray-900">{selectedVehicleInfo.make}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Model</label>
                            <p className="text-gray-900">{selectedVehicleInfo.model}</p>
                          </div>
                        </>
                      )}
                      {selectedRequest.description && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-500">Description</label>
                          <p className="text-gray-900">{selectedRequest.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock size={20} />
                      Request Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Request Date</label>
                        <p className="text-gray-900">{selectedRequest.requestDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Request Time</label>
                        <p className="text-gray-900">{selectedRequest.requestTime}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Time Since Request</label>
                        <p className="text-gray-900">{formatTimeAgo(selectedRequest.created_at)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedRequest.requestType)}`}>
                          {selectedRequest.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dealer Assignment */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                      <UserPlus size={20} />
                      Dealer Assignment
                    </h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter Dealer ID"
                        value={dealerInput}
                        onChange={(e) => setDealerInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:outline-none"
                      />
                      <button
                        onClick={() => handleAssignDealer(selectedRequest)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading ? "Assigning..." : "Assign"}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleMarkCompleted(selectedRequest)}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle size={16} />
                      Mark Completed
                    </button>
                    <button
                      onClick={() => handleCancelRequest(selectedRequest)}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                      <XCircle size={16} />
                      Cancel Request
                    </button>
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerServiceQueue;
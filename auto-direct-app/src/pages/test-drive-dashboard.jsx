import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Calendar, Car, User, Clock, Filter, Search, Eye, CheckCircle, XCircle, UserPlus, DollarSign } from "lucide-react";

// Backend base for test-drive routes
const API_BASE = "http://localhost:3000/test-drive";

function TestDriveDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [dealerInput, setDealerInput] = useState("");
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-requests`);
      const data = await res.json();
      // Process the enhanced data from backend
      const normalised = (data.result || []).map((r) => {
        let suburb = "";
        if (r.customerNotes && typeof r.customerNotes === "string") {
          const parts = r.customerNotes.split("|").map((p) => p.trim());
          suburb = parts[1] || "";
        }
        return {
          ...r,
          name: r.customerName || "N/A",
          email: r.customerEmail || "N/A",
          phone: r.customerPhone || "N/A",
          suburb,
          vehicle: r.vehicleInfo || `${r.make || ''} ${r.model || ''} ${r.year || ''}`.trim() || r.vehicleID || "N/A",
          requestDate: r.time ? new Date(r.time).toLocaleDateString() : "N/A",
          requestTime: r.time ? new Date(r.time).toLocaleTimeString() : "N/A"
        };
      });
      setRequests(normalised);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setRequests([]);
    }
    setLoading(false);
  };

  const handleAssignDealer = async (request) => {
    if (!dealerInput.trim()) {
      window.toast.error("Please enter a Dealer ID");
      return;
    }
    
    setActionLoading(true);
    const token = Cookies.get("auto-direct-token");
    try {
      const response = await fetch(`${API_BASE}/admin/assign-dealer`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          bookingID: request.bookingID, 
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
        window.toast.error(`Error: ${data.error || 'Failed to assign dealer'}`);
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
    const token = Cookies.get("auto-direct-token");
    try {
      const response = await fetch(`${API_BASE}/admin/update-status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          bookingID: request.bookingID, 
          status: "Completed" 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.toast.success("Request marked as completed!");
        fetchRequests();
        setSelectedRequest(null);
      } else {
        window.toast.error(`Error: ${data.error || 'Failed to update status'}`);
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
    const token = Cookies.get("auto-direct-token");
    try {
      const response = await fetch(`${API_BASE}/admin/update-status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          bookingID: request.bookingID, 
          status: "Cancelled" 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.toast.success("Request cancelled successfully!");
        fetchRequests();
        setSelectedRequest(null);
      } else {
        window.toast.error(`Error: ${data.error || 'Failed to cancel request'}`);
      }
    } catch (err) {
      console.error('Error cancelling request:', err);
      window.toast.error('Network error. Please try again.');
    }
    setActionLoading(false);
  };

  const viewRequest = async (req) => {
    setSelectedRequest(req);
    setDealerInput(req.dealerID || "");
    setSelectedVehicleInfo(null);
    if (req.vehicleID) {
      try {
        const res = await fetch(`/vehicle/vehicle-information/${req.vehicleID}`);
        const data = await res.json();
        setSelectedVehicleInfo(data.vehicle || null);
      } catch (e) {
        setSelectedVehicleInfo(null);
      }
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      (statusFilter === "All" || req.status === statusFilter) &&
      (req.name?.toLowerCase().includes(search.toLowerCase()) ||
        req.email?.toLowerCase().includes(search.toLowerCase()) ||
        req.vehicle?.toLowerCase().includes(search.toLowerCase()) ||
        req.suburb?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black flex items-center gap-3 mb-2">
                <Calendar className="text-black" size={32} />
                Test Drive Requests
              </h1>
              <p className="text-gray-600">Manage and track customer test drive bookings</p>
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
                placeholder="Search by customer name, email, vehicle, or suburb"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none appearance-none bg-white min-w-[160px]"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">No test drive requests match your current filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="py-3 px-6 font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        <User size={16} />
                        Customer
                      </div>
                    </th>
                    <th className="py-3 px-6 font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Car size={16} />
                        Vehicle
                      </div>
                    </th>
                    <th className="py-3 px-6 font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Clock size={16} />
                        Date/Time
                      </div>
                    </th>
                    <th className="py-3 px-6 font-medium text-center">Status</th>
                    <th className="py-3 px-6 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((req, index) => (
                    <tr key={req.bookingID || req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{req.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <span>📧</span> {req.email}
                          </div>
                          {req.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <span>📞</span> {req.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{req.vehicle}</div>
                          {req.price && (
                            <div className="text-sm font-semibold text-green-600">
                              ${req.price.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{req.requestDate}</div>
                          <div className="text-sm text-gray-500">{req.requestTime}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            req.status === "Pending"
                              ? "bg-gray-200 text-black"
                              : req.status === "Completed"
                              ? "bg-gray-300 text-black"
                              : req.status === "Cancelled" 
                              ? "bg-gray-400 text-white" 
                              : "bg-gray-200 text-black"
                          }`}
                        >
                          {req.status === "Pending" && <Clock size={12} className="mr-1" />}
                          {req.status === "Completed" && <CheckCircle size={12} className="mr-1" />}
                          {req.status === "Cancelled" && <XCircle size={12} className="mr-1" />}
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                          onClick={() => viewRequest(req)}
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Details Modal - Popup Overlay */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto border border-gray-300">
              {/* Modal Header */}
              <div className="bg-gray-50 border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Eye size={20} />
                    Request Details
                  </h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* System IDs Section */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <span className="bg-gray-600 text-white p-1 rounded text-sm">ID</span>
                    System Identifiers
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-50 border border-gray-300 p-3 rounded">
                      <div className="text-black font-medium text-sm mb-1">Booking ID</div>
                      <div className="font-mono text-black text-xs break-all bg-white p-2 rounded border">
                        {selectedRequest.bookingID}
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-300 p-3 rounded">
                      <div className="text-black font-medium text-sm mb-1">Vehicle ID</div>
                      <div className="font-mono text-black text-xs break-all bg-white p-2 rounded border">
                        {selectedRequest.vehicleID}
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-300 p-3 rounded">
                      <div className="text-black font-medium text-sm mb-1">Customer ID</div>
                      <div className="font-mono text-black text-xs break-all bg-white p-2 rounded border">
                        {selectedRequest.userID}
                      </div>
                    </div>
                    {selectedRequest.dealerID && (
                      <div className="bg-gray-50 border border-gray-300 p-3 rounded">
                        <div className="text-black font-medium text-sm mb-1">Dealer ID</div>
                        <div className="font-mono text-black text-xs break-all bg-white p-2 rounded border">
                          {selectedRequest.dealerID}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer and Vehicle Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <User className="text-gray-600" size={16} />
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Name:</span>
                        <span className="text-gray-900">{selectedRequest.name || selectedRequest.customerName || "N/A"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900">{selectedRequest.email || selectedRequest.customerEmail || "N/A"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phone:</span>
                        <span className="text-gray-900">{selectedRequest.phone || selectedRequest.customerPhone || "N/A"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Suburb:</span>
                        <span className="text-gray-900">{selectedRequest.suburb || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <Car className="text-gray-600" size={16} />
                      Vehicle Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="text-gray-900">{selectedRequest.vehicle || selectedRequest.vehicleInfo || "N/A"}</span>
                      </div>
                      {selectedRequest.price && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price:</span>
                          <span className="text-green-600 font-semibold">${selectedRequest.price.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="bg-white border p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="text-gray-600" size={16} />
                    Booking Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Status:</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedRequest.status === "Pending"
                            ? "bg-gray-200 text-black"
                            : selectedRequest.status === "Completed"
                            ? "bg-gray-300 text-black"
                            : selectedRequest.status === "Cancelled" 
                            ? "bg-gray-400 text-white" 
                            : "bg-gray-200 text-black"
                        }`}>
                          {selectedRequest.status === "Pending" && <Clock size={12} className="mr-1" />}
                          {selectedRequest.status === "Completed" && <CheckCircle size={12} className="mr-1" />}
                          {selectedRequest.status === "Cancelled" && <XCircle size={12} className="mr-1" />}
                          {selectedRequest.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Request Date:</span>
                      <div className="text-gray-900 mt-1">{selectedRequest.requestDate || "N/A"}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Request Time:</span>
                      <div className="text-gray-900 mt-1">{selectedRequest.requestTime || "N/A"}</div>
                    </div>
                  </div>
                  {selectedRequest.customerNotes && (
                    <div className="mt-4">
                      <div className="text-gray-600 text-sm mb-2">Customer Notes:</div>
                      <div className="bg-gray-50 p-3 rounded text-gray-700 border text-sm">
                        {selectedRequest.customerNotes}
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Actions */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <UserPlus className="text-gray-600" size={16} />
                    Admin Actions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Dealer ID</label>
                        <input 
                          value={dealerInput} 
                          onChange={(e) => setDealerInput(e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all" 
                          placeholder="Enter Dealer ID" 
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium" 
                        onClick={() => handleAssignDealer(selectedRequest)} 
                        disabled={actionLoading}
                      >
                        <UserPlus size={14} />
                        {actionLoading ? 'Assigning...' : 'Assign Dealer'}
                      </button>
                      <button 
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium" 
                        onClick={() => handleMarkCompleted(selectedRequest)} 
                        disabled={actionLoading}
                      >
                        <CheckCircle size={14} />
                        {actionLoading ? 'Updating...' : 'Mark Completed'}
                      </button>
                      <button 
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium" 
                        onClick={() => handleCancelRequest(selectedRequest)} 
                        disabled={actionLoading}
                      >
                        <XCircle size={14} />
                        {actionLoading ? 'Cancelling...' : 'Cancel Request'}
                      </button>
                      <button 
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-all text-sm font-medium" 
                        onClick={() => setSelectedRequest(null)}
                      >
                        Close
                      </button>
                    </div>
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

export default TestDriveDashboard;

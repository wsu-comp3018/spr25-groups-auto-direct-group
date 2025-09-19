import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { DollarSign, Users, TrendingUp, Car, Search, Eye, X } from "lucide-react";

function FinanceDashboardModal({ isOpen, onClose }) {
  const [financeData, setFinanceData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalCustomers: 0,
    totalTestDrives: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    totalCommission: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchFinanceData();
    }
  }, [isOpen]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auto-direct-token='))
        ?.split('=')[1];

      const [summaryResponse, dataResponse] = await Promise.all([
        fetch('http://localhost:3000/finance/summary'),
        fetch('http://localhost:3000/finance/dashboard-data')
      ]);

      if (summaryResponse.ok && dataResponse.ok) {
        const summaryData = await summaryResponse.json();
        const customerData = await dataResponse.json();
        
        setSummaryStats(summaryData);
        setFinanceData(customerData);
      } else {
        console.error('Failed to fetch finance data');
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = financeData.filter(customer =>
    customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden border-2 border-gray-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <DollarSign className="text-gray-700" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Finance Dashboard</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Total Customers</div>
                      <div className="text-lg font-bold text-gray-900">{summaryStats.totalCustomers || 0}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Car className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Test Drives</div>
                      <div className="text-lg font-bold text-gray-900">{summaryStats.totalTestDrives || 0}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <DollarSign className="text-green-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Total Revenue</div>
                      <div className="text-lg font-bold text-gray-900">${summaryStats.totalRevenue?.toLocaleString() || 0}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <TrendingUp className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Commission</div>
                      <div className="text-lg font-bold text-gray-900">${summaryStats.totalCommission?.toLocaleString() || 0}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search customers by name, email, phone, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Customer Data Table */}
              <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Drives Completed</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchased Vehicle</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer Commission</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((customer) => (
                        <tr 
                          key={customer.customerID} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{customer.customerName}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {customer.testDrivesCompleted}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {customer.hasPurchased}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            ${customer.dealerCommission?.toLocaleString() || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden border-2 border-gray-200">
              <div className="flex items-center justify-between p-6 border-b bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900">Customer Details</h3>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <div className="text-lg text-gray-900">{selectedCustomer.customerName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="text-lg text-gray-900">{selectedCustomer.customerEmail}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <div className="text-lg text-gray-900">{selectedCustomer.customerPhone}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Test Drives Completed</label>
                    <div className="text-lg text-gray-900">{selectedCustomer.testDrivesCompleted}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Has Purchased</label>
                    <div className="text-lg text-gray-900">{selectedCustomer.hasPurchased}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Purchase Amount</label>
                    <div className="text-lg text-gray-900">${selectedCustomer.purchaseAmount?.toLocaleString() || 0}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Vehicle</label>
                    <div className="text-lg text-gray-900">{selectedCustomer.vehicleInfo}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dealer Commission</label>
                    <div className="text-lg text-gray-900">${selectedCustomer.dealerCommission?.toLocaleString() || 0}</div>
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

export default FinanceDashboardModal;
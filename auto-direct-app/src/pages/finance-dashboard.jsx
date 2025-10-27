import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Car, TrendingUp, Eye, Calendar, CheckCircle } from 'lucide-react';

const FinanceDashboard = () => {
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auto-direct-token='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:3000/finance-requests/admin-requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.requests) {
          setFinanceData(data.requests);
        } else {
          setFinanceData([]);
        }
      } else {
        console.error('Failed to fetch finance data');
        setFinanceData([]);
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
      setFinanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = financeData.filter(customer =>
    customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = financeData.reduce((sum, customer) => sum + (customer.purchaseAmount || 0), 0);
  const totalCommission = financeData.reduce((sum, customer) => sum + (customer.dealerCommission || 0), 0);
  const totalTestDrives = financeData.reduce((sum, customer) => sum + (customer.testDrivesCompleted || 0), 0);
  const purchaseRate = financeData.length > 0 ? (financeData.filter(c => c.hasPurchased).length / financeData.length * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <DollarSign className="text-gray-700" size={32} />
            Finance Dashboard
          </h1>
          <p className="text-gray-600">Track customer activity, purchases, and dealer commissions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Commission</div>
                <div className="text-2xl font-bold text-gray-900">${totalCommission.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Car className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Test Drives</div>
                <div className="text-2xl font-bold text-gray-900">{totalTestDrives}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="text-orange-600" size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Purchase Rate</div>
                <div className="text-2xl font-bold text-gray-900">{purchaseRate}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by customer name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Finance Data Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading finance data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No finance data found</h3>
            <p className="text-gray-600">No customer finance data matches your search.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="py-3 px-6 font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users size={16} />
                        Customer
                      </div>
                    </th>
                    <th className="py-3 px-6 font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Car size={16} />
                        Test Drives
                      </div>
                    </th>
                    <th className="py-3 px-6 font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle size={16} />
                        Purchase Status
                      </div>
                    </th>
                    <th className="py-3 px-6 font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        <DollarSign size={16} />
                        Commission
                      </div>
                    </th>
                    <th className="py-3 px-6 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((customer, index) => (
                    <tr key={customer.customerID || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.customerName}</div>
                          <div className="text-sm text-gray-500">{customer.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.testDrivesCompleted || 0}</div>
                        <div className="text-sm text-gray-500">completed</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            customer.hasPurchased 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {customer.hasPurchased ? 'Purchased' : 'No Purchase'}
                          </span>
                          {customer.hasPurchased && customer.purchaseAmount && (
                            <div className="text-sm font-semibold text-green-600 mt-1">
                              ${customer.purchaseAmount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(customer.dealerCommission || 0).toLocaleString()}
                        </div>
                        {customer.dealerName && (
                          <div className="text-sm text-gray-500">{customer.dealerName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                          onClick={() => setSelectedCustomer(customer)}
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

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-gray-300">
              {/* Modal Header */}
              <div className="bg-gray-50 border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Eye size={20} />
                    Customer Finance Details
                  </h3>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <Users className="text-gray-600" size={16} />
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Name:</span>
                        <span className="text-gray-900">{selectedCustomer.customerName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900">{selectedCustomer.customerEmail}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Customer ID:</span>
                        <span className="text-gray-900 font-mono">{selectedCustomer.customerID}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <Car className="text-gray-600" size={16} />
                      Activity Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Test Drives Completed:</span>
                        <span className="text-gray-900 font-semibold">{selectedCustomer.testDrivesCompleted || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Purchase Status:</span>
                        <span className={`font-semibold ${selectedCustomer.hasPurchased ? 'text-green-600' : 'text-gray-600'}`}>
                          {selectedCustomer.hasPurchased ? 'Purchased' : 'No Purchase'}
                        </span>
                      </div>
                      {selectedCustomer.hasPurchased && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Purchase Amount:</span>
                          <span className="text-green-600 font-semibold">${selectedCustomer.purchaseAmount?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign className="text-gray-600" size={16} />
                    Financial Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Dealer Commission:</span>
                      <div className="text-lg font-bold text-gray-900">${(selectedCustomer.dealerCommission || 0).toLocaleString()}</div>
                    </div>
                    {selectedCustomer.dealerName && (
                      <div className="text-sm">
                        <span className="text-gray-600">Assigned Dealer:</span>
                        <div className="text-gray-900 font-medium">{selectedCustomer.dealerName}</div>
                      </div>
                    )}
                    {selectedCustomer.vehicleInfo && (
                      <div className="text-sm">
                        <span className="text-gray-600">Vehicle:</span>
                        <div className="text-gray-900 font-medium">{selectedCustomer.vehicleInfo}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;
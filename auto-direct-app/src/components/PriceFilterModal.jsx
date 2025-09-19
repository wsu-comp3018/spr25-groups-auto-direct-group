import React, { useState } from 'react';

function PriceFilterModal({ isOpen, onClose, priceOptions, selectedPrices, onSelectionChange }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handlePriceToggle = (price) => {
    if (selectedPrices.includes(price)) {
      onSelectionChange(selectedPrices.filter(p => p !== price));
    } else {
      onSelectionChange([...selectedPrices, price]);
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleSearch = () => {
    onClose();
  };

  const filteredOptions = priceOptions.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Price</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search price range
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search price ranges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Price Options List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredOptions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No price ranges found</p>
          ) : (
            <div className="space-y-2">
              {filteredOptions.map(option => (
                <div key={option.value} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2">
                  <label className="flex items-center flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(option.value)}
                      onChange={() => handlePriceToggle(option.value)}
                      className="mr-3 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <span className="text-gray-900">{option.label}</span>
                  </label>
                  <button
                    onClick={() => handlePriceToggle(option.value)}
                    className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleClearAll}
            className="text-black hover:text-gray-800 font-medium"
          >
            Clear
          </button>
          <button
            onClick={handleSearch}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default PriceFilterModal;

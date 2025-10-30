import React, { useState, useEffect } from 'react';

function MakeFilterModal({ isOpen, onClose, makes, selectedMakes, onSelectionChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMakes, setFilteredMakes] = useState([]);
  const [groupedMakes, setGroupedMakes] = useState({});

  // Group makes by first letter
  useEffect(() => {
    const filtered = makes.filter(make => 
      make.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const grouped = filtered.reduce((acc, make) => {
      const firstLetter = make.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(make);
      return acc;
    }, {});

    // Sort each group alphabetically
    Object.keys(grouped).forEach(letter => {
      grouped[letter].sort();
    });

    setGroupedMakes(grouped);
    setFilteredMakes(filtered);
  }, [makes, searchTerm]);

  const handleMakeToggle = (make) => {
    if (selectedMakes.includes(make)) {
      onSelectionChange(selectedMakes.filter(m => m !== make));
    } else {
      onSelectionChange([...selectedMakes, make]);
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleSearch = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Make</h2>
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
            Search make
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search makes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Makes List */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.keys(groupedMakes).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No makes found</p>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedMakes).sort().map(letter => (
                <div key={letter}>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">
                    {letter}
                  </h3>
                  <div className="space-y-2">
                    {groupedMakes[letter].map(make => (
                      <div key={make} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2">
                        <label className="flex items-center flex-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedMakes.includes(make)}
                            onChange={() => handleMakeToggle(make)}
                            className="mr-3 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                          />
                          <span className="text-gray-900">{make}</span>
                        </label>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {/* You can add count here if you have the data */}
                          </span>
                          <button
                            onClick={() => handleMakeToggle(make)}
                            className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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

export default MakeFilterModal;

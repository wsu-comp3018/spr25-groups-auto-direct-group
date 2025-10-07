import React from 'react';
import { X } from 'lucide-react';

function FilterPills({ 
  makeFilter, 
  priceFilter, 
  transmissionFilter, 
  bodyTypeFilter, 
  driveTypeFilter, 
  fuelFilter,
  onRemoveMake,
  onRemovePrice,
  onRemoveTransmission,
  onRemoveBodyType,
  onRemoveDriveType,
  onRemoveFuel,
  onClearAll
}) {
  const allFilters = [
    ...makeFilter.map(make => ({ type: 'make', value: make, label: make })),
    ...priceFilter.map(price => ({ 
      type: 'price', 
      value: price, 
      label: price === 'above-100000' ? 'Above $100,000' : `Under $${parseInt(price).toLocaleString()}`
    })),
    ...transmissionFilter.map(transmission => ({ type: 'transmission', value: transmission, label: transmission })),
    ...bodyTypeFilter.map(bodyType => ({ type: 'bodyType', value: bodyType, label: bodyType })),
    ...driveTypeFilter.map(driveType => ({ type: 'driveType', value: driveType, label: driveType })),
    ...fuelFilter.map(fuel => ({ type: 'fuel', value: fuel, label: fuel }))
  ];

  const handleRemove = (type, value) => {
    switch (type) {
      case 'make':
        onRemoveMake(value);
        break;
      case 'price':
        onRemovePrice(value);
        break;
      case 'transmission':
        onRemoveTransmission(value);
        break;
      case 'bodyType':
        onRemoveBodyType(value);
        break;
      case 'driveType':
        onRemoveDriveType(value);
        break;
      case 'fuel':
        onRemoveFuel(value);
        break;
      default:
        break;
    }
  };

  if (allFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
        {allFilters.length > 1 && (
          <button
            onClick={onClearAll}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {allFilters.map((filter, index) => (
          <div
            key={`${filter.type}-${filter.value}-${index}`}
            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full border border-gray-200"
          >
            <span className="font-medium">{filter.label}</span>
            <button
              onClick={() => handleRemove(filter.type, filter.value)}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilterPills;

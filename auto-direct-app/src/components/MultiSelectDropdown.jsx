import React, { useState, useRef, useEffect } from 'react';

function MultiSelectDropdown({ label, options, selectedValues, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter(val => val !== value));
    }
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) {
      return `All ${label.toLowerCase()}s`;
    }
    if (selectedValues.length === options.length) {
      return `All ${label.toLowerCase()}s selected`;
    }
    return selectedValues.join(', ');
  };

  return (
    <div className="relative flex flex-col flex-1 min-w-[130px]" ref={dropdownRef}>
      <label className="text-black font-medium mb-1">{label}</label>
      <button
        type="button"
        className="border rounded-lg p-2 text-black bg-white text-left flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{getDisplayValue()}</span>
        <span className="ml-2">&#9662;</span> {/* Down arrow */}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-2 max-h-40 overflow-y-auto top-full">
          {options.map((option, index) => (
            <label key={option} className="flex items-center p-1 hover:bg-gray-100 rounded cursor-pointer">
              <input
                type="checkbox"
                value={option}
                checked={selectedValues.includes(option)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;
import React, { useState } from "react";

const GlossaryPage = () => {
	const [searchTerm, setSearchTerm] = useState("");

  const glossaryItems = [
    {
      term: "BSB (Bank State Branch)",
      description:
        "A six-digit number used to identify the individual branch of an Australian bank or financial institution.",
		},
		{
			term: "VIN (Vehicle Identification Number)",
			description:
        "A unique code used by the automotive industry to identify individual motor vehicles, towed vehicles, motorcycles, scooters, and mopeds.",
		},
		{
			term: "Registration",
			description:
        "The legal process of recording a vehicle under a government authority to authorize its use on public roads.",
		},
		{
			term: "Test Drive",
			description:
        "An opportunity for a potential buyer to drive a vehicle before making a purchase decision.",
		},
		{
			term: "Dealer Locator",
			description:
        "A tool that allows customers to find nearby authorized car dealerships based on location.",
		},
		{
			term: "Warranty",
			description:
        "A promise provided by the manufacturer or dealer to repair or replace a vehicle if necessary within a certain period after purchase.",
		},
		{
			term: "Roadworthy Certificate (RWC)",
			description:
        "An official certificate issued after a vehicle inspection, stating the vehicle meets the minimum safety standards required by law.",
		},
		{
			term: "Logbook Servicing",
			description:
        "Scheduled maintenance services performed on a vehicle according to the manufacturer's specifications to maintain warranty and vehicle health.",
		},
		{
			term: "Stamp Duty",
			description:
        "A tax paid to the state government when registering a new or used vehicle, based on its market value or purchase price.",
		},
		{
			term: "Trade-In",
			description:
        "When a buyer exchanges their current vehicle as part of the payment towards purchasing a new or used vehicle.",
		},
	];

  const filteredItems = glossaryItems.filter((item) =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 px-6 bg-white font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-black-800 mb-6">Glossary</h1>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search glossary terms..."
          className="mb-8 w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="space-y-6">
          {filteredItems.map((item, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold text-blacklue-800">
                {item.term}
              </h2>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}

					{filteredItems.length === 0 && (
						<p className="text-gray-500">No matching terms found.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default GlossaryPage;

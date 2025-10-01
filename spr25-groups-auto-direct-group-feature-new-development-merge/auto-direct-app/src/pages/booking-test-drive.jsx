import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import getImageUrl from "../components/getImageUrl";

function TestDrivePage() {
  const location = useLocation();
  const { car } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    preferredDate: "",
  });

  useEffect(() => {
    if (!car) {
      alert("No car selected for test drive!");
    }
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      carId: car?.id,
      carName: car?.modelName,
      ...formData,
    };

    console.log("Test Drive Booking Submitted:", bookingData);

    alert("Thank you! Your test drive request has been sent.");

    //  reset the form:
    setFormData({ name: "", mobile: "", email: "", preferredDate: "" });
  };

  if (!car) {
    return (
      <div className="min-h-screen pt-24 p-8 text-center text-gray-600">
        <p>Invalid access. Please go back and select a car for a test drive.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Book a Test Drive
      </h2>

      {/* Car Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-center gap-4">
        <img
          src={getImageUrl(`../assets/${car.image[0]}`)}
          alt={car.modelName}
          className="w-32 h-20 object-cover rounded border"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {car.modelName} {car.make}
          </h3>
          <p className="text-gray-600">{car.bodyType}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="tel"
            name="mobile"
            required
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="+61 412 345 678"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Preferred Date
          </label>
          <input
            type="date"
            name="preferredDate"
            required
            value={formData.preferredDate}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition"
        >
          Submit Test Drive Request
        </button>
      </form>
    </div>
  );
}

export default TestDrivePage;

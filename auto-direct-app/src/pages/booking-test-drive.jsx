import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { CalendarDays, User, Mail, Phone, MapPin, Car } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../data/api-calls";
import Cookies from "js-cookie";

function TestDrivePage({ car: providedCar, thumbnailPath, onClose }) {
  const location = useLocation();
  const routeStateCar = (location && location.state && location.state.car) ? location.state.car : null;
  const car = providedCar || routeStateCar || null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    suburb: "",
    date: "",
    vehicle: car ? `${car.makeName || ""} ${car.modelName || ""}`.trim() : "",
    slot: "",
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    // Keep vehicle field in sync if car changes (e.g., opened from different source)
    if (car) {
      setFormData((prev) => ({
        ...prev,
        vehicle: `${car.makeName || ""} ${car.modelName || ""}`.trim(),
      }));
    }
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setFormData((prev) => ({ ...prev, date: date ? date.toISOString().split('T')[0] : "" }));
    setLoadingSlots(true);
    // Fetch available slots from backend
    try {
      // Optional endpoint; keep graceful if not implemented
      const res = await fetch(`${api}/test-drive/slots?date=${date ? date.toISOString().split('T')[0] : ""}&vehicle=${encodeURIComponent(formData.vehicle)}`);
      if (res.ok) {
        const data = await res.json();
        setAvailableSlots(data.slots || []);
      } else {
        setAvailableSlots([]);
      }
    } catch (err) {
      setAvailableSlots([]);
    }
    setLoadingSlots(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      window.toast.error("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      window.toast.error("Please enter your email address.");
      return;
    }
    if (!formData.phone.trim()) {
      window.toast.error("Please enter your phone number.");
      return;
    }
    if (!formData.suburb.trim()) {
      window.toast.error("Please enter your suburb.");
      return;
    }
    if (!formData.date) {
      window.toast.error("Please select a date for your test drive.");
      return;
    }
    if (!formData.slot) {
      window.toast.error("Please select a time slot for your test drive.");
      return;
    }
    
    // Use js-cookie for reliable cookie access
    const userID = Cookies.get("auto-direct-userID");
    const token = Cookies.get("auto-direct-token");
    const vehicleID = car?.vehicleID || car?.id || "";
    
    if (!token || !userID) {
      window.toast.warning("Please log in to send a request.");
      return;
    }

    const status = "Pending";
    const notes = `${formData.slot} | ${formData.suburb} | ${formData.name} | ${formData.email} | ${formData.phone} | ${formData.date}`;
    
    const payload = {
      testDrive: {
        userID,
        vehicleID,
        status,
        notes
      }
    };

    console.log("Test Drive Submission Debug:", {
      userID,
      token: token ? "Present" : "Missing",
      vehicleID,
      payload,
      apiUrl: `${api}/test-drive/test-drive`
    });

    try {
      const res = await fetch(`${api}/test-drive/test-drive`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      
      if (!res.ok) {
        console.error('Backend error:', responseData);
        throw new Error(responseData.error || `Server returned ${res.status}: ${res.statusText}`);
      }

      window.toast.success("Thank you! Your test drive request has been sent.");
      setFormData({ 
        name: "", 
        email: "", 
        phone: "", 
        suburb: "", 
        date: "", 
        vehicle: car ? `${car.makeName || ""} ${car.modelName || ""}`.trim() : "", 
        slot: "" 
      });
      setSelectedDate(null);
      setAvailableSlots([]);
      
      // Close modal if onClose function is provided
      if (onClose) {
        onClose();
      }
      
    } catch (err) {
      console.error("Test drive booking error:", err);
      window.toast.error(`Failed to book test drive: ${err.message}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-10 px-0 flex items-start justify-center">
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-[900px]">
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100">
          <div className="px-8 md:px-10 py-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center">Book a Test Drive</h1>
          </div>
        </div>
        <div className="px-8 md:px-10 pt-6">
          <p className="text-center text-gray-500 mt-0 mb-6 md:mb-8 text-base md:text-lg">Experience your next car before you buy. Choose your date and time, then we’ll be in touch.</p>

          {/* Vehicle Summary */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 md:p-5 mb-8">
            <div className="flex items-stretch gap-4">
              <div className="flex flex-col items-start gap-2 w-28 md:w-32">
                <div className="w-full h-20 md:h-24 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                  {thumbnailPath ? (
                    <img
                      src={api + `/vehicle-images/${thumbnailPath}`}
                      alt={formData.vehicle}
                      className="w-full h-full object-cover"
                    />
                  ) : car && car.mainImage ? (
                    <img
                      src={api + `/vehicle-images/${car.mainImage}`}
                      alt={formData.vehicle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Car className="w-6 h-6 text-black"/>
                  )}
                </div>
                {car && (
                  <ul className="text-xs text-gray-700 space-y-1 w-full">
                    {typeof car.price === 'number' && (
                      <li className="flex items-center justify-between bg-white border border-gray-200 rounded px-2 py-1">
                        <span className="text-gray-500">Price</span>
                        <span className="font-medium text-gray-900">
                          {new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(car.price)}
                        </span>
                      </li>
                    )}
                    {car.bodyType && (
                      <li className="flex items-center justify-between bg-white border border-gray-200 rounded px-2 py-1">
                        <span className="text-gray-500">Body</span>
                        <span className="font-medium text-gray-900">{car.bodyType}</span>
                      </li>
                    )}
                    {car.transmission && (
                      <li className="flex items-center justify-between bg-white border border-gray-200 rounded px-2 py-1">
                        <span className="text-gray-500">Transmission</span>
                        <span className="font-medium text-gray-900">{car.transmission}</span>
                      </li>
                    )}
                  </ul>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center">
                <div className="text-xs md:text-sm uppercase tracking-wide text-gray-500">You’re booking a test drive for</div>
                <div className="text-lg md:text-xl font-semibold text-gray-900 truncate">{formData.vehicle || "Selected Vehicle"}</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 md:px-10 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Details */}
            <div className="flex flex-col gap-5">
              <div className="relative">
                <label className="block text-gray-800 font-semibold mb-1 flex items-center gap-2"><User className="w-5 h-5 text-black"/> Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition bg-white" placeholder="Enter your full name" />
              </div>
              <div className="relative">
                <label className="block text-gray-800 font-semibold mb-1 flex items-center gap-2"><Mail className="w-5 h-5 text-black"/> Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition bg-white" placeholder="name@example.com" />
              </div>
              <div className="relative">
                <label className="block text-gray-800 font-semibold mb-1 flex items-center gap-2"><Phone className="w-5 h-5 text-black"/> Phone Number</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition bg-white" placeholder="e.g. 0412 345 678" />
              </div>
              <div className="relative">
                <label className="block text-gray-800 font-semibold mb-1 flex items-center gap-2"><MapPin className="w-5 h-5 text-black"/> Suburb</label>
                <input type="text" name="suburb" required value={formData.suburb} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition bg-white" placeholder="Your suburb" />
              </div>
              <div className="relative">
                <label className="block text-gray-800 font-semibold mb-1 flex items-center gap-2"><Car className="w-5 h-5 text-black"/> Vehicle</label>
                <input type="text" name="vehicle" required value={formData.vehicle} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition bg-white" placeholder="Vehicle to test drive" />
              </div>
            </div>

            {/* Right: Date & Slots */}
            <div className="flex flex-col gap-5">
              <div className="relative">
                <label className="block text-gray-800 font-semibold mb-2 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-black"/> Preferred Date</label>
                <DatePicker selected={selectedDate} onChange={handleDateSelect} dateFormat="yyyy-MM-dd" className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition cursor-pointer bg-white" placeholderText="Select a date" required />
                <p className="text-xs text-gray-500 mt-2">We’ll confirm availability with the dealership.</p>
              </div>

              <div className="">
                <div className="font-semibold text-gray-800 mb-2">Available Time Slots</div>
                {selectedDate ? (
                  loadingSlots ? (
                    <div className="text-center text-gray-400 py-6">Loading slots...</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {["09:00AM - 10:00AM","10:00AM - 11:00AM","11:00AM - 12:00PM","12:00PM - 01:00PM","01:00PM - 02:00PM","02:00PM - 03:00PM","03:00PM - 04:00PM","04:00PM - 05:00PM"].map((slot) => {
                        const isBooked = availableSlots && availableSlots.booked && availableSlots.booked.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            className={`border rounded-lg p-3 font-semibold w-full transition-all duration-150 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 ${isBooked ? "bg-gray-100 text-gray-400 cursor-not-allowed" : formData.slot===slot?"bg-black text-white border-black":"bg-white hover:bg-gray-50"}`}
                            onClick={()=>!isBooked && setFormData(prev=>({...prev,slot}))}
                            disabled={isBooked}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <div className="text-gray-400 text-sm py-6">Select a date to view available slots.</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10">
            <p className="text-xs text-gray-500 text-center md:text-left">By clicking ‘Send Request’, you agree to our Privacy Policy and to be contacted about your booking.</p>
            <div className="flex gap-3 w-full md:w-auto">
              <button type="button" className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition w-full md:w-auto" onClick={()=> (onClose ? onClose() : window.history.back())}>Cancel</button>
              <button type="submit" className="px-6 py-2.5 rounded-lg bg-black text-white font-semibold shadow hover:bg-gray-900 transition w-full md:w-auto">Send Request</button>
            </div>
          </div>
        </form>

        <div className="px-8 md:px-10 pb-8">
          <div className="text-[11px] text-gray-500 mt-2 text-center border-t pt-4">
            © 2025 Autos Direct. All rights reserved. · <Link to="/contact" className="underline">Contact</Link> · <Link to="/privacy-policy" className="underline">Privacy Policy</Link> · <Link to="/glossary" className="underline">Glossary</Link>
          </div>
        </div>
      </div>
    </div>
  );


  if (!car) {
    return (
      <div className="min-h-screen pt-24 p-8 text-center text-gray-600">
        <p>Invalid access. Please go back and select a car for a test drive.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Book a Test Drive</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded"
              placeholder="Name*"
            />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded"
              placeholder="Email*"
            />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded"
              placeholder="Phone*"
            />
            <input
              type="text"
              name="suburb"
              required
              value={formData.suburb}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded"
              placeholder="Suburb*"
            />
            <div className="flex gap-2">
              <input
                type="text"
                name="date"
                required
                value={selectedDate}
                onClick={handleDateClick}
                readOnly
                className="border border-gray-300 p-3 rounded w-1/2 cursor-pointer"
                placeholder="dd/mm/yyyy*"
              />
              <input
                type="text"
                name="vehicle"
                required
                value={formData.vehicle}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded w-1/2"
                placeholder="Vehicle to Test Drive*"
              />
            </div>
          </div>
          <div className="flex gap-8">
            {/* Calendar Popup */}
            {showCalendar && (
              <div className="bg-white border rounded-lg shadow p-4">
                {/* Simple calendar: replace with a calendar library for production */}
                <div className="mb-2 font-semibold">August 2025</div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {["M","T","W","T","F","S","S"].map((d,i)=>(<div key={i} className="font-bold">{d}</div>))}
                  {/* Days: 1-31 for demo */}
                  {Array.from({length:31},(_,i)=>(
                    <button key={i+1} type="button" className="py-1 px-2 rounded hover:bg-blue-100" onClick={()=>handleDateSelect(`2025-08-${String(i+1).padStart(2,"0")}`)}>{i+1}</button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <button type="button" className="text-blue-600" onClick={()=>setShowCalendar(false)}>Clear</button>
                  <span className="text-gray-500">Today</span>
                </div>
              </div>
            )}
            {/* Slot Times */}
            {selectedDate && (
              <div className="ml-4">
                <div className="font-semibold mb-2">Available Slot Times</div>
                {loadingSlots ? (
                  <div>Loading...</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.length > 0 ? availableSlots.map((slot, idx) => (
                      <button
                        key={slot}
                        type="button"
                        className={`border rounded p-2 font-semibold ${formData.slot===slot?"bg-blue-600 text-white":"bg-gray-100"}`}
                        onClick={()=>setFormData(prev=>({...prev,slot}))}
                      >
                        {slot}
                      </button>
                    )) : <div>No slots available.</div>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" className="px-6 py-2 rounded bg-gray-300 text-gray-700 font-semibold" onClick={()=>window.history.back()}>Cancel</button>
          <button type="submit" className="px-6 py-2 rounded bg-black text-white font-semibold">Send</button>
        </div>
        <div className="text-xs text-gray-500 mt-4">
          Disclaimer: By clicking the 'Send' button you acknowledge you have read and agree to abide by the Autos Direct Privacy Policy. When you use this page, your contact details will be forwarded to the sales team so they can contact you directly.<br/>
          © 2025 Autos Direct. All rights reserved. | <Link to="/contact" className="underline">Contact</Link> | <Link to="/privacy-policy" className="underline">Privacy Policy</Link> | <Link to="/glossary" className="underline">Glossary</Link>
        </div>
      </form>
    </div>
  );
}

export default TestDrivePage;

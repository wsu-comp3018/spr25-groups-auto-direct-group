// Register component: Renders the registration form for new users

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // added navigate
import Cookies from "js-cookie";
import { useUser } from "../contexts/UserContext"; 
import api from "../data/api-calls";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";


//function RegisterPage() {
const RegisterPage = () => {
  const navigate = useNavigate(); // useNavigate hook

  const { setUser } = useUser(); 

  // Set the JSON data fields
  const [errorMessage, setErrorMessage] = useState(""); // To display errors
  const [recaptchaToken, setRecaptchaToken] = useState(null); // reCAPTCHA token
  const recaptchaRef = useRef(null); // reCAPTCHA ref
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    streetNo: "",
    streetName: "",
    suburb: "",
    postcode: "",
  });

  


  // handleChange will get the form data and plug it into JSON above
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // reCAPTCHA callback function
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  // handleSubmit that handles clicking Register and passing to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'emailAddress', 'password', 'confirmPassword', 'phoneNumber', 'streetNo', 'streetName', 'suburb', 'postcode'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA verification.");
      return;
    }

    try {
      //  register user
      const response = await fetch(api + "/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailAddress: formData.emailAddress,
          password: formData.password,
          phone: formData.phoneNumber,
          streetNo: formData.streetNo,
          streetName: formData.streetName,
          suburb: formData.suburb,
          postcode: formData.postcode,
          recaptchaToken: recaptchaToken
        }),
      });

      if (!response.ok) {
        console.error("Registration failed");
        const errorData = await response.json();
        const errorMessage = errorData.error || "Registration failed. Please try again.";
        toast.error(errorMessage);
        setErrorMessage(errorMessage);
        // Reset reCAPTCHA on error
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setRecaptchaToken(null);
        }
        return;
      }

      console.log("Registration successful");
      toast.success("Registration successful! Welcome to Auto Direct!");

      // login user right after registration
      const loginResponse = await fetch(api + "/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: formData.emailAddress,
          password: formData.password,
        }),
      });

      const loginResult = await loginResponse.json();
      console.log("Login response:", loginResult);

      // CHANGED: use Cookies and not localStorage so Navbar works instantly
      if (loginResponse.ok && loginResult.token) {
        // ADDED: Save token and userID to cookies for Navbar to detect login immediately
        Cookies.set("auto-direct-token", loginResult.token, { expires: 1 });
        Cookies.set("auto-direct-userID", loginResult.userID, { expires: 1 });
        Cookies.set("auto-direct-roles", JSON.stringify(loginResult.roles), { expires: 1 });
        Cookies.set("auto-direct-firstName", loginResult.firstName, { expires: 1 });

        // Update user context immediately!
        setUser({
          userID: loginResult.userID,
          roles: loginResult.roles,
          token: loginResult.token,
          firstName: loginResult.firstName,

        });

        // Redirect to the home page
        navigate("/");
      } else {
        console.error("Login failed after registration");
        window.toast.error("Login failed after registration.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      window.toast.error("An error occurred during registration.");
    }
  };

  /* Actual form now. Mitchell has added onSubmit and onChange into the fields. Additionally,
   * I have also added a name for each field, as well as onChange. So that it populates the JSON block
   * above
   */

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative">
      {/* Car image background */}
      <img 
        src="/assets/login-image.png" 
        alt="Car background"
        className="absolute inset-0 w-full h-full object-cover opacity-95"
        style={{ zIndex: 1 }}
        onError={(e) => {
          console.log('Image failed to load:', e.target.src);
          e.target.src = './assets/login-image.png';
        }}
        onLoad={() => {
          console.log('Image loaded successfully');
        }}
      />
      {/* No overlay - using image opacity instead */}
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-black flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    First Name *
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Last Name *
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    name="emailAddress"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="04########"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Account Security Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-black flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Account Security
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-black flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Address Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Street Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Street Number *
                  </label>
                  <input
                    name="streetNo"
                    type="text"
                    placeholder="123"
                    value={formData.streetNo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Street Name */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Street Name *
                  </label>
                  <input
                    name="streetName"
                    type="text"
                    placeholder="Enter street name"
                    value={formData.streetName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Suburb */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Suburb *
                  </label>
                  <input
                    name="suburb"
                    type="text"
                    placeholder="Enter suburb"
                    value={formData.suburb}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Postcode */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Postcode *
                  </label>
                  <input
                    name="postcode"
                    type="number"
                    placeholder="2000"
                    value={formData.postcode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* reCAPTCHA Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-black flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Security Verification
                </h3>
              </div>
              
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={handleRecaptchaChange}
                  theme="light"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-lg"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

// Register component: Renders the registration form for new users

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // added navigate
import Cookies from "js-cookie";
import { useUser } from "../contexts/UserContext"; 
import api from "../data/api-calls";


//function RegisterPage() {
const RegisterPage = () => {
  const navigate = useNavigate(); // useNavigate hook

  const { setUser } = useUser(); 

  // Set the JSON data fields
  const [errorMessage, setErrorMessage] = useState(""); // To display errors
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
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

  // handleSubmit that handles clicking Register and passing to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //  register user
      const response = await fetch(api + "/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error("Registration failed");
        alert("Registration failed. Please check your details.");

        // If login failed, show an error
        setErrorMessage(response.json().error || "Registration failed. Please try again.");
        return;
      }

      console.log("Registration successful");

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
        alert("Login failed after registration.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred during registration.");
    }
  };

  /* Actual form now. Mitchell has added onSubmit and onChange into the fields. Additionally,
   * I have also added a name for each field, as well as onChange. So that it populates the JSON block
   * above
   */

  return (
    <div className="min-h-screen pt-24 px-4 bg-white">
      <div className="max-w-md mx-auto bg-white border border-black rounded-lg p-8 shadow">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">
          Create an Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* First Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              First Name
            </label>
            <input
              name="firstName"
              type="text"
              placeholder="John"
              onChange={handleChange}
              className="w-full border border-black p-3 rounded text-black bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Last Name
            </label>
            <input
              name="lastName"
              type="text"
              placeholder="Doe"
              onChange={handleChange}
              className="w-full border border-black p-3 rounded text-black bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Email Address
            </label>
            <input
              name="emailAddress"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full border border-black p-3 rounded text-black bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full border border-black p-3 rounded text-black bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="w-full border border-black p-3 rounded text-black bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              type="text"
              placeholder="04########"
              onChange={handleChange}
              className="w-full border border-black p-3 rounded text-black bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Street Number */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Street Number
            </label>
            <input
              name="streetNo"
              type="text"
              placeholder="222"
              onChange={handleChange}
              className="w-full border border-black p-3 rounded text-black bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Street Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Street Name
            </label>
            <input
              name="streetName"
              type="text"
              placeholder="Pitt Street"
              onChange={handleChange}
              className="w-full border border-black p-3 rounded text-black bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Suburb */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Suburb
            </label>
            <input
              name="suburb"
              type="text"
              placeholder="Sydney"
              onChange={handleChange}
              className="w-full border border-black p-3 rounded text-black bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Postcode */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Postcode
            </label>
            <input
              name="postcode"
              type="number"
              placeholder="2000"
              onChange={handleChange}
              className="w-full border border-black p-3 rounded text-black bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>
          {errorMessage && (
            <div className="text-red-600 text-sm text-center">{errorMessage}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-900 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

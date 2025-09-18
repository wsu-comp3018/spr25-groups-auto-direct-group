// Login component: Renders the login form for user authentication
import React, { useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useUser } from "../contexts/UserContext"; // Import your UserContext
import api from "../data/api-calls";

function Login() {
	const [formData, setFormData] = useState({
		emailAddress: "",
		password: "",
	});
	const [errorMessage, setErrorMessage] = useState(""); // To display errors
	const navigate = useNavigate(); // Initialize navigate
	
	const { setUser } = useUser(); //get setUser from context

  // handleChange updates formData state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handleSubmit sends form data to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error

    try {
      const response = await fetch(api + "/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (response.ok && result.token) {
        // Save the token
		// store result.roles (array)
		Cookies.set('auto-direct-token', result.token, { expires: 1 });
		Cookies.set('auto-direct-userID', result.userID, { expires: 1 });
        Cookies.set('auto-direct-firstName', result.firstName, { expires: 1 });

        // Save user info (including roles) in context
        setUser({
          userID: result.userID,
          roles: result.roles,
          token: result.token,
          firstName: result.firstName,

        });			

        // Redirect to home page
        navigate("/");
      } else {
        // If login failed, show an error
        setErrorMessage(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-white">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 border border-black">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">
          Login to Your Account
				</h2>

				<form className="space-y-5" onSubmit={handleSubmit}>
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
							required
							className="w-full border border-black p-3 rounded-lg text-black bg-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:outline-none"
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
              				required
							className="w-full border border-black p-3 rounded-lg text-black bg-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:outline-none"
						/>
					</div>

          {/* Error message */}
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-700 "
					>
            Login
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;

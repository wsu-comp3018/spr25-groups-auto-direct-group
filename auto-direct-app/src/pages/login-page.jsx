// Login component: Renders the login form for user authentication
import React, { useState, useRef } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useUser } from "../contexts/UserContext"; // Import your UserContext
import api from "../data/api-calls";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";

function Login() {
	const [formData, setFormData] = useState({
		emailAddress: "",
		password: "",
	});
	const [errorMessage, setErrorMessage] = useState(""); // To display errors
	const [recaptchaToken, setRecaptchaToken] = useState(null); // reCAPTCHA token
	const recaptchaRef = useRef(null); // reCAPTCHA ref
	const navigate = useNavigate(); // Initialize navigate
	
	const { setUser } = useUser(); //get setUser from context

  // handleChange updates formData state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // reCAPTCHA callback function
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  // handleSubmit sends form data to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error

    // Validate reCAPTCHA (temporarily disabled for development)
    // if (!recaptchaToken) {
    //   setErrorMessage("Please complete the reCAPTCHA verification.");
    //   return;
    // }

    try {
      const response = await fetch(api + "/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: "development-bypass" // Temporary bypass for development
        }),
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

        // Show success message
        toast.success(`Welcome back, ${result.firstName}!`);

        // Redirect to home page
        navigate("/");
      } else {
        // If login failed, show an error
        const errorMsg = result.message || "Login failed. Please try again.";
        toast.error(errorMsg);
        setErrorMessage(errorMsg);
        // Reset reCAPTCHA on error
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setRecaptchaToken(null);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg = "An error occurred. Please try again.";
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Car image background */}
      <img 
        src="/assets/login-image.png" 
        alt="Car background"
        className="absolute inset-0 w-full h-full object-cover opacity-95"
        style={{ zIndex: 1 }}
        onError={(e) => {
          console.log('Image failed to load:', e.target.src);
          // Try alternative path
          e.target.src = './assets/login-image.png';
        }}
        onLoad={() => {
          console.log('Image loaded successfully');
        }}
      />
      {/* No overlay - using image opacity instead */}
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-200 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
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
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
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
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* reCAPTCHA Section - temporarily disabled for development */}
            {/* <div className="space-y-4">
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
                  onChange={handleRecaptchaChange}
                  theme="light"
                />
              </div>
            </div> */}

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
					<button
						type="submit"
						className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-700 "
					>
            Login
					</button>
				</form>
			</div>
		</div>
	</div>
	);
}

export default Login;

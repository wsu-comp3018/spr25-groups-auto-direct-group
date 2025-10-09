import { useState, useEffect } from "react";
import { autoFillForm, fieldMappings } from "../utils/autoFillUtils";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  // Auto-fill form with user profile data when component loads
  useEffect(() => {
    autoFillForm(setFormData, fieldMappings.contact);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Add your contact form submission logic here
  };
	return (
		<div className="p-8 max-w-3xl mx-auto pt-20">
			<h2 className="text-4xl font-bold text-black mb-8 text-center">
        Contact Us
			</h2>

			<form onSubmit={handleSubmit} className="bg-white border border-black rounded-lg p-6 space-y-6">
				{/* Name */}
				<div>
					<label className="block mb-2 text-sm font-medium text-gray-700">
            Your Name
					</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						placeholder="Jane Doe"
						className="w-full border border-black p-3 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            className="w-full border border-black p-3 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Your Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="How can we help you?"
            rows="4"
            className="w-full border border-black p-3 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black border border-black border-2 text-white text-lg font-semibold py-3 rounded-lg hover:bg-gray-700 hover:text-white transition shadow"
        >
          Send Message
				</button>
			</form>
		</div>
	);
}

export default ContactPage;

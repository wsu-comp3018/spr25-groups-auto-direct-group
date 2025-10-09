// ComplaintsPage.jsx – Complaint form for Autos Direct
import React, { useState, useEffect } from "react";
import { autoFillForm, fieldMappings } from "../utils/autoFillUtils";

const ComplaintsPage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    hasAccount: "",
    accountNumber: "",
    isStaffRelated: "",
    staffMember: "",
    complaintDetails: "",
    resolutionRequest: "",
    contactDetails: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Auto-fill form with user profile data when component loads
  useEffect(() => {
    autoFillForm(setFormData, fieldMappings.complaints);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      console.log('Submitting complaint:', formData);
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage(result.message || "Complaint submitted successfully. You will receive a response directly.");
        setFormData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          hasAccount: "",
          accountNumber: "",
          isStaffRelated: "",
          staffMember: "",
          complaintDetails: "",
          resolutionRequest: "",
          contactDetails: ""
        });
      } else {
        try {
          const errorData = await response.json();
          setSubmitMessage(errorData.error || "There was an error submitting your complaint. Please try again or contact us directly.");
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
          setSubmitMessage(`Server error (${response.status}). Please try again or contact us directly.`);
        }
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setSubmitMessage("There was an error submitting your complaint. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-black-800 mb-6 text-center">
          Submit a Complaint
        </h1>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Questions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of customer
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  placeholder="0412345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you have an account?
                </label>
                <select
                  name="hasAccount"
                  value={formData.hasAccount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Please select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {formData.hasAccount === "yes" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    If so, what is your account number?
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is this a staff related complaint?
                </label>
                <select
                  name="isStaffRelated"
                  value={formData.isStaffRelated}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Please select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {formData.isStaffRelated === "yes" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    If so, please refer to the staff member in question
                  </label>
                  <input
                    type="text"
                    name="staffMember"
                    value={formData.staffMember}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              )}
            </div>

            {/* Right Column - Detailed Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please outline specific details of the complaint
                </label>
                <textarea
                  name="complaintDetails"
                  value={formData.complaintDetails}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Please provide detailed information about your complaint..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please outline how we can best resolve this complaint for you
                </label>
                <textarea
                  name="resolutionRequest"
                  value={formData.resolutionRequest}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Please describe how you would like us to resolve this issue..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please outline the best contact details where we can address your complaint and provide you with feedback ASAP
                </label>
                <textarea
                  name="contactDetails"
                  value={formData.contactDetails}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Please provide your preferred contact information (email, phone, etc.)..."
                />
              </div>
            </div>
          </div>

          {submitMessage && (
            <div className={`p-4 rounded-md ${
              submitMessage.includes("successfully") 
                ? "bg-green-100 text-green-700 border border-green-300" 
                : "bg-red-100 text-red-700 border border-red-300"
            }`}>
              {submitMessage}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintsPage;

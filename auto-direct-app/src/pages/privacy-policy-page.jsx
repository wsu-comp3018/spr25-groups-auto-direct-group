// PrivacyPolicyPage.jsx – Privacy policy content for Autos Direct
import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen pt-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-black-800 mb-6">
          Privacy Policy
			</h1>

			<p className="text-gray-700 mb-4">
          At Autos Direct, we value your privacy and are committed to protecting
          your personal information. This Privacy Policy outlines how we
          collect, use, store, and safeguard your data when you use our
          services.
			</p>

        <h2 className="text-xl font-semibold text-black-800 mt-6 mb-2">
          1. Information We Collect
			</h2>
			<p className="text-gray-700 mb-4">
          We may collect personal information including your name, contact
          details, email address, phone number, home address, and payment
          information when you interact with our website or register an account.
			</p>

        <h2 className="text-xl font-semibold text-black-800 mt-6 mb-2">
          2. How We Use Your Information
			</h2>
			<p className="text-gray-700 mb-4">
          Your information is used to provide and improve our services,
          personalize your experience, process transactions, and communicate
          important updates. We may also use anonymized data for analytical
          purposes.
			</p>

        <h2 className="text-xl font-semibold text-black-800 mt-6 mb-2">
          3. Data Sharing
			</h2>
			<p className="text-gray-700 mb-4">
          We do not sell your personal information. We may share data with
          trusted service providers for the purpose of delivering our services,
          such as payment processors, but only under strict confidentiality
          agreements.
			</p>

        <h2 className="text-xl font-semibold text-black-800 mt-6 mb-2">
          4. Security
			</h2>
			<p className="text-gray-700 mb-4">
          We implement appropriate technical and organizational measures to
          protect your information from unauthorized access, disclosure,
          alteration, or destruction.
			</p>

        <h2 className="text-xl font-semibold text-black-800 mt-6 mb-2">
          5. Your Rights
			</h2>
			<p className="text-gray-700 mb-4">
          You have the right to access, update, or delete your personal
          information at any time. To do so, please contact our support team via
          the Contact page.
			</p>

			<p className="text-gray-700 mt-8 text-sm italic">
          This policy may be updated occasionally. Please review it periodically
          to stay informed of any changes.
			</p>
		</div>
	</div>
);
}

export default PrivacyPolicyPage;

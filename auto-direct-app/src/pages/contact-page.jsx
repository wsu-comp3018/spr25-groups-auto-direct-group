function ContactPage() {
	return (
		<div className="p-8 max-w-3xl mx-auto pt-20">
			<h2 className="text-4xl font-bold text-black mb-8 text-center">
        Contact Us
			</h2>

			<form className="bg-white border border-black rounded-lg p-6 space-y-6">
				{/* Name */}
				<div>
					<label className="block mb-2 text-sm font-medium text-gray-700">
            Your Name
					</label>
					<input
						type="text"
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

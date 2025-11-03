import React, { useState } from "react";
import { requestPasswordReset } from "../utils/authApi";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setSent(true);
      toast.success("If the email exists, a reset link was sent.");
    } catch (e) {
      toast.error("Failed to send reset email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 border">
        <h1 className="text-xl font-semibold mb-4">Forgot your password?</h1>
        {sent ? (
          <p className="text-gray-700">Check your email for a reset link.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded-lg">Send reset link</button>
          </form>
        )}
      </div>
    </div>
  );
}



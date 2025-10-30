import { useState } from "react";
import api from "../data/api-calls";
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const [emailAddress, setEmail] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(api + "/user/password-reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailAddress }),
      });
      await res.json().catch(() => ({}));
      toast.success("If the email exists, a reset link has been sent.");
    } catch (_) {
      toast.error("Failed to request reset. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Forgot your password?</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your email to receive a reset link.</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            value={emailAddress}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;



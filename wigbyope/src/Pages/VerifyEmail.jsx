import React, { useState } from "react";
import { authAPI } from "../api";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyEmail() {
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";

  const [email, setEmail] = useState(prefilledEmail);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await authAPI.verifyEmail(email, code);
      setMessage(res.message || "Email verified successfully!");

      // ✅ Auto-redirect to login after 2s
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Email</h2>

        {message && (
          <p
            className={`mb-4 text-center ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!prefilledEmail} // ✅ lock if prefilled
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">
            Verification Code
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}

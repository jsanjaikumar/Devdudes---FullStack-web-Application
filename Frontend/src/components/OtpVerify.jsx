import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const VerifyOtp = ({ emailId }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      setError("");
      setLoading(true);
      await axios.post(
        `${BASE_URL}/verify-otp`,
        { emailId, verifyOtp: otp }, // ✅ match backend field name
        { withCredentials: true }
      );
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-center text-white text-2xl font-semibold mb-4">
        Verify OTP
      </h2>
      <p className="text-sm text-gray-400 text-center">
        OTP sent to your email
      </p>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <p className="text-sm text-center text-red-400 min-h-[1.25rem]">
        {error}
      </p>
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold rounded-md transition"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
};

export default VerifyOtp;

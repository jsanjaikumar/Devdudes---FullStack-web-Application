import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      setMsg("");
      setLoading(true);
      await axios.post(`${BASE_URL}/reset-password/${token}`, { newPassword });
      setMsg("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h3 className="mb-4 text-lg font-semibold">Reset Password</h3>
      <input
        placeholder="New password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full mb-3 px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md"
      />
      <button
        onClick={submit}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded-md"
      >
        {loading ? "Please wait..." : "Reset password"}
      </button>
      <p className="mt-3 text-sm text-red-500">{msg}</p>
    </div>
  );
};

export default ResetPassword;

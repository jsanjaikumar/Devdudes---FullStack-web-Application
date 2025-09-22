import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import VerifyOtp from "./OtpVerify"; // For signup OTP verification

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [verifyOtp, setVerifyOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      await axios.post(
        `${BASE_URL}/send-otp`,
        { emailId },
        { withCredentials: true }
      );
      setMode("otp");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    try {
      setError("");
      setLoading(true);
      await axios.post(
        `${BASE_URL}/forgot-password`,
        { emailId },
        { withCredentials: true }
      );
      setMode("reset");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setError("");
      setLoading(true);
      await axios.post(
        `${BASE_URL}/reset-password`,
        { emailId, verifyOtp, newPassword: password },
        { withCredentials: true }
      );
      setMode("login");
      setError("Password reset successful. Please login.");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePrimary = () => {
    if (mode === "login") return handleLogin();
    if (mode === "signup") return handleSignUp();
    if (mode === "forgot") return handleForgot();
    if (mode === "reset") return handleReset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            DevDudes
          </div>
        </div>

        <h2 className="text-center text-white text-2xl font-semibold mb-6">
          {mode === "login"
            ? "Sign in to your account"
            : mode === "signup"
            ? "Create an account"
            : mode === "forgot"
            ? "Forgot password"
            : mode === "reset"
            ? "Reset your password"
            : "Verify OTP"}
        </h2>

        <div className="space-y-3">
          {mode === "otp" ? (
            <VerifyOtp emailId={emailId} />
          ) : (
            <>
              {mode === "signup" && (
                <>
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">
                      First name
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">
                      Last name
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm text-gray-300 block mb-1">
                  Email address
                </label>
                <input
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {mode !== "forgot" && mode !== "otp" && (
                <div>
                  <label className="text-sm text-gray-300 block mb-1">
                    {mode === "reset" ? "New Password" : "Password"}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {mode === "reset" && (
                <div>
                  <label className="text-sm text-gray-300 block mb-1">
                    OTP
                  </label>
                  <input
                    value={verifyOtp}
                    onChange={(e) => setVerifyOtp(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              <p className="text-sm text-center text-red-400 min-h-[1.25rem]">
                {error}
              </p>

              <div className="pt-2">
                <button
                  onClick={handlePrimary}
                  disabled={loading}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold rounded-md transition"
                >
                  {loading
                    ? "Please wait..."
                    : mode === "login"
                    ? "Sign in"
                    : mode === "signup"
                    ? "Create account"
                    : mode === "forgot"
                    ? "Send reset OTP"
                    : "Reset password"}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400 mt-3">
                <div>
                  {mode === "login" && (
                    <button
                      onClick={() => {
                        setMode("forgot");
                        setError("");
                      }}
                      className="text-purple-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div>
                  {mode === "login" && (
                    <button
                      onClick={() => {
                        setMode("signup");
                        setError("");
                      }}
                      className="text-purple-400 hover:underline"
                    >
                      New user? Sign up
                    </button>
                  )}
                  {mode === "signup" && (
                    <button
                      onClick={() => {
                        setMode("login");
                        setError("");
                      }}
                      className="text-purple-400 hover:underline"
                    >
                      Existing user? Login
                    </button>
                  )}
                  {mode === "forgot" && (
                    <button
                      onClick={() => {
                        setMode("login");
                        setError("");
                      }}
                      className="text-purple-400 hover:underline"
                    >
                      Back to login
                    </button>
                  )}
                  {mode === "reset" && (
                    <button
                      onClick={() => {
                        setMode("login");
                        setError("");
                      }}
                      className="text-purple-400 hover:underline"
                    >
                      Back to login
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

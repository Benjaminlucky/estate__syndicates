import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { api } from "../../lib/api.js";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // -------------------------------
  // ✅ Auto Logout If Token Expired
  // -------------------------------
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("adminToken");
        navigate("/adminLogin");
      }
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await api.post("/api/admin/login", form);

      localStorage.setItem("adminToken", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // ✨ Motion Variants
  // -------------------------------
  const container = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-chivo">
      <motion.div
        className="w-full max-w-md text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-white text-2xl font-chivo font-bold py-3 tracking-wide">
          ADMIN LOGIN
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          Don’t have an account?{" "}
          <Link to="/adminSignup" className="text-yellow-500">
            Sign up
          </Link>
        </p>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 bg-black-700 p-6 rounded-lg"
          variants={container}
        >
          {error && (
            <div className="bg-red-600 text-white p-2 text-sm rounded">
              {error}
            </div>
          )}

          {/* Email */}
          <motion.div
            className="relative flex flex-col bg-black-800 rounded-sm"
            variants={container}
          >
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full text-white pl-10 pr-4 py-3 rounded outline-none"
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div
            className="relative flex flex-col bg-black-800 rounded-sm"
            variants={container}
          >
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full text-white pl-10 pr-10 py-3 rounded outline-none"
              required
            />

            {/* Toggle Icon */}
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </motion.div>

          {/* Forgot Password */}
          <motion.div className="text-right text-sm" variants={container}>
            <Link
              to="/forgotPassword"
              className="text-yellow-500 hover:text-yellow-600"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            disabled={loading}
            className="w-full bg-golden-600 hover:bg-golden-800 text-black font-semibold py-3 rounded flex items-center justify-center"
            variants={container}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

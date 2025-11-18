import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../../lib/api.js";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/admin/signup", form);
      navigate("/admin/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-chivo">
      <div className="w-full max-w-md text-center">
        <h2 className="text-white text-2xl font-chivo font-bold py-3 tracking-wide">
          CREATE ADMIN ACCOUNT
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          Already have an account?{" "}
          <Link to="/adminLogin" className="text-yellow-500">
            Log in
          </Link>
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-black-700 p-6 rounded-lg"
        >
          {error && (
            <div className="bg-red-600 text-white p-2 text-sm rounded">
              {error}
            </div>
          )}

          {/* First Name */}
          <div className="relative flex flex-col bg-black-800 rounded-sm">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              className="w-full text-white pl-10 pr-4 py-3 rounded outline-none"
              required
            />
          </div>

          {/* Last Name */}
          <div className="relative flex flex-col bg-black-800 rounded-sm">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              className="w-full text-white pl-10 pr-4 py-3 rounded outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="relative flex flex-col bg-black-800 rounded-sm">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full text-white pl-10 pr-4 py-3 rounded outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative flex flex-col bg-black-800 rounded-sm">
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
          </div>

          {/* Confirm Password */}
          <div className="relative flex flex-col bg-black-800 rounded-sm">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full text-white pl-10 pr-10 py-3 rounded outline-none"
              required
            />

            {/* Toggle Icon */}
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-golden-600 hover:bg-golden-800 text-black font-semibold py-3 rounded"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

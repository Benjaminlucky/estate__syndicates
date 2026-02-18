// client/src/pages/auth/ResetPassword.jsx
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  AiOutlineCheckCircle,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { motion } from "framer-motion";
import { api } from "../../lib/api.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      await api.post(`/investor/reset-password/${token}`, {
        password: formData.password,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup__section w-full">
      <div className="signup__wrapper w-10/12 mx-auto py-32">
        <div className="signup__content grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left image */}
          <div className="left hidden md:flex">
            <div className="left__content rounded-full">
              <img
                src="./assets/signupBg.jpg"
                alt="A Duplex model"
                className="rounded-sm aspect-square"
              />
            </div>
          </div>

          {/* Right form */}
          <div className="right">
            <div className="right__content">
              <div className="bottom__content">
                <h3 className="uppercase text-black-200 text-2xl md:text-4xl font-bold">
                  Reset Password
                </h3>
                <p className="text-black-400 font-chivo">
                  Back to{" "}
                  <Link to="/login" className="text-black-50 underline">
                    Log in
                  </Link>
                </p>

                {!success ? (
                  <form
                    onSubmit={handleSubmit}
                    className="form__container w-full md:w-4/5 py-12 font-chivo"
                  >
                    {/* New Password */}
                    <label htmlFor="password" className="text-black-300">
                      New Password
                    </label>
                    <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3 mb-5">
                      <RiLockPasswordFill className="text-2xl text-black-300 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 6 characters"
                        required
                        className="w-full bg-transparent rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0 text-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-black-300 hover:text-black-200 duration-150 shrink-0"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible className="text-xl" />
                        ) : (
                          <AiOutlineEye className="text-xl" />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <label htmlFor="confirmPassword" className="text-black-300">
                      Confirm Password
                    </label>
                    <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                      <RiLockPasswordFill className="text-2xl text-black-300 shrink-0" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                        required
                        className="w-full bg-transparent rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0 text-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="text-black-300 hover:text-black-200 duration-150 shrink-0"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirm ? (
                          <AiOutlineEyeInvisible className="text-xl" />
                        ) : (
                          <AiOutlineEye className="text-xl" />
                        )}
                      </button>
                    </div>

                    {/* Password strength hint */}
                    {formData.password && (
                      <p
                        className={`text-xs mt-2 ${
                          formData.password.length >= 6
                            ? "text-green-500"
                            : "text-red-400"
                        }`}
                      >
                        {formData.password.length >= 6
                          ? "✓ Password length is good"
                          : "✗ At least 6 characters required"}
                      </p>
                    )}

                    {/* Match hint */}
                    {formData.confirmPassword && (
                      <p
                        className={`text-xs mt-1 ${
                          formData.password === formData.confirmPassword
                            ? "text-green-500"
                            : "text-red-400"
                        }`}
                      >
                        {formData.password === formData.confirmPassword
                          ? "✓ Passwords match"
                          : "✗ Passwords do not match"}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-golden-600 rounded-sm py-4 mt-6 hover:bg-golden-500 duration-200 disabled:opacity-50"
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>

                    {error && (
                      <p className="text-red-500 mt-4 text-sm">{error}</p>
                    )}
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-green-100 text-green-800 px-4 py-5 w-full md:w-4/5 rounded-md shadow-md my-10 flex items-start gap-3"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      }}
                    >
                      <AiOutlineCheckCircle className="text-2xl text-green-600 mt-0.5 shrink-0" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-sm md:text-base">
                        Password reset successful!
                      </p>
                      <p className="text-sm mt-1">
                        Redirecting you to the login page...
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;

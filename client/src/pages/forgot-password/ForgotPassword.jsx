// client/src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion } from "framer-motion";
import { api } from "../../lib/api.js";

const ForgotPassword = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailAddress.trim()) {
      return setError("Email address is required");
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/investor/forgot-password", {
        emailAddress: emailAddress.toLowerCase().trim(),
      });

      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to send reset link. Please try again.",
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
                alt="Estate Syndicates"
                className="rounded-sm aspect-square"
              />
            </div>
          </div>

          {/* Right form */}
          <div className="right">
            <div className="right__content">
              <h3 className="uppercase text-black-200 text-2xl md:text-4xl font-bold">
                Forgot Password
              </h3>

              <p className="text-black-400 font-chivo">
                Remembered it?{" "}
                <Link to="/login" className="text-black-50 underline">
                  Log in
                </Link>
              </p>

              {!success ? (
                <form
                  onSubmit={handleSubmit}
                  className="w-full md:w-4/5 py-12 font-chivo"
                >
                  <p className="text-black-400 text-sm mb-6">
                    Enter your email address and we’ll send you a reset link.
                  </p>

                  <label className="text-black-300">Email Address</label>

                  <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3 mb-5">
                    <MdEmail className="text-2xl text-black-300" />

                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      required
                      className="w-full bg-transparent py-2 outline-none"
                      placeholder="you@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-golden-600 rounded-sm py-4 hover:bg-golden-500 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>

                  {error && (
                    <p className="text-red-500 mt-4 text-sm">{error}</p>
                  )}
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-100 text-green-800 px-4 py-5 w-full md:w-4/5 rounded-md shadow-md my-10 flex gap-3"
                >
                  <AiOutlineCheckCircle className="text-2xl text-green-600" />

                  <div>
                    <p className="font-semibold">
                      Reset link sent successfully.
                    </p>

                    <p className="text-sm">Check your inbox and spam folder.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;

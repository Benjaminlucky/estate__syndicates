import React, { useState } from "react";
import { Checkbox, Spinner } from "flowbite-react";
import { FaUserCircle, FaPhoneAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./signup.css";
import { api } from "../../lib/api.js";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/investor/signup", formData);

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <main className="signup__section w-full">
      <div className="signup__wrapper w-10/12 mx-auto py-32 font-chivo">
        <div className="signup__content grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="left hidden md:flex">
            <div className="left__content rounded-full">
              <img
                src="./assets/signupBg.jpg"
                alt="A Duplex model"
                className="rounded-sm aspect-square"
              />
            </div>
          </div>
          <div className="right">
            <div className="right__content">
              <h3 className="uppercase text-black-200 text-2xl md:text-4xl font-bold">
                Create an Account
              </h3>
              <p className="text-black-400 font-chivo">
                Already have an account?{" "}
                <Link to="/login" className="text-black-50 underline">
                  Log in
                </Link>
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full md:w-4/5 py-12">
                <div className="mb-6">
                  <label htmlFor="first-name" className="text-black-300">
                    First Name
                  </label>
                  <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                    <FaUserCircle className="text-2xl text-black-300" />
                    <input
                      id="first-name"
                      type="text"
                      name="firstName"
                      onChange={handleChange}
                      value={formData.firstName}
                      placeholder="Chukwuma"
                      required
                      className="w-full bg-transparent text-black-300 rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="last-name" className="text-black-300">
                    Last Name
                  </label>
                  <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                    <FaUserCircle className="text-2xl text-black-300" />
                    <input
                      id="last-name"
                      type="text"
                      name="lastName"
                      onChange={handleChange}
                      value={formData.lastName}
                      placeholder="Nnebe"
                      required
                      className="w-full bg-transparent text-black-300 rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="text-black-300">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                    <FaPhoneAlt className="text-2xl text-black-300" />
                    <input
                      type="text"
                      id="phone"
                      name="phoneNumber"
                      onChange={handleChange}
                      value={formData.phoneNumber}
                      placeholder="+234 (0)805 364 2425"
                      required
                      className="w-full bg-transparent text-black-300 rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="text-black-300">
                    Email
                  </label>
                  <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                    <MdEmail className="text-2xl text-black-300" />
                    <input
                      type="email"
                      id="email"
                      name="emailAddress"
                      onChange={handleChange}
                      value={formData.emailAddress}
                      placeholder="nnebe@estatesindicates.com"
                      required
                      className="w-full bg-transparent text-black-300 rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="text-black-300">
                    Password
                  </label>
                  <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                    <RiLockPasswordFill className="text-2xl text-black-300" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={handleChange}
                      value={formData.password}
                      placeholder="*******"
                      required
                      className="w-full bg-transparent text-black-300 rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="text-black-300">
                    Confirm Password
                  </label>
                  <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                    <RiLockPasswordFill className="text-2xl text-black-300" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      onChange={handleChange}
                      value={formData.confirmPassword}
                      placeholder="*******"
                      required
                      className="w-full bg-transparent text-black-300 rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0"
                    />
                  </div>
                </div>

                <div className="checkbox flex gap-3 py-7">
                  <Checkbox />
                  <p className="text-black-300">
                    I agree to the{" "}
                    <span className="text-black-50 underline">
                      Terms and Conditions
                    </span>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-golden-600 rounded-sm py-4 mt-2 hover:bg-golden-500 duration-200 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="md" color="white" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>
              {/* ✅ Success Message Animation */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-green-100 text-green-800 px-4 py-3 w-full md:w-4/5 rounded-md shadow-md mb-6 flex items-center gap-3"
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
                    <AiOutlineCheckCircle className="text-2xl text-green-600" />
                  </motion.div>
                  <span className="text-sm md:text-base font-semibold">
                    Account created successfully! Redirecting to login...
                  </span>
                </motion.div>
              )}
              {/* Animated Error Message */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    className="bg-red-100 text-red-700 px-4 py-3 my-4 w-full md:w-4/5 rounded-md shadow-md flex items-center gap-3"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    ⚠️ <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;

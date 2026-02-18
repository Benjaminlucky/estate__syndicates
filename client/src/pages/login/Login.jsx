import React, { useState } from "react";
import { Card } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion } from "framer-motion";
import { api } from "../../lib/api.js";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailAddress: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/investor/login", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("investor", JSON.stringify(data.investor));

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate("/investor-dashboard/");
      }, 2500);
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <main className="signup__section w-full">
      <div className="signup__wrapper w-10/12 mx-auto py-32">
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
              <div className="right__top"></div>
              <div className="right__buttom">
                <div className="bottom__content">
                  <h3 className="uppercase text-black-200 text-2xl md:text-4xl font-bold">
                    Access your Account
                  </h3>
                  <p className="text-black-400 font-chivo">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-black-50 underline">
                      Register
                    </Link>
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="form__container w-full md:w-4/5 py-12 font-chivo"
                  >
                    <label htmlFor="email" className="text-black-300">
                      Email
                    </label>
                    <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3 mb-5">
                      <MdEmail className="text-2xl text-black-300" />
                      <input
                        type="email"
                        id="emailAddress"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        placeholder="nnebe@estatesindicates.com"
                        className="w-full bg-transparent rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0 text-bold"
                      />
                    </div>

                    <label htmlFor="password" className="text-black-300 mt-6">
                      Password
                    </label>
                    <div className="flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                      <RiLockPasswordFill className="text-2xl text-black-300" />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="*******"
                        className="w-full bg-transparent rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0 text-bold"
                      />
                    </div>

                    {/* Add this right after the password input div, before the button */}
                    <div className="text-right mt-2 mb-1">
                      <Link
                        to="/forgot-password"
                        className="text-black-300 text-sm hover:text-black-50 underline duration-150 font-chivo"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      className="w-full bg-golden-600 rounded-sm py-4 mt-6 hover:bg-golden-500 duration-200 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Log In"}
                    </button>

                    {error && (
                      <p className="text-red-500 mt-4 text-sm">{error}</p>
                    )}
                  </form>
                  {/* ✅ Success Animation */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-green-100 text-green-800 px-4 py-3 w-full md:w-4/5 rounded-md shadow-md my-6 flex items-center gap-3"
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
                        Login successful! Redirecting...
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;

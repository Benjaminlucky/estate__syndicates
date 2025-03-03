import React, { useState } from "react";
import { useSignUp, useSignIn } from "@clerk/clerk-react";
import { Checkbox, Spinner, TextInput } from "flowbite-react";
import { FaUserCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import "./signup.css";

const Signup = () => {
  const { signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signIn } = useSignIn();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification();
      await setActive({ session: user.createdSessionId });

      const response = await fetch("http://localhost:5000/investor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          emailAddress: formData.emailAddress,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/investor-dashboard",
        redirectUrlComplete: "/investor-dashboard",
      });
    } catch (err) {
      console.error("Google OAuth error:", err);
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
                </Link>{" "}
              </p>
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-green-100 border w-fit border-green-400 text-green-700 px-4 py-3 rounded relative my-4"
                >
                  Investor successfully created! Redirecting...
                </motion.div>
              )}
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
                      placeholder="Chukwuma"
                      name="firstName"
                      onChange={handleChange}
                      value={formData.firstName}
                      required
                      className="w-full !bg-transparent !focus:bg-transparent  rounded-sm py-2 !focus:ring-0 !focus:border-0 !focus:outline-0"
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
                      placeholder="Nnebe"
                      name="lastName"
                      onChange={handleChange}
                      value={formData.lastName}
                      required
                      className="w-full bg-transparent rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0"
                    />
                  </div>
                </div>
                <div className="phone mt-6">
                  <label htmlFor="phone" className="text-black-300">
                    Phone Number
                  </label>
                  <div className="phone flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                    <FaPhoneAlt className="text-2xl text-black-300" />
                    <input
                      type="text"
                      id="phone"
                      name="phoneNumber"
                      onChange={handleChange}
                      value={FormData.phoneNumber}
                      required
                      placeholder="+234 (0)805 364 2425"
                      className="w-full bg-transparent rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0 text-bold"
                    />
                  </div>
                </div>
                <div className="mb-6 mt-6">
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
                      required
                      placeholder="nnebe@estatesindicates.com"
                      className="w-full bg-transparent rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0"
                    />
                  </div>
                </div>

                <div className="mb-6 mt-6">
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
                      required
                      placeholder="*******"
                      className="w-full bg-transparent rounded-sm py-2 focus:ring-0  focus:border-0 focus:outline-0"
                    />
                  </div>
                </div>
                <div className="confirmPassword mt-6">
                  <label htmlFor="confirmPassword" className="text-black-300">
                    Confirm Password
                  </label>
                  <div className="password flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                    <RiLockPasswordFill className="text-2xl text-black-300" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      onChange={handleChange}
                      value={FormData.confirmPassword}
                      required
                      placeholder="*******"
                      className="w-full bg-transparent rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0 text-bold"
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
                {/* Button with loading animation */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-golden-600 rounded-sm py-4 mt-6 hover:bg-golden-500 duration-200 disabled:opacity-50"
                  disabled={loading} // Disable button when loading
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
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <p className="text-black-300 mt-8">or register with</p>
                <button
                  onClick={handleGoogleSignup}
                  className="flex items-center gap-2 w-full mt-4 justify-center border-solid  border-gray-300 text-black px-4 py-3 rounded-md"
                >
                  <FcGoogle className="text-2xl" /> <p>Google</p>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;

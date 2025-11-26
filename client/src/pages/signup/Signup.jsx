// Signup.jsx
import React, { useState } from "react";
import { Checkbox, Spinner } from "flowbite-react";
import { FaUserCircle, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

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
      {/* your full UI unchanged */}
    </main>
  );
};

export default Signup;

// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion } from "framer-motion";
import { api } from "../../lib/api.js";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailAddress: "",
    password: "",
  });

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
      {/* your full UI unchanged */}
    </main>
  );
};

export default Login;

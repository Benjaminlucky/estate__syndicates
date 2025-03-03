import React, { useState } from "react";
import { SignUp, useSignIn } from "@clerk/clerk-react";
import { Card } from "flowbite-react";
import { Checkbox, Button, Label } from "flowbite-react";
import { FaUserCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { use } from "react";

const Login = () => {
  const { signIn, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailAddress: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: formData.emailAddress,
        password: formData.password,
      });

      if (result.status === "complete") {
        navigate("/investor-dashboard"); // Redirect after login
      } else {
        console.error("Unexpected Clerk Response:", result);
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/investor-dashboard",
        redirectUrlComplete: "/investor-dashboard",
      });
    } catch (err) {
      console.error("Google Login Error:", err);
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
                  <div className="buttom__title">
                    <h3 className="uppercase text-black-200 text-2xl md:text-4xl font-bold">
                      Access your Account
                    </h3>
                  </div>
                  <div className="bottom__subtitle">
                    <p className="text-black-400 font-chivo">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-black-50 underline">
                        Register
                      </Link>{" "}
                    </p>
                  </div>
                  <div className="form__container">
                    <form onSubmit={handleSubmit}>
                      <div className="form__content w-full md:w-4/5 py-12 font-chivo">
                        <div className="last__name mt-6">
                          <label htmlFor="email" className="text-black-300">
                            Email
                          </label>
                          <div className="email flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                            <MdEmail className="text-2xl text-black-300" />
                            <input
                              type="email"
                              placeholder="nnebe@estatesindicates.com"
                              id="emailAddress"
                              name="emailAddress"
                              value={formData.emailAddress}
                              onChange={handleChange}
                              className="w-full bg-transparent rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0 text-bold"
                            />
                          </div>
                        </div>

                        <div className="password mt-6">
                          <label htmlFor="password" className="text-black-300">
                            Password
                          </label>
                          <div className="password flex items-center gap-2 bg-black-500 py-1 px-5 rounded-sm mt-3">
                            <RiLockPasswordFill className="text-2xl text-black-300" />
                            <input
                              type="password"
                              id="password"
                              placeholder="*******"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="w-full bg-transparent rounded-sm py-2 focus:ring-0 focus:border-0 focus:outline-0 text-bold"
                            />
                          </div>
                        </div>

                        <button className="w-full bg-golden-600 rounded-sm py-4 mt-6 hover:bg-golden-500 duration-200">
                          Log In
                        </button>
                        <p className="text-black-300 mt-8">or Log In with</p>
                        <button className="flex items-center gap-2 w-full mt-4 justify-center border-solid border-gray-300 text-white px-4 py-3 rounded-md">
                          <FcGoogle /> <p>Google</p>
                        </button>
                      </div>
                    </form>
                  </div>
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

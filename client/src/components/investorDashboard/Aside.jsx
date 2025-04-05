import React, { useState, useEffect } from "react";
import { investDashLink } from "../../../data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Menu icons

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-gray-800 text-white rounded"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black-900 text-white w-64 z-40 transform ${
          isOpen
            ? "translate-x-0 pointer-events-auto"
            : "-translate-x-full pointer-events-none"
        } md:relative md:translate-x-0 md:pointer-events-auto transition-transform duration-300 ease-in-out`}
      >
        <div className="top px-6 py-4">
          <Link to="/investor-dashboard" className="logo">
            <img src="/assets/eslogo.svg" alt="Logo" className="w-20 mx-auto" />
          </Link>
        </div>

        <div className="bottom mt-10">
          <div className="btm__content">
            <div className="links px-5 py-2 gap-4 flex flex-col">
              {investDashLink.map((link, index) => {
                const isLogout = link.name === "Logout";

                return isLogout ? (
                  <button
                    key={index}
                    onClick={handleLogout}
                    className="flex items-center gap-4 py-2 px-4 rounded-md hover:bg-red-600 hover:text-white transition duration-300 text-left w-full"
                  >
                    <div className="icon text-2xl md:text-3xl">
                      {React.createElement(link.icon)}
                    </div>
                    <div className="font-chivo uppercase text-sm text-white">
                      {link.name}
                    </div>
                  </button>
                ) : (
                  <Link
                    to={link.link}
                    key={index}
                    className={`${
                      location.pathname === link.link
                        ? "bg-golden-300 !text-white "
                        : ""
                    } flex items-center gap-4 py-2 px-4 rounded-md hover:bg-golden-100 hover:text-black-700 transition duration-300`}
                    onClick={toggleSidebar}
                  >
                    <div className="icon text-2xl md:text-3xl">
                      {React.createElement(link.icon)}
                    </div>
                    <div
                      className={`${
                        location.pathname === link.link
                          ? "text-white font-chivo uppercase text-sm "
                          : "font-chivo uppercase text-black-300 text-sm hover:text-black-700"
                      }`}
                    >
                      {link.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aside;

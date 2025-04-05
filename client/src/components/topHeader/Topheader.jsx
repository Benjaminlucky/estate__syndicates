import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { accountLink, mainNav } from "../../../data";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";

function Topheader() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="mainheader__container w-full bg-black-900">
      {/* Desktop Navigation */}
      <div className="mainheader__wrapper hidden md:block w-10/12 mx-auto">
        <div className="desktopNav__wrapper my-5">
          <div className="dnav__content flex justify-between items-center">
            {/* Logo */}
            <div className="logo">
              <Link to="/">
                <img
                  src="./assets/eslogo.svg"
                  alt="Estate Syndicate Logo"
                  className="w-[90px] "
                />
              </Link>
            </div>

            {/* Main Navigation Links */}
            <div className="dmain__nav flex justify-center">
              <div className="dmain__navContent flex gap-8 text-black-300 font-bold uppercase">
                {mainNav.map((nav, index) => (
                  <Link
                    to={nav.link}
                    key={index}
                    className={`${
                      isActive(nav.link)
                        ? "text-white"
                        : "hover:text-golden-200 transition-all duration-200"
                    }`}
                  >
                    {nav.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Navigation */}
            <div className="daccount__nav flex items-center">
              <div className="daccount__navContent flex gap-5 items-center uppercase">
                {accountLink.map((accountlink, index) => (
                  <Link
                    to={accountlink.link}
                    key={index}
                    className={`${
                      index === 0
                        ? "px-4 py-2 rounded-lg bg-gradient-to-r from-golden-400 via-yellow-500 to-golden-600 font-bold border-2 border-transparent hover:border-white hover:bg-transparent transition-all duration-200"
                        : "border border-2 border-black-400 px-4 py-2 rounded-lg font-bold hover:border-black-50"
                    }`}
                  >
                    {accountlink.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="mobileNav__wrapper md:hidden w-full">
        <div className="mobilenav__content relative flex items-center w-10/12 mx-auto mt-5">
          {/* Mobile Logo */}
          <div className="mobile__logo">
            <Link to="/">
              <img
                src="./assets/eslogo.svg"
                alt="Estate Syndicates Logo"
                className="w-[80px] iphone5s:w-[60px]"
              />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} className="ml-auto">
            {menuOpen ? (
              <IoClose className="text-4xl transition-all duration-200" />
            ) : (
              <IoIosMenu className="text-4xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="linksLogo absolute flex flex-col gap-8 top-0 left-0 bottom-0 py-5 w-8/12 pl-8 bg-golden-900 z-50">
            {/* Mobile Logo */}
            <div className="mobile__logo">
              <Link to="/">
                <img
                  src="./assets/eslogo.svg"
                  alt="Estate Syndicates Logo"
                  className="w-[80px]"
                />
              </Link>
            </div>

            {/* Main Links for Mobile */}
            <div className="mobileNavLinks flex flex-col text-black-300 font-bold">
              {mainNav.map((link, index) => (
                <Link
                  onClick={toggleMenu}
                  to={link.link}
                  key={index}
                  className={`px-5 py-2 hover:bg-golden-100 hover:text-black-600 transition-all duration-200 ${
                    isActive(link.link) ? "text-white" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Account Links for Mobile */}
            <div className="mobileAccountsNav mt-auto">
              <div className="mobileAccountContent flex flex-col gap-3 mr-10">
                {accountLink.map((link, index) => (
                  <Link
                    onClick={toggleMenu}
                    to={link.link}
                    key={index}
                    className={`${
                      index === 0
                        ? "font-bold bg-golden-300 border border-2 border-golden-100 hover:border-white px-4 py-2 rounded-lg"
                        : "border border-2 border-black-200 rounded-lg px-4 py-2 font-bold text-black-200 hover:border-black-100 hover:text-black-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Topheader;

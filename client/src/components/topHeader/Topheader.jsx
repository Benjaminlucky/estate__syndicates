import React from "react";
import { Link, useLocation } from "react-router-dom";
import { accountLink, mainNav } from "../../../data";

function Topheader() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  return (
    <div className="mainheader__container w-full">
      <div className="mainheader__wrapper w-10/12 mx-auto">
        <div className="desktopNav__wrapper my-5">
          <div className="dnav__content flex justify-between items-center">
            <div className="logo">
              <Link to="/">
                <img
                  src="./assets/eslogo.svg"
                  alt="Estate Syndicate Logo"
                  className="w-[90px]"
                />
              </Link>
            </div>
            <div className="dmain__nav flex justify-center">
              <div className="dmain__navContent flex gap-8 text-black-300 font-bold">
                {mainNav.map((nav, index) => (
                  <Link
                    to={nav.link}
                    key={index}
                    className={` ${isActive(nav.link) ? "text-white" : ""}`}
                  >
                    <div className="link">{nav.name}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="daccount__nav flex justify-end items-center">
              <div className="daccount__navContent flex gap-5 items-center">
                {accountLink.map((accountlink, index) => (
                  <Link
                    to={accountlink.link}
                    key={index}
                    className={`${
                      index === 0
                        ? "px-4 py-2 rounded-lg bg-gradient-to-r from-golden-400 via-yellow-500 to-golden-600 font-bold border-2 border-transparent hover:border-white !hover:bg-transparent transition-all duration-200"
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
        <div className="mobileNav__wrapper"></div>
      </div>
    </div>
  );
}

export default Topheader;

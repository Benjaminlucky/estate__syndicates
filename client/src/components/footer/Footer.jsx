import React from "react";
import { legallink, mainNav, social } from "../../../data";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer__section w-full">
      <div className="footer__wrapper w-full">
        <div className="footer__content w-10/12 mx-auto">
          <div className="footer__top flex flex-col md:flex-row  justify-center md:justify-between">
            <div className="footer__logo flex justify-center py-8 md:py-0">
              <img
                src="./assets/eslogo.svg"
                alt="Estate Syndicates Brand Identity"
              />
            </div>
            <div className="all__links grid grid-cols-3 md:flex md:flex-row justify-center w-full md:w-3/5 mx-auto gap-16">
              <div className="footer__qlinks">
                <div className="link__title py-3 font-bold text-golden-200">
                  <h5>Quick Links</h5>
                </div>
                <div className="qlinks flex flex-col font-chivo gap-4">
                  {mainNav.map((link, index) => (
                    <div className="link" key={index}>
                      <Link to={link.link}>{link.name}</Link>
                    </div>
                  ))}
                </div>
              </div>
              <div className="footer__legal ">
                <div className="links__title py-3 font-bold text-golden-200">
                  <h5>Legal Links</h5>
                </div>
                <div className="lLinks flex flex-col font-chivo">
                  {legallink.map((legal, index) => (
                    <Link to={legal.link} key={index}>
                      {legal.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="footer__social">
                <div className="social__title text-golden-200 font-bold py-3">
                  <h5>Socials</h5>
                </div>
                <div className="sLinks flex flex-col md:flex-row gap-3">
                  {social.map((social, index) => (
                    <Link
                      to={social.link}
                      key={index}
                      className="h-10 w-10 aspect-square flex justify-center text-2xl overflow-hidden rounded-full items-center  bg-golden-300 "
                    >
                      {React.createElement(social.social)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__bottom mt-16 bg-golden-900">
          <div className="footerbottom_content flex flex-col md:flex-row justify-between w-full md:w-10/12 mx-auto py-3 font-chivo">
            <div className="right text-center">
              &copy; Estate Syndicates 2025. All Rights Reserved
            </div>
            <div className="developer text-black-300 text-center">
              Developed by Inspireme Media Networks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;

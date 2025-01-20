import React from "react";
import { homeprocess } from "../../../data";

function Homeprocess() {
  return (
    <div className="process__section w-full pt-16 md:py-32">
      <div className="process__wrapper w-full">
        <div className="process__content justify-center w-3/5 mx-auto">
          <div className="process__titles">
            <div className="pTitle text-center text-2xl md:text-4xl font-bold uppercase">
              <h3>How it works</h3>
            </div>
            <div className="pSubtitle text-center font-chivo text-black-300">
              <p>
                We’ve simplified real estate investment into a seamless and
                transparent process. Here’s how you can start building wealth
                with us in just four easy steps:
              </p>
            </div>
          </div>
          <div className="process__items w-full mt-8">
            <div className="pitems grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-1">
              {homeprocess.map((process, index) => (
                <div
                  className="process flex flex-col items-center gap-2 md:gap-5"
                  key={index}
                >
                  <div className="icon h-25 w-25 aspect-square border border-4 border-golden-200 text-black-300 p-5 md:p-8 rounded-full text-3xl md:text-4xl overflow-hidden">
                    {React.createElement(process.icon)}
                  </div>
                  <div className="name font-chivo uppercase  text-xl ">
                    {process.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homeprocess;

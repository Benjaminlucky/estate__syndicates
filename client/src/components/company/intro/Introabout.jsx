import React from "react";

function Introabout() {
  return (
    <div className="intro__section w-full">
      <div className="intro__wrapper w-10/12 mx-auto">
        <div className="intro__content grid grid-cols-1 md:grid-cols-2 items-center mx-auto">
          <div className="left">
            <div className="left__content mt-10 md:mt-0">
              <div className="title uppercase font-bold text-xl text-center md:text-left md:text-5xl">
                <h3>Be a part of our Mission</h3>
              </div>
              <div className="subtitle font-chivo text-lg text-center  md:text-3xl md:text-justify hyphens-auto text-black-200 mt-2">
                <h4>
                  we’re revolutionizing real estate investment by breaking down
                  barriers and making property ownership accessible to everyone.
                </h4>
              </div>
              <div className="para font-chivo text-black-400 text-[12px] md:text-base text-center md:text-justify mt-4 ">
                <p>
                  Our platform unites like-minded investors to co-invest in
                  premium real estate projects, leveraging the power of
                  collaboration and fractional ownership to create wealth
                  opportunities that were once exclusive to high-net-worth
                  individuals.
                </p>
              </div>
            </div>
          </div>
          <div className="right flex justify-center items-center">
            <div className="right__content">
              <div className="img">
                <img
                  src="./assets/aboutimg.png"
                  alt="An image of a PR person"
                  className="max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Introabout;

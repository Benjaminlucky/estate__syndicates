import React from "react";
import { homeBenefits } from "../../../data";

function Homebenefits() {
  return (
    <div className="homeBenfits__section w-full mt-44 mb-16">
      <div className="hBenefits__wrapper w-full mx-auto">
        <div className="hb__content w-full flex flex-col justify-center">
          <div className="hbTop w-full">
            <div className="hbTopContent w-3/5 mx-auto">
              <div className="title text-center text-4xl uppercase font-bold">
                <h3>Benefits of Joining Estate Syndicates</h3>
              </div>
              <div className="subTitle text-center w-4/5 text-2xl text-black-300 font-chivo mx-auto">
                <p>
                  Unlock unparalleled opportunities and redefine your investment
                  journey with Estate Syndicates. Here's what sets us apart
                </p>
              </div>
            </div>
          </div>
          <div className="hbBottom py-24 w-full">
            <div className="hbBottom__content w-full">
              <div className="benefits flex gap-12">
                {homeBenefits.map((benefits, index) => (
                  <div className="benefit" key={index}>
                    <div className="benefit__title text-center font-bold text-xl mb-6 uppercase">
                      <h4>{benefits.title}</h4>
                    </div>
                    <div className="benefit__text font-chivo text-black-300 text-lg">
                      <p className="text-center tracking-wide hyphens-auto leading-relaxed">
                        {benefits.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homebenefits;

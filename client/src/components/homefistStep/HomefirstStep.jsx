import React from "react";
import { Link } from "react-router-dom";

function Homefirststep() {
  return (
    <div className="first__section py-16 md:py-32 w-full">
      <div className="first__wrapper w-full">
        <div className="first__content flex flex-col justify-center w-full md:w-4/5 mx-auto">
          <div className="fTitle text-2xl md:text-4xl text-center uppercase font-bold">
            <h3>Take the first step towards financial freedom</h3>
          </div>
          <div className="fsubtitle font-chivo text-center text-black-300">
            <p>
              Don't wait to unlock your potential in real estate. Join a
              community of forward-thinking investors and start building your
              wealth today.
            </p>
          </div>
          <Link
            to="/"
            className="py-5 px-8 mt-8 rounded-sm text-center text-xl md:text-2xl font-bold w-fit mx-auto justify-center border border-2 border-golden-200 hover:bg-golden-200 hover:text-black-900"
          >
            Sign up for free Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homefirststep;

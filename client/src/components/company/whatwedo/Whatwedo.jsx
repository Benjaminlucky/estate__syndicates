import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { whatwedo } from "../../../../data";

function Whatwedo() {
  if (!whatwedo || whatwedo.length === 0) {
    return <div>Loading...</div>;
  }

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <div ref={sectionRef} className="whatwedo__section w-full py-16">
      <div className="whatwedo__wrapper w-10/12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="whatwedo__content w-full md:w-8/12 mx-auto"
        >
          <div className="title text-center uppercase text-white text-2xl md:text-4xl font-bold">
            <h3>WHAT WE DO</h3>
          </div>
          <div className="subtitle text-center text-black-300 md:text-xl font-chivo">
            <p>At Estate Syndicates, we offer:</p>
          </div>
        </motion.div>

        <div className="things py-16">
          <div className="things__content grid grid-cols-1 md:grid-cols-2 gap-8">
            {whatwedo.map((data, index) => (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="thing flex flex-col md:flex-row items-center md:items-start gap-8"
                key={index}
              >
                <div className="left">
                  {data.icon && (
                    <div className="icon text-6xl w-24 h-24 rounded-full aspect-square border border-2 border-golden-200 flex justify-center items-center">
                      {React.createElement(data.icon)}
                    </div>
                  )}
                </div>
                <div className="right">
                  <p className="font-bold uppercase text-xl text-center md:text-left">
                    {data.title}
                  </p>
                  <p className="font-chivo text-black-300 text-xl text-center md:text-left">
                    {data.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Whatwedo;

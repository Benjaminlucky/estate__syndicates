import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { values } from "../../../../data";

function Values() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <div ref={sectionRef} className="values__section w-full">
      <div className="values__wrapper w-10/12 mx-auto">
        <div className="values__content w-full py-16">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center uppercase font-bold text-3xl md:text-5xl"
          >
            <h3>OUR CORE VALUES</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center font-chivo text-black-300 text-xl mt-4"
          >
            <p>At Estate Syndicates, we stand behind these four pillars:</p>
          </motion.div>

          {/* Values Grid */}
          <div className="values w-full py-12">
            <div className="grid grid-cols-1 md:grid-cols-4">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`p-6 md:p-8 py-8 flex flex-col justify-center items-center shadow-lg transition-all cursor-pointer ${
                    index === 1
                      ? "bg-golden-800"
                      : index === 2
                      ? "bg-golden-700"
                      : index === 3
                      ? "bg-golden-600"
                      : "bg-golden-500"
                  }`}
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className="text-6xl py-3 mb-4 text-center"
                  >
                    {React.createElement(value.icon)}
                  </motion.div>

                  {/* Title */}
                  <h4 className="text-3xl uppercase font-bold mb-4">
                    {value.value}
                  </h4>

                  {/* Description */}
                  <p className="text-center font-chivo text-black-200 text-lg leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Values;

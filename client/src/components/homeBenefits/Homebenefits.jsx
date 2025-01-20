import React from "react";
import { homeBenefits } from "../../../data";
import { motion } from "framer-motion";

function Homebenefits() {
  return (
    <div className="homeBenfits__section w-full mt-44 mb-16">
      <div className="hBenefits__wrapper w-full mx-auto">
        <div className="hb__content w-full flex flex-col justify-center">
          <div className="hbTop w-full">
            <motion.div
              className="hbTopContent w-full mb-8 md:mb-4 md:w-3/5 mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="title text-center text-2xl md:text-4xl uppercase font-bold">
                <h3>Benefits of Joining Estate Syndicates</h3>
              </div>
              <div className="subTitle text-center w-full md:w-4/5 text-lg mb:text-2xl text-black-300 font-chivo mx-auto">
                <p>
                  Unlock unparalleled opportunities and redefine your investment
                  journey with Estate Syndicates. Here's what sets us apart
                </p>
              </div>
            </motion.div>
          </div>
          <motion.div
            className="hbBottom py-16 md:py-24 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="hbBottom__content w-full">
              <motion.div
                className="benefits flex flex-col md:flex-row gap-12"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 },
                  },
                }}
              >
                {homeBenefits.map((benefits, index) => (
                  <motion.div
                    className="benefit"
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? 100 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="benefit__title text-center font-bold text-sm md:text-xl md:mb-6 uppercase">
                      <h4>{benefits.title}</h4>
                    </div>
                    <div className="benefit__text font-chivo text-black-300 text-lg">
                      <p className="text-center tracking-wide hyphens-auto leading-relaxed">
                        {benefits.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Homebenefits;

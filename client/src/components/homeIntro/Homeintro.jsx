import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Homeintro() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <div
      className="homeIntro__section w-full mt-32 md:mt-64 mb-16 md:mb-32"
      ref={ref}
    >
      <motion.div
        className="homeIntro__wrapper flex flex-col w-full md:w-8/12 mx-auto justify-center"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <motion.div
          className="homeIntro__content"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="introTitle w-full">
            <h3 className="text-center text-sm md:text-4xl font-bold uppercase">
              Making real estate investments accessible to everyone through
              fractional ownership.
            </h3>
          </div>
          <div className="introSubtitle">
            <p className="text-center font-chivo my-2 text-sm md:text-2xl text-black-300">
              At Estate Syndicates, we believe that everyone should have the
              opportunity to participate in real estate investment, regardless
              of financial capacity.
            </p>
          </div>
        </motion.div>
        <motion.div
          className="intro2ContentWrapper py-10"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="intro2Contents flex flex-col text-center md:flex-row gap-10 font-chivo md:text-justify text-black-300">
            <div className="i2Cleft">
              <div className="i2Cleftcopy max-w-prose">
                <motion.p
                  className="text-justify tracking-wide hyphens-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  At Estate Syndicates, we believe that everyone should have the
                  opportunity to participate in real estate investment,
                  regardless of financial capacity. Our mission is to empower
                  individuals through innovative technology and strategic
                  partnerships, enabling like-minded investors to pool
                  resources, share expertise, and achieve financial growth.
                </motion.p>
              </div>
            </div>
            <div className="i2Cright">
              <div className="i2Cleftcopy max-w-prose">
                <motion.p
                  className="text-justify tracking-wide hyphens-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  Guided by our vision to democratize real estate, we are
                  redefining the investment landscape by offering fractional
                  ownership opportunities. This unique approach allows investors
                  to collectively access premium real estate projects—making it
                  possible to diversify portfolios, share risks, and enjoy
                  significant returns that were once exclusive to institutional
                  investors or high-net-worth individuals.
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Homeintro;

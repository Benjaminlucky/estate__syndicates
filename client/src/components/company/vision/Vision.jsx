import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Vision() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <div ref={sectionRef} className="vision__section w-full py-16">
      <div className="vision__wrapper w-10/12 mx-auto">
        <div className="vision__content flex flex-col lg:flex-row items-center gap-8">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="left flex-[1]"
          >
            <div className="title mb-4">
              <h3 className="text-3xl font-bold text-black text-center md:text-left text-5xl">
                Our Vision
              </h3>
            </div>
            <div className="subtitle">
              <p className="text-lg text-black-300 text-2xl text-center md:text-left md:text-4xl font-chivo leading-normal">
                To create a world where real estate investment is inclusive,
                collaborative, and rewarding for all, regardless of financial
                capacity or experience level.
              </p>
            </div>
          </motion.div>

          {/* Right Section (Image) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="right flex-[1]"
          >
            <div className="visionimg">
              <img
                className="object-cover rounded-lg shadow-lg"
                src="./assets/visionImg.png"
                alt="Vision"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Vision;

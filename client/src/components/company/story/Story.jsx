import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Story() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <div ref={sectionRef} className="story__section w-full pb-32">
      <div className="story__wrapper w-10/12 mx-auto">
        <div className="story__content w-full md:w-7/12">
          {/* Title Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="story__title text-center md:text-left text-5xl font-bold uppercase mb-6"
          >
            <h3>our story</h3>
          </motion.div>

          {/* Subtitle Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="story__subtitle text-center md:text-left font-chivo text-xl md:text-4xl leading-normal text-black-300"
          >
            <p>
              Estate Syndicates was founded with a vision to democratize real
              estate investment, making it accessible to individuals from all
              walks of life. Since our inception, we have successfully
              syndicated over 10 premium projects, providing countless investors
              with a reliable path to wealth creation.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Story;

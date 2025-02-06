import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { leadership } from "../../../../data";

function Leadership() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <div ref={sectionRef} className="leadership__section w-full">
      <div className="leadership__wrapper w-10/12 mx-auto py-16 md:py-24">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="leadership__content w-full text-center"
        >
          <h3 className="text-3xl md:text-5xl font-bold uppercase text-black">
            Leadership Team
          </h3>
          <p className="w-full md:w-6/12 mx-auto text-lg text-black-200 mt-4 font-chivo">
            Our team is led by experienced professionals with deep expertise in
            real estate, finance, and technology. Together, they drive our
            mission to revolutionize the industry.
          </p>
        </motion.div>

        {/* Team Members */}
        <div className="team__members py-24">
          <div className="teams grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="team text-center bg-white rounded-lg shadow-lg p-4 cursor-pointer"
              >
                {/* Team Member Image */}
                <motion.div
                  className="team__img w-full h-[320px] mb-4 overflow-hidden rounded-md"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    className="w-full h-full object-cover rounded-md"
                    src={leader.avatar}
                    alt={`${leader.name}'s picture`}
                  />
                </motion.div>

                {/* Team Member Name */}
                <h5 className="text-lg uppercase font-bold text-gray-800">
                  {leader.name}
                </h5>

                {/* Team Member Role */}
                <p className="text-md text-gray-600 mt-2 font-chivo uppercase">
                  {leader.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leadership;

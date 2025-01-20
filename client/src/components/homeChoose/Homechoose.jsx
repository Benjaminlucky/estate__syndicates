import React from "react";
import { motion } from "framer-motion";
import { perk } from "../../../data";
import { Link } from "react-router-dom";

function Homechoose() {
  return (
    <div className="choose__section w-full">
      <div className="choose__wrapper w-full mx-auto">
        <div className="choose__content flex flex-col justify-center">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="title__wrapper"
          >
            <div className="choose__title text-center font-bold text-2xl md:text-4xl">
              <h3>WHY CHOOSE US ?</h3>
            </div>
            <div className="choose__subtitle text-center text-[16px] md:w-2/5 mx-auto font-chivo text-black-300">
              <p>
                At Estate Syndicates, we are committed to making real estate
                investment accessible, transparent, and rewarding for everyone.
                Here's what sets us apart:
              </p>
            </div>
          </motion.div>

          {/* Perks Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="choosePerksWrapper mt-5 md:mt-0 w-full"
          >
            <motion.div
              className="cPerksContent flex w-5/5 md:w-4/5 mx-auto"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 },
                },
              }}
            >
              <div className="perks grid grid-cols-1  md:grid-cols-2 gap-5 md:gap-10 my-3 md:mt-32 mb-16">
                {perk.map((perk, index) => (
                  <motion.div
                    key={index}
                    className="perk flex flex-1 items-start md:items-center justify-center  gap-4 md:gap-8"
                    initial={{ opacity: 0, x: index % 2 === 0 ? 100 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="perkIcon w-[100px] aspect-square flex items-center justify-center rounded-full overflow-hidden p-3 text-4xl text-black-50 border-2 border-golden-300">
                      {React.createElement(perk.icon)}
                    </div>
                    <div className="perkContent">
                      <div className="perkTitle font-bold text-lg">
                        {perk.name}
                      </div>
                      <div className="perkText text-lg font-chivo text-black-300">
                        {perk.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Journey Section */}
          <div className="journey__wrapper w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="journey-content flex flex-col justify-center w-5/5 mt-3 mx-auto"
            >
              <div className="journey">
                <h5 className="text-center">
                  Ready to learn more about our story and how we're transforming
                  real estate investment?
                </h5>
              </div>
              <motion.div
                className="explore flex justify-center my-5"
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95, rotate: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to="/company"
                  className="border mt-5 border-2 border-golden-200 py-3 font-bold px-4 rounded-lg text-lg hover:border-transparent hover:bg-golden-200 hover:text-golden-800"
                >
                  Explore our Journey
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homechoose;

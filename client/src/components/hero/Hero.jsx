import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Hero() {
  const sectionVariant = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1 } },
  };

  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } },
  };

  return (
    <motion.div
      className="hero__section"
      variants={sectionVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="hero__wrapper relative">
        <div className="hero__content flex justify-center">
          {/* Background Image */}
          <div className="translate-y-36 iphone5s:translate-y-16 md:translate-y-44">
            <img
              src="./assets/heroBG1.png"
              alt="A building model"
              className="py-16 opacity-50"
            />
          </div>

          {/* Text Content */}
          <motion.div
            className="absolute top-12 iphone5s:top-4 iPhone12ProMax:top-[20px] iPhone12Pro:top-[22px] text-center flex flex-col gap-1 iphone5s:gap-[1px]"
            variants={textVariant}
          >
            <div className="subTitle text-sm iphone5s:text-[10px] iPhone12ProMax:text-[16px] iPhone12Pro:text-[14px]  md:text-2xl text-black-300 uppercase">
              Transforming Real Estate Investment
            </div>
            <h1 className="font-bold text-xl iphone5s:text-[16px] iPhone12ProMax:text-[24px] iPhone12Pro:text-[22px] md:text-6xl uppercase">
              Achieve More Together
            </h1>
            <p className="font-chivo text-black-300 iphone5s:text-[10px] md:text-2xl md:w-3/5 mx-auto text-center">
              Join a Community of like-minded Investors to co-own Premium Real
              Estate Projects and grow your wealth collaboratively
            </p>
          </motion.div>
        </div>

        {/* Scroll Down Bubble Rings */}
        <motion.div
          className="absolute top-1/2 iphone5s:top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute w-8 h-8 bg-golden-100 rounded-full z-10"></div>
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="absolute w-full h-full rounded-full border-2 border-golden-300"
                initial={{ scale: 1, opacity: 1 }}
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [1, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              ></motion.div>
            ))}
          </div>
          <p className="mt-4 text-sm text-white text-center font-bold">
            Scroll Down
          </p>
        </motion.div>

        {/* Link Button */}
        <motion.div
          whileHover={{ scale: 1.1, opacity: 0.8 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/how-it-works"
            className="absolute -bottom-32 iphone5s:-bottom-12 iphone5s:text-[12px] md:bottom-0 flex w-8/12 md:w-fit justify-center left-1/2 border border-2 border-golden-100 iphone5s:px-3 iphone5s:py-1 px-5 py-3 rounded-lg text-sm md:text-2xl font-bold uppercase transform -translate-x-1/2 md:-translate-y-1/2 hover:bg-golden-100 hover:text-golden-700"
          >
            See how it works
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Hero;

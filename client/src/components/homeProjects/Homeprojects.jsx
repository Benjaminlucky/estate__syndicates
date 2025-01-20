import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { homeProject } from "../../../data";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Homeprojects.css";

function Homeprojects() {
  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="projects__section w-full md:mt-48 mb-16">
      <div className="project__wrapper w-full mx-auto">
        <motion.div
          className="project__content w-full flex flex-col justify-center"
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="ptitle__section py-16 text-center">
            <div className="project__title text-2xl md:text-4xl uppercase font-bold">
              <h3>Featured Projects</h3>
            </div>
            <div className="project__subtitle w-full md:w-2/5 mx-auto font-chivo text-black-300">
              <p>
                Explore some of our standout real estate investment
                opportunities, each designed to deliver exceptional returns
                while meeting diverse investment goals.
              </p>
            </div>
          </div>
          <div className="project__highlights w-full">
            <div className="phighlights__wrapper w-full">
              <motion.div
                className="phighlights__content w-full"
                variants={containerVariant}
              >
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]} // Added Autoplay
                  navigation
                  pagination={{
                    clickable: true,
                  }}
                  autoplay={{ delay: 3000 }} // Auto-slide every 3 seconds
                  spaceBetween={30}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    1024: { slidesPerView: 2 },
                  }}
                >
                  {homeProject.map((project, index) => (
                    <SwiperSlide key={index}>
                      <motion.div className="project" variants={itemVariant}>
                        <div className="projectimage overflow-hidden rounded-lg">
                          <motion.img
                            src={project.image}
                            alt={project.name}
                            className="w-full transition-transform duration-300 hover:scale-110"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>

                        <div className="project__title pt-5 pb-10 text-lg font-bold uppercase">
                          {project.name}
                        </div>
                        <div className="project__status grid grid-cols-2 gap-5 items-center mb-3">
                          <div className="status bg-golden-200 rounded-lg px-4 py-2 font-chivo uppercase text-golden-700">
                            Status
                          </div>
                          <div className="stat font-chivo text-golden-300 font-bold">
                            {project.Status}
                          </div>
                        </div>
                        <div className="project__purpose grid grid-cols-2 gap-5 items-center">
                          <div className="purpose status bg-golden-300 rounded-lg px-4 py-2 font-chivo uppercase text-golden-800">
                            Purpose
                          </div>
                          <div className="pur stat font-chivo text-golden-300 font-bold">
                            {project.purpose}
                          </div>
                        </div>
                        <div className="project__return grid grid-cols-2 gap-5 mt-3 items-center">
                          <div className="return purpose status bg-golden-400 rounded-lg px-4 py-2 font-chivo uppercase text-golden-900">
                            Return
                          </div>
                          <div className="ret font-chivo text-golden-300 font-bold">
                            {project.Return}
                          </div>
                        </div>
                        <div className="project__duration grid grid-cols-2 mt-3 gap-5 items-center">
                          <div className="duration bg-black-200  rounded-lg px-4 py-2 font-chivo uppercase text-golden-900">
                            Duration
                          </div>
                          <div className="dur font-chivo font-bold">
                            {project.Duration}
                          </div>
                        </div>
                        <div className="project__link py-8 w-full">
                          <motion.div
                            whileHover={{
                              scale: 1.1,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <Link
                              to={project.link}
                              className="border border-2 font-bold font-chivo uppercase border-golden-300 px-8 py-3 rounded-full w-full hover:border-transparent hover:bg-golden-300"
                            >
                              View Details
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Homeprojects;

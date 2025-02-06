import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper/bundle";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./testimonial.css";

// Import Swiper styles
import "swiper/css/bundle";
import "swiper/css";
import "swiper/css/navigation";

// Import your reviews data
import { homeReviews } from "../../../../data";

// Install Swiper modules
SwiperCore.use(["Autoplay", "Navigation"]);

function Testimonial() {
  return (
    <div className="testimonial__section w-full bg-black text-white py-16">
      <div className="testimonial__wrapper w-11/12 lg:w-5/12 mx-auto">
        <Swiper
          navigation={true} // Add this to enable default navigation buttons
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          slidesPerView={1}
          spaceBetween={30}
        >
          {homeReviews.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-slide flex flex-col md:flex-row items-center gap-6  w-full">
                {/* Left Image */}
                <div className="left">
                  <div className="img aspect-square w-24 h-24">
                    <img
                      className=" rounded-full aspect-square object-cover"
                      src={testimonial.image}
                      alt={`${testimonial.name} review`}
                    />
                  </div>
                </div>
                {/* Right Text Content */}
                <div className="right flex flex-col">
                  <p className="text-lg italic text-gray-200 text-center font-chivo md:textleft">
                    {testimonial.review}
                  </p>
                  <h5 className="font-bold text-xl mt-2 text-gray-400 text-center md:text-left text-golden-400">
                    {testimonial.name}
                  </h5>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Testimonial;

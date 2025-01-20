import React from "react";
import { homeReviews } from "../../../data";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./investorsreview.css";

function Investorsreview() {
  return (
    <div className="investorReview__section mt-32 w-full">
      <div className="investorsReview__Wrapper w-4/5 mx-auto">
        <div className="iReview__Content w-full">
          <div className="review__title text-center font-bold uppercase text-4xl">
            <h3>What our Investors are Saying</h3>
          </div>
          <div className="reviews__wrapper py-16 w-full">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1} // Default for small screens
              spaceBetween={20}
              navigation={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              breakpoints={{
                640: {
                  slidesPerView: 1, // For tablets and small screens
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3, // Two slides for larger screens
                  spaceBetween: 30,
                },
                1440: {
                  slidesPerView: 3, // Three slides for extra-large screens
                  spaceBetween: 40,
                },
              }}
              className="reviews mb-8 "
            >
              {homeReviews.map((review, index) => (
                <SwiperSlide key={index}>
                  <div className="review border border-2 border-golden-200 px-4 py-6 hover:border-transparent hover:bg-golden-200 hover:!text-black-800 rounded-lg">
                    <div className="name__avatar flex flex-col sm:flex-row gap-3 py-4 items-center text-center sm:text-left">
                      <div className="avatar w-16 h-16 rounded-full overflow-hidden">
                        <img src={review.image} alt="" />
                      </div>
                      <div className="name__location flex flex-col sm:flex-row gap-1 sm:gap-2 items-center sm:items-start">
                        <div className="name font-bold uppercase text-lg">
                          {review.name}
                        </div>
                        <div className="location font-chivo text-black-500 hover:text-black-600 text-sm">
                          {review.location}
                        </div>
                      </div>
                    </div>
                    <div className="reviewText font-chivo text-black-300 hover:text-black-700 text-sm text-justify hyphens-auto">
                      {review.review}
                    </div>
                    <div className="social__email flex gap-4 text-xl py-4 justify-center sm:justify-start text-golden-600 hover:text-golden-700">
                      <div className="social">
                        <Link to="/">{React.createElement(review.social)}</Link>
                      </div>
                      <div className="email">
                        <a href="#">{React.createElement(review.mail)}</a>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="custom-pagination mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Investorsreview;

import React from "react";
import { dashsummary, statData } from "../../../data";
import StatCard from "./StartCard"; // Ensure this is spelled correctly
import { Link } from "react-router-dom";

export default function DashboardSummary() {
  return (
    <>
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 watch:grid-cols-1 watch:w-full  sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 ">
        {statData.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            chartData={item.chartData}
            buttonText={item.buttonText}
            roi={item.roi}
          />
        ))}
      </div>

      {/* Summary Bottom Section */}
      <div className="summary__bottom w-full mt-10 watch:mt-4">
        <div className="sbottom__wrapper w-full">
          <div className="sbottom__content w-full grid grid-cols-1 watch:grid-cols-1  md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 watch:gap-2">
            {dashsummary.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                className={`shadow-sm py-8 px-8 watch:py-4 watch:px-2 rounded-sm text-center flex justify-center items-center ${
                  index === 0
                    ? "bg-golden-50 text-black-500"
                    : index === 1
                    ? "bg-golden-100 text-black-500"
                    : index === 2
                    ? "bg-golden-200 text-black-50"
                    : index === 3
                    ? "bg-golden-300 text-black-50"
                    : index === 4
                    ? "bg-golden-400 text-black-50"
                    : index === 5
                    ? "bg-golden-500 text-black-50"
                    : index === 6
                    ? "bg-golden-600 text-black-50"
                    : index === 7
                    ? "bg-golden-700 text-black-50"
                    : ""
                }`}
              >
                <div className="scard__content font-chivo font-semibold flex flex-col justify-center items-center text-center">
                  <span className="total text-4xl watch:text-lg">
                    {item.total}
                  </span>
                  <span className="title text-xl watch:text-sm mt-1">
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

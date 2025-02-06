import React from "react";
import { metric } from "../../../../data";

function Metrics() {
  return (
    <div className="metrics__section w-full bg-golden-500">
      <div className="metric__wrapper w-10/12 mx-auto py-12">
        <div className="metric__content w-full ">
          <div className="metrics grid grid-cols-1 md:grid-cols-4">
            {metric.map((metric, index) => (
              <div
                className="metric flex flex-col items-center py-5 md:py-0"
                key={index}
              >
                <div className="number text-6xl md:text-7xl font-chivo font-bold">
                  {metric.number}
                </div>
                <div className="number font-chivo text-xl text-black-200 uppercase text-center">
                  {metric.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Metrics;

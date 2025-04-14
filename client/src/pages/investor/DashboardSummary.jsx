import React from "react";
import { statData } from "../../../data";
import StatCard from "./StartCard"; // make sure this is spelled correctly

export default function DashboardSummary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statData.map((item, index) => (
        <StatCard
          key={index}
          title={item.title}
          value={item.value}
          chartData={item.chartData}
          buttonText={item.buttonText}
          roi={item.roi} // ✅ Add this line
        />
      ))}
    </div>
  );
}

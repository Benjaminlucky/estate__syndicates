import React, { useState } from "react";
import Aside from "../../../components/investorDashboard/Aside";
import DashboardSummary from "../DashboardSummary";
import Profile from "./Profile";

const InvestorDashboard = () => {
  return (
    <main className="signup__section w-full flex">
      <div className="main__wrapper  w-full mx-auto p-4">
        <div className="right__wrapper ">
          <div className="profile text-3xl text-gray-500 font-bold font-chivo pb-12">
            {<Profile />}
          </div>
          <div className="summary">{<DashboardSummary />}</div>
        </div>
      </div>
    </main>
  );
};

export default InvestorDashboard;

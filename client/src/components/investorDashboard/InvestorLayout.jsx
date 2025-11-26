import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Aside from "./Aside";

const InvestorLayout = () => {
  const [sidebarWidth, setSidebarWidth] = useState("w-64"); // Default width

  return (
    <div className="flex">
      {/* Sidebar with dynamic width */}
      <Aside width="w-[260px]" />

      {/* Main Content */}
      <div className="flex-1 p-4 bg-black-800 text-black-900">
        <Outlet />
      </div>
    </div>
  );
};

export default InvestorLayout;

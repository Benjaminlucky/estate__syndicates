import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/admin/Sidebar";
import TopNav from "../../../components/admin/TopNav";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar open={open} setOpen={setOpen} />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 
        ${open ? "ml-64" : "ml-0 md:ml-64"}`}
      >
        <TopNav onSignOut={handleSignOut} setOpen={setOpen} />

        {/* Render all nested admin routes */}
        <main className="p-6 mt-14 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

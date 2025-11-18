// src/components/admin/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import logo from "/assets/eslogo.svg";
import {
  FaHome,
  FaProjectDiagram,
  FaChartPie,
  FaFileAlt,
  FaUser,
  FaHeadset,
} from "react-icons/fa";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const menu = [
    { name: "Overview", path: "/dashboard", icon: <FaHome /> },
    {
      name: "Projects",
      path: "/dashboard/projects",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Expense Breakdown",
      path: "/dashboard/expenses",
      icon: <FaChartPie />,
    },
    {
      name: "Payout & Withdrawals",
      path: "/dashboard/payouts",
      icon: <FaFileAlt />,
    },
    { name: "Documents", path: "/dashboard/documents", icon: <FaFileAlt /> },
    {
      name: "Investment Preference",
      path: "/dashboard/preferences",
      icon: <FaChartPie />,
    },
    { name: "Profile Settings", path: "/dashboard/settings", icon: <FaUser /> },
    {
      name: "Support & Community",
      path: "/dashboard/support",
      icon: <FaHeadset />,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 md:hidden transition-opacity font-chivo ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`w-64 bg-black fixed left-0 top-0 h-screen p-6 border-r font-chivo border-gray-800
          transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-64 md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img src={logo} alt="logo" className="w-28" />
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menu.map((item) => {
            const active =
              location.pathname === item.path ||
              (location.pathname.startsWith(item.path + "/") &&
                item.path !== "/dashboard");

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition ${
                  active
                    ? "bg-golden-600 text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

import { Link, useLocation } from "react-router-dom";
import logo from "/assets/eslogo.svg";
import {
  FaHome,
  FaProjectDiagram,
  FaChartPie,
  FaFileAlt,
  FaTruck,
  FaMoneyCheckAlt,
  FaFolderOpen,
  FaChartBar,
  FaFlag,
  FaFileInvoiceDollar,
  FaUsers,
} from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { useAdminRole } from "../../hooks/useAdmin.js";

const ROLE_BADGE = {
  super_admin: { label: "Super Admin", cls: "bg-golden-500 text-black" },
  manager: { label: "Manager", cls: "bg-blue-700 text-white" },
  viewer: { label: "Viewer", cls: "bg-black-600 text-black-300" },
};

const menu = [
  { name: "Overview", path: "/dashboard", icon: FaHome },
  { name: "Projects", path: "/dashboard/projects", icon: FaProjectDiagram },
  {
    name: "Investments",
    path: "/dashboard/investments",
    icon: FaMoneyCheckAlt,
  },
  { name: "Expense Breakdown", path: "/dashboard/expenses", icon: FaChartPie },
  { name: "Payouts", path: "/dashboard/payouts", icon: FaFileInvoiceDollar },
  { name: "Documents", path: "/dashboard/documents", icon: FaFolderOpen },
  { name: "Milestones", path: "/dashboard/milestones", icon: FaFlag },
  { name: "Analytics", path: "/dashboard/analytics", icon: FaChartBar },
  { name: "Reports", path: "/dashboard/reports", icon: FaFileAlt },
  { name: "Team Members", path: "/dashboard/team", icon: RiTeamFill },
  { name: "Vendors", path: "/dashboard/vendors", icon: FaTruck },
  {
    name: "Admin Users",
    path: "/dashboard/admins",
    icon: FaUsers,
    superOnly: true,
  },
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const role = useAdminRole();
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.viewer;

  const isActive = (path) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/60 md:hidden transition-opacity z-40 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`w-64 bg-black fixed left-0 top-0 h-screen flex flex-col border-r border-gray-800
          transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-64 md:translate-x-0"}`}
      >
        {/* Logo + role badge */}
        <div className="px-6 py-5 border-b border-gray-800">
          <img src={logo} alt="logo" className="w-24 mx-auto mb-3" />
          <div className="flex justify-center">
            <span
              className={`font-chivo text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badge.cls}`}
            >
              {badge.label}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {menu.map((item) => {
            if (item.superOnly && role !== "super_admin") return null;
            const active = isActive(item.path);
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-150 group ${
                  active
                    ? "bg-golden-600 text-black font-bold"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <ItemIcon
                  className={`text-base flex-shrink-0 ${active ? "text-black" : "text-golden-600 group-hover:text-golden-300"}`}
                />
                <span className="font-chivo text-sm uppercase tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

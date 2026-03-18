import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaBell,
  FaHome,
  FaProjectDiagram,
  FaChartPie,
  FaFileInvoiceDollar,
  FaFileAlt,
  FaCog,
  FaHeadset,
  FaSignOutAlt,
  FaHeart,
} from "react-icons/fa";

const NAV_LINKS = [
  { name: "Overview", link: "/investor-dashboard/", Icon: FaHome },
  {
    name: "My Projects",
    link: "/investor-dashboard/active-projects",
    Icon: FaProjectDiagram,
  },
  {
    name: "Expense Breakdown",
    link: "/investor-dashboard/expense-breakdown",
    Icon: FaChartPie,
  },
  {
    name: "Payouts",
    link: "/investor-dashboard/payouts",
    Icon: FaFileInvoiceDollar,
  },
  { name: "Documents", link: "/investor-dashboard/documents", Icon: FaFileAlt },
  {
    name: "Preferences",
    link: "/investor-dashboard/investmentPreference",
    Icon: FaHeart,
  },
  {
    name: "Profile",
    link: "/investor-dashboard/profile-settings",
    Icon: FaCog,
  },
  {
    name: "Support",
    link: "/investor-dashboard/support-community",
    Icon: FaHeadset,
  },
];

const MOCK_NOTIFS = [
  {
    id: 1,
    text: "Your investment is now active.",
    time: "2h ago",
    read: false,
  },
  {
    id: 2,
    text: "Payout of ₦150,000 has been processed.",
    time: "1d ago",
    read: false,
  },
  {
    id: 3,
    text: "New project listing: Lekki Phase 3.",
    time: "3d ago",
    read: true,
  },
];

const InvestorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const investor = JSON.parse(localStorage.getItem("investor") || "{}");
  const initials =
    `${investor.firstName?.[0] ?? ""}${investor.lastName?.[0] ?? ""}`.toUpperCase();
  const unreadCount = MOCK_NOTIFS.filter((n) => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("investor");
    navigate("/login");
  };

  const isActive = (link) =>
    link === "/investor-dashboard/"
      ? location.pathname === "/investor-dashboard/" ||
        location.pathname === "/investor-dashboard"
      : location.pathname.startsWith(link);

  return (
    <div className="flex h-screen bg-black-900 text-white overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-black-900 border-r border-black-800
        flex flex-col z-40 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex-shrink-0
      `}
      >
        <div className="px-6 py-5 border-b border-black-800 flex-shrink-0">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <img
              src="/assets/eslogo.svg"
              alt="Estate Syndicates"
              className="w-24 mx-auto"
            />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_LINKS.map(({ name, link, Icon }) => {
            const active = isActive(link);
            return (
              <Link
                key={link}
                to={link}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-chivo
                  transition-all duration-200 group
                  ${
                    active
                      ? "bg-golden-500 text-white font-bold"
                      : "text-black-300 hover:bg-black-800 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`text-base flex-shrink-0 ${active ? "text-white" : "text-golden-600 group-hover:text-golden-300"}`}
                />
                <span className="uppercase tracking-wide">{name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-black-800 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-chivo text-black-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-200"
          >
            <FaSignOutAlt className="text-base flex-shrink-0" />
            <span className="uppercase tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-16 bg-black-900 border-b border-black-800 flex items-center justify-between px-4 md:px-6 z-20">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-black-800 transition-colors"
            onClick={() => setSidebarOpen((p) => !p)}
          >
            {sidebarOpen ? (
              <FaTimes className="text-lg" />
            ) : (
              <FaBars className="text-lg" />
            )}
          </button>

          <div className="hidden md:block">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-widest">
              Investor Portal
            </p>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((p) => !p)}
                className="relative p-2 rounded-lg hover:bg-black-800 transition-colors"
              >
                <FaBell className="text-lg text-black-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-golden-400 rounded-full text-[10px] font-bold text-black-900 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotifOpen(false)}
                    />
                    <motion.div
                      key="notif-panel"
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-80 bg-black-800 border border-black-700 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-black-700 flex items-center justify-between">
                        <p className="font-bold text-sm uppercase tracking-wide">
                          Notifications
                        </p>
                        <span className="font-chivo text-xs text-black-500">
                          {unreadCount} unread
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {MOCK_NOTIFS.map((n) => (
                          <div
                            key={n.id}
                            className={`px-4 py-3 border-b border-black-700/50 last:border-0 ${!n.read ? "bg-golden-900/20" : ""}`}
                          >
                            <p className="font-chivo text-sm text-white leading-snug">
                              {n.text}
                            </p>
                            <p className="font-chivo text-xs text-black-500 mt-1">
                              {n.time}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3">
                        <button
                          onClick={() => setNotifOpen(false)}
                          className="w-full font-chivo text-xs text-golden-400 uppercase tracking-wide hover:text-golden-300"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-golden-600 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
              {initials || "IN"}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold leading-tight">
                {investor.firstName} {investor.lastName}
              </p>
              <p className="font-chivo text-xs text-black-400 uppercase tracking-wide">
                Investor
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-black-900 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InvestorLayout;

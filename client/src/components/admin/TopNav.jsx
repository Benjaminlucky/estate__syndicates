import { FaBars, FaBell, FaSignOutAlt } from "react-icons/fa";

export default function TopNav({ onSignOut, setOpen }) {
  const token = localStorage.getItem("adminToken");
  const admin = (() => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return {};
    }
  })();

  const initials = admin.email ? admin.email.slice(0, 2).toUpperCase() : "AD";

  return (
    <header className="w-full flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-800 bg-black/60 backdrop-blur sticky top-0 z-30">
      {/* Hamburger — mobile only */}
      <button
        className="md:hidden text-gray-300 hover:text-white text-xl p-1"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open menu"
      >
        <FaBars />
      </button>

      {/* Spacer on desktop */}
      <div className="hidden md:block" />

      {/* Right section */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-golden-600 flex items-center justify-center font-bold text-sm text-white flex-shrink-0 uppercase">
            {initials}
          </div>
          <div className="hidden sm:block text-right leading-tight">
            <p className="text-sm font-bold text-gray-100">
              {admin.email?.split("@")[0] ?? "Admin"}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-chivo">
              {admin.role?.replace("_", " ") ?? "Admin"}
            </p>
          </div>
        </div>

        {/* Logout — always visible */}
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black-800 border border-black-700 hover:bg-red-900/30 hover:border-red-700 hover:text-red-400 text-gray-300 font-chivo text-xs font-bold uppercase tracking-wide transition-colors duration-200"
          title="Sign out"
        >
          <FaSignOutAlt className="text-sm" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

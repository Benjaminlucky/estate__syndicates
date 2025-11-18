// src/components/admin/TopNav.jsx
import { FaBars } from "react-icons/fa";
import userImg from "/assets/investor1.jpg";

export default function TopNav({ onSignOut, setOpen }) {
  return (
    <header className="w-full flex items-center justify-between p-4 border-b border-gray-800 bg-black/40 backdrop-blur">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-gray-300 text-xl"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaBars />
      </button>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto mr-2 sm:mr-6 flex-shrink-0">
        <img
          src={userImg}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />

        <div className="text-right hidden xs:block">
          <p className="text-sm text-gray-200">Benjamin</p>
          <p className="text-xs text-gray-400">Admin</p>
        </div>

        <button
          onClick={onSignOut}
          className="text-gray-300 hover:text-white text-sm hidden xs:block"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

import React, { useState } from "react";
import {
  Search,
  Bell,
  Mail,
  Grid,
  Settings,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  const [searchVal, setSearchVal] = useState("");

  return (
    <header className="fixed top-0 left-56 right-0 h-16 bg-white border-b border-gray-100 z-30 flex items-center px-6">

      {/* SEARCH */}
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />

          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-gray-300 transition"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* ICONS */}
        <div className="flex items-center gap-2">

          <IconBtn icon={Bell} badge={3} />
          <IconBtn icon={Mail} badge={5} />
          <IconBtn icon={Grid} badge={2} />
          <IconBtn icon={Settings} />

        </div>

        {/* DIVIDER */}
        <div className="w-px h-7 bg-gray-200 mx-2" />

        {/* USER */}
        <div className="flex items-center gap-3 cursor-pointer">

          <div className="text-right leading-tight hidden sm:block">
            <p className="text-xs text-gray-500">Hello,</p>
            <p className="text-sm font-semibold text-gray-700">
              Samantha
            </p>
          </div>

          <img
            src="https://i.pravatar.cc/40?img=47"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200"
          />

          <ChevronDown size={15} className="text-gray-400" />

        </div>

      </div>
    </header>
  );
};

const IconBtn = ({ icon: Icon, badge }) => {
  return (
    <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition text-gray-600">

      <Icon size={18} />

      {badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}

    </button>
  );
};

export default Header;

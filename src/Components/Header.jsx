import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/theme';
import { FiSearch, FiBell, FiMessageSquare, FiGift, FiSettings, FiSun, FiMoon } from 'react-icons/fi';

const Header = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  return (
    <header className="bg-[#f3f4f6] dark:bg-slate-800 flex items-center justify-between px-8 py-4 sticky top-0 z-20">
      {/* Search Bar */}
      <div className="relative w-full max-w-md hidden md:block text-gray-400 bg-white dark:bg-slate-700 rounded-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="bg-transparent border-none text-gray-800 dark:text-slate-100 text-sm rounded-xl block w-full pl-10 p-3 h-12 outline-none"
          placeholder="Search here"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-3 rounded-xl bg-gray-200/60 dark:bg-slate-700 text-gray-500 dark:text-slate-300 hover:bg-gray-300/60 transition-colors"
          >
            {mode === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <button className="relative p-3 rounded-xl bg-[#2D9CDB]/10 text-[#2D9CDB] hover:bg-[#2D9CDB]/20 transition-colors">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-[#2D9CDB] border-2 border-[#f3f4f6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center">
              11
            </span>
          </button>

          <button className="relative p-3 rounded-xl bg-[#2D9CDB]/10 text-[#2D9CDB] hover:bg-[#2D9CDB]/20 transition-colors">
            <FiMessageSquare size={20} />
            <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-[#2D9CDB] border-2 border-[#f3f4f6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          <button className="p-3 rounded-xl bg-gray-200/60 dark:bg-slate-700 text-gray-500 dark:text-slate-300 hover:bg-gray-300/60 transition-colors">
            <FiGift size={20} />
          </button>

          <button className="relative p-3 rounded-xl bg-[#FF5B5B]/10 text-[#FF5B5B] hover:bg-[#FF5B5B]/20 transition-colors">
            <FiSettings size={20} />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-[#FF5B5B] border-[1.5px] border-[#f3f4f6] rounded-full"></span>
          </button>
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-slate-600"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-500 dark:text-slate-400">Hello, <span className="font-semibold text-gray-800 dark:text-slate-100">Samantha</span></p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

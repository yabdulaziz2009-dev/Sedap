import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleTheme } from '../store/slices/theme';
import { clearSession, getSession } from '../auth';
import { FiSearch, FiBell, FiMessageSquare, FiGift, FiSettings, FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  const session = getSession();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

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

        {/* User Profile + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Hello, <span className="font-semibold text-gray-800 dark:text-slate-100">{session?.fullName || 'User'}</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
              <img
                src={session?.img || 'https://via.placeholder.com/150'}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">
                  {session?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500 truncate mt-0.5">
                  {session?.email || ''}
                </p>
              </div>

              {/* Profile */}
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <FiUser size={15} className="text-gray-400 dark:text-slate-500" />
                Profile
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-2xl"
              >
                <FiLogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

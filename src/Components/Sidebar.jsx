import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiList, FiFileText, FiUser, FiPieChart, 
  FiEdit, FiGift, FiInfo, FiUserCheck, FiCalendar, 
  FiMessageSquare, FiCreditCard
} from 'react-icons/fi';
import { LuChefHat } from 'react-icons/lu';

const menuItems = [
  { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { name: 'Order List', icon: FiList, path: '/order-list' },
  { name: 'Order Detail', icon: FiFileText, path: '/order-detail' },
  { name: 'Customer', icon: FiUser, path: '/customers' },
  { name: 'Analytics', icon: FiPieChart, path: '/analytics' },
  { name: 'Reviews', icon: FiEdit, path: '/reviews' },
  { name: 'Foods', icon: FiGift, path: '/foods' },
  { name: 'Food Detail', icon: FiInfo, path: '/food-detail' },
  { name: 'Customer Detail', icon: FiUserCheck, path: '/customer-detail' },
  { name: 'Calendar', icon: '/calendar' }, // will use calendar from pages if needed, but let's map path
  { name: 'Chat', icon: FiMessageSquare, path: '/chat' },
  { name: 'Wallet', icon: FiCreditCard, path: '/wallet' },
];

// Re-adjust Calendar icon
const menuItemsWithIcons = menuItems.map(item => {
  if (item.name === 'Calendar') {
    return { ...item, icon: FiCalendar, path: '/calendar' };
  }
  return item;
});

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen overflow-y-auto hidden md:flex sticky top-0 custom-scrollbar">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Sedap<span className="text-[#00B074]">.</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Modern Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-1">
        {menuItemsWithIcons.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#00B074]/10 text-[#00B074] font-semibold'
                  : 'text-gray-500 hover:bg-gray-50'
              }`
            }
          >
             {({ isActive }) => (
               <>
                 <item.icon className={`text-xl ${isActive ? 'text-[#00B074]' : 'text-gray-400'}`} />
                 <span className="text-sm">{item.name}</span>
               </>
             )}
          </NavLink>
        ))}
      </nav>

      {/* Promo Card */}
      <div className="p-4 mb-4">
        <div className="bg-[#00B074] rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-[#00B074]/30">
          <div className="relative z-10 w-2/3">
            <p className="text-xs font-medium leading-tight mb-3">
              Please, organize your menus through button below!
            </p>
            <button className="bg-white text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm w-max hover:bg-gray-50 transition-colors">
              +Add Menus
            </button>
          </div>
          {/* Decorative Chef icon / circle */}
          <div className="absolute -bottom-2 -right-2 text-white/20 w-20 h-20 rounded-full border-4 border-white/10 flex items-center justify-center">
            <LuChefHat size={40} className="text-white/60 ml-2 mb-2" />
          </div>
        </div>
        
        {/* Footer text */}
        <div className="mt-6 text-[10px] text-gray-400">
          <p className="font-semibold text-gray-600">Sedap Restaurant Admin Dashboard</p>
          <p>© 2020 All Rights Reserved</p>
          <p className="flex items-center gap-1 mt-1">
            Made with <span className="text-red-500 text-xs">♥</span> by Peterdraw
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

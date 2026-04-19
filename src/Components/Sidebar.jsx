import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  HiChartBar,
  HiHome,
  HiOutlineUsers,
  HiShoppingCart,
  HiReceiptPercent,
  HiShoppingBag,
  HiStar,
  HiCalendar,
  HiChatBubbleLeftRight,
  HiWallet,
} from 'react-icons/hi2'

const navItems = [
  { label: 'Dashboard', icon: HiHome, path: '/' },
  { label: 'Order List', icon: HiShoppingBag, path: '/orders' },
  { label: 'Order Detail', icon: HiReceiptPercent, path: '/orders/detail' },
  { label: 'Customer', icon: HiOutlineUsers, path: '/customers' },
  { label: 'Analytics', icon: HiChartBar, path: '/analytics' },
  { label: 'Reviews', icon: HiStar, path: '/reviews' },
  { label: 'Foods', icon: HiShoppingCart, path: '/foods' },
  { label: 'Calendar', icon: HiCalendar, path: '/calendar' },
  { label: 'Chat', icon: HiChatBubbleLeftRight, path: '/chat' },
  { label: 'Wallet', icon: HiWallet, path: '/wallet' },
]

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col min-h-screen bg-slate-950 text-slate-100 p-6 gap-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Sedap.</h2>
        <p className="text-sm text-slate-400">Modern Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm transition ${
                  isActive
                    ? 'bg-slate-200 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="rounded-3xl bg-slate-800 p-4 text-sm text-slate-300">
        <p className="font-semibold text-slate-100">Add Orders</p>
        <p className="mt-2 text-xs text-slate-400">Organize your menu through dashboard buttons.</p>
        <button className="mt-4 w-full rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-400">
          + Add Menu
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

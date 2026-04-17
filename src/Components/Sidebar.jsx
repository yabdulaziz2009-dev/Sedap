import React from 'react'
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
  { label: 'Dashboard', icon: HiHome, active: false },
  { label: 'Order List', icon: HiShoppingBag, active: false },
  { label: 'Order Detail', icon: HiReceiptPercent, active: false },
  { label: 'Customer', icon: HiOutlineUsers, active: false },
  { label: 'Analytics', icon: HiChartBar, active: true },
  { label: 'Reviews', icon: HiStar, active: false },
  { label: 'Foods', icon: HiShoppingCart, active: false },
  { label: 'Food Detail', icon: HiReceiptPercent, active: false },
  { label: 'Customer Detail', icon: HiOutlineUsers, active: false },
  { label: 'Calendar', icon: HiCalendar, active: false },
  { label: 'Chat', icon: HiChatBubbleLeftRight, active: false },
  { label: 'Wallet', icon: HiWallet, active: false },
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
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm transition ${
                item.active
                  ? 'bg-slate-200 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
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

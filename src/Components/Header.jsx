import React from 'react'
import { Link } from 'react-router-dom'
import { HiMagnifyingGlass, HiBell, HiCog, HiUserCircle } from 'react-icons/hi2'

const Header = () => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-[1380px] mx-auto flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex items-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm shadow-slate-100">
            <HiMagnifyingGlass className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search here"
              className="ml-3 w-72 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <div className="font-semibold">Filter Periode</div>
            <div className="mt-1 text-xs text-slate-500">17 April 2026 - 23 May 2026</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-2xl bg-slate-50 p-3 text-slate-600 shadow-sm shadow-slate-100 hover:bg-slate-100">
            <HiBell className="h-5 w-5" />
          </button>
          <button className="rounded-2xl bg-slate-50 p-3 text-slate-600 shadow-sm shadow-slate-100 hover:bg-slate-100">
            <HiCog className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-2">
            <div className="rounded-full bg-slate-200 p-2 text-slate-700">
              <HiUserCircle className="h-6 w-6" />
            </div>
            <div className="text-sm text-slate-700">
              <div className="font-semibold">Hello, Samanth</div>
              <div className="text-xs text-slate-500">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

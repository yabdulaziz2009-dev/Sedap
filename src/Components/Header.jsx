import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../store/slices/theme'
import { HiMagnifyingGlass, HiBell, HiCog, HiUserCircle, HiSun, HiMoon } from 'react-icons/hi2'

const Header = () => {
  const dispatch = useDispatch()
  const { mode } = useSelector((state) => state.theme)

  return (
    <header className="bg-white border-b shadow-sm dark:bg-slate-800 dark:border-slate-700">
      <div className="max-w-[1380px] mx-auto flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex items-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm shadow-slate-100 dark:border-slate-600 dark:bg-slate-700">
            <HiMagnifyingGlass className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search here"
              className="ml-3 w-72 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
            <div className="font-semibold">Filter Periode</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">17 April 2026 - 23 May 2026</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="rounded-2xl bg-slate-50 p-3 text-slate-600 shadow-sm shadow-slate-100 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            {mode === 'dark' ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
          </button>
          <button className="rounded-2xl bg-slate-50 p-3 text-slate-600 shadow-sm shadow-slate-100 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
            <HiBell className="h-5 w-5" />
          </button>
          <button className="rounded-2xl bg-slate-50 p-3 text-slate-600 shadow-sm shadow-slate-100 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
            <HiCog className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-700">
            <div className="rounded-full bg-slate-200 p-2 text-slate-700 dark:bg-slate-600 dark:text-slate-300">
              <HiUserCircle className="h-6 w-6" />
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-200">
              <div className="font-semibold">Hello, Samanth</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

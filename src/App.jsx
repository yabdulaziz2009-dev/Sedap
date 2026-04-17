import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Components/Header'
import Sidebar from './Components/Sidebar'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="lg:grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="min-h-screen">
          <Header />
          <main className="p-6 xl:px-12 xl:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default App

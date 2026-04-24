import React from 'react'
import { HiShoppingBag } from 'react-icons/hi2'

const Orders = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-slate-400">
      <HiShoppingBag className="h-16 w-16 opacity-30" />
      <h2 className="text-2xl font-semibold">Order List</h2>
      <p className="text-sm">Bu sahifa hali ishlab chiqilmoqda.</p>
    </div>
  )
}

export default Orders

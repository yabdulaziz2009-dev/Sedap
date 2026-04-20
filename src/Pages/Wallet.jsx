import React from 'react'
import { HiWallet } from 'react-icons/hi2'

const Wallet = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-slate-400">
      <HiWallet className="h-16 w-16 opacity-30" />
      <h2 className="text-2xl font-semibold">Wallet</h2>
      <p className="text-sm">Bu sahifa hali ishlab chiqilmoqda.</p>
    </div>
  )
}

export default Wallet

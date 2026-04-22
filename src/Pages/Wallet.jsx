import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  AreaChart, Area, XAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

// ── Mock Data ──────────────────────────────────────────────────────────────────
const areaData = [
  { day: 'Sun', income: 3200, expense: 4100 },
  { day: 'Mon', income: 4800, expense: 2800 },
  { day: 'Tue', income: 3600, expense: 5200 },
  { day: 'Wed', income: 6100, expense: 3100 },
  { day: 'Thu', income: 4700, expense: 3800 },
  { day: 'Fri', income: 5900, expense: 2700 },
  { day: 'Sat', income: 5200, expense: 4200 },
]

const pieData = [
  { name: 'Income',  value: 30, color: '#10b981' },
  { name: 'Expense', value: 46, color: '#f87171' },
  { name: 'Unknown', value: 24, color: '#e2e8f0' },
]

const payments = [
  { id: 1, name: 'Peterdraw',       sub: 'Online Shop', date: 'June 5, 2020, 08:22 AM',  amount: '+$6,553', card: 'MasterCard 404', status: 'Pending',   sc: 'amber',   avatar: 'P', aBg: '#fef3c7', aColor: '#92400e' },
  { id: 2, name: 'Olivia Brownlee', sub: '',             date: 'June 4, 2020, 08:22 AM',  amount: '+$6,553', card: 'MasterCard 404', status: 'Completed', sc: 'emerald', avatar: 'O', aBg: '#d1fae5', aColor: '#065f46' },
  { id: 3, name: 'Angela Moss',     sub: '',             date: 'June 3, 2020, 08:22 AM',  amount: '+$6,553', card: 'MasterCard 404', status: 'Cancelled', sc: 'red',     avatar: 'A', aBg: '#fee2e2', aColor: '#991b1b' },
  { id: 4, name: 'XYZ Store ID',    sub: 'Online Shop', date: 'June 1, 2020, 08:22 AM',  amount: '+$6,553', card: 'MasterCard 404', status: 'Completed', sc: 'emerald', avatar: 'X', aBg: '#d1fae5', aColor: '#065f46' },
  { id: 5, name: 'Peter Parkur',    sub: '',             date: 'June 10, 2020, 08:22 AM', amount: '+$6,553', card: 'MasterCard 404', status: 'Pending',   sc: 'amber',   avatar: 'P', aBg: '#fef3c7', aColor: '#92400e' },
]

const invoices = [
  { name: 'Stevan Store', time: '1h ago', amount: '$562', avatar: 'S', aBg: '#e0e7ff', aColor: '#3730a3' },
  { name: 'David Ignis',  time: '1h ago', amount: '$672', avatar: 'D', aBg: '#fce7f3', aColor: '#9d174d' },
  { name: 'Olivia Johan', time: '1h ago', amount: '$769', avatar: 'O', aBg: '#d1fae5', aColor: '#065f46' },
  { name: 'Melanie Wong', time: '1h ago', amount: '$45',  avatar: 'M', aBg: '#fef3c7', aColor: '#92400e' },
  { name: 'Roberto',      time: '4h ago', amount: '$776', avatar: 'R', aBg: '#fee2e2', aColor: '#991b1b' },
]

const badge = {
  amber:   { light: 'bg-amber-100 text-amber-600',    dark: 'bg-amber-900/40 text-amber-400' },
  emerald: { light: 'bg-emerald-100 text-emerald-600', dark: 'bg-emerald-900/40 text-emerald-400' },
  red:     { light: 'bg-red-100 text-red-500',         dark: 'bg-red-900/40 text-red-400' },
}

const dotColor = { Completed: '#10b981', Pending: '#f59e0b', Cancelled: '#f87171' }
const dotIcon  = { Completed: '✓', Pending: '!', Cancelled: '✕' }

export default function FinanceDashboard() {
  const dark = useSelector((state) => state.theme.mode === 'dark')
  const [tab,      setTab]      = useState('Today')
  const [expanded, setExpanded] = useState(2)

  const pg   = dark ? 'bg-slate-900'  : 'bg-[#f4f6fb]'
  const cd   = dark ? 'bg-slate-800 border border-slate-700/50' : 'bg-white'
  const h    = dark ? 'text-slate-100' : 'text-slate-800'
  const b    = dark ? 'text-slate-300' : 'text-slate-600'
  const m    = dark ? 'text-slate-500' : 'text-slate-400'
  const div  = dark ? 'border-slate-700' : 'border-slate-100'
  const tip  = { borderRadius: 8, fontSize: 11, backgroundColor: dark ? '#1e293b' : '#fff', borderColor: dark ? '#334155' : '#e2e8f0', color: dark ? '#e2e8f0' : '#334155' }

  return (
    <div className={`${pg} min-h-screen p-6 transition-colors duration-300`}
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div className="max-w-[1160px] mx-auto grid grid-cols-3 gap-5">

        {/* ══ LEFT 2 cols ══ */}
        <div className="col-span-2 flex flex-col gap-5">

          {/* Main Balance */}
          <div className={`${cd} rounded-2xl p-6 shadow-sm`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-widest ${m}`}>Main Balance</p>
                <h2 className={`text-[2.1rem] font-bold leading-tight mt-0.5 ${h}`}>$673,412.66</h2>
              </div>
              <div className="flex items-center gap-8 pt-1">
                <div>
                  <p className={`text-[10px] font-semibold uppercase tracking-widest ${m}`}>Valid Thru</p>
                  <p className={`text-sm font-semibold mt-0.5 ${h}`}>08/21</p>
                </div>
                <div>
                  <p className={`text-[10px] font-semibold uppercase tracking-widest ${m}`}>Card Holder</p>
                  <p className={`text-sm font-semibold mt-0.5 ${h}`}>Samantha Anderson</p>
                </div>
                <div>
                  <p className={`text-[10px] invisible ${m}`}>–</p>
                  <p className={`text-sm font-mono mt-0.5 ${b}`}>**** **** **** 1234</p>
                </div>
                <button className={`${m} text-xl`}>⋮</button>
              </div>
            </div>

            {/* Progress bar */}
            <div className={`h-1.5 rounded-full w-full mb-5 ${dark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: '68%' }} />
            </div>

            {/* Earning + Area */}
            <div className="flex gap-5 items-center">
              <div className="flex items-center gap-4 flex-shrink-0">
                <div>
                  <p className={`text-xs font-bold mb-3 ${h}`}>Earning Category</p>
                  {pieData.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: i === 2 ? (dark ? '#475569' : '#cbd5e1') : d.color }} />
                      <span className={`text-xs ${b}`}>{d.name}</span>
                      <span className={`text-xs font-bold ml-2 ${h}`}>{d.value}%</span>
                    </div>
                  ))}
                </div>
                <PieChart width={88} height={88}>
                  <Pie data={pieData} cx={40} cy={40} innerRadius={24} outerRadius={42}
                    dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={i === 2 ? (dark ? '#475569' : '#e2e8f0') : d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={110}>
                  <AreaChart data={areaData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.18}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f87171" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: dark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={tip}/>
                    <Area type="monotone" dataKey="income"  stroke="#10b981" fill="url(#gI)" strokeWidth={2} dot={false}/>
                    <Area type="monotone" dataKey="expense" stroke="#f87171" fill="url(#gE)" strokeWidth={2} dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className={`${cd} rounded-2xl shadow-sm overflow-hidden`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${div}`}>
              <div>
                <h3 className={`text-[15px] font-bold ${h}`}>Payment History</h3>
                <p className={`text-[11px] mt-0.5 ${m}`}>Lorem ipsum dolor sit amet, consectetur</p>
              </div>
              <div className="flex items-center">
                {['Monthly', 'Weekly', 'Today'].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`text-xs px-3 py-1 font-medium transition-colors
                      ${tab === t ? 'text-emerald-500 font-bold border-b-2 border-emerald-500' : `${m} hover:opacity-80`}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {payments.map(p => {
              const isExp = expanded === p.id
              return (
                <div key={p.id}>
                  <div
                    onClick={() => setExpanded(isExp ? null : p.id)}
                    className={`flex items-center gap-4 px-6 py-3.5 cursor-pointer transition-colors border-b ${div}`}
                    style={isExp ? { backgroundColor: dark ? '#334155' : '#475569' } : {}}>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: p.aBg, color: p.aColor }}>{p.avatar}</div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px] text-white"
                        style={{ backgroundColor: dotColor[p.status], borderColor: isExp ? (dark ? '#334155' : '#475569') : (dark ? '#1e293b' : '#fff') }}>
                        {dotIcon[p.status]}
                      </span>
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isExp ? 'text-white' : h}`}>{p.name}</p>
                      {p.sub && <p className={`text-[11px] ${isExp ? 'text-slate-300' : m}`}>{p.sub}</p>}
                    </div>

                    <p className={`text-[11px] flex-shrink-0 w-40 ${isExp ? 'text-slate-300' : m}`}>{p.date}</p>
                    <p className={`text-sm font-bold flex-shrink-0 w-16 text-right ${isExp ? 'text-white' : h}`}>{p.amount}</p>
                    <p className={`text-[11px] flex-shrink-0 w-28 text-right ${isExp ? 'text-slate-300' : m}`}>{p.card}</p>

                    <div className="flex-shrink-0 w-24 text-right">
                      {isExp
                        ? <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500 text-white">Completed</span>
                        : <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badge[p.sc][dark ? 'dark' : 'light']}`}>{p.status}</span>
                      }
                    </div>
                    <span className={`text-base flex-shrink-0 ${isExp ? 'text-white' : m}`}>{isExp ? '▲' : '›'}</span>
                  </div>

                  {isExp && (
                    <div className="px-6 py-4 border-b border-slate-600"
                      style={{ backgroundColor: dark ? '#253347' : '#3d4f63' }}>
                      <div className="grid grid-cols-5 gap-4">
                        {[
                          { label: 'ID Payment',     val: '#00123521' },
                          { label: 'Payment Method', val: 'MasterCard 404' },
                          { label: 'Invoice Date',   val: 'April 29, 2020' },
                          { label: 'Due Date',       val: 'June 5, 2020' },
                          { label: 'Date Paid',      val: 'June 4, 2020' },
                        ].map((item, i) => (
                          <div key={i}>
                            <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wide">{item.label}</p>
                            <p className="text-sm text-white font-semibold">{item.val}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-slate-400 text-[11px] mt-3">Lorem ipsum dolor sit amet, consectetur</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ══ RIGHT 1 col ══ */}
        <div className="flex flex-col gap-5">

          {/* Wallet Card */}
          <div className="rounded-2xl p-6 shadow-xl relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #2c3e6b 0%, #1a2444 60%, #111827 100%)' }}>
            <div className="absolute top-5 right-5 flex">
              <div className="w-9 h-9 rounded-full bg-slate-500 opacity-70" />
              <div className="w-9 h-9 rounded-full bg-slate-400 opacity-50 -ml-4" />
            </div>
            <p className="text-[2rem] font-bold text-white mt-2">$824,571.93</p>
            <p className="text-slate-400 text-xs mt-1">Wallet Balance</p>
            <p className="text-emerald-400 text-xs mt-2 font-semibold">+0.9% than last week</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { label: 'Top Up',   icon: '⬆', iColor: '#fca5a5', bg: 'rgba(239,68,68,0.12)',    border: 'rgba(239,68,68,0.2)' },
                { label: 'Withdraw', icon: '↺',  iColor: '#6ee7b7', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)' },
              ].map((a, i) => (
                <button key={i}
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: a.bg, border: `1px solid ${a.border}` }}>
                  <span className="text-2xl leading-none" style={{ color: a.iColor }}>{a.icon}</span>
                  <span className="text-white text-xs font-semibold">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Invoices Sent */}
          <div className={`${cd} rounded-2xl p-5 shadow-sm flex-1`}>
            <h3 className={`text-[15px] font-bold ${h}`}>Invoices Sent</h3>
            <p className={`text-[11px] mt-0.5 mb-4 ${m}`}>Lorem ipsum dolor sit amet, consectetur</p>
            <div>
              {invoices.map((inv, i) => (
                <div key={i} className={`flex items-center gap-3 py-3 border-b last:border-0 ${div}`}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: inv.aBg, color: inv.aColor }}>{inv.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${h}`}>{inv.name}</p>
                    <p className={`text-[11px] ${m}`}>{inv.time}</p>
                  </div>
                  <p className={`text-sm font-bold flex-shrink-0 ${h}`}>{inv.amount}</p>
                </div>
              ))}
            </div>
            <button className={`w-full mt-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all
              hover:bg-emerald-500 hover:text-white hover:border-emerald-500
              ${dark ? 'border-slate-600 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
              View More
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
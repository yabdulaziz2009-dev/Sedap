import { useState, useEffect, useRef } from "react";
import { Bar } from "recharts";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────

const FOOD_DATA = {
  monthly: [
    { emoji: "🍝", name: "Medium Spicy Spaghetti Italiano", tag: "SPAGHETTI", meta: "Serves 4 Persons · 24 mins", price: "$12.56" },
    { emoji: "🍕", name: "Crispy Thin Crust Margherita", tag: "PIZZA", meta: "Serves 2 Persons · 18 mins", price: "$14.20" },
    { emoji: "🍔", name: "Classic Double Smash Burger", tag: "BURGER", meta: "Serves 1 Person · 12 mins", price: "$10.99" },
    { emoji: "🥗", name: "Garden Fresh Caesar Salad", tag: "SALAD", meta: "Serves 2 Persons · 10 mins", price: "$8.75" },
    { emoji: "🍜", name: "Spicy Tom Yum Noodle Soup", tag: "NOODLES", meta: "Serves 2 Persons · 20 mins", price: "$11.30" },
  ],
  weekly: [
    { emoji: "🍔", name: "Classic Double Smash Burger", tag: "BURGER", meta: "Serves 1 Person · 12 mins", price: "$10.99" },
    { emoji: "🍝", name: "Medium Spicy Spaghetti Italiano", tag: "SPAGHETTI", meta: "Serves 4 Persons · 24 mins", price: "$12.56" },
    { emoji: "🥤", name: "Fresh Mango Sprite Smoothie", tag: "DRINK", meta: "1 Cup · 5 mins", price: "$5.50" },
  ],
  daily: [
    { emoji: "☕", name: "Morning Espresso Double Shot", tag: "DRINK", meta: "1 Cup · 3 mins", price: "$4.20" },
    { emoji: "🥐", name: "Butter Croissant with Jam", tag: "PASTRY", meta: "Serves 1 · 8 mins", price: "$3.90" },
  ],
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CHART_DATA = {
  monthly: DAYS.map((day, i) => ({
    day,
    Spaghetti: [420, 310, 490, 370, 280, 360, 200][i],
    Pizza:     [220, 180, 260, 170, 140, 190, 120][i],
    Burger:    [150, 200, 180, 280, 390, 260, 763][i],
    Sprite:    [310, 420, 340, 610, 310, 440, 280][i],
  })),
  weekly: DAYS.map((day, i) => ({
    day,
    Spaghetti: [80,  60,  90,  70,  50,  65,  40][i],
    Pizza:     [45,  35,  55,  30,  25,  40,  20][i],
    Burger:    [30,  40,  35,  60,  80,  50, 150][i],
    Sprite:    [60,  80,  65, 120,  60,  85,  55][i],
  })),
  daily: DAYS.map((day, i) => ({
    day,
    Spaghetti: [12,  8, 14, 10,  7,  9,  5][i],
    Pizza:     [ 6,  5,  8,  4,  3,  5,  2][i],
    Burger:    [ 4,  6,  5,  8, 11,  7, 22][i],
    Sprite:    [ 9, 12, 10, 18,  9, 12,  8][i],
  })),
};

const LEGEND = {
  monthly: [
    { key: "Spaghetti", pct: 22, count: 69,  color: "#3b82f6" },
    { key: "Pizza",     pct: 11, count: 321, color: "#ef4444" },
    { key: "Burger",    pct: 27, count: 763, color: "#16a34a" },
    { key: "Sprite",    pct: 15, count: 154, color: "#eab308" },
  ],
  weekly: [
    { key: "Spaghetti", pct:  8, count: 18,  color: "#3b82f6" },
    { key: "Pizza",     pct: 14, count: 82,  color: "#ef4444" },
    { key: "Burger",    pct: 32, count: 195, color: "#16a34a" },
    { key: "Sprite",    pct: 11, count: 38,  color: "#eab308" },
  ],
  daily: [
    { key: "Spaghetti", pct:  5, count: 3,   color: "#3b82f6" },
    { key: "Pizza",     pct:  9, count: 12,  color: "#ef4444" },
    { key: "Burger",    pct: 18, count: 28,  color: "#16a34a" },
    { key: "Sprite",    pct:  7, count: 5,   color: "#eab308" },
  ],
};

const STATS = [
  { label: "Total Orders", value: "1,284", change: "+12.5%", up: true },
  { label: "Total Spent",  value: "$3,842", change: "+8.3%",  up: true },
  { label: "Avg Order",    value: "$24.6",  change: "-2.1%",  up: false },
  { label: "Member Since", value: "2020",   change: "4 years", up: null },
];

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

function Tabs({ active, onChange, options }) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt.toLowerCase())}
          className={`px-3 py-1 rounded-full text-xs border transition-all font-medium ${
            active === opt.toLowerCase()
              ? "bg-green-600 text-white border-green-600"
              : "bg-transparent text-gray-400 border-gray-200 hover:border-green-400 hover:text-green-600"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.fill }} />
          <span className="text-gray-300">{p.name}:</span>
          <span className="font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function CustomerDashboard() {
  const [orderPeriod, setOrderPeriod] = useState("monthly");
  const [chartPeriod, setChartPeriod] = useState("monthly");

  return (
    <div className="min-h-screen bg-gray-100 p-5 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); body{font-family:'Plus Jakarta Sans',sans-serif;}`}</style>

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Customer Detail</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here your customer detail profile</p>
      </div>

      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow">
            EY
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-gray-900">Eren Yeager</span>
              <span className="bg-green-50 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">UX Designer</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">St. Kings Road 57th, Garden Hills, Chelsea – London</p>
            <div className="mt-3 space-y-1.5">
              {[
                { icon: "✉️", text: "eren.yeager@mail.co.id" },
                { icon: "📞", text: "+012 345 6789" },
                { icon: "🏢", text: "Highspeed Studios" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-600 transition-all text-sm">ℹ</button>
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-600 transition-all text-sm">✎</button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-900 mb-3">Activity Overview</p>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(({ label, value, change, up }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
                <p className={`text-xs mt-0.5 font-medium ${up === true ? "text-green-600" : up === false ? "text-red-500" : "text-gray-400"}`}>
                  {up === true ? "↑" : up === false ? "↓" : ""} {change}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs opacity-70">Your Balance</p>
              <span className="text-white/50 text-lg leading-none cursor-pointer">•••</span>
            </div>
            <p className="text-4xl font-bold tracking-tight">$ 9,425</p>
            <p className="text-xs opacity-60 mt-3 tracking-widest">2451 **** **** ****</p>
            <p className="text-xs opacity-50 mt-0.5">Exp: 02/21</p>
            <div className="flex justify-between items-end mt-5">
              <div>
                <p className="text-xs opacity-60">Name</p>
                <p className="font-semibold text-sm">Eren Yeager</p>
              </div>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm">Mastercard</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Most Ordered Food */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-gray-900">Most Ordered Food</p>
            <Tabs active={orderPeriod} onChange={setOrderPeriod} options={["Monthly", "Weekly", "Daily"]} />
          </div>
          <p className="text-xs text-gray-400 mb-4">Lorem ipsum dolor sit amet, consectetur</p>
          <div className="space-y-2">
            {FOOD_DATA[orderPeriod].map((food, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {food.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{food.name}</p>
                  <p className="text-xs text-green-600 font-bold">{food.tag}</p>
                  <p className="text-xs text-gray-400">{food.meta}</p>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">{food.price}</p>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors">⋯</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Liked Food Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-gray-900">Most Liked Food</p>
            <Tabs active={chartPeriod} onChange={setChartPeriod} options={["Monthly", "Weekly", "Daily"]} />
          </div>
          <p className="text-xs text-gray-400 mb-3">Lorem ipsum dolor sit amet, consectetur</p>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA[chartPeriod]} barCategoryGap="25%" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar dataKey="Spaghetti" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pizza"     fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Burger"    fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sprite"    fill="#eab308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {LEGEND[chartPeriod].map(({ key, pct, count, color }) => (
              <div key={key} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs text-gray-500">{key} ({pct}%)</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
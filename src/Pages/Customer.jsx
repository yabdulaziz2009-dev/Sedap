import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const datasets = {
  monthly: [
    { label: "Spaghetti", data: [420, 310, 490, 370, 280, 360, 200], backgroundColor: "#62b8e8", borderRadius: 5, borderSkipped: false },
    { label: "Pizza",     data: [220, 180, 260, 170, 140, 190, 120], backgroundColor: "#e87272", borderRadius: 5, borderSkipped: false },
    { label: "Burger",    data: [150, 200, 180, 280, 390, 260, 763], backgroundColor: "#4caf82", borderRadius: 5, borderSkipped: false },
    { label: "Sprite",    data: [310, 420, 340, 610, 310, 440, 280], backgroundColor: "#f5c542", borderRadius: 5, borderSkipped: false },
  ],
  weekly: [
    { label: "Spaghetti", data: [120, 90, 150, 80,  60,  110, 50],  backgroundColor: "#62b8e8", borderRadius: 5, borderSkipped: false },
    { label: "Pizza",     data: [60,  50, 70,  40,  35,  55,  30],  backgroundColor: "#e87272", borderRadius: 5, borderSkipped: false },
    { label: "Burger",    data: [40,  55, 45,  80,  100, 70,  200], backgroundColor: "#4caf82", borderRadius: 5, borderSkipped: false },
    { label: "Sprite",    data: [80,  110,90,  160, 85,  120, 70],  backgroundColor: "#f5c542", borderRadius: 5, borderSkipped: false },
  ],
  daily: [
    { label: "Spaghetti", data: [18, 12, 22, 10, 8,  14, 6],  backgroundColor: "#62b8e8", borderRadius: 5, borderSkipped: false },
    { label: "Pizza",     data: [8,  7,  10, 5,    { label: "Sprite",    data: [11, 16, 13, 22, 12, 17, 9],  backgroundColor: "#f5c542", borderRadius: 5, borderSkipped: false },
  4,  8,  3],  backgroundColor: "#e87272", borderRadius: 5, borderSkipped: false },
    { label: "Burger",    data: [5,  8,  6,  12, 14, 10, 28], backgroundColor: "#4caf82", borderRadius: 5, borderSkipped: false },
  ],
};

const foodItems = [
  { emoji: "🍝", bg: "#fef3c7" },
  { emoji: "🍜", bg: "#f3f4f6" },
  { emoji: "🫕", bg: "#fef9c3" },
  { emoji: "🍛", bg: "#fce7f3" },
  { emoji: "🥗", bg: "#dcfce7" },
];

const legendItems = [
  { color: "#62b8e8", label: "Spaghetti (22%)", count: 69  },
  { color: "#4caf82", label: "Burger (27%)",    count: 763 },
  { color: "#e87272", label: "Pizza (11%)",     count: 321 },
  { color: "#f5c542", label: "Sprite (15%)",    count: 154 },
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 }, color: "#9ca3af", maxRotation: 0 },
    },
    y: {
      grid: { color: "rgba(0,0,0,0.04)" },
      ticks: { font: { size: 10 }, color: "#9ca3af" },
      beginAtZero: true,
    },
  },
};

function TabGroup({ active, onChange, options }) {
  return (
    <div className="flex gap-1">
      {options.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t.toLowerCase())}
          className={`px-3 py-1 rounded-full text-xs border transition-all ${
            active === t.toLowerCase()
              ? "bg-green-600 text-white border-green-600"
              : "bg-transparent text-gray-500 border-gray-300 hover:border-gray-400"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function CustomerDashboard() {
  const [period, setPeriod] = useState("monthly");
  const [foodTab, setFoodTab] = useState("monthly");

  const chartData = {
    labels: days,
    datasets: datasets[period],
  };

  return (
    
    <div className="bg-gray-100 min-h-screen p-5 font-sans">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg font-medium text-gray-800">Customer detail</h1>
        <p className="text-sm text-gray-500">Here your customer detail profile</p>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Profile card */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-2xl font-medium text-gray-500 shrink-0">
            EY
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-lg font-medium text-gray-800">Eren Yeager</span>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-0.5 rounded-full font-medium">
                UX Designer
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              St. Kings Road 57th, Garden Hills, Chelsea · London
            </p>
            <div className="flex gap-5 flex-wrap">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                eren.yeager@mail.co.id
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.7h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 10.09a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z" />
                </svg>
                +012 345 6789
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e87272" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
                Highspeed Studios
              </span>
            </div>
          </div>
        </div>

        {/* Balance card */}
        <div className="bg-green-600 rounded-2xl p-5 text-white">
          <p className="text-xs opacity-70 mb-1">Your balance</p>
          <p className="text-3xl font-medium mb-3">$ 9,425</p>
          <p className="text-xs opacity-60 tracking-widest mb-3">2451 **** **** ****</p>
          <div className="flex justify-between items-center border-t border-white/20 pt-3">
            <div>
              <p className="text-xs opacity-60">Name</p>
              <p className="text-sm font-medium">Eren Yeager</p>
            </div>
            <p className="text-xs opacity-60">02/21</p>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Most ordered food */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-800">Most ordered food</p>
              <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet</p>
            </div>
            <TabGroup
              active={foodTab}
              onChange={setFoodTab}
              options={["Monthly", "Weekly", "Daily"]}
            />
          </div>
          <div className="divide-y divide-gray-50">
            {foodItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: item.bg }}
                >
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    Meidum spicy spagheti italiano
                  </p>
                  <p className="text-xs text-green-600 font-medium">SPAGETHI</p>
                  <p className="text-xs text-gray-400">Serves for 4 person · 24 mins</p>
                </div>
                <p className="text-sm font-medium text-gray-700 shrink-0">$12.56</p>
              </div>
            ))}
          </div>
        </div>

        {/* Most liked food */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm font-medium text-gray-800">Most liked food</p>
              <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet</p>
            </div>
            <TabGroup
              active={period}
              onChange={setPeriod}
              options={["Monthly", "Weekly", "Daily"]}
            />
          </div>

          <div className="relative h-52">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3"> 
            {legendItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-lg"
              >
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{ background: item.color }}
                  />
                  {item.label}
                </span>
                <span className="text-sm font-medium text-gray-700">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
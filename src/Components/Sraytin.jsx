import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const foodItems = [
  { id: 1, img: "🍝", name: "Medium Spicy Spaghetti Italiano", cat: "SPAGHETTI", price: "$12.56", time: "24 mins", serves: "4 Person" },
  { id: 2, img: "🍜", name: "Medium Spicy Spaghetti Italiano", cat: "SPAGHETTI", price: "$12.56", time: "24 mins", serves: "4 Person" },
  { id: 3, img: "🥘", name: "Medium Spicy Spaghetti Italiano", cat: "SPAGHETTI", price: "$12.56", time: "24 mins", serves: "4 Person" },
  { id: 4, img: "🍲", name: "Medium Spicy Spaghetti Italiano", cat: "SPAGHETTI", price: "$12.56", time: "24 mins", serves: "4 Person" },
  { id: 5, img: "🍔", name: "Medium Spicy Spaghetti Italiano", cat: "SPAGHETTI", price: "$12.56", time: "24 mins", serves: "4 Person" },
];


const chartColors = {
  Spaghetti: "#3B82F6",
  Burger: "#10B981",
  Pizza: "#EF4444",
  Sprite: "#F59E0B",
};

// Har bir tab uchun faqat 3 kunlik ma'lumotlar
const tabData = {
  Monthly: {
    spaghetti: [480, 650, 720],
    burger:    [420, 510, 680],
    pizza:     [350, 380, 410],
    sprite:    [430, 490, 520],
  },
  Weekly: {
    spaghetti: [390, 520, 610],
    burger:    [340, 440, 570],
    pizza:     [280, 330, 350],
    sprite:    [380, 450, 460],
  },
  Daily: {
    spaghetti: [140, 190, 210],
    burger:    [120, 150, 190],
    pizza:     [70, 90, 110],
    sprite:    [120, 140, 150],
  },
};

export default function CustomerDetail() {
  const [activeTab, setActiveTab] = useState("Monthly");

  const chartData = useMemo(() => {
    const current = tabData[activeTab];
    return {
      labels: ["Day 1", "Day 2", "Day 3"],
      datasets: [
        {
          label: "Spaghetti",
          data: current.spaghetti,
          backgroundColor: chartColors.Spaghetti,
          borderRadius: 12,
          barThickness: 14,        // Ingichka qilindi
        },
        {
          label: "Burger",
          data: current.burger,
          backgroundColor: chartColors.Burger,
          borderRadius: 12,
          barThickness: 14,
        },
        {
          label: "Pizza",
          data: current.pizza,
          backgroundColor: chartColors.Pizza,
          borderRadius: 12,
          barThickness: 14,
        },
        {
          label: "Sprite",
          data: current.sprite,
          backgroundColor: chartColors.Sprite,
          borderRadius: 12,
          barThickness: 14,
        },
      ],
    };
  }, [activeTab]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 13 },
          color: "#374151",
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F3F4F6",
        bodyColor: "#D1D5DB",
        padding: 14,
        cornerRadius: 10,
        displayColors: true,
        callbacks: {
          title: (context) => `Day ${context[0].dataIndex + 1}`,
          label: (context) => `${context.dataset.label}: ${context.raw} likes`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 13 }, 
          color: "#6B7280",
          padding: 12 
        },
      },
      y: { display: false },
    },
    animation: {
      duration: 1300,
      easing: "easeOutCubic",
    },
  };

  const legendData = {
    Monthly: { spaghetti: 720, burger: 680, pizza: 410, sprite: 520, total: 2330 },
    Weekly:  { spaghetti: 610, burger: 570, pizza: 370, sprite: 470, total: 2020 },
    Daily:   { spaghetti: 210, burger: 190, pizza: 120, sprite: 160, total: 680 },
  };

  const currentLegend = legendData[activeTab];

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-[1000px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Customer Detail</h1>
          <p className="text-gray-500 mt-1">Here your Customer Detail Profile</p>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex gap-8">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                <img
                  src="https://i.pravatar.cc/300?u=eren"
                  alt="Eren Yeager"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-gray-900">Eren Yeager</h2>
                    <p className="text-emerald-600 font-medium mt-1">UX Designer</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center text-xl">ℹ️</button>
                    <button className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center text-xl">✏️</button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-5">
                  St. Kings Road 57th, Garden Hills, Chelsea - London
                </p>

                <div className="mt-7 grid grid-cols-3 gap-6 text-sm">
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="font-medium text-gray-700">eren.yeager@mail.co.id</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="font-medium text-gray-700">+012 345 6789</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Company</p>
                    <p className="font-medium text-gray-700">Highspeed Studios</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="lg:col-span-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-8 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100 text-sm tracking-wide">Your Balance</p>
                <p className="text-5xl font-bold mt-4">$9,425</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">Mastercard</p>
                <p className="text-2xl mt-2 font-medium">•••• 2451</p>
                <p className="text-sm mt-1 opacity-75">02/21</p>
              </div>
            </div>

            <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs opacity-75">Name</p>
                <p className="font-semibold text-lg">Eren Yeager</p>
              </div>
              <div className="text-4xl opacity-60">💳</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Ordered Food */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-semibold text-2xl">Most Ordered Food</h3>
              <div className="flex bg-gray-100 rounded-2xl p-1">
                {["Monthly", "Weekly", "Daily"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 text-sm font-medium rounded-xl transition-all ${
                      activeTab === tab ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {foodItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-6 p-5 hover:bg-gray-50 rounded-2xl transition-all group border border-transparent hover:border-gray-100"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-5xl shadow-inner transition-transform group-hover:scale-110">
                    {item.img}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-lg text-gray-800">{item.name}</p>
                    <p className="text-emerald-600 font-semibold text-base mt-0.5">{item.cat}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Serves for {item.serves} • {item.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-2xl text-gray-900">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Liked Food - 3 kunlik + ingichka barlar */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-semibold text-2xl">Most Liked Food</h3>
                <p className="text-sm text-gray-400 mt-1">This {activeTab.toLowerCase()} period</p>
              </div>
              <div className="flex bg-gray-100 rounded-2xl p-1">
                {["Monthly", "Weekly", "Daily"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 text-sm font-medium rounded-xl transition-all ${
                      activeTab === tab ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-[420px]">
              <Bar data={chartData} options={options} />
            </div>

            {/* Legend */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <p className="text-lg font-semibold">Total Likes</p>
                <p className="text-3xl font-bold text-emerald-600">{currentLegend.total}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-6 text-base">
                {[
                  { color: "bg-blue-500", label: "Spaghetti (22%)", value: currentLegend.spaghetti },
                  { color: "bg-emerald-500", label: "Burger (27%)", value: currentLegend.burger },
                  { color: "bg-red-500", label: "Pizza (11%)", value: currentLegend.pizza },
                  { color: "bg-orange-500", label: "Sprite (15%)", value: currentLegend.sprite },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded ${item.color}`}></div>
                    <span className="text-gray-700">{item.label}</span>
                    <span className="ml-auto font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
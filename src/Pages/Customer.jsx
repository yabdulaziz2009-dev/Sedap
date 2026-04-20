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

export default function Customer() {
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
          barThickness: 14,
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

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Customer Detail</h1>
          <p className="text-gray-500 mt-1">Here your Customer Detail Profile</p>
        </div>

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
                <h2 className="text-3xl font-semibold text-gray-900">Eren Yeager</h2>
                <p className="text-emerald-600 font-medium mt-1">UX Designer</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-8 shadow-lg">
            <p className="text-5xl font-bold">$9,425</p>
          </div>
        </div>

        <div className="h-[420px] bg-white rounded-3xl p-8">
          <Bar data={chartData} options={options} />
        </div>

      </div>
    </div>
  );
}
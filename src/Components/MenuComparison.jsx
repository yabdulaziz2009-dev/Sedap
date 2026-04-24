import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const DONUT_DATA = [
  { label: "Burger",     percent: 75, color: "#3b82f6", bg: "#bfdbfe" },
  { label: "Pizza",      percent: 32, color: "#f87171", bg: "#fecaca" },
  { label: "Soft Drink", percent: 67, color: "#eab308", bg: "#fef08a" },
];

function DonutChart({ percent, color, bg }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Canvas elementdan 2d context olamiz
    const ctx = canvasRef.current.getContext("2d");

    // Chart.js bilan donut chart yasaymiz
    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            // percent qancha bo'lsa shuncha to'ladi, qolganini bo'sh rang bilan to'ldiradi
            data: [percent, 100 - percent],
            backgroundColor: [color, bg],
            borderWidth: 0,
            hoverOffset: 0,
          },
        ],
      },
      options: {
        cutout: "75%",         // donut teshigining kattaligi
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },   // legend ko'rsatmaymiz
          tooltip: { enabled: false },  // hover tooltip kerak emas
        },
      },
    });

    // Component o'chganda chartni tozalaymiz (memory leak oldini olamiz)
    return () => chartRef.current?.destroy();
  }, []); // faqat birinchi render da ishlaydi

  return (
    <div className="relative w-[180px] h-[180px]">
      <canvas ref={canvasRef} />
      {/* Donut markaziga foiz yozuvini qo'yamiz */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold text-gray-700 dark:text-slate-200">
          {percent}%
        </span>
      </div>
    </div>
  );
}

function MenuComparison() {
  // Chart checkbox holati
  const [showChart, setShowChart] = useState(false);
  // Show Value checkbox holati
  const [showValue, setShowValue] = useState(true);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 dark:bg-slate-800 dark:border-slate-700"
      style={{ width: "900px", height: "500px" }}
    >
      {/* ── Header qismi ── */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-100">
          Menu Comparison
        </h3>

        <div className="flex items-center gap-4">
          {/* Chart checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showChart}
              onChange={(e) => setShowChart(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-xs text-gray-500 dark:text-slate-400">Chart</span>
          </label>

          {/* Show Value checkbox — custom yashil checkbox */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowValue(!showValue)}
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center ${
                showValue ? "bg-green-600" : "border border-gray-300"
              }`}
            >
              {showValue && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400">Show Value</span>
          </div>

          {/* 3 nuqta menyu tugmasi */}
          <button className="text-gray-400 hover:text-gray-600 dark:text-slate-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5"  r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Donut chartlar qismi ── */}
      {/* h-[calc(100%-60px)] — header balandligini ayirib qolgan joyni to'ldiradi */}
      <div className="flex items-center justify-around h-[calc(100%-60px)]">
        {DONUT_DATA.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-4">
            <DonutChart
              percent={item.percent}
              color={item.color}
              bg={item.bg}
            />
            {/* Label faqat showValue true bo'lganda ko'rinadi */}
            {showValue && (
              <span className="text-sm text-gray-500 dark:text-slate-400">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuComparison;
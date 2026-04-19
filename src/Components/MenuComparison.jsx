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
    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [percent, 100 - percent],
          backgroundColor: [color, bg],
          borderWidth: 0,
          hoverOffset: 0,
        }],
      },
      options: {
        cutout: "75%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
    return () => chartRef.current?.destroy();
  }, []);

  return (
    <div className="relative w-[140px] h-[140px]">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold text-gray-700 dark:text-slate-200">
          {percent}%
        </span>
      </div>
    </div>
  );
}

function MenuComparison() {
  const [showValue, setShowValue] = useState(true);
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 dark:bg-slate-800 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-100">
          Menu Comparison
        </h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showChart}
              onChange={(e) => setShowChart(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-xs text-gray-500 dark:text-slate-400">Chart</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setShowValue(!showValue)}
              className={`w-4 h-4 rounded flex items-center justify-center cursor-pointer ${
                showValue ? "bg-green-600" : "border border-gray-300"
              }`}
            >
              {showValue && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400">Show Value</span>
          </label>
          <button className="text-gray-400 hover:text-gray-600 dark:text-slate-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="flex items-center justify-around flex-wrap gap-6">
        {DONUT_DATA.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-3">
            <DonutChart percent={item.percent} color={item.color} bg={item.bg} />
            <span className="text-sm text-gray-500 dark:text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuComparison;
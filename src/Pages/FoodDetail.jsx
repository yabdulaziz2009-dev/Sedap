import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/slices/Food";
import Chart from "chart.js/auto";
import CustomerReviews from "../Components/CustomerReviews";

const ALL_DATA = {
  weekly:  [22000, 35000, 32000, 48000, 83000, 67000, 65000, 60000, 75000],
  monthly: [18000, 28000, 38000, 55000, 72000, 63000, 68000, 58000, 74000],
  daily:   [12000, 20000, 25000, 42000, 65000, 58000, 55000, 52000, 68000],
};
const LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept"];

function RevenueChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [tab, setTab] = useState("weekly");

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 230);
    grad.addColorStop(0, "rgba(56,189,180,0.22)");
    grad.addColorStop(1, "rgba(56,189,180,0.01)");

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: LABELS,
        datasets: [{
          data: ALL_DATA.weekly,
          fill: true,
          backgroundColor: grad,
          borderColor: "#38bdb4",
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: "#38bdb4",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#fff",
            borderColor: "rgba(0,0,0,0.1)",
            borderWidth: 1,
            titleColor: "#111",
            bodyColor: "#6b7280",
            padding: 10,
            titleFont: { size: 13, weight: "500" },
            callbacks: {
              title: (items) => "$" + items[0].raw.toLocaleString(),
              label: (item) => item.label + " 2024",
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: "#9ca3af", font: { size: 11 }, autoSkip: false },
          },
          y: {
            min: 10000,
            max: 100000,
            grid: { color: "rgba(0,0,0,0.05)", drawTicks: false },
            border: { display: false },
            ticks: {
              color: "#9ca3af",
              font: { size: 11 },
              padding: 8,
              stepSize: 10000,
              callback: (v) => v / 1000 + "k",
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data.datasets[0].data = ALL_DATA[tab];
      chartRef.current.update();
    }
  }, [tab]);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 flex-shrink-0 flex flex-col dark:bg-slate-800 dark:border-slate-700"
      style={{ width: "600px", height: "500px" }}
    >
      <p className="text-[15px] font-medium text-gray-900 mb-0.5 dark:text-slate-100">Revenue</p>
      <p className="text-[11px] text-gray-400 mb-3 dark:text-slate-500">Lorem ipsum dolor sit amet, consectetur</p>

      <div className="flex justify-end gap-1 mb-4">
        {["monthly", "weekly", "daily"].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`text-[11px] px-3 py-1 rounded-md capitalize transition-colors ${
              tab === key
                ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/30 dark:text-blue-400"
                : "border border-gray-200 text-gray-500 dark:border-slate-600 dark:text-slate-400"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="relative w-full flex-1 min-h-0">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

function FoodDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { foods, loading } = useSelector((state) => state.food);

  useEffect(() => {
    if (foods.length === 0) {
      dispatch(fetchFoods());
    }
  }, [dispatch, foods.length]);

  const food = foods.find((item) => item.id === id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-slate-700 dark:text-slate-300">
        Loading...
      </div>
    );
  }

  if (!food) {
    return <div className="text-slate-700 dark:text-slate-300">Food topilmadi</div>;
  }

  return (
    <div>
      
    <div className="flex gap-4 items-center justify-center flex-wrap">
      {/* Food Card */}
      <div
        className="bg-white rounded-2xl border border-dashed border-gray-200 p-5 flex-shrink-0 dark:bg-slate-800 dark:border-slate-600"
        style={{ width: "600px", height: "500px" }}
      >
        <p className="text-right text-xs text-gray-400 mb-3 dark:text-slate-500">
          Category: {food.category} /{" "}
          <span className="text-green-700 font-medium dark:text-green-400">{food.subcategory}</span>
        </p>

        <div className="flex gap-4 items-start mb-4">
          <img
            src={food.image}
            alt={food.name}
            className="w-[110px] h-[85px] object-cover rounded-xl flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <span className={`w-2 h-2 rounded-full inline-block ${food.stockAvailable ? "bg-green-700" : "bg-red-500"}`} />
              <span className={`text-xs font-medium ${food.stockAvailable ? "text-green-700 dark:text-green-400" : "text-red-500"}`}>
                {food.stockAvailable ? "Stock Available" : "Out of Stock"}
              </span>
            </div>
            <h2 className="text-sm font-medium text-gray-900 leading-snug mb-1 dark:text-slate-100">
              {food.name}
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-3 dark:text-slate-400">
              {food.description}
            </p>
            <div className="flex gap-2">
              <button className="bg-green-700 hover:bg-green-800 text-white text-xs font-medium px-4 py-2 rounded-lg">
                Add Menu
              </button>
              <button className="text-xs border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                Edit Menu
              </button>
            </div>
          </div>
        </div>

        <hr className="border-dashed border-gray-200 my-3 dark:border-slate-600" />
        <h3 className="text-xs font-medium text-gray-900 mb-1.5 dark:text-slate-200">Ingredients</h3>
        <p className="text-xs text-gray-500 leading-relaxed dark:text-slate-400">
          {food.ingredients.length > 0 ? food.ingredients.join(", ") : "No ingredients"}
        </p>

        <hr className="border-dashed border-gray-200 my-3 dark:border-slate-600" />
        <h3 className="text-xs font-medium text-gray-900 mb-1.5 dark:text-slate-200">Nutrition Info</h3>
        <p className="text-xs text-gray-500 leading-relaxed dark:text-slate-400">
          {food.nutritionInfo}
        </p>
      </div>

      {/* Revenue Chart */}
      <RevenueChart />
    </div>
    <CustomerReviews/>
    </div>
  );
}

export default FoodDetail;
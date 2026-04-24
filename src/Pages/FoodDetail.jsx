// FoodDetail.jsx — to'liq, to'g'ri

import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/slices/Food";
import Chart from "chart.js/auto";
import CustomerReviews from "../Components/CustomerReviews";
import axios from "axios";

// ── Static chart data ──────────────────────────────────────────
const ALL_DATA = {
  weekly:  [22000, 35000, 32000, 48000, 83000, 67000, 65000, 60000, 75000],
  monthly: [18000, 28000, 38000, 55000, 72000, 63000, 68000, 58000, 74000],
  daily:   [12000, 20000, 25000, 42000, 65000, 58000, 55000, 52000, 68000],
};
const LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept"];

// ── Revenue Chart ──────────────────────────────────────────────
function RevenueChart() {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const [tab, setTab] = useState("weekly");

  useEffect(() => {
    const ctx  = canvasRef.current.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, "rgba(56,189,180,0.18)");
    grad.addColorStop(1, "rgba(56,189,180,0.00)");

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
          pointRadius: 4,
          pointHoverRadius: 7,
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
            borderColor: "rgba(0,0,0,0.08)",
            borderWidth: 1,
            titleColor: "#111827",
            bodyColor: "#6b7280",
            padding: 12,
            titleFont: { size: 14, weight: "600" },
            callbacks: {
              title: (items) => "$" + items[0].raw.toLocaleString(),
              label: (item)  => item.label + " 2024",
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
            grid: { color: "rgba(0,0,0,0.04)", drawTicks: false },
            border: { display: false },
            ticks: {
              color: "#9ca3af",
              font: { size: 11 },
              padding: 10,
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
      chartRef.current.update("active");
    }
  }, [tab]);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col flex-1 min-w-0 dark:bg-slate-800 dark:border-slate-700"
      style={{ minHeight: "340px" }}
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Revenue</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">Lorem ipsum dolor sit amet, consectetur</p>
        </div>
        <div className="flex gap-1">
          {["Monthly", "Weekly", "Daily"].map((key) => (
            <button
              key={key}
              onClick={() => setTab(key.toLowerCase())}
              className={`text-[11px] px-3 py-1 rounded-md capitalize transition-colors font-medium ${
                tab === key.toLowerCase()
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "border border-gray-200 text-gray-400 hover:text-gray-600 dark:border-slate-600 dark:text-slate-400"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      <div className="relative flex-1 min-h-0 mt-4" style={{ height: "260px" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

// ── Edit Modal ─────────────────────────────────────────────────
function EditMenuModal({ food, onClose, onSaved }) {
  const [ingredients,  setIngredients]  = useState(food.ingredients?.join(", ") || "");
  const [nutritionInfo, setNutritionInfo] = useState(food.nutritionInfo || "");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // ESC bilan yopish
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = async () => {
    setError("");
    setLoading(true);
    const updatedData = {
      ingredients:  ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      nutritionInfo: nutritionInfo.trim(),
    };
    try {
      await axios.patch(
        `https://sedab-backend.onrender.com/api/foods/${food.id || food._id}`,
        updatedData
      );
    } catch {
      // backend xato bo'lsa ham UI yangilansin
    } finally {
      onSaved(updatedData);
      onClose();
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl dark:bg-slate-800">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Edit Menu</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 dark:text-slate-500">{food.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors dark:border-slate-600 dark:hover:bg-slate-700"
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="12" y2="12"/>
              <line x1="12" y1="2" x2="2" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Ingredients */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1.5 block dark:text-slate-400">
            Ingredients
            <span className="text-gray-300 ml-1 dark:text-slate-600">(vergul bilan ajrat)</span>
          </label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Tomato, Cheese, Basil..."
            className="w-full border text-gray-500 border-gray-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 transition-colors dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          {ingredients.trim() && (
            <div className="flex flex-wrap gap-1 mt-2">
              {ingredients.split(",").map((ing, i) =>
                ing.trim() ? (
                  <span key={i} className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">
                    {ing.trim()}
                  </span>
                ) : null
              )}
            </div>
          )}
        </div>

        {/* Nutrition Info */}
        <div className="mb-5">
          <label className="text-xs text-gray-500 mb-1.5 block dark:text-slate-400">Nutrition Info</label>
          <textarea
            value={nutritionInfo}
            onChange={(e) => setNutritionInfo(e.target.value)}
            placeholder="Calories: 250kcal, Protein: 12g, Fat: 8g..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 resize-none transition-colors dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500 text-gray-500"
          />
        </div>

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 text-xs border border-gray-200 rounded-full px-4 py-2.5 hover:bg-gray-50 text-gray-600 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs font-semibold py-2.5 rounded-full transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Food Info Card ─────────────────────────────────────────────
function FoodInfoCard({ food: initialFood }) {
  const [food,     setFood]     = useState(initialFood);
  const [showEdit, setShowEdit] = useState(false);

  const handleSaved = (updatedData) => {
    setFood((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-5 flex flex-col dark:bg-slate-800 dark:border-slate-600">

        <p className="text-right text-xs text-gray-400 mb-4 dark:text-slate-500">
          Category: {food.category} /{" "}
          <span className="text-green-600 font-semibold dark:text-green-400">{food.subcategory}</span>
        </p>

        <div className="flex gap-4 items-start mb-5">
          <img
            src={food.image}
            alt={food.name}
            className="w-28 h-20 object-cover rounded-xl flex-shrink-0 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${food.stockAvailable ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`text-xs font-semibold ${food.stockAvailable ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                {food.stockAvailable ? "Stock Available" : "Out of Stock"}
              </span>
            </div>
            <h2 className="text-sm font-bold text-gray-900 leading-snug mb-1.5 dark:text-slate-100">
              {food.name}
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-4 dark:text-slate-400 line-clamp-3">
              {food.description}
            </p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Menu
              </button>
              <button
                onClick={() => setShowEdit(true)}
                className="text-xs border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 text-gray-600 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Edit Menu
              </button>
            </div>
          </div>
        </div>

        <hr className="border-dashed border-gray-200 my-3 dark:border-slate-600" />
        <h3 className="text-xs font-bold text-gray-800 mb-2 dark:text-slate-200">Ingredients</h3>
        {food.ingredients?.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {food.ingredients.map((ing, i) => (
              <span key={i} className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">
                {ing}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 dark:text-slate-400">No ingredients listed</p>
        )}

        <hr className="border-dashed border-gray-200 my-3 dark:border-slate-600" />
        <h3 className="text-xs font-bold text-gray-800 mb-2 dark:text-slate-200">Nutrition Info</h3>
        <p className="text-xs text-gray-400 leading-relaxed dark:text-slate-400">
          {food.nutritionInfo || "No nutrition info available"}
        </p>

      </div>

      {showEdit && (
        <EditMenuModal
          food={food}
          onClose={() => setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────
function FoodDetail() {
  const dispatch = useDispatch();
  const { id }   = useParams();
  const { foods, loading } = useSelector((state) => state.food);

  useEffect(() => {
    if (foods.length === 0) dispatch(fetchFoods());
  }, [dispatch, foods.length]);

  const food = foods.find((item) => item.id === id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-sm animate-pulse">
        Loading...
      </div>
    );
  }

  if (!food) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-gray-400 text-sm">Menu item not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] dark:bg-slate-900 px-8 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Foods</h1>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Here is your menus summary with graph view</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <FoodInfoCard food={food} />
        <RevenueChart />
      </div>

      <CustomerReviews />
    </div>
  );
}

export default FoodDetail;
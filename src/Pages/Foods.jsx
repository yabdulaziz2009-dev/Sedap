// ═══════════════════════════════════════════════════════════════════
//  Foods.jsx  —  Restaurant Admin · Food Management Page
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/slices/Food";
import { Link } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";

const BASE = import.meta.env.VITE_API_URL || "https://sedab-backend.onrender.com/api";
const PAGE_LIMIT = 10;
const CATEGORY_ID = "69e0f565573605f218e3736e";
const VIEW_STORAGE_KEY = "sedab-foods-view";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const SEASONS = [
  { label: "Spring", text: "Spring" },
  { label: "Summer", text: "Summer" },
  { label: "Autumn", text: "Autumn" },
  { label: "Winter", text: "Winter" },
];

const CHART_COLORS = [
  "#22c55e","#3b82f6","#f59e0b",
  "#ef4444","#8b5cf6","#ec4899","#06b6d4",
];

const SUBCATEGORIES = ["Food", "Snack", "Drinks", "Sweets"];



// ─── Dark mode hook ───────────────────────────────────────────────
function useDark() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("sedab-theme") === "dark"
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("sedab-theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
}

// ─── SVG Icons ────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  List: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  Grid: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Close: () => (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  ),
  Filter: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Sun: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

// ─── CSS helpers ──────────────────────────────────────────────────
function inputCls(extra = "") {
  return [
    "w-full border text-gray-600 dark:text-slate-200",
    "border-gray-200 dark:border-slate-600 dark:bg-slate-700",
    "rounded-lg px-3 py-2.5 text-xs outline-none",
    "focus:border-green-400 transition",
    "placeholder:text-gray-300 dark:placeholder:text-slate-500",
    extra,
  ].join(" ");
}

const selectCls =
  "w-full border text-gray-600 dark:text-slate-200 border-gray-200 dark:border-slate-600 dark:bg-slate-700 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 transition";

// ─── Small UI helpers ─────────────────────────────────────────────
function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 flex items-center gap-1 block">
        {label}
        {required && <span className="text-red-400">*</span>}
        {hint && <span className="text-gray-300 dark:text-slate-600 ml-1 text-[10px]">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
        value ? "bg-green-500" : "bg-gray-200 dark:bg-slate-600"
      }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
        value ? "left-[22px]" : "left-0.5"
      }`} />
    </button>
  );
}

function ActionBtn({ variant, title, onClick, children }) {
  const colors = {
    green: "bg-green-100 text-green-500 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400",
    amber: "bg-amber-100 text-amber-500 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    red:   "bg-red-100   text-red-400   hover:bg-red-200   dark:bg-red-900/30   dark:text-red-400",
    blue:  "bg-blue-100  text-blue-500  hover:bg-blue-200  dark:bg-blue-900/30  dark:text-blue-400",
  };
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-full transition ${colors[variant] || colors.green}`}
    >
      {children}
    </button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="py-4">
      <div className="w-[240px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex flex-col items-center animate-pulse">
        <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-slate-700 -mt-8" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mt-4" />
        <div className="h-3 w-20 bg-gray-100 dark:bg-slate-700 rounded mt-2" />
        <div className="flex gap-2 mt-4">
          {[0,1,2].map((i) => <div key={i} className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700" />)}
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50 dark:border-slate-700">
      {[0,1,2,3,4,5].map((i) => (
        <td key={i} className="py-3 px-3">
          <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ─── Food image with fallback ─────────────────────────────────────
const FALLBACK_IMAGES = {
  pizza:    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80",
  burger:   "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80",
  drink:    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80",
  snack:    "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=200&q=80",
  dessert:  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&q=80",
  grill:    "https://images.unsplash.com/photo-1544025162-d76538775574?w=200&q=80",
  default:  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80",
};

function getFoodFallback(name = "") {
  const n = name.toLowerCase();
  for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
    if (key !== "default" && n.includes(key)) return url;
  }
  return FALLBACK_IMAGES.default;
}

function FoodImage({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src || getFoodFallback(alt));
  useEffect(() => { setImgSrc(src || getFoodFallback(alt)); }, [src, alt]);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(getFoodFallback(alt))}
    />
  );
}

// ─── Sales Chart ──────────────────────────────────────────────────


// ─── Menu Comparison (real subcategories) ────────────────────────
function MiniDonut({ pct, color, label, count }) {
  const r    = 38;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="14" className="dark:stroke-slate-700" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" />
        <text x="50" y="46" textAnchor="middle" fontSize="13" fontWeight="700" fill={color}>{pct}%</text>
        <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#9ca3af">of menu</text>
      </svg>
      <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">{label}</p>
      <p className="text-[10px] text-gray-400">{count} items</p>
    </div>
  );
}

function MenuComparison({ foods }) {
  // Group by subcategory (real backend field)
  const groups = (foods ?? []).reduce((acc, f) => {
    const key = f.subcategory || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const total   = foods?.length || 0;
  const entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);
  if (!total) return null;

  const categoryColors = {
    Food:   "#22c55e",
    Snack:  "#3b82f6",
    Drinks: "#f59e0b",
    Sweets: "#ec4899",
    Other:  "#8b5cf6",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100">Menu Comparison</h2>
        <span className="text-[11px] text-gray-400">{total} total items</span>
      </div>
      <div className="flex flex-wrap gap-10 justify-center mb-6">
        {entries.slice(0, 4).map(([cat, count], i) => (
          <MiniDonut
            key={cat}
            pct={Math.round((count / total) * 100)}
            color={categoryColors[cat] || CHART_COLORS[i]}
            label={cat}
            count={count}
          />
        ))}
      </div>
      
    </div>
  );
}

// ─── Filter Modal ─────────────────────────────────────────────────
function FilterModal({ onClose, onApply, currentFilters }) {
  const [selectedSubcategories, setSelectedSubcategories] = useState(
    currentFilters.subcategories || []
  );
  const [stockFilter, setStockFilter] = useState(currentFilters.stock || "all");
  const [priceMin, setPriceMin] = useState(currentFilters.priceMin || "");
  const [priceMax, setPriceMax] = useState(currentFilters.priceMax || "");

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function toggleSubcategory(sub) {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  }

  function handleApply() {
    onApply({
      subcategories: selectedSubcategories,
      stock: stockFilter,
      priceMin: priceMin ? Number(priceMin) : "",
      priceMax: priceMax ? Number(priceMax) : "",
    });
    onClose();
  }

  function handleReset() {
    setSelectedSubcategories([]);
    setStockFilter("all");
    setPriceMin("");
    setPriceMax("");
  }

  const subcategoryColors = {
    Food:   "bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400",
    Snack:  "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400",
    Drinks: "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400",
    Sweets: "bg-pink-50 border-pink-300 text-pink-700 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-400",
  };
  const subcategoryDefault = "bg-gray-50 border-gray-200 text-gray-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400";

  const activeCount = [
    selectedSubcategories.length > 0,
    stockFilter !== "all",
    !!priceMin,
    !!priceMax,
  ].filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Filter Items</h3>
            {activeCount > 0 && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            <Icon.Close />
          </button>
        </div>

        {/* Category filter */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Category</p>
          <div className="flex flex-wrap gap-2">
            {SUBCATEGORIES.map((sub) => {
              const isActive = selectedSubcategories.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleSubcategory(sub)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                    isActive
                      ? subcategoryColors[sub] || "bg-green-50 border-green-300 text-green-700"
                      : subcategoryDefault
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock filter */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Stock Status</p>
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "in", label: "In Stock" },
              { value: "out", label: "Out of Stock" },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setStockFilter(value)}
                className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition ${
                  stockFilter === value
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-green-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Price Range ($)</p>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="Min"
              className={inputCls("flex-1")}
            />
            <span className="text-gray-300 dark:text-slate-600 text-xs">—</span>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="Max"
              className={inputCls("flex-1")}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 text-xs border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 rounded-full py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2.5 rounded-full transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────
function StepIndicator({ step, labels }) {
  return (
    <div className="flex items-center justify-between mb-6">
      {labels.map((label, i) => {
        const num    = i + 1;
        const active = step === num;
        const done   = step > num;
        return (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done   ? "bg-green-500 text-white" :
                active ? "bg-green-500 text-white ring-4 ring-green-100 dark:ring-green-900/30" :
                         "bg-gray-100 dark:bg-slate-700 text-gray-400"
              }`}>
                {done ? <Icon.Check /> : num}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-green-600" : "text-gray-400"}`}>{label}</span>
            </div>
            {i < labels.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-all ${done ? "bg-green-400" : "bg-gray-100 dark:bg-slate-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Food Form Modal ──────────────────────────────────────────────
function FoodFormModal({ mode = "add", initial = null, onClose, onSaved }) {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState("");

  const [name,        setName]        = useState(initial?.name        ?? "");
  const [price,       setPrice]       = useState(initial?.price       ?? "");
  const [subcategory, setSubcategory] = useState(initial?.subcategory ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageFile,   setImageFile]   = useState(null);
  const [imagePreview,setImagePreview]= useState(initial?.image ?? "");
  const fileRef = useRef();

  const [ingInput,    setIngInput]    = useState("");
  const [ingredients, setIngredients] = useState(Array.isArray(initial?.ingredients) ? initial.ingredients : []);
  const [nutrition,   setNutrition]   = useState(initial?.nutritionInfo ?? "");
  const [inStock,     setInStock]     = useState(initial?.stockAvailable ?? true);

  const thisYear = new Date().getFullYear();
  const [month,   setMonth]   = useState(initial?.addedMonth ?? "");
  const [year,    setYear]    = useState(initial?.addedYear  ?? String(thisYear));
  const [seasons, setSeasons] = useState(Array.isArray(initial?.seasons) ? initial.seasons : []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function addIngredients() {
    const parts = ingInput.split(",").map((s) => s.trim()).filter(Boolean);
    setIngredients((prev) => [...new Set([...prev, ...parts])]);
    setIngInput("");
  }

  function toggleSeason(label) {
    setSeasons((prev) => prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]);
  }

  function goNext() {
    setErr("");
    if (step === 1) {
      if (!name.trim())                          return setErr("Product name is required");
      if (!price || isNaN(price) || +price <= 0) return setErr("Please enter a valid price");
      if (!subcategory.trim())                   return setErr("Category is required");
      setStep(2);
    } else if (step === 2) {
      if (ingredients.length === 0) return setErr("Add at least one ingredient");
      setStep(3);
    }
  }

  async function handleSubmit() {
    setErr("");
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("name",           name.trim());
      formData.append("price",          Number(price));
      formData.append("category",       CATEGORY_ID);
      formData.append("subcategory",    subcategory.trim());
      formData.append("description",    description.trim());
      formData.append("nutritionInfo",  nutrition.trim());
      formData.append("stockAvailable", inStock);
      formData.append("addedMonth",     month);
      formData.append("addedYear",      Number(year));
      formData.append("ingredients",    JSON.stringify(ingredients));
      formData.append("seasons",        JSON.stringify(seasons));
      if (imageFile) formData.append("image", imageFile);
      if (mode === "add") { formData.append("rating", 0); formData.append("sold", 0); }

      const url    = mode === "add" ? `${BASE}/food` : `${BASE}/food/${initial._id || initial.id}`;
      const method = mode === "add" ? "post" : "put";
      await axios[method](url, formData);

      onSaved?.();
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Server error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const STEP_LABELS = ["Basic Info", "Ingredients", "Season & Date"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
              {mode === "add" ? "Add New Item" : "Edit Item"}
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Step {step} / 3</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            <Icon.Close />
          </button>
        </div>

        <StepIndicator step={step} labels={STEP_LABELS} />

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <Field label="Product Name" required>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Spicy Mozarella with Barbeque" className={inputCls()} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price ($)" required>
                <input type="number" min="0" step="100" value={price}
                  onChange={(e) => setPrice(e.target.value)} placeholder="25000" className={inputCls()} />
              </Field>
              <Field label="Category" required>
                <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={selectCls}>
                  <option value="">-- select --</option>
                  {SUBCATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Description">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about this item..." rows={3} className={inputCls("resize-none")} />
            </Field>
            <Field label="Product Image">
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-green-400 transition">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview" className="w-full h-36 object-cover rounded-lg"
                      onError={(e) => { e.target.style.display = "none"; }} />
                    <p className="text-[10px] text-green-500">Click to change image</p>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400"><Icon.Upload /></span>
                    <p className="text-xs text-gray-400">Click to upload image</p>
                    <p className="text-[10px] text-gray-300">JPG, PNG, WebP</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <Field label="Enter ingredients" hint="Separate with commas">
              <div className="flex gap-2">
                <input type="text" value={ingInput} onChange={(e) => setIngInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addIngredients(); } }}
                  placeholder="cheese, sauce, pasta..." className={inputCls("flex-1")} />
                <button type="button" onClick={addIngredients}
                  className="px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition">
                  Add
                </button>
              </div>
            </Field>
            {ingredients.length > 0 ? (
              <div>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mb-2">{ingredients.length} ingredients added</p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {ingredients.map((ing, i) => (
                    <span key={i} className="flex items-center gap-1 text-[11px] bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full">
                      {ing}
                      <button type="button" onClick={() => setIngredients((prev) => prev.filter((x) => x !== ing))}
                        className="hover:text-red-400 transition ml-0.5"><Icon.Close /></button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl py-6 text-center">
                <p className="text-xs text-gray-300 dark:text-slate-600">No ingredients added yet</p>
              </div>
            )}
            <Field label="Nutrition Info">
              <input type="text" value={nutrition} onChange={(e) => setNutrition(e.target.value)}
                placeholder="Calories: 608, Protein: 25g..." className={inputCls()} />
            </Field>
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">In Stock</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{inStock ? "Available for ordering" : "Currently unavailable"}</p>
              </div>
              <Toggle value={inStock} onChange={setInStock} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Added Month">
                <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectCls}>
                  <option value="">-- select --</option>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Year">
                <select value={year} onChange={(e) => setYear(e.target.value)} className={selectCls}>
                  {Array.from({ length: 6 }, (_, i) => thisYear - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Season" hint="Which seasons is this available?">
              <div className="flex gap-2 flex-wrap mt-1">
                {SEASONS.map(({ label, text }) => (
                  <button key={label} type="button" onClick={() => toggleSeason(label)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                      seasons.includes(label)
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-green-400"
                    }`}>
                    {text}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">Leave empty = available year-round</p>
            </Field>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-gray-600 dark:text-slate-300 mb-2">Summary</p>
              {[
                ["Name",        name],
                ["Price",       `${Number(price || 0).toLocaleString()} $`],
                ["Category",    subcategory],
                ["Ingredients", `${ingredients.length} items`],
                ["In Stock",    inStock ? "Yes" : "No"],
                ["Added",       [month, year].filter(Boolean).join(" ") || "--"],
                ["Season",      seasons.join(", ") || "Year-round"],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between text-[11px] mb-1 last:mb-0">
                  <span className="text-gray-400">{key}</span>
                  <span className="text-gray-700 dark:text-slate-200 font-medium truncate ml-4 max-w-[180px]">{val || "--"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {err && (
          <p className="text-xs text-red-400 mt-3 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{err}</p>
        )}

        <div className="flex gap-2 mt-5">
          {step > 1 && (
            <button type="button" onClick={() => { setStep((s) => s - 1); setErr(""); }}
              className="flex-1 text-xs border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 rounded-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
              Back
            </button>
          )}
          <button type="button" onClick={step < 3 ? goNext : handleSubmit} disabled={busy}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-full transition">
            {busy ? "Saving..." : step < 3 ? "Next" : mode === "add" ? "Add to Menu" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────
function DeleteModal({ food, onClose, onDeleted }) {
  const [reason, setReason] = useState("");
  const [busy,   setBusy]   = useState(false);
  const [err,    setErr]    = useState("");

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleDelete() {
    setBusy(true); setErr("");
    try {
      const log = JSON.parse(localStorage.getItem("foodDeleteLog") || "[]");
      log.unshift({ id: food._id || food.id, name: food.name, reason: reason.trim() || "No reason given", deletedAt: new Date().toISOString() });
      localStorage.setItem("foodDeleteLog", JSON.stringify(log.slice(0, 100)));
      await axios.delete(`${BASE}/food/${food._id || food.id}`);
      onDeleted?.();
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Delete failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Delete Item</h3>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            <Icon.Close />
          </button>
        </div>
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
          <FoodImage src={food.image} alt={food.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-gray-800 dark:text-slate-100">{food.name}</p>
            <p className="text-[10px] text-red-400 mt-0.5">This action cannot be undone</p>
          </div>
        </div>
        <label className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 block">
          Why are you deleting this? <span className="text-gray-400 ml-1">(Saved to logs)</span>
        </label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Menu updated, Season ended..."
          rows={4}
          className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-gray-500 dark:text-slate-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-red-300 resize-none transition" />
        {err && <p className="text-xs text-red-400 mt-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{err}</p>}
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onClose}
            className="flex-1 text-xs border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 rounded-full py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            Cancel
          </button>
          <button type="button" onClick={handleDelete} disabled={busy}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-full transition">
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Food Card (Grid view) ────────────────────────────────────────
function FoodCard({ food, onEdit, onDelete }) {
  return (
    <div className="py-4">
      <div className="w-[240px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex justify-center -mt-12">
          <FoodImage src={food.image} alt={food.name}
            className="w-32 h-32 object-cover rounded-full shadow-md border-4 border-white dark:border-slate-800" />
        </div>
        <h3 className="mt-4 font-semibold text-sm text-gray-800 dark:text-slate-100 h-[44px] leading-tight line-clamp-2 px-4">
          {food.name}
        </h3>
        <p className="text-xs mt-1">
          <span className="text-green-500">Food</span>
          <span className="text-gray-400 dark:text-slate-400"> / {food.subcategory || food.category?.name || "Other"}</span>
        </p>
        <p className="text-sm font-bold text-green-600 mt-1">{Number(food.price).toLocaleString()} $</p>
        <div className="flex justify-center gap-2 mt-4">
          <Link to={`/foods/${food._id || food.id}`}>
            <ActionBtn variant="green" title="View"><Icon.Eye /></ActionBtn>
          </Link>
          <ActionBtn variant="amber" title="Edit" onClick={() => onEdit(food)}><Icon.Edit /></ActionBtn>
          <ActionBtn variant="red"   title="Delete" onClick={() => onDelete(food)}><Icon.Trash /></ActionBtn>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <span className="text-[10px] text-gray-400">View</span>
          <span className="text-[10px] text-gray-400">Edit</span>
          <span className="text-[10px] text-gray-400">Delete</span>
        </div>
      </div>
    </div>
  );
}

// ─── Food Row (List view) ─────────────────────────────────────────
function FoodRow({ food, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition">
      <td className="py-3 pl-4">
        <FoodImage src={food.image} alt={food.name} className="w-10 h-10 rounded-full object-cover" />
      </td>
      <td className="py-3 px-3">
        <p className="text-xs font-semibold text-gray-800 dark:text-slate-100">{food.name}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[160px]">{food.description || "--"}</p>
      </td>
      <td className="py-3 px-3">
        <span className="text-xs text-gray-600 dark:text-slate-300">{food.category?.name || "fast food"}</span>
        {food.subcategory && (
          <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-1">/ {food.subcategory}</span>
        )}
      </td>
      <td className="py-3 px-3">
        <span className="text-xs font-semibold text-green-600">{Number(food.price).toLocaleString()} $</span>
      </td>
      <td className="py-3 px-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          food.stockAvailable
            ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-50 text-red-400 dark:bg-red-900/30"
        }`}>
          {food.stockAvailable ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td className="py-3 px-3 pr-4">
        <div className="flex gap-1.5">
          <Link to={`/foods/${food._id || food.id}`}>
            <ActionBtn variant="blue" title="View"><Icon.Eye /></ActionBtn>
          </Link>
          <ActionBtn variant="amber" title="Edit" onClick={() => onEdit(food)}><Icon.Edit /></ActionBtn>
          <ActionBtn variant="red"   title="Delete" onClick={() => onDelete(food)}><Icon.Trash /></ActionBtn>
        </div>
      </td>
    </tr>
  );
}

// ─── Pagination ───────────────────────────────────────────────────
function PagArrow({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:border-green-400 disabled:opacity-30 transition">
      {children}
    </button>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  let start = Math.max(1, page - 2);
  let end   = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center gap-1">
      <PagArrow onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </PagArrow>
      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
            page === p ? "bg-green-500 text-white shadow-sm" : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-500 hover:border-green-400"
          }`}>
          {p}
        </button>
      ))}
      <PagArrow onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </PagArrow>
    </div>
  );
}

// ─── Main Foods Component ─────────────────────────────────────────
function Foods() {
  const dispatch           = useDispatch();
  const { foods, loading } = useSelector((s) => s.food);
  const [dark, toggleDark] = useDark();

  const [page, setPage] = useState(1);

  const [view, setView] = useState(() => {
    try {
      const saved = localStorage.getItem(VIEW_STORAGE_KEY);
      return saved === "list" || saved === "grid" ? saved : "grid";
    } catch {
      return "grid";
    }
  });

  const handleViewChange = (newView) => {
    setView(newView);
    try { localStorage.setItem(VIEW_STORAGE_KEY, newView); } catch {}
  };

  const [search, setSearch] = useState("");

  // Filter state
  const [filters, setFilters] = useState({
    subcategories: [],
    stock: "all",
    priceMin: "",
    priceMax: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  const [showAdd,    setShowAdd]    = useState(false);
  const [editFood,   setEditFood]   = useState(null);
  const [deleteFood, setDeleteFood] = useState(null);

  useEffect(() => { dispatch(fetchFoods()); }, [dispatch]);

  const refresh = () => dispatch(fetchFoods());

  const normalizedFoods = (foods ?? []).map((f) => ({ ...f, id: f._id || f.id }));

  // Active filter count for badge
  const activeFilterCount = [
    filters.subcategories.length > 0,
    filters.stock !== "all",
    !!filters.priceMin,
    !!filters.priceMax,
  ].filter(Boolean).length;

  // Apply all filters
  const filtered = normalizedFoods.filter((f) => {
    // Search
    if (!f.name?.toLowerCase().includes(search.toLowerCase())) return false;
    // Subcategory filter
    if (filters.subcategories.length > 0 && !filters.subcategories.includes(f.subcategory)) return false;
    // Stock filter
    if (filters.stock === "in"  && !f.stockAvailable) return false;
    if (filters.stock === "out" &&  f.stockAvailable) return false;
    // Price filter
    if (filters.priceMin !== "" && f.price < filters.priceMin) return false;
    if (filters.priceMax !== "" && f.price > filters.priceMax) return false;
    return true;
  });

  const totalPages   = Math.ceil(filtered.length / PAGE_LIMIT);
  const visibleFoods = filtered.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

  return (
    <div className="min-h-screen bg-[#f5f6fa] dark:bg-slate-900 rounded-2xl border border-gray-200/40 dark:border-slate-700">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Foods</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? "Loading..." : `Managing ${normalizedFoods.length} items`}
            {activeFilterCount > 0 && (
              <span className="ml-2 text-green-500">· {filtered.length} filtered</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">

          {/* Search */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-4 py-2.5 border border-gray-100 dark:border-slate-700 w-56">
            <span className="text-gray-400 flex-shrink-0"><Icon.Search /></span>
            <input type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search items..."
              className="text-xs text-gray-600 dark:text-slate-200 bg-transparent outline-none w-full placeholder:text-gray-400" />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }}
                className="text-gray-300 hover:text-gray-500 transition flex-shrink-0">
                <Icon.Close />
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 border border-gray-100 dark:border-slate-700">
            <button onClick={() => handleViewChange("list")}
              className={`p-2 rounded-lg transition ${
                view === "list"
                  ? "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200"
                  : "text-gray-300 hover:text-gray-500"
              }`}>
              <Icon.List />
            </button>
            <button onClick={() => handleViewChange("grid")}
              className={`p-2 rounded-lg transition ${
                view === "grid"
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:text-gray-500"
              }`}>
              <Icon.Grid />
            </button>
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilter(true)}
            className={`relative flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full transition border ${
              activeFilterCount > 0
                ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400"
                : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-green-400"
            }`}
          >
            <Icon.Filter />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Add button */}
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition shadow-sm">
            <Icon.Plus /> New Item
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="px-8 pb-2 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] text-gray-400">Active filters:</span>
          {filters.subcategories.map((s) => (
            <span key={s} className="flex items-center gap-1 text-[11px] bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
              {s}
              <button onClick={() => setFilters((f) => ({ ...f, subcategories: f.subcategories.filter((x) => x !== s) }))}
                className="hover:text-red-400 transition"><Icon.Close /></button>
            </span>
          ))}
          {filters.stock !== "all" && (
            <span className="flex items-center gap-1 text-[11px] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              {filters.stock === "in" ? "In Stock" : "Out of Stock"}
              <button onClick={() => setFilters((f) => ({ ...f, stock: "all" }))}
                className="hover:text-red-400 transition"><Icon.Close /></button>
            </span>
          )}
          {(filters.priceMin || filters.priceMax) && (
            <span className="flex items-center gap-1 text-[11px] bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              {filters.priceMin ? `${Number(filters.priceMin).toLocaleString()}` : "0"} — {filters.priceMax ? `${Number(filters.priceMax).toLocaleString()}` : "∞"} $npm 
              <button onClick={() => setFilters((f) => ({ ...f, priceMin: "", priceMax: "" }))}
                className="hover:text-red-400 transition"><Icon.Close /></button>
            </span>
          )}
          <button onClick={() => setFilters({ subcategories: [], stock: "all", priceMin: "", priceMax: "" })}
            className="text-[11px] text-gray-400 hover:text-red-400 transition underline">
            Clear all
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-8 py-4">
        {view === "grid" && (
          <div className="flex flex-wrap gap-4 pt-8">
            {loading
              ? [...Array(10)].map((_, i) => <SkeletonCard key={i} />)
              : visibleFoods.map((food) => (
                  <FoodCard key={food._id || food.id} food={food} onEdit={setEditFood} onDelete={setDeleteFood} />
                ))
            }
          </div>
        )}

        {view === "list" && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Image","Name","Category","Price","Stock","Actions"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-gray-400 dark:text-slate-500 px-3 py-3 first:pl-4 last:pr-4 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                  : visibleFoods.map((food) => (
                      <FoodRow key={food._id || food.id} food={food} onEdit={setEditFood} onDelete={setDeleteFood} />
                    ))
                }
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-slate-500">
                <path d="M3 3h18v4H3z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 7v14h18V7" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11h6m-6 4h4" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-gray-400 dark:text-slate-500 text-sm font-medium">No items found</p>
            {(search || activeFilterCount > 0) && (
              <button onClick={() => { setSearch(""); setFilters({ subcategories: [], stock: "all", priceMin: "", priceMax: "" }); }}
                className="mt-2 text-xs text-green-500 hover:underline">
                Clear search & filters
              </button>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between mt-6 pb-2">
            <p className="text-xs text-gray-400">
              {(page - 1) * PAGE_LIMIT + 1}–{Math.min(page * PAGE_LIMIT, filtered.length)} of {filtered.length} shown
            </p>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="px-8 pb-10 mt-2"><MenuComparison foods={normalizedFoods} /></div>

      {/* Modals */}
      {showFilter  && <FilterModal onClose={() => setShowFilter(false)} onApply={(f) => { setFilters(f); setPage(1); }} currentFilters={filters} />}
      {showAdd     && <FoodFormModal mode="add"  onClose={() => setShowAdd(false)}    onSaved={refresh} />}
      {editFood    && <FoodFormModal mode="edit" initial={editFood} onClose={() => setEditFood(null)}   onSaved={refresh} />}
      {deleteFood  && <DeleteModal   food={deleteFood}              onClose={() => setDeleteFood(null)} onDeleted={refresh} />}
    </div>
  );
}

export default Foods;
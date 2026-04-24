// ═══════════════════════════════════════════════════════════════════
//  Foods.jsx  —  Restaurant Admin · Food Management Page
//  FIX: multipart/form-data (FormData) for POST + PUT
//  FIX: SalesChart emojis removed, null-safe canvas ref
//  FIX: ingredients + seasons JSON.stringify for FormData
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

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const SEASONS = [
  { label: "Spring", text: "Bahor" },
  { label: "Summer", text: "Yoz" },
  { label: "Autumn", text: "Kuz" },
  { label: "Winter", text: "Qish" },
];

const CHART_COLORS = [
  "#22c55e","#3b82f6","#f59e0b",
  "#ef4444","#8b5cf6","#ec4899","#06b6d4",
];

// ─── Sales data (no emojis in labels) ────────────────────────────
const SALES_DATA = {
  monthly: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    ovqat:    [180,220,195,260,310,285,320,298,275,340,360,420],
    ichimlik: [95,110,88,145,190,230,280,265,195,150,120,160],
    snek:     [45,55,48,72,85,78,90,82,68,95,105,130],
  },
  weekly: {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    ovqat:    [42,38,51,55,72,88,65],
    ichimlik: [28,22,35,40,58,70,52],
    snek:     [15,12,18,22,35,42,30],
  },
};

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
  };
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-full transition ${colors[variant]}`}
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
  sandwich: "https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=200&q=80",
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

// ─── Sales Chart — FIX: no emojis, null-safe canvas ──────────────
function SalesChart() {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const d   = SALES_DATA[period];
    const isDark = document.documentElement.classList.contains("dark");

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: d.labels,
        datasets: [
          {
            label: "Ovqatlar",
            data: d.ovqat,
            backgroundColor: "rgba(34,197,94,0.85)",
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: "Ichimliklar",
            data: d.ichimlik,
            backgroundColor: "rgba(59,130,246,0.85)",
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: "Sneklar",
            data: d.snek,
            backgroundColor: "rgba(245,158,11,0.85)",
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              font: { size: 11, family: "inherit" },
              color: isDark ? "#94a3b8" : "#6b7280",
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 8,
            },
          },
          tooltip: {
            backgroundColor: isDark ? "#1e293b" : "#fff",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            borderWidth: 1,
            titleColor: isDark ? "#f1f5f9" : "#111827",
            bodyColor: isDark ? "#94a3b8" : "#6b7280",
            padding: 12,
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ${item.raw} dona`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: "#9ca3af", font: { size: 11 } },
          },
          y: {
            grid: { color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", drawTicks: false },
            border: { display: false },
            ticks: {
              color: "#9ca3af",
              font: { size: 11 },
              padding: 8,
              callback: (v) => v + " ta",
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [period]);

  return (
    <div>

    {/* <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100">Sotuv statistikasi</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Kategoriyalar boyicha sotuv</p>
        </div>
        <div className="flex gap-1 bg-gray-50 dark:bg-slate-700/50 p-1 rounded-xl">
          {[
            { key: "monthly", label: "Oylik" },
            { key: "weekly",  label: "Haftalik" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition ${
                period === key
                  ? "bg-green-500 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 260 }}>
        <canvas ref={canvasRef} />
      </div>
    </div> */}
    </div>
  );
}

// ─── Menu Comparison (donut charts) ──────────────────────────────
function MiniDonut({ pct, color, label, count }) {
  const r    = 38;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="14"
          className="dark:stroke-slate-700" />
        <circle cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="14"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
        />
        <text x="50" y="46" textAnchor="middle" fontSize="13" fontWeight="700" fill={color}>
          {pct}%
        </text>
        <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#9ca3af">of menu</text>
      </svg>
      <p className="text-xs font-semibold text-gray-700 dark:text-slate-200 capitalize">{label}</p>
      <p className="text-[10px] text-gray-400">{count} items</p>
    </div>
  );
}

function MenuComparison({ foods }) {
  const groups = (foods ?? []).reduce((acc, f) => {
    const key = (f.subcategory || f.category?.name || "other").toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const total   = foods?.length || 0;
  const entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);
  if (!total) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100">Menu Comparison</h2>
        <span className="text-[11px] text-gray-400">{total} total items</span>
      </div>
      <div className="flex flex-wrap gap-10 justify-center mb-6">
        {entries.slice(0, 3).map(([cat, count], i) => (
          <MiniDonut
            key={cat}
            pct={Math.round((count / total) * 100)}
            color={CHART_COLORS[i]}
            label={cat}
            count={count}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {entries.map(([cat, count], i) => (
          <div key={cat} className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="text-xs text-gray-500 dark:text-slate-400 w-24 capitalize truncate">{cat}</span>
            <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
              <div className="h-1.5 rounded-full transition-all"
                style={{ width: `${(count / total) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-slate-200 w-5 text-right">{count}</span>
          </div>
        ))}
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
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-green-600" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-all ${
                done ? "bg-green-400" : "bg-gray-100 dark:bg-slate-700"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Food Form Modal — FIX: FormData for POST + PUT ───────────────
function FoodFormModal({ mode = "add", initial = null, onClose, onSaved }) {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState("");

  // Step 1
  const [name,        setName]        = useState(initial?.name        ?? "");
  const [price,       setPrice]       = useState(initial?.price       ?? "");
  const [subcategory, setSubcategory] = useState(initial?.subcategory ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageFile,   setImageFile]   = useState(null);
  const [imagePreview,setImagePreview]= useState(initial?.image ?? "");
  const fileRef = useRef();

  // Step 2
  const [ingInput,    setIngInput]    = useState("");
  const [ingredients, setIngredients] = useState(
    Array.isArray(initial?.ingredients) ? initial.ingredients : []
  );
  const [nutrition,   setNutrition]   = useState(initial?.nutritionInfo ?? "");
  const [inStock,     setInStock]     = useState(initial?.stockAvailable ?? true);

  // Step 3
  const thisYear = new Date().getFullYear();
  const [month,   setMonth]   = useState(initial?.addedMonth ?? "");
  const [year,    setYear]    = useState(initial?.addedYear  ?? String(thisYear));
  const [seasons, setSeasons] = useState(
    Array.isArray(initial?.seasons) ? initial.seasons : []
  );

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
    setSeasons((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  }

  function goNext() {
    setErr("");
    if (step === 1) {
      if (!name.trim())                          return setErr("Mahsulot nomi kerak");
      if (!price || isNaN(price) || +price <= 0) return setErr("Togri narx kiriting");
      if (!subcategory.trim())                   return setErr("Kategoriya kerak");
      setStep(2);
    } else if (step === 2) {
      if (ingredients.length === 0) return setErr("Kamida bitta tarkib kiriting");
      setStep(3);
    }
  }

  // ── FIXED handleSubmit: FormData (multipart/form-data) ──────────
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

      // Array fields — append each item or JSON string based on backend expectation
      // Most backends with multer accept JSON string for arrays
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("seasons",     JSON.stringify(seasons));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (mode === "add") {
        formData.append("rating", 0);
        formData.append("sold",   0);
      }

      const url    = mode === "add"
        ? `${BASE}/food`
        : `${BASE}/food/${initial._id || initial.id}`;
      const method = mode === "add" ? "post" : "put";

      // No Content-Type header — axios sets multipart/form-data automatically
      await axios[method](url, formData);

      onSaved?.();
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Server xatosi. Qayta urinib koring.");
    } finally {
      setBusy(false);
    }
  }

  const STEP_LABELS = ["Asosiy malumot", "Tarkib", "Mavsum va sana"];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
              {mode === "add" ? "Yangi Taom Qoshish" : "Taomni Tahrirlash"}
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Qadam {step} / 3</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            <Icon.Close />
          </button>
        </div>

        <StepIndicator step={step} labels={STEP_LABELS} />

        {/* Step 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <Field label="Mahsulot nomi" required>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Spicy Mozarella with Barbeque" className={inputCls()} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Narx ($)" required>
                <input type="number" min="0" step="0.01" value={price}
                  onChange={(e) => setPrice(e.target.value)} placeholder="15.00" className={inputCls()} />
              </Field>
              <Field label="Kategoriya" required>
                <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={selectCls}>
                  <option value="">-- tanlang --</option>
                  {["Burger","Pizza","Sandwich","Grill","Snack","Dessert","Drink","Noodle","Other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Tavsif">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Bu taom haqida..." rows={3} className={inputCls("resize-none")} />
            </Field>
            <Field label="Mahsulot rasmi">
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-green-400 transition">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview"
                      className="w-full h-36 object-cover rounded-lg"
                      onError={(e) => { e.target.style.display = "none"; }} />
                    <p className="text-[10px] text-green-500">Rasmni ozgartirish uchun bosing</p>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400"><Icon.Upload /></span>
                    <p className="text-xs text-gray-400">Rasm yuklash uchun bosing</p>
                    <p className="text-[10px] text-gray-300">JPG, PNG, WebP</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </Field>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <Field label="Tarkiblarni kiriting" hint="Vergul bilan ajrating">
              <div className="flex gap-2">
                <input type="text" value={ingInput}
                  onChange={(e) => setIngInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addIngredients();
                    }
                  }}
                  placeholder="pishloq, sous, pasta..." className={inputCls("flex-1")} />
                <button type="button" onClick={addIngredients}
                  className="px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition">
                  Qosh
                </button>
              </div>
            </Field>
            {ingredients.length > 0 ? (
              <div>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mb-2">
                  {ingredients.length} ta tarkib qoshildi
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {ingredients.map((ing, i) => (
                    <span key={i} className="flex items-center gap-1 text-[11px] bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full">
                      {ing}
                      <button type="button"
                        onClick={() => setIngredients((prev) => prev.filter((x) => x !== ing))}
                        className="hover:text-red-400 transition ml-0.5">
                        <Icon.Close />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl py-6 text-center">
                <p className="text-xs text-gray-300 dark:text-slate-600">Hali tarkib qoshilmagan</p>
              </div>
            )}
            <Field label="Ozuqa malumoti">
              <input type="text" value={nutrition} onChange={(e) => setNutrition(e.target.value)}
                placeholder="Kalori: 608, Oqsil: 25g..." className={inputCls()} />
            </Field>
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">Stokda bor</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {inStock ? "Buyurtma qilish mumkin" : "Hozir mavjud emas"}
                </p>
              </div>
              <Toggle value={inStock} onChange={setInStock} />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Qoshilgan oy">
                <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectCls}>
                  <option value="">-- tanlang --</option>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Yil">
                <select value={year} onChange={(e) => setYear(e.target.value)} className={selectCls}>
                  {Array.from({ length: 6 }, (_, i) => thisYear - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Mavsum" hint="Qaysi mavsumda taklif etiladi?">
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
              <p className="text-[10px] text-gray-400 mt-1.5">Bosh qolsa = yil boyi mavjud</p>
            </Field>
            {/* Summary */}
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-gray-600 dark:text-slate-300 mb-2">Xulosa</p>
              {[
                ["Nomi",       name],
                ["Narx",       `$${Number(price || 0).toFixed(2)}`],
                ["Kategoriya", subcategory],
                ["Tarkiblar",  `${ingredients.length} ta`],
                ["Stokda",     inStock ? "Ha" : "Yoq"],
                ["Qoshilgan",  [month, year].filter(Boolean).join(" ") || "--"],
                ["Mavsum",     seasons.join(", ") || "Yil boyi"],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between text-[11px] mb-1 last:mb-0">
                  <span className="text-gray-400">{key}</span>
                  <span className="text-gray-700 dark:text-slate-200 font-medium truncate ml-4 max-w-[180px]">
                    {val || "--"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {err && (
          <p className="text-xs text-red-400 mt-3 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            {err}
          </p>
        )}

        <div className="flex gap-2 mt-5">
          {step > 1 && (
            <button type="button"
              onClick={() => { setStep((s) => s - 1); setErr(""); }}
              className="flex-1 text-xs border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 rounded-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
              Orqaga
            </button>
          )}
          <button type="button"
            onClick={step < 3 ? goNext : handleSubmit}
            disabled={busy}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-full transition">
            {busy
              ? "Saqlanmoqda..."
              : step < 3
                ? "Keyingisi"
                : mode === "add" ? "Menyuga Qosh" : "Ozgarishlarni Saqlash"}
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
    setBusy(true);
    setErr("");
    try {
      // Log to localStorage
      const log = JSON.parse(localStorage.getItem("foodDeleteLog") || "[]");
      log.unshift({
        id:        food._id || food.id,
        name:      food.name,
        reason:    reason.trim() || "Sabab korsatilmagan",
        deletedAt: new Date().toISOString(),
      });
      localStorage.setItem("foodDeleteLog", JSON.stringify(log.slice(0, 100)));

      await axios.delete(`${BASE}/food/${food._id || food.id}`);
      onDeleted?.();
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Ochirish xatoligi. Qayta urinib koring.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Taomni Ochirish</h3>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            <Icon.Close />
          </button>
        </div>
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
          <FoodImage src={food.image} alt={food.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-gray-800 dark:text-slate-100">{food.name}</p>
            <p className="text-[10px] text-red-400 mt-0.5">Bu amalni qaytarib bolmaydi</p>
          </div>
        </div>
        <label className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 block">
          Nima uchun ochiryapsiz?
          <span className="text-gray-400 ml-1">(Qaydlarga saqlanadi)</span>
        </label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)}
          placeholder="masalan: Menyu yangilandi, Mavsum tugadi..."
          rows={4}
          className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-gray-500 dark:text-slate-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-red-300 resize-none transition" />
        {err && (
          <p className="text-xs text-red-400 mt-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{err}</p>
        )}
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onClose}
            className="flex-1 text-xs border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 rounded-full py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            Bekor
          </button>
          <button type="button" onClick={handleDelete} disabled={busy}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-full transition">
            {busy ? "Ochirilmoqda..." : "Ochirish"}
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
          <FoodImage
            src={food.image}
            alt={food.name}
            className="w-32 h-32 object-cover rounded-full shadow-md border-4 border-white dark:border-slate-800"
          />
        </div>
        <h3 className="mt-4 font-semibold text-sm text-gray-800 dark:text-slate-100 h-[44px] leading-tight line-clamp-2 px-4">
          {food.name}
        </h3>
        <p className="text-xs mt-1">
          <span className="text-green-500">Food</span>
          <span className="text-gray-400 dark:text-slate-400"> / {food.subcategory || food.category?.name || "Other"}</span>
        </p>
        <p className="text-sm font-bold text-green-600 mt-1">${Number(food.price).toFixed(2)}</p>
        <div className="flex justify-center gap-2 mt-4">
          <Link to={`/foods/${food._id || food.id}`}>
            <ActionBtn variant="green" title="Korish"><Icon.Eye /></ActionBtn>
          </Link>
          <ActionBtn variant="amber" title="Tahrirlash" onClick={() => onEdit(food)}>
            <Icon.Edit />
          </ActionBtn>
          <ActionBtn variant="red" title="Ochirish" onClick={() => onDelete(food)}>
            <Icon.Trash />
          </ActionBtn>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <span className="text-[10px] text-gray-400">Korish</span>
          <span className="text-[10px] text-gray-400">Tahrir</span>
          <span className="text-[10px] text-gray-400">Ochir</span>
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
        <FoodImage src={food.image} alt={food.name}
          className="w-10 h-10 rounded-full object-cover" />
      </td>
      <td className="py-3 px-3">
        <p className="text-xs font-semibold text-gray-800 dark:text-slate-100">{food.name}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[160px]">{food.description || "--"}</p>
      </td>
      <td className="py-3 px-3">
        <span className="text-xs text-gray-600 dark:text-slate-300 capitalize">
          {food.category?.name || "food"}
        </span>
        {food.subcategory && (
          <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-1">/ {food.subcategory}</span>
        )}
      </td>
      <td className="py-3 px-3">
        <span className="text-xs font-semibold text-green-600">${Number(food.price).toFixed(2)}</span>
      </td>
      <td className="py-3 px-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          food.stockAvailable
            ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-50 text-red-400 dark:bg-red-900/30"
        }`}>
          {food.stockAvailable ? "Stokda" : "Stok yoq"}
        </span>
      </td>
      <td className="py-3 px-3 pr-4">
        <div className="flex gap-1.5">
          <Link to={`/foods/${food._id || food.id}`}>
            <ActionBtn variant="blue" title="Korish"><Icon.Eye /></ActionBtn>
          </Link>
          <ActionBtn variant="amber" title="Tahrirlash" onClick={() => onEdit(food)}>
            <Icon.Edit />
          </ActionBtn>
          <ActionBtn variant="red" title="Ochirish" onClick={() => onDelete(food)}>
            <Icon.Trash />
          </ActionBtn>
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
            page === p
              ? "bg-green-500 text-white shadow-sm"
              : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-500 hover:border-green-400"
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

  const [page,   setPage]   = useState(1);
  const [view,   setView]   = useState("grid");
  const [search, setSearch] = useState("");

  const [showAdd,    setShowAdd]    = useState(false);
  const [editFood,   setEditFood]   = useState(null);
  const [deleteFood, setDeleteFood] = useState(null);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  const refresh = () => dispatch(fetchFoods());

  const normalizedFoods = (foods ?? []).map((f) => ({
    ...f,
    id: f._id || f.id,
  }));

  const filtered = normalizedFoods.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages   = Math.ceil(filtered.length / PAGE_LIMIT);
  const visibleFoods = filtered.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

  return (
    <div className="min-h-screen bg-[#f5f6fa] dark:bg-slate-900 rounded-2xl border border-gray-200/40 dark:border-slate-700">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Foods</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? "Yuklanmoqda..." : `${normalizedFoods.length} ta taom boshqarilmoqda`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-4 py-2.5 border border-gray-100 dark:border-slate-700 w-56">
            <span className="text-gray-400 flex-shrink-0"><Icon.Search /></span>
            <input type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Taom qidiring..."
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
            <button onClick={() => setView("list")}
              className={`p-2 rounded-lg transition ${
                view === "list"
                  ? "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200"
                  : "text-gray-300 hover:text-gray-500"
              }`}>
              <Icon.List />
            </button>
            <button onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition ${
                view === "grid"
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:text-gray-500"
              }`}>
              <Icon.Grid />
            </button>
          </div>

          {/* Dark mode */}
          {/* <button onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-green-400 transition">
            {dark ? <Icon.Sun /> : <Icon.Moon />}
          </button> */}

          {/* Add button */}
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition shadow-sm">
            <Icon.Plus /> Yangi Taom
          </button>
        </div>
      </div>

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
          <div className="bg-white rounde dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Rasm","Nomi","Kategoriya","Narx","Stok","Amallar"].map((h) => (
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
            <p className="text-gray-400 dark:text-slate-500 text-sm font-medium">Taom topilmadi</p>
            {search && (
              <button onClick={() => setSearch("")}
                className="mt-2 text-xs text-green-500 hover:underline">
                Qidiruvni tozalash
              </button>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between mt-6 pb-2">
            <p className="text-xs text-gray-400">
              {(page - 1) * PAGE_LIMIT + 1}--{Math.min(page * PAGE_LIMIT, filtered.length)} / {filtered.length} ta korsatilmoqda
            </p>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="px-8 pb-6 mt-4">
        <SalesChart />
      </div>

      <div className="px-8 pb-10 mt-2">
        <MenuComparison foods={normalizedFoods} />
      </div>

      {/* Modals */}
      {showAdd && (
        <FoodFormModal mode="add" onClose={() => setShowAdd(false)} onSaved={refresh} />
      )}
      {editFood && (
        <FoodFormModal mode="edit" initial={editFood} onClose={() => setEditFood(null)} onSaved={refresh} />
      )}
      {deleteFood && (
        <DeleteModal food={deleteFood} onClose={() => setDeleteFood(null)} onDeleted={refresh} />
      )}
    </div>
  );
}

export default Foods;

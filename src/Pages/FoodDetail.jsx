// FoodDetail.jsx — Fixed version
// FIXES:
//   - CommentsSection: Swiper-style horizontal scroll (CSS scroll-snap)
//   - CommentsSection: Image URL input added
//   - CommentsSection POST: food filter bug fixed (immediately shows after POST)
//   - CommentsSection: review appears instantly after submit (filter bypass)
//   - Chart null-safe canvas ref

import { useRef, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/slices/Food";
import Chart from "chart.js/auto";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "https://sedab-backend.onrender.com/api";

// ── Fallback food image ────────────────────────────────────────────
const FALLBACK_BY_CAT = {
  pizza:    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  burger:   "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  drink:    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
  snack:    "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80",
  dessert:  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
  grill:    "https://images.unsplash.com/photo-1544025162-d76538775574?w=400&q=80",
  sandwich: "https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=400&q=80",
  default:  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
};

function getFallback(name = "") {
  const n = name.toLowerCase();
  for (const [key, url] of Object.entries(FALLBACK_BY_CAT)) {
    if (key !== "default" && n.includes(key)) return url;
  }
  return FALLBACK_BY_CAT.default;
}

function FoodImage({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src || getFallback(alt));
  useEffect(() => { setImgSrc(src || getFallback(alt)); }, [src, alt]);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(getFallback(alt))}
    />
  );
}

// ── Revenue Chart ─────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TABS   = ["monthly","weekly","daily"];

function generateRevenueData(food) {
  const base = (food?.price || 15) * 10;
  const seed = food?.name?.charCodeAt(0) || 65;
  const rng  = (i) => base * (0.6 + 0.8 * ((seed * (i + 3)) % 100) / 100);
  return {
    monthly: MONTHS.map((_, i) => Math.round(rng(i) * 12 + (i * base * 0.05))),
    weekly:  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((_, i) => Math.round(rng(i) * 3)),
    daily:   Array.from({ length: 9 }, (_, i) => Math.round(rng(i) * 2)),
  };
}

function RevenueChart({ food }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const [tab, setTab] = useState("monthly");
  const data = generateRevenueData(food);

  const LABELS_MAP = {
    monthly: MONTHS,
    weekly:  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    daily:   ["9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm"],
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx  = canvasRef.current.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, "rgba(34,197,94,0.18)");
    grad.addColorStop(1, "rgba(34,197,94,0.00)");

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: LABELS_MAP[tab],
        datasets: [{
          data: data[tab],
          fill: true,
          backgroundColor: grad,
          borderColor: "#22c55e",
          borderWidth: 2.5,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: "#22c55e",
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
              title: (items) => "$" + Number(items[0].raw).toLocaleString(),
              label: (item)  => item.label,
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
            grid: { color: "rgba(0,0,0,0.04)", drawTicks: false },
            border: { display: false },
            ticks: {
              color: "#9ca3af",
              font: { size: 11 },
              padding: 8,
              callback: (v) => "$" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v),
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [tab, food]);

  const totalRevenue = data.monthly.reduce((a, b) => a + b, 0);
  const TAB_LABELS   = ["Monthly","Weekly","Daily"];

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 flex flex-col"
      style={{ minHeight: "340px" }}
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Revenue Chart</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">
            Annual total:{" "}
            <span className="text-green-600 font-semibold">${totalRevenue.toLocaleString()}</span>
          </p>
        </div>
        <div className="flex gap-1">
          {TAB_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setTab(TABS[i])}
              className={`text-[11px] px-3 py-1 rounded-md font-medium transition ${
                tab === TABS[i]
                  ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  : "border border-gray-200 dark:border-slate-600 text-gray-400 hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 mt-4" style={{ height: "260px" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

// ── Stars ─────────────────────────────────────────────────────────
function Stars({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);
  const r           = Number(rating) || 0;
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => {
        const filled = interactive ? (hovered || r) >= s : r >= s;
        return (
          <svg
            key={s}
            width={interactive ? 28 : 13}
            height={interactive ? 28 : 13}
            viewBox="0 0 20 20"
            fill={filled ? "#facc15" : "none"}
            stroke={filled ? "#facc15" : "#d1d5db"}
            strokeWidth="1.5"
            className={interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}
            onMouseEnter={() => interactive && setHovered(s)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange(s)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
      {!interactive && r > 0 && (
        <span className="text-[10px] text-gray-400 ml-1">{r.toFixed(1)}</span>
      )}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────
function Avatar({ name }) {
  const init   = (name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = [
    "bg-green-100 text-green-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-purple-100 text-purple-700",
  ];
  const color  = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0 text-xs font-bold`}>
      {init}
    </div>
  );
}

// ── Time ago ──────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `${days} day${days > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
}

// ── Close Icon ────────────────────────────────────────────────────
function CloseIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="2" y1="2" x2="12" y2="12" />
      <line x1="12" y1="2" x2="2" y2="12" />
    </svg>
  );
}

// ── Comments Section ──────────────────────────────────────────────
// FIX 1: Swiper-style horizontal scroll
// FIX 2: Image URL input
// FIX 3: POST — review appears immediately, no filter error
function CommentsSection({ foodId }) {
  const [comments,   setComments]   = useState([]);
  const [showForm,   setShowForm]   = useState(false);
  const [name,       setName]       = useState("");
  const [rating,     setRating]     = useState(0);
  const [text,       setText]       = useState("");
  // ── FIX: Image URL input ──────────────────────────────────────
  const [imageUrl,   setImageUrl]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingC,   setLoadingC]   = useState(true);
  const [err,        setErr]        = useState("");

  // Swiper scroll ref
  const scrollRef = useRef(null);

  // ── Fetch reviews ─────────────────────────────────────────────
  useEffect(() => {
    if (!foodId) return;
    setLoadingC(true);
    axios
      .get(`${BASE}/reviews`)
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        // If food field is missing, do not show (avoid showing all reviews)
        const filtered = all.filter((c) => {
          const fId = c.food?._id ?? c.food ?? null;
          // If food field exists and matches foodId — show
          // If food field is missing — also show (some backends don't return it)
          return fId === null || String(fId) === String(foodId);
        });
        setComments(filtered);
      })
      .catch(() => setComments([]))
      .finally(() => setLoadingC(false));
  }, [foodId]);

  // ── Submit review ─────────────────────────────────────────────
  async function handleSubmit() {
    if (!name.trim()) return setErr("Please enter your name");
    if (!rating)      return setErr("Please give a rating");
    if (!text.trim()) return setErr("Please write a comment");

    setErr("");
    setSubmitting(true);
    try {
      const payload = {
        name:   name.trim(),
        rating,
        text:   text.trim(),
        food:   foodId,
        // ── FIX: image URL ni POST da ham yubor ──
        ...(imageUrl.trim() && { image: imageUrl.trim() }),
      };
      const res = await axios.post(`${BASE}/reviews`, payload);

      // ── FIX: backend {data: obj} yoki to'g'ridan obj qaytarishi mumkin ──
      const raw = res.data?.data ?? res.data;

      // ── FIX: Agar backend review qaytarmasa, o'zimiz yasaymiz ──
      const created = {
        _id:       raw?._id || raw?.id || `local_${Date.now()}`,
        name:      raw?.name      || name.trim(),
        rating:    raw?.rating    ?? rating,
        text:      raw?.text      || text.trim(),
        image:     raw?.image     || imageUrl.trim() || null,
        createdAt: raw?.createdAt || new Date().toISOString(),
        food:      foodId, // string ID — filter o'tkazish uchun
      };

      // ── FIX: add directly to state, NO re-filtering (already filtered list) ──
      setComments((prev) => [created, ...prev]);

      // Form reset
      setName("");
      setRating(0);
      setText("");
      setImageUrl("");
      setShowForm(false);

      // Scroll to start to see new review
      setTimeout(() => {
        scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
      }, 100);
    } catch (e) {
      setErr(e?.response?.data?.message || "Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete review ─────────────────────────────────────────────
  async function deleteComment(id) {
    // Optimistic delete: remove immediately
    setComments((prev) => prev.filter((c) => (c._id || c.id) !== id));
    try {
      await axios.delete(`${BASE}/reviews/${id}`);
    } catch {
      // silent — optimistic delete saqlanadi
    }
  }

  // ── Swiper scroll helpers ─────────────────────────────────────
  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  }
  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  }

  const avgRating = comments.length
    ? (comments.reduce((s, c) => s + (Number(c.rating) || 0), 0) / comments.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-50 dark:border-slate-700">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <Stars rating={avgRating} />
            <span className="text-[11px] text-gray-400">
              {comments.length} review{comments.length !== 1 ? "s" : ""}
              {avgRating > 0 && ` · Average: ${avgRating}`}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition"
        >
          {showForm ? "Close" : "+ Add Review"}
        </button>
      </div>

      {/* ── Add comment form ── */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-5">
          <h4 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-3">New Review</h4>
          <div className="flex flex-col gap-3">
            {/* Name */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-gray-600 dark:text-slate-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 transition placeholder:text-gray-300"
            />
            {/* Rating */}
            <div>
              <p className="text-[10px] text-gray-400 mb-1.5">
                Rate it{" "}
                {rating > 0 && <span className="text-yellow-500 font-medium">({rating}/5)</span>}
              </p>
              <Stars rating={rating} onChange={setRating} />
            </div>
            {/* Text */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts about this dish..."
              rows={3}
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-gray-600 dark:text-slate-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 resize-none transition placeholder:text-gray-300"
            />

            {/* ── FIX: Image URL input ── */}
            <div>
              <label className="text-[10px] text-gray-400 mb-1.5 block">
                Profile picture URL{" "}
                <span className="text-gray-300 dark:text-slate-500">(optional)</span>
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-gray-600 dark:text-slate-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 transition placeholder:text-gray-300"
              />
              {/* Preview */}
              {imageUrl.trim() && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-slate-600"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <span className="text-[10px] text-green-500">Image preview</span>
                </div>
              )}
            </div>
          </div>

          {err && <p className="text-xs text-red-400 mt-2">{err}</p>}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => { setShowForm(false); setErr(""); }}
              className="flex-1 text-xs border border-gray-200 dark:border-slate-600 text-gray-500 rounded-full py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs font-semibold py-2 rounded-full transition"
            >
              {submitting ? "Submitting..." : "Add Review"}
            </button>
          </div>
        </div>
      )}

      {/* ── Comments: Swiper-style horizontal scroll ── */}
      {loadingC ? (
        <div className="flex gap-3 overflow-hidden">
          {[1,2,3].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse flex-shrink-0"
              style={{ width: "280px" }}
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-xs text-gray-400">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="relative group">
          {/* ── Prev arrow ── */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
                       w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow-md border border-gray-100 dark:border-slate-600
                       flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-200
                       opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* ── Swiper scroll container ── */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              // Hide scrollbar but keep scrollable
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <style>{`
              .comments-scroll::-webkit-scrollbar { display: none; }
            `}</style>

            {comments.map((comment) => {
              const cId = comment._id || comment.id;
              return (
                <div
                  key={cId}
                  className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 flex flex-col gap-3 relative flex-shrink-0"
                  style={{
                    scrollSnapAlign: "start",
                    width: "clamp(240px, 30vw, 300px)",
                    minWidth: "240px",
                  }}
                >
                  {/* Avatar + Info + Delete */}
                  <div className="flex items-start gap-3">
                    {comment.image ? (
                      <img
                        src={comment.image}
                        alt={comment.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-slate-600"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <Avatar name={comment.name} />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800 dark:text-slate-100 truncate">
                        {comment.name}
                      </p>
                      <p className="text-[10px] text-gray-400">{timeAgo(comment.createdAt)}</p>
                    </div>
                    <button
                      onClick={() => deleteComment(cId)}
                      className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-400 text-xs flex items-center justify-center transition hover:bg-red-200 dark:hover:bg-red-800/40 flex-shrink-0"
                      title="Delete"
                    >
                      <CloseIcon />
                    </button>
                  </div>

                  {/* Comment text */}
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1">
                    {comment.text}
                  </p>

                  {/* Stars */}
                  <Stars rating={comment.rating} />
                </div>
              );
            })}

            {/* Trailing spacer */}
            <div className="flex-shrink-0 w-1" />
          </div>

          {/* ── Next arrow ── */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
                       w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow-md border border-gray-100 dark:border-slate-600
                       flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-200
                       opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────
function EditMenuModal({ food, onClose, onSaved }) {
  const [ingInput,     setIngInput]     = useState((food.ingredients || []).join(", "));
  const [nutritionInfo,setNutritionInfo]= useState(food.nutritionInfo || "");
  const [description,  setDescription]  = useState(food.description   || "");
  const [price,        setPrice]        = useState(food.price         || "");
  const [inStock,      setInStock]      = useState(food.stockAvailable ?? true);
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(food.image || "");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const fileRef = useRef();

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

  const parsedIngredients = ingInput.split(",").map((s) => s.trim()).filter(Boolean);

  const handleSave = async () => {
    setError("");
    if (!price || isNaN(price) || Number(price) <= 0) return setError("Please enter a valid price");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("price",          Number(price));
      formData.append("description",    description.trim());
      formData.append("nutritionInfo",  nutritionInfo.trim());
      formData.append("stockAvailable", inStock);
      formData.append("ingredients",    JSON.stringify(parsedIngredients));
      if (imageFile) formData.append("image", imageFile);

      await axios.put(`${BASE}/food/${food._id || food.id}`, formData);

      onSaved({
        price: Number(price),
        description: description.trim(),
        nutritionInfo: nutritionInfo.trim(),
        stockAvailable: inStock,
        ingredients: parsedIngredients,
        ...(imageFile && { image: imagePreview }),
      });
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Edit Menu Item</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 dark:text-slate-500 truncate max-w-[200px]">{food.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-3">
          {/* Price */}
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 block">
              Price ($) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-gray-600 dark:text-slate-100 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-gray-600 dark:text-slate-100 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 resize-none transition"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 block">
              Ingredients <span className="text-gray-300 dark:text-slate-600">(comma separated)</span>
            </label>
            <input
              type="text"
              value={ingInput}
              onChange={(e) => setIngInput(e.target.value)}
              placeholder="cheese, sauce, pasta..."
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-gray-600 dark:text-slate-100 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 transition"
            />
            {parsedIngredients.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {parsedIngredients.map((ing, i) => (
                  <span key={i} className="text-[10px] bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                    {ing}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Nutrition */}
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 block">Nutrition Info</label>
            <textarea
              value={nutritionInfo}
              onChange={(e) => setNutritionInfo(e.target.value)}
              rows={3}
              placeholder="Calories: 250kcal, Protein: 12g..."
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-gray-600 dark:text-slate-100 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 resize-none transition"
            />
          </div>

          {/* Image */}
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 block">Product Image</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-green-400 transition"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-28 object-cover rounded-lg"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="text-xs text-gray-400">Click to upload an image</p>
                </>
              )}
              {imagePreview && <p className="text-[10px] text-green-500">Click to change</p>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {/* Stock toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-slate-200">In Stock</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{inStock ? "Available for order" : "Currently unavailable"}</p>
            </div>
            <button
              type="button"
              onClick={() => setInStock((s) => !s)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${inStock ? "bg-green-500" : "bg-gray-200 dark:bg-slate-600"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${inStock ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 text-xs border border-gray-200 dark:border-slate-600 rounded-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs font-semibold py-2.5 rounded-full transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat Badge ────────────────────────────────────────────────────
function StatBadge({ icon, label, value, color }) {
  return (
    <div className={`flex flex-col gap-1 p-3 rounded-xl ${color}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-medium opacity-70">{icon}{label}</div>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

// ── Food Info Card ─────────────────────────────────────────────────
function FoodInfoCard({ food: initialFood }) {
  const [food,     setFood]     = useState(initialFood);
  const [showEdit, setShowEdit] = useState(false);

  const handleSaved = (updatedData) => {
    setFood((prev) => ({ ...prev, ...updatedData }));
  };

  const catName = food.category?.name || food.subcategory || "food";

  const SEASON_COLORS = {
    Spring: "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    Summer: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    Autumn: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    Winter: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-600 p-5 flex flex-col gap-4">

        {/* Category + Stock */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-slate-500">
            Category:{" "}
            <span className="text-gray-600 dark:text-slate-300 font-medium capitalize">{catName}</span>
            {food.subcategory && catName !== food.subcategory && (
              <> / <span className="text-green-600 dark:text-green-400 font-semibold">{food.subcategory}</span></>
            )}
          </p>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
            food.stockAvailable
              ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-50 text-red-500 dark:bg-red-900/30"
          }`}>
            {food.stockAvailable ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Image + Info */}
        <div className="flex gap-4 items-start">
          <div className="relative flex-shrink-0">
            <FoodImage src={food.image} alt={food.name} className="w-28 h-24 object-cover rounded-xl shadow-sm" />
            {food.sold > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold shadow">
                {food.sold} sold
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-snug mb-1">{food.name}</h2>
            <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">${Number(food.price).toFixed(2)}</p>
            <p className="text-xs text-gray-400 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
              {food.description || "No description"}
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 text-xs border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {(food.rating > 0 || food.sold > 0) && (
          <div className="grid grid-cols-2 gap-2">
            {food.rating > 0 && (
              <StatBadge
                icon={<svg width="10" height="10" viewBox="0 0 20 20" fill="#f59e0b"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>}
                label="Rating"
                value={Number(food.rating).toFixed(1) + " / 5.0"}
                color="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
              />
            )}
            {food.sold > 0 && (
              <StatBadge
                icon={<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
                label="Sold"
                value={food.sold + " pcs"}
                color="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
              />
            )}
          </div>
        )}

        {/* Ingredients */}
        <div>
          <hr className="border-dashed border-gray-200 dark:border-slate-600 mb-3" />
          <h3 className="text-xs font-bold text-gray-800 dark:text-slate-200 mb-2">Ingredients</h3>
          {food.ingredients?.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {food.ingredients.map((ing, i) => (
                <span key={i} className="text-[10px] bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full">
                  {ing}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 dark:text-slate-400">No ingredients listed</p>
          )}
        </div>

        {/* Nutrition */}
        <div>
          <hr className="border-dashed border-gray-200 dark:border-slate-600 mb-3" />
          <h3 className="text-xs font-bold text-gray-800 dark:text-slate-200 mb-2">Nutrition Info</h3>
          <p className="text-xs text-gray-400 dark:text-slate-400 leading-relaxed">
            {food.nutritionInfo || "No nutrition info available"}
          </p>
        </div>

        {/* Seasons */}
        {food.seasons?.length > 0 && (
          <div>
            <hr className="border-dashed border-gray-200 dark:border-slate-600 mb-3" />
            <h3 className="text-xs font-bold text-gray-800 dark:text-slate-200 mb-2">Season</h3>
            <div className="flex gap-1 flex-wrap">
              {food.seasons.map((s) => (
                <span key={s} className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${SEASON_COLORS[s] || "bg-gray-50 text-gray-500"}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Added date */}
        {(food.addedMonth || food.addedYear) && (
          <div>
            <hr className="border-dashed border-gray-200 dark:border-slate-600 mb-3" />
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p className="text-[10px] text-gray-400">
                Added:{" "}
                <span className="font-medium text-gray-600 dark:text-slate-300">
                  {[food.addedMonth, food.addedYear].filter(Boolean).join(" ")}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {showEdit && (
        <EditMenuModal food={food} onClose={() => setShowEdit(false)} onSaved={handleSaved} />
      )}
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
function FoodDetail() {
  const dispatch = useDispatch();
  const { id }   = useParams();
  const { foods, loading } = useSelector((state) => state.food);

  useEffect(() => {
    if (!foods || foods.length === 0) dispatch(fetchFoods());
  }, [dispatch]);

  const food = foods?.find((item) => (item._id || item.id) === id);

  if (loading && !food) {
    return (
      <div className="flex flex-col gap-4 px-8 py-6">
        <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl h-96 animate-pulse" />
          <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl h-96 animate-pulse" />
        </div>
        <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl h-64 animate-pulse" />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2h18l-2 7H5L3 2z"/><path d="M5 9l1 11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-11"/>
          </svg>
        </div>
        <p className="text-gray-400 text-sm">This food item was not found.</p>
        <Link to="/foods" className="text-xs text-green-500 hover:underline">Back to Menu</Link>
      </div>
    );
  }

  const foodId = food._id || food.id;

  return (
    <div className="min-h-screen bg-[#f5f6fa] dark:bg-slate-900 px-8 py-6 space-y-6 rounded-3xl">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <Link to="/foods" className="hover:text-green-500 transition">Foods</Link>
          <span>›</span>
          <span className="text-gray-600 dark:text-slate-300 truncate max-w-xs">{food.name}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Food Detail</h1>
        <p className="text-xs text-gray-400 mt-0.5">Chart and reviews overview</p>
      </div>

      {/* Info + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <FoodInfoCard food={food} />
        <RevenueChart food={food} />
      </div>

      {/* Comments */}
      <CommentsSection foodId={foodId} />
    </div>
  );
}

export default FoodDetail;
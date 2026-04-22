// CustomerReviews.jsx — to'liq

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, addReview } from "../store/slices/Reviews";

const VISIBLE = 3;

/* ─── Stars display ─── */
function Stars({ rating }) {
  const r = Number(rating) || 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="13" height="13" viewBox="0 0 20 20"
          fill={r >= s ? "#facc15" : "none"}
          stroke={r >= s ? "#facc15" : "#d1d5db"}
          strokeWidth="1.5"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-[10px] text-gray-400 ml-1">{r.toFixed(1)}</span>
    </div>
  );
}

/* ─── Star picker ─── */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = (hovered || value) >= s;
        return (
          <svg key={s}
            width="32" height="32" viewBox="0 0 24 24"
            className="cursor-pointer transition-transform hover:scale-110"
            fill={filled ? "#facc15" : "#e5e7eb"}
            stroke={filled ? "#facc15" : "#e5e7eb"}
            strokeWidth="1"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(s)}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      })}
    </div>
  );
}

/* ─── Avatar ─── */
function Avatar({ name, image }) {
  if (image) {
    return (
      <img src={image} alt={name}
        className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  }
  const init = (name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 ring-2 ring-gray-100">
      <span className="text-xs font-bold text-green-700">{init}</span>
    </div>
  );
}

/* ─── Time ago ─── */
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
}

/* ─── Skeleton ─── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-50 flex flex-col gap-3 animate-pulse dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-100" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-2.5 w-24 bg-gray-100 rounded" />
          <div className="h-2 w-16 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded" />
      <div className="h-2 w-4/5 bg-gray-100 rounded" />
    </div>
  );
}

/* ─── Review Card ─── */
function ReviewCard({ review }) {
  const name    = review.userName || review.user?.name || "Anonymous";
  const userImg = review.userImage || review.user?.image || "";
  const foodImg = review.food?.image || review.foodImage || "";
  const comment = review.comment || review.text || "No comment";
  const time    = timeAgo(review.createdAt) || review.time || "";

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 hover:shadow-md transition-shadow flex flex-col gap-3 dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <Avatar name={name} image={userImg} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-gray-800 truncate dark:text-slate-100">{name}</p>
          <p className="text-[10px] text-gray-400">{time}</p>
        </div>
        {foodImg ? (
          <img src={foodImg} alt="food"
            className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">🍽</div>
        )}
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 dark:text-slate-400">{comment}</p>
      <Stars rating={review.rating} />
    </div>
  );
}

/* ─── Add Review Modal ─── */
function AddReviewModal({ onClose, onAdded, dispatch }) {
  const [name,    setName]    = useState("");
  const [rating,  setRating]  = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // ESC bilan yopish
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!name.trim())    return setError("Please enter your name");
    if (!rating)         return setError("Please select a rating");
    if (!comment.trim()) return setError("Please write a comment");

    setError("");
    setLoading(true);

    const reviewData = {
      userName:  name.trim(),
      rating,
      comment:   comment.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      // Redux thunk orqali POST /api/reviews
      const result = await dispatch(addReview(reviewData));
      onAdded(result.payload);
      onClose();
    } catch {
      onAdded(reviewData);
      onClose();
    } finally {
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
          <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Add a Review</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors dark:border-slate-600 dark:hover:bg-slate-700"
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1.5 block dark:text-slate-400">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full border text-gray-500 border-gray-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 transition-colors dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-2 block dark:text-slate-400">
            Rating {rating > 0 && <span className="text-yellow-400 font-medium">({rating}.0)</span>}
          </label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        {/* Comment */}
        <div className="mb-5">
          <label className="text-xs text-gray-500 mb-1.5 block dark:text-slate-400">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-green-400 resize-none transition-colors dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500 text-gray-500"
          />
        </div>

        {/* Error */}
        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-semibold py-2.5 rounded-full transition-colors"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>

      </div>
    </div>
  );
}

/* ─── Main Component ─── */
function CustomerReviews() {
  const dispatch = useDispatch();
  const { reviews: apiReviews, loading, error } = useSelector((state) => state.reviews);
  const [reviews,   setReviews]   = useState([]);
  const [current,   setCurrent]   = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  useEffect(() => {
    setReviews(apiReviews);
  }, [apiReviews]);

  const total    = reviews.length;
  const maxIndex = Math.max(0, total - VISIBLE);
  const shown    = reviews.slice(current, current + VISIBLE);

  const handleAdded = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setCurrent(0);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 dark:bg-slate-800 dark:border-slate-700">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Customer Review</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {loading ? "Loading..." : `${total} review${total !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white hover:border-green-500 disabled:opacity-30 transition-all dark:border-slate-600"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={() => setCurrent((c) => Math.min(maxIndex, c + 1))}
              disabled={current >= maxIndex}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white hover:border-green-500 disabled:opacity-30 transition-all dark:border-slate-600"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Add button */}
            <button
              onClick={() => setShowModal(true)}
              className="w-8 h-8 rounded-full border-2 border-green-500 bg-green-500 hover:bg-green-600 hover:border-green-600 flex items-center justify-center text-white transition-all hover:scale-105"
              title="Add Review"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Cards */}
        {error ? (
          <p className="text-xs text-red-400 text-center py-6">{error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {loading
              ? [...Array(VISIBLE)].map((_, i) => <SkeletonCard key={i} />)
              : shown.length > 0
                ? shown.map((review, i) => (
                    <ReviewCard key={review._id || review.id || i} review={review} />
                  ))
                : (
                  <p className="col-span-3 text-xs text-gray-400 text-center py-6">
                    No reviews yet. Be the first!
                  </p>
                )
            }
          </div>
        )}

        {/* Dots */}
        {!loading && total > VISIBLE && (
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 border-none cursor-pointer ${
                  i === current ? "bg-green-500 w-5" : "bg-gray-200 w-2"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddReviewModal
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
          dispatch={dispatch}
        />
      )}
    </>
  );
}

export default CustomerReviews;
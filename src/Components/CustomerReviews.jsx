import { useState } from "react";

const REVIEWS = [
  {
    id: 1,
    name: "Johnny Ahmad",
    time: "1 hour ago",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    rating: 4,
  },
  {
    id: 2,
    name: "Maria Vania",
    time: "1 hour ago",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    rating: 4,
  },
  {
    id: 3,
    name: "Sarah Muellerz",
    time: "1 hour ago",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    rating: 4,
  },
];

// Yulduzlarni chizadigan kichik component
function StarRating({ rating }) {
  return (
    <div className="flex gap-1 mt-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Bitta review card
function ReviewCard({ name, time, image, text, rating }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 dark:bg-slate-800 dark:border-slate-700"
      style={{ width: "calc((2000px - 48px) / 3)" }}
    >
      {/* Avatar va ism */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={image}
          alt={name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">{name}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">{time}</p>
        </div>
      </div>

      {/* Review matni */}
      <p className="text-xs text-gray-500 leading-relaxed dark:text-slate-400">{text}</p>

      {/* Yulduzlar */}
      <StarRating rating={rating} />
    </div>
  );
}

// Asosiy CustomerReviews component
function CustomerReviews() {
  return (
    <div style={{ width: "1300px" }} className="mt-8">
      <h2 className="text-base font-bold text-gray-800 dark:text-slate-100 mb-4">
        Customer Reviews
      </h2>

      {/* 3 ta card yonma-yon */}
      <div className="flex gap-6">
        {REVIEWS.map((review) => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </div>
    </div>
  );
}

export default CustomerReviews;
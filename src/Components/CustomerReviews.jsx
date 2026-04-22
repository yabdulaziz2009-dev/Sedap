import React from 'react';

const reviews = [
  {
    id: 1,
    name: 'Jons Sena',
    time: '2 days ago',
    rating: 4.5,
    text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text.",
    img: 'https://i.pravatar.cc/40?img=11',
    food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop',
  },
  {
    id: 2,
    name: 'Sofia',
    time: '5 days ago',
    rating: 4.0,
    text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text.",
    img: 'https://i.pravatar.cc/40?img=5',
    food: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop',
  },
  {
    id: 3,
    name: 'Anandreansyah',
    time: '7 days ago',
    rating: 4.5,
    text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text.",
    img: 'https://i.pravatar.cc/40?img=8',
    food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&h=80&fit=crop',
  },
  {
    id: 4,
    name: 'Marcus Lee',
    time: '1 week ago',
    rating: 5.0,
    text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text.",
    img: 'https://i.pravatar.cc/40?img=12',
    food: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    time: '2 weeks ago',
    rating: 3.5,
    text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text.",
    img: 'https://i.pravatar.cc/40?img=9',
    food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop',
  },
];

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => {
      const filled = rating >= star;
      return (
        <svg
          key={star}
          width="12"
          height="12"
          viewBox="0 0 20 20"
          fill={filled ? '#facc15' : 'none'}
          stroke={filled ? '#facc15' : '#d1d5db'}
          strokeWidth="1.5"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    })}
    <span className="text-[10px] text-gray-500 ml-1 font-medium">{rating.toFixed(1)}</span>
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-3 mb-3">
        <img src={review.img} alt={review.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100" />
        <div>
          <p className="text-xs font-bold text-gray-800">{review.name}</p>
          <p className="text-[10px] text-gray-400">{review.time}</p>
        </div>
        <div className="ml-auto">
          <img src={review.food} alt="food" className="w-12 h-12 rounded-xl object-cover" />
        </div>
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3">{review.text}</p>
    </div>
    <div className="mt-3">
      <Stars rating={review.rating} />
    </div>
  </div>
);

const CustomerReviews = () => {
  const [current, setCurrent] = React.useState(0);
  const visible = 3;
  const total = reviews.length;

  const prev = () => setCurrent(c => (c === 0 ? total - visible : c - 1));
  const next = () => setCurrent(c => (c >= total - visible ? 0 : c + 1));

  const shown = [];
  for (let i = 0; i < visible; i++) {
    shown.push(reviews[(current + i) % total]);
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Customer Review</h3>
          <p className="text-[10px] text-gray-400">Eum fuga consequuntur oladign et.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={next}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {shown.map((review) => (
          <ReviewCard key={review.id + '-' + current} review={review} />
        ))}
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: total - visible + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-5' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;

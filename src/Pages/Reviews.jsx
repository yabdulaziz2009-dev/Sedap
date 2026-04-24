import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Star, ChevronDown, Calendar, ChevronLeft, ChevronRight, Tag, Loader2 } from 'lucide-react';

// Swiper uslublari
import 'swiper/css';

const RestaurantDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4); // Load More uchun
  const [loading, setLoading] = useState(true);
  
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    fetch('https://sedab-backend.onrender.com/api/reviews')
      .then(res => res.json())
      .then(data => {
        const result = Array.isArray(data) ? data : (data.data || []);
        // Agar ma'lumot kam bo'lsa, slider chiroyli chiqishi uchun ko'paytiramiz
        setReviews(result.length < 5 ? [...result, ...result, ...result] : result);
        setLoading(false);
      })
      .catch(err => {
        console.error("Xatolik:", err);
        setLoading(false);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8F9FD]">
        <Loader2 className="w-12 h-12 text-[#10B981] animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FD] min-h-screen p-4 md:p-10 font-sans">
      <div className="max-w-[1300px] mx-auto">
        
        {/* --- HEADER & DATE FILTER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1F2937] tracking-tight">Reviews</h1>
            <p className="text-sm mt-1">
              <span className="text-[#10B981] font-bold">Dashboard</span> 
              <span className="text-gray-400"> / Customer Reviews</span>
            </p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-[20px] shadow-sm border border-gray-50 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="bg-[#E6F6FE] p-2.5 rounded-xl text-[#0EA5E9]">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Filter Periode</p>
              <p className="text-[14px] font-black text-[#1F2937]">17 April 2020 - 21 May 2020</p>
            </div>
            <ChevronDown size={20} className="ml-4 text-gray-300" />
          </div>
        </div>

        {/* --- TOP SLIDER SECTION --- */}
        <div className="relative mb-20">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1100: { slidesPerView: 3 },
            }}
          >
            {reviews.slice(0, 6).map((item, idx) => (
              <SwiperSlide key={idx} className="pt-12">
                <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col h-full relative">
                  
                  {/* Floating Dish Image */}
                  <div className="absolute -top-12 left-10 w-28 h-28 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-white">
                    <img 
                      src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop&sig=${idx}`} 
                      className="w-full h-full object-cover" 
                      alt="dish" 
                    />
                  </div>

                  <div className="mt-14">
                    <h3 className="font-black text-lg leading-tight text-[#1F2937]">
                      {item.dishName || "Chicken Curry Special with Cucumber"}
                    </h3>
                    <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[2px] mt-2 block">MAIN COURSE</p>
                    
                    <div className="w-12 h-[2px] bg-gray-100 my-5" />
                    
                    <p className="text-sm text-gray-500 leading-relaxed italic line-clamp-3">
                      "{item.comment || "Fast, professional and friendly service, we ordered the six course tasting menu and every dish was spectacular..."}"
                    </p>
                  </div>

                  {/* Dark User Footer */}
                  <div className="bg-[#526282] rounded-[28px] p-5 mt-10 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/100?u=${item.name}`} className="w-11 h-11 rounded-full border-2 border-white/20" alt="user" />
                      <div>
                        <h4 className="text-white font-bold text-[13px]">{item.name || "Roberto Jr."}</h4>
                        <p className="text-[10px] text-white/50">{item.profession || "Graphic Design"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#FFB800] text-white px-3.5 py-1.5 rounded-full shadow-md">
                      <Star size={14} className="fill-white stroke-none" />
                      <span className="font-black text-sm">4.5</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Slayder tugmalari (Siz so'ragan yashil tugmalar) */}
          <div className="flex justify-end gap-3 mt-8 pr-4">
            <button ref={prevRef} className="w-11 h-11 rounded-xl bg-[#E6F6F2] flex items-center justify-center text-[#10B981] hover:bg-[#10B981] hover:text-white transition-all duration-300">
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <button ref={nextRef} className="w-11 h-11 rounded-xl bg-[#E6F6F2] flex items-center justify-center text-[#10B981] hover:bg-[#10B981] hover:text-white transition-all duration-300">
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* --- OTHERS REVIEW LIST SECTION --- */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-2xl font-black text-[#1F2937]">Others review</h2>
              <p className="text-sm text-gray-400 mt-1 font-medium">Here is customer review about your restaurant</p>
            </div>
            
            {/* Latest Filter Button */}
            <button className="flex items-center gap-3 bg-[#E6F0F8] px-5 py-3 rounded-2xl text-[13px] font-black text-[#4B5E7F] hover:bg-[#D9E6F2] transition-colors">
              Latest <ChevronDown size={18} />
            </button>
          </div>

          {/* List of Reviews */}
          <div className="space-y-12">
            {reviews.slice(0, visibleCount).map((rev, i) => (
              <div key={i} className="flex flex-col lg:flex-row gap-8 pb-12 border-b border-gray-50 last:border-0 relative group">
                <img src={`https://i.pravatar.cc/150?u=${rev._id || i}`} className="w-14 h-14 rounded-full object-cover shadow-md group-hover:scale-110 transition-transform" alt="user" />
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <div>
                      <h4 className="font-black text-[#1F2937] text-lg">{rev.name || "James Kowalski"}</h4>
                      <p className="text-[11px] text-gray-400 font-black uppercase tracking-[1.5px] mt-1">
                        {rev.profession || "Head Marketing"} • <span className="normal-case font-bold text-gray-300">24 June 2020</span>
                      </p>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                       <span className="bg-[#EBF9F4] text-[#10B981] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter">Good Services</span>
                       <span className="bg-[#F0F5FA] text-[#3B82F6] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter">Good Places</span>
                       <span className="bg-[#FFF1F1] text-[#F87171] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter">Excellent</span>
                    </div>
                  </div>
                  
                  <p className="text-[14px] text-gray-500 leading-relaxed max-w-4xl pr-10">
                    {rev.comment || "We recently had dinner with friends at David CC and we all walked away with a great experience. Good food, pleasant environment, personal attention through all the evening. Thanks to the team and we will be back!"}
                  </p>
                </div>

                {/* Rating Block */}
                <div className="lg:w-32 flex flex-col items-center justify-center bg-[#F8F9FD] rounded-[24px] p-5 self-center lg:self-start">
                   <span className="text-3xl font-black text-[#1F2937]">3.5</span>
                   <div className="flex gap-0.5 mt-2">
                     {[...Array(5)].map((_, sIdx) => (
                       <Star key={sIdx} size={13} className={sIdx < 4 ? "fill-[#FFB800] text-[#FFB800]" : "text-gray-200"} />
                     ))}
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button (Siz so'ragan ko'k tugma) */}
          {visibleCount < reviews.length && (
            <div className="mt-16 text-center">
              <button 
                onClick={handleLoadMore}
                className="flex items-center justify-center gap-3 bg-[#3B82F6] hover:bg-blue-600 transition-all text-white font-black py-5 px-14 rounded-[24px] shadow-xl shadow-blue-200 active:scale-95 mx-auto"
              >
                Load More <ChevronDown size={22} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RestaurantDashboard;
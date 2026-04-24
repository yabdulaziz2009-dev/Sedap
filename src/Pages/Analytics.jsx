
import StatsCards from '../Components/StatsCards';
import TotalRevenue from '../Components/TotalRevenue';
import ChartOrder from '../Components/ChartOrder';
import PieChartSection from '../Components/PieChartSection';
import CustomerMap from '../Components/CustomerMap';
import CustomerReviews from '../Components/CustomerReviews';

const trendingItems = [
  { rank: 1, name: 'Chicken Burger', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=60&h=60&fit=crop', sales: 320, up: true },
  { rank: 2, name: 'Veggie Pizza', img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=60&h=60&fit=crop', sales: 280, up: false },
  { rank: 3, name: 'Cheese Pasta', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=60&h=60&fit=crop', sales: 210, up: true },
];

const mostSelling = [
  { name: 'Chicken Burger', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=40&h=40&fit=crop', price: '$12.99' },
  { name: 'Veggie Pizza', img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=40&h=40&fit=crop', price: '$10.99' },
  { name: 'Cheese Pasta', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=40&h=40&fit=crop', price: '$9.99' },
];

const favouriteItems = [
  { name: 'Chicken Burger', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop', rating: 4.8 },
  { name: 'Veggie Pizza', img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=100&h=100&fit=crop', rating: 4.7 },
  { name: 'Cheese Pasta', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop', rating: 4.6 },
  { name: 'French Fries', img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=100&h=100&fit=crop', rating: 4.5 },
];

const Analytics = () => {
  return (
    <div className="flex gap-6 w-full">
      {/* Main Section */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Top: Stats and Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-6">
            <StatsCards />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TotalRevenue />
              <ChartOrder />
            </div>
          </div>
          {/* Right Panel: Most Selling Items */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-gray-50 min-w-[260px] flex flex-col gap-4">
            <h3 className="text-base font-bold text-gray-800 mb-2">Most Selling Items</h3>
            <ul className="flex flex-col gap-4">
              {mostSelling.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <img src={item.img} alt={item.name} className="w-10 h-10 rounded-xl object-cover shadow" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle: Trending Items */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-gray-50 flex flex-col gap-4">
          <h3 className="text-base font-bold text-gray-800 mb-2">Trending Items</h3>
          <ul className="flex gap-6">
            {trendingItems.map((item) => (
              <li key={item.rank} className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-400 w-8 text-center">{item.rank}</span>
                <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover shadow" />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700 text-sm">{item.name}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${item.up ? 'text-green-500' : 'text-red-500'}`}>{item.up ? '▲' : '▼'} {item.sales}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: Most Favourite Items */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-gray-50">
          <h3 className="text-base font-bold text-gray-800 mb-4">Most Favourite Items</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {favouriteItems.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white rounded-2xl p-4 shadow group hover:shadow-lg transition-all">
                <img src={item.img} alt={item.name} className="w-20 h-20 rounded-xl object-cover mb-3 shadow" />
                <span className="font-semibold text-gray-700 text-center">{item.name}</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400 font-bold">★</span>
                  <span className="text-xs font-medium text-gray-500">{item.rating}</span>
                </div>
                <button className="mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-600 text-xs font-semibold shadow hover:from-green-200 hover:to-green-300 transition-all">Like</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel: Pie Chart, Customer Map, Reviews */}
      <div className="flex flex-col gap-6 w-[340px] max-w-[340px]">
        <PieChartSection />
        <CustomerMap />
        <CustomerReviews />
      </div>
    </div>
  );
};

export default Analytics;

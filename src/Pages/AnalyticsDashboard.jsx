import React from "react";

const AnalyticsDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-gray-500">Here is your restaurant summary with graph view</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Chart Orders */}
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Chart Orders</h3>
              <div>
                <button className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-600 mr-2">Monthly</button>
                <button className="px-3 py-1 text-xs rounded hover:bg-blue-50">Weekly</button>
                <button className="px-3 py-1 text-xs rounded hover:bg-blue-50">Daily</button>
              </div>
            </div>
            <div className="flex gap-8 mb-4">
              <div>
                <div className="text-2xl font-bold">257K</div>
                <div className="text-gray-400 text-xs">Total Sales</div>
              </div>
              <div>
                <div className="text-2xl font-bold">1,245</div>
                <div className="text-gray-400 text-xs">Active Orders</div>
              </div>
            </div>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              {/* Placeholder for Chart */}
              Chart
            </div>
          </div>

          {/* Trending Items */}
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Trending Items</h3>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Weekly</span>
            </div>
            <ul>
              <li className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span>#1 Tuna soup spinach with himalaya salt</span>
                <span className="font-bold">524</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span>#2 Chicken curry special with cucumber</span>
                <span className="font-bold">215</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span>#3 Italiano pizza mozzarella with garlic</span>
                <span className="font-bold">120</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span>#4 Watermelon mix chocolate juice with ice</span>
                <span className="font-bold">76</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Most Selling Items */}
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Most Selling Items</h3>
              <div>
                <button className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-600 mr-2">Monthly</button>
                <button className="px-3 py-1 text-xs rounded hover:bg-blue-50">Weekly</button>
                <button className="px-3 py-1 text-xs rounded hover:bg-blue-50">Daily</button>
              </div>
            </div>
            <ul>
              <li className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span>Medium Spicy Spaghetti Italiano</span>
                <span className="font-bold">$12.56</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span>Pizza Meal for Kids (Small size)</span>
                <span className="font-bold">$5.67</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span>Supreme Pizza With Beef Topping</span>
                <span className="font-bold">$11.21</span>
              </li>
            </ul>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Revenue</h3>
              <div>
                <button className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-600 mr-2">Monthly</button>
                <button className="px-3 py-1 text-xs rounded hover:bg-blue-50">Weekly</button>
                <button className="px-3 py-1 text-xs rounded hover:bg-blue-50">Daily</button>
              </div>
            </div>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              {/* Placeholder for Revenue Chart */}
              Revenue Chart
            </div>
          </div>
        </div>
      </div>

      {/* Most Favourite Items */}
      <div className="bg-white rounded-xl p-6 shadow mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Most Favourite Items</h3>
          <div>
            <button className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-600 mr-2">Monthly</button>
            <button className="px-3 py-1 text-xs rounded hover:bg-blue-50">Weekly</button>
            <button className="px-3 py-1 text-xs rounded hover:bg-blue-50">Daily</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mb-2"></div>
            <span className="text-center text-sm">Medium Spicy Pizza with Kemangi Leaf</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mb-2"></div>
            <span className="text-center text-sm">Chicken Curry Specials With Cucumber</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mb-2"></div>
            <span className="text-center text-sm">Watermelon Mix Chocolate Juice with Ice</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mb-2"></div>
            <span className="text-center text-sm">Italiano Pizza with mozzarella Spicy</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mb-2"></div>
            <span className="text-center text-sm">Burger Jumbo la Pizza with Barbeque</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mb-2"></div>
            <span className="text-center text-sm">Bread Fried with Nuggets Specials</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

import React from 'react';
import { Download } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { day: 'Sunday', orders: 180 },
  { day: 'Monday', orders: 320 },
  { day: 'Tuesday', orders: 260 },
  { day: 'Wednesday', orders: 496 },
  { day: 'Thursday', orders: 310 },
  { day: 'Friday', orders: 420 },
  { day: 'Saturday', orders: 280 },
];

const ChartOrder = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Chart Order</h3>
          <p className="text-[10px] text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
          <Download size={12} />
          Save Report
        </button>
      </div>

      {/* Tooltip label */}
      <div className="flex justify-end mb-2">
        <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-md">496 Order</span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#bbb' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#bbb' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: 11 }}
            labelStyle={{ color: '#2d3436', fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#6C5CE7"
            strokeWidth={2.5}
            fill="url(#orderGradient)"
            dot={{ r: 3, fill: '#6C5CE7', strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartOrder;

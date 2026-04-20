import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, MoreVertical } from 'lucide-react';

const data = [
  { day: 'Sun', val1: 55, val2: 45 },
  { day: 'Mon', val1: 70, val2: 35 },
  { day: 'Tue', val1: 40, val2: 60 },
  { day: 'Wed', val1: 80, val2: 55 },
  { day: 'Thu', val1: 35, val2: 70 },
  { day: 'Fri', val1: 65, val2: 45 },
  { day: 'Sat', val1: 50, val2: 40 },
];

const CustomerMap = () => {
  const [period, setPeriod] = useState('Weekly');

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 w-64 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800">Customer Map</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-xs font-medium text-primary border border-primary/30 px-2 py-1 rounded-lg hover:bg-primary/5">
            {period}
            <ChevronDown size={12} />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barGap={3} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#bbb' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: '#bbb' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: 11 }}
          />
          <Bar dataKey="val1" fill="#6C5CE7" radius={[4, 4, 0, 0]} maxBarSize={12} />
          <Bar dataKey="val2" fill="#fdcb6e" radius={[4, 4, 0, 0]} maxBarSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerMap;

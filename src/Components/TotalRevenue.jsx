import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const data = [
  { month: 'Jan', y2022: 310, y2021: 150 },
  { month: 'Feb', y2022: 280, y2021: 200 },
  { month: 'Mar', y2022: 200, y2021: 280 },
  { month: 'Apr', y2022: 250, y2021: 350 },
  { month: 'May', y2022: 180, y2021: 400 },
  { month: 'Jun', y2022: 300, y2021: 370 },
  { month: 'Jul', y2022: 350, y2021: 320 },
  { month: 'Aug', y2022: 290, y2021: 280 },
  { month: 'Sept', y2022: 260, y2021: 240 },
  { month: 'Oct', y2022: 340, y2021: 310 },
  { month: 'Nov', y2022: 390, y2021: 280 },
  { month: 'Dec', y2022: 420, y2021: 260 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: ${p.value}k
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TotalRevenue = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800">Total Revenue</h3>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="w-6 h-0.5 bg-primary rounded inline-block" />
            2022
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="w-6 h-0.5 bg-red-400 rounded inline-block" />
            2021
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#bbb' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: '#bbb' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="y2022"
            name="2022"
            stroke="#6C5CE7"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#6C5CE7' }}
          />
          <Line
            type="monotone"
            dataKey="y2021"
            name="2021"
            stroke="#e17055"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#e17055' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalRevenue;

import React from 'react';
import { MoreVertical } from 'lucide-react';
import DonutChart from './DonutChart';

const PieChartSection = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-gray-800">Pie Chart</h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
            <input type="checkbox" className="accent-primary w-3 h-3" />
            Chart
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-red-500 w-3 h-3" />
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />
            Show Value
          </label>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="flex items-center justify-around">
        <DonutChart percentage={81} color="#6C5CE7" label="Total Order" />
        <DonutChart percentage={22} color="#00b894" label="Customer Growth" />
        <DonutChart percentage={62} color="#fdcb6e" label="Total Revenue" />
      </div>
    </div>
  );
};

export default PieChartSection;

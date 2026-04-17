import React from 'react';
import { ShoppingBag, Truck, XCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const stats = [
  {
    label: 'Total Orders',
    value: '75',
    change: '+1.56 lorem',
    up: true,
    icon: ShoppingBag,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
    badge: 'bg-orange-500',
  },
  {
    label: 'Total Delivered',
    value: '357',
    change: '+1.56 lorem',
    up: true,
    icon: Truck,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-500',
    badge: 'bg-teal-500',
  },
  {
    label: 'Total Cancelled',
    value: '65',
    change: '-20.56 lorem',
    up: false,
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    badge: 'bg-red-500',
  },
  {
    label: 'Total Revenue',
    value: '$128',
    change: '+1.56 lorem',
    up: true,
    icon: DollarSign,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    badge: 'bg-purple-600',
  },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0 relative`}>
              <Icon size={22} className={s.iconColor} strokeWidth={1.8} />
              <span className={`absolute -top-1 -right-1 w-4 h-4 ${s.badge} rounded-full flex items-center justify-center`}>
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-800 leading-tight">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium truncate">{s.label}</p>
              <p className={`text-[10px] mt-0.5 font-medium flex items-center gap-0.5 ${s.up ? 'text-green-500' : 'text-red-500'}`}>
                {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {s.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

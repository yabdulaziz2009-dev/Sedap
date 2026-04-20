import React, { useEffect, useState, useCallback } from 'react'
import {
  PieChart, Pie, Cell,
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';

const apiurl = import.meta.env.VITE_API_URL;

// ── Donut (halqa) grafik ──────────────────────────────────────────────────────
// value=foiz (0-100), color=rang, label=nom
function DonutChart({ value, color, label }) {
  const safe = Math.min(Math.max(Number(value) || 0, 0), 100);
  const data = [{ value: safe }, { value: 100 - safe }]; // to'lgan + bo'sh qism
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <PieChart width={96} height={96}>
          <Pie data={data} cx={44} cy={44} innerRadius={30} outerRadius={44}
            startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
            <Cell fill={color} />      {/* to'lgan qism */}
            <Cell fill="#f1f5f9" />    {/* bo'sh qism */}
          </Pie>
        </PieChart>
        {/* Markazdagi foiz yozuvi */}
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">
          {safe}%
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-600 text-center">{label}</p>
    </div>
  );
}

// ── Yuklanish animatsiyasi (skeleton) ─────────────────────────────────────────
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

// ── Statistika kartasi ────────────────────────────────────────────────────────
const ICONS  = ['🧾', '💰', '✅', '❌'];
const COLORS = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100'];

function StatCard({ name, count, index, loading }) {
  // Yuklanayotganda skeleton ko'rsatamiz
  if (loading) return (
    <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-5 w-[23%]">
      <Skeleton className="w-14 h-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-5 w-[23%] hover:shadow-md transition-shadow">
      <div className={`${COLORS[index]} w-14 h-14 rounded-full flex items-center justify-center text-2xl`}>
        {ICONS[index]}
      </div>
      <div>
        {/* Revenue bo'lsa dollar belgisi qo'shamiz */}
        <p className="text-3xl font-bold text-gray-800">
          {name === 'Revenue' ? `$${count?.toLocaleString()}` : count?.toLocaleString()}
        </p>
        <p className="text-gray-400 text-sm">{name}</p>
        <p className="text-green-500 text-xs mt-1">↑ 4% (30 days)</p>
      </div>
    </div>
  );
}

// ── Asosiy komponent ──────────────────────────────────────────────────────────
const Home = () => {
  // Har bir bo'lim uchun data va loading holati
  const [stats,        setStats]        = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pieData,      setPieData]      = useState([]);
  const [pieLoading,   setPieLoading]   = useState(true);
  const [orderData,    setOrderData]    = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [revenueData,  setRevenueData]  = useState([]);
  const [revLoading,   setRevLoading]   = useState(true);
  const [customerData, setCustomerData] = useState([]);
  const [custLoading,  setCustLoading]  = useState(true);
  const [reviews,      setReviews]      = useState([]);
  const [revLoading2,  setRevLoading2]  = useState(true);

  // useCallback — funksiya har render da qayta yaratilmasligi uchun
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res  = await fetch(`${apiurl}/Dashboard`);
      const json = await res.json();
      const d    = json.data ?? json; // json.data bo'lmasa json o'zi olinadi
      setStats([
        { id: 1, name: 'Total Orders', count: Number(d.totalOrders)     || 0 },
        { id: 2, name: 'Revenue',      count: Number(d.totalRevenue)    || 0 },
        { id: 3, name: 'Ready',        count: Number(d.readyOrders)     || 0 },
        { id: 4, name: 'Cancelled',    count: Number(d.cancelledOrders) || 0 },
      ]);
    } catch (e) { console.error(e); }
    finally     { setStatsLoading(false); }
  }, []);

  const fetchPie = useCallback(async () => {
    setPieLoading(true);
    try {
      const res  = await fetch(`${apiurl}/Dashboard/PieChart`);
      const json = await res.json();
      const d    = json.data ?? json;
      setPieData([
        { name: 'Total Order',     value: Number(d.totalOrderPercent)     || 0, color: '#ef4444' },
        { name: 'Customer Growth', value: Number(d.customerGrowthPercent) || 0, color: '#10b981' },
        { name: 'Total Revenue',   value: Number(d.totalRevenuePercent)   || 0, color: '#3b82f6' },
      ]);
    } catch (e) { console.error(e); }
    finally     { setPieLoading(false); }
  }, []);

  // Quyidagi fetch lar ham xuddi shunday ishlaydi — API → json → state
  const fetchOrderChart = useCallback(async () => {
    setOrderLoading(true);
    try {
      const res  = await fetch(`${apiurl}/Dashboard/OrderChart`);
      const json = await res.json();
      const raw  = json.data ?? json;
      setOrderData(Array.isArray(raw) ? raw : []); // array bo'lmasa bo'sh array
    } catch (e) { console.error(e); }
    finally     { setOrderLoading(false); }
  }, []);

  const fetchRevenue = useCallback(async () => {
    setRevLoading(true);
    try {
      const res  = await fetch(`${apiurl}/Dashboard/RevenueChart`);
      const json = await res.json();
      const raw  = json.data ?? json;
      setRevenueData(Array.isArray(raw) ? raw : []);
    } catch (e) { console.error(e); }
    finally     { setRevLoading(false); }
  }, []);

  const fetchCustomer = useCallback(async () => {
    setCustLoading(true);
    try {
      const res  = await fetch(`${apiurl}/Dashboard/CustomerMap`);
      const json = await res.json();
      const raw  = json.data ?? json;
      setCustomerData(Array.isArray(raw) ? raw : []);
    } catch (e) { console.error(e); }
    finally     { setCustLoading(false); }
  }, []);

  const fetchReviews = useCallback(async () => {
    setRevLoading2(true);
    try {
      const res  = await fetch(`${apiurl}/Dashboard/CustomerReviews`);
      const json = await res.json();
      const raw  = json.data ?? json;
      setReviews(Array.isArray(raw) ? raw : []);
    } catch (e) { console.error(e); }
    finally     { setRevLoading2(false); }
  }, []);

  // Komponent birinchi yuklanganda barcha fetch lar chaqiriladi
  useEffect(() => {
    fetchStats();
    fetchPie();
    fetchOrderChart();
    fetchRevenue();
    fetchCustomer();
    fetchReviews();
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen">

      {/* ── Header ── */}
      <div className="w-full flex items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Hi, Samantha. Welcome back to Sedap Admin!</p>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center w-10 h-10 bg-sky-50 rounded-xl">
            <svg className="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/>
              <line x1="8"  y1="2" x2="8"  y2="6" strokeLinecap="round"/>
              <line x1="3"  y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Filter Periode</p>
            <p className="text-xs text-slate-400">17 April 2020 – 21 May 2020</p>
          </div>
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      {/* ── Stat kartalar ── */}
      <div className="flex justify-between mt-5 px-6 gap-4">
        {statsLoading
          ? Array(4).fill(0).map((_, i) => <StatCard key={i} index={i} loading />)
          : stats.map((item, i) => <StatCard key={item.id} {...item} index={i} loading={false} />)
        }
      </div>

      {/* ── Grafiklar (2x2 grid) ── */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-4">

        {/* 1. Pie Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Pie Chart</h2>
            <div className="flex gap-3 text-xs text-slate-500">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" readOnly /> Chart</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-red-500" readOnly /> Show Value</label>
            </div>
          </div>
          {pieLoading
            ? <div className="flex justify-around">{[0,1,2].map(i => <Skeleton key={i} className="w-24 h-24 rounded-full" />)}</div>
            : <div className="flex justify-around">{pieData.map((d, i) => <DonutChart key={i} {...d} />)}</div>
          }
        </div>

        {/* 2. Chart Order — Area grafik */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-base font-bold text-slate-800">Chart Order</h2>
              <p className="text-xs text-slate-400">Lorem ipsum dolor sit amet</p>
            </div>
            <button className="border border-blue-500 text-blue-500 text-xs px-3 py-1.5 rounded-full hover:bg-blue-50 transition">
              ↓ Save Report
            </button>
          </div>
          {orderLoading ? <Skeleton className="h-40 w-full mt-2" /> : (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={orderData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" fill="url(#grad)" strokeWidth={2} dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 3. Total Revenue — Line grafik */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Total Revenue</h2>
            <div className="flex gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/> 2020</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/> 2021</span>
            </div>
          </div>
          {revLoading ? <Skeleton className="h-52 w-full" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `$${(v/1000).toFixed(0)}0k`}/>
                <Tooltip formatter={v => `$${Number(v).toLocaleString()}`} contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
                <Line type="monotone" dataKey="y2020" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }}/>
                <Line type="monotone" dataKey="y2021" stroke="#f87171" strokeWidth={2} dot={{ r: 3, fill: '#f87171' }}/>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 4. Customer Map — Bar grafik */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Customer Map</h2>
            <button className="border border-slate-200 text-xs px-3 py-1 rounded-lg">Weekly ▼</button>
          </div>
          {custLoading ? <Skeleton className="h-52 w-full" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={customerData} barCategoryGap="30%">
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
                <Bar dataKey="red"    fill="#f87171" radius={[4,4,0,0]}/>
                <Bar dataKey="yellow" fill="#facc15" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* ── Customer Reviews ── */}
      <div className="px-6 mt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Customer Review</h2>
            <p className="text-xs text-slate-400">Eum fuga consequatur aliquip sit</p>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">‹</button>
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">›</button>
          </div>
        </div>

        {revLoading2 ? (
          // Yuklanayotganda 3 ta skeleton karta
          <div className="grid grid-cols-3 gap-4">
            {[0,1,2].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No reviews yet</p>
        ) : (
          // Review kartalar — max 3 ta ko'rsatiladi
          <div className="grid grid-cols-3 gap-4">
            {reviews.slice(0, 3).map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  {/* Rasm bo'lsa ko'rsatamiz, bo'lmasa ismning bosh harfi */}
                  {r.image
                    ? <img src={r.image} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                    : <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">{(r.name ?? '?')[0]}</div>
                  }
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.date}</p>
                  </div>
                  {r.foodImage && <img src={r.foodImage} alt="food" className="ml-auto w-12 h-12 rounded-xl object-cover" />}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">{r.text ?? r.comment}</p>
                {/* Yulduzcha reytingi */}
                <div className="flex items-center gap-1 mt-3">
                  {Array(5).fill(0).map((_, s) => (
                    <span key={s} className={`text-sm ${s < Math.round(r.rating) ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
                  ))}
                  <span className="text-xs text-slate-500 ml-1">{Number(r.rating).toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const API = "https://sedab-backend.onrender.com/api/customers";

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const FOOD_DATA = {
  monthly: [
    { icon: "🍝", name: "Medium Spicy Spaghetti Italiano", tag: "SPAGHETTI", meta: "Serves 4 Persons · 24 mins", price: "$12.56" },
    { icon: "🍕", name: "Crispy Thin Crust Margherita",    tag: "PIZZA",     meta: "Serves 2 Persons · 18 mins", price: "$14.20" },
    { icon: "🍔", name: "Classic Double Smash Burger",     tag: "BURGER",    meta: "Serves 1 Person · 12 mins",  price: "$10.99" },
    { icon: "🥗", name: "Garden Fresh Caesar Salad",       tag: "SALAD",     meta: "Serves 2 Persons · 10 mins", price: "$8.75"  },
    { icon: "🍜", name: "Spicy Tom Yum Noodle Soup",       tag: "NOODLES",   meta: "Serves 2 Persons · 20 mins", price: "$11.30" },
  ],
  weekly: [
    { icon: "🍔", name: "Classic Double Smash Burger",     tag: "BURGER",    meta: "Serves 1 Person · 12 mins",  price: "$10.99" },
    { icon: "🍝", name: "Medium Spicy Spaghetti Italiano", tag: "SPAGHETTI", meta: "Serves 4 Persons · 24 mins", price: "$12.56" },
    { icon: "🥤", name: "Fresh Mango Sprite Smoothie",     tag: "DRINK",     meta: "1 Cup · 5 mins",             price: "$5.50"  },
  ],
  daily: [
    { icon: "☕", name: "Morning Espresso Double Shot",    tag: "DRINK",     meta: "1 Cup · 3 mins",             price: "$4.20"  },
    { icon: "🥐", name: "Butter Croissant with Jam",       tag: "PASTRY",    meta: "Serves 1 · 8 mins",          price: "$3.90"  },
  ],
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CHART_DATA = {
  monthly: DAYS.map((day, i) => ({ day, Spaghetti: [420,310,490,370,280,360,200][i], Pizza: [220,180,260,170,140,190,120][i], Burger: [150,200,180,280,390,260,763][i], Sprite: [310,420,340,610,310,440,280][i] })),
  weekly:  DAYS.map((day, i) => ({ day, Spaghetti: [80,60,90,70,50,65,40][i],         Pizza: [45,35,55,30,25,40,20][i],        Burger: [30,40,35,60,80,50,150][i],        Sprite: [60,80,65,120,60,85,55][i]         })),
  daily:   DAYS.map((day, i) => ({ day, Spaghetti: [12,8,14,10,7,9,5][i],             Pizza: [6,5,8,4,3,5,2][i],              Burger: [4,6,5,8,11,7,22][i],             Sprite: [9,12,10,18,9,12,8][i]             })),
};
const LEGEND = {
  monthly: [{ key:"Spaghetti",pct:22,count:69, color:"#3b82f6"},{ key:"Pizza",pct:11,count:321,color:"#ef4444"},{ key:"Burger",pct:27,count:763,color:"#16a34a"},{ key:"Sprite",pct:15,count:154,color:"#eab308"}],
  weekly:  [{ key:"Spaghetti",pct:8, count:18, color:"#3b82f6"},{ key:"Pizza",pct:14,count:82, color:"#ef4444"},{ key:"Burger",pct:32,count:195,color:"#16a34a"},{ key:"Sprite",pct:11,count:38, color:"#eab308"}],
  daily:   [{ key:"Spaghetti",pct:5, count:3,  color:"#3b82f6"},{ key:"Pizza",pct:9, count:12, color:"#ef4444"},{ key:"Burger",pct:18,count:28, color:"#16a34a"},{ key:"Sprite",pct:7, count:5,  color:"#eab308"}],
};

const AVATAR_GRADIENTS = [
  ["#16a34a","#0d9488"],
  ["#3b82f6","#6366f1"],
  ["#a855f7","#ec4899"],
  ["#f97316","#ef4444"],
  ["#06b6d4","#3b82f6"],
];

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// ─── SVG ICONS (no emoji) ─────────────────────────────────────────────────────
const Icons = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Moon: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Bell: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Message: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Gift: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7m0 0a3 3 0 1 0 3-3c-1.66 0-3 1.34-3 3zm0 0a3 3 0 1 1-3-3c1.66 0 3 1.34 3 3z"/>
    </svg>
  ),
  Settings: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Dashboard: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Orders: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/>
    </svg>
  ),
  Food: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z"/>
    </svg>
  ),
  Stats: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Users: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Mail: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Phone: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.06 6.06l1.12-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Id: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  Info: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Dots: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
    </svg>
  ),
  Location: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
};

// ─── TABS ─────────────────────────────────────────────────────────────────────
function Tabs({ active, onChange, options }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-0.5 rounded-xl">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt.toLowerCase())}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            active === opt.toLowerCase()
              ? "bg-white text-green-700 shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-xl shadow-2xl border border-gray-700">
      <p className="font-bold mb-1.5 text-gray-100 border-b border-gray-700 pb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.fill }} />
          <span className="text-gray-400">{p.name}:</span>
          <span className="font-bold text-white ml-auto pl-3">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const [customers, setCustomers]     = useState([]);
  const [selectedId, setSelectedId]   = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [orderPeriod, setOrderPeriod] = useState("monthly");
  const [chartPeriod, setChartPeriod] = useState("monthly");
  const [activeMenu, setActiveMenu]   = useState("dashboard");

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((json) => {
        const list = json.data || [];
        setCustomers(list);
        if (list.length) setSelectedId(list[list.length - 1]._id);
        setLoading(false);
      })
      .catch(() => { setError("API xatosi"); setLoading(false); });
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
    setOrderPeriod("monthly");
    setChartPeriod("monthly");
  };

  const customer = customers.find((c) => c._id === selectedId) || null;
  const custIdx  = customers.findIndex((c) => c._id === selectedId);
  const [g1, g2] = AVATAR_GRADIENTS[custIdx >= 0 ? custIdx % AVATAR_GRADIENTS.length : 0];

  const memberYear  = customer ? new Date(customer.createdAt).getFullYear() : "—";
  const yearsActive = customer ? (new Date().getFullYear() - memberYear) : 0;
  const STATS = [
    { label: "Jami Buyurtmalar", value: "1,284",           change: "+12.5%",           up: true  },
    { label: "Jami Xarajat",     value: "$3,842",           change: "+8.3%",            up: true  },
    { label: "O'rtacha Buyurtma",value: "$24.6",            change: "-2.1%",            up: false },
    { label: "A'zo Bo'lgan",     value: String(memberYear), change: `${yearsActive} yil`, up: null  },
  ];

  const MENU_ITEMS = [
    { key: "dashboard",   label: "Dashboard",    Icon: Icons.Dashboard },
    { key: "orders",      label: "Buyurtmalar",  Icon: Icons.Orders    },
    { key: "food",        label: "Taomlar",      Icon: Icons.Food      },
    { key: "stats",       label: "Statistika",   Icon: Icons.Stats     },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm font-medium">Yuklanmoqda...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-red-100">
        <p className="text-red-500 font-semibold mb-1">Xatolik yuz berdi</p>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
 

      {/* ── BODY ───────────────────────────────────────────────────────────── */}
      <div className="flex" style={{ minHeight: "calc(100vh - 57px)" }}>

        {/* ── SIDEBAR ────────────────────────────────────────────────────── */}
        <aside className="w-[220px] bg-white border-r border-gray-100 flex flex-col flex-shrink-0 overflow-y-auto">

          {/* Customers list */}
          <div className="p-4 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">
              Mijozlar
            </p>
            <div className="flex flex-col gap-0.5">
              {customers.map((c, idx) => {
                const [cg1, cg2] = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
                const isActive = c._id === selectedId;
                return (
                  <button
                    key={c._id}
                    onClick={() => handleSelect(c._id)}
                    className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left transition-all w-full group ${
                      isActive
                        ? "bg-green-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${cg1}, ${cg2})` }}
                    >
                      {getInitials(c.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate leading-tight ${isActive ? "text-green-700" : "text-gray-700 group-hover:text-gray-900"}`}>
                        {c.name}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {c.email}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Menu */}
            {/* <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">
                Menu
              </p>
              <div className="flex flex-col gap-0.5">
                {MENU_ITEMS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveMenu(key)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all w-full group ${
                      activeMenu === key
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <span className={activeMenu === key ? "text-white" : "text-gray-400 group-hover:text-gray-600"}>
                      <Icon />
                    </span>
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </aside>
     
        {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">Mijoz Tafsiloti</h1>
            <p className="text-sm text-gray-400 mt-0.5">Mijozning to'liq profil ma'lumotlari</p>
          </div>

          {!customer ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              Chap tarafdan mijoz tanlang
            </div>
          ) : (
            <>
              {/* TOP ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow"
                      style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
                    >
                      {getInitials(customer.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-gray-900">{customer.name}</span>
                        <span className="bg-green-50 text-green-700 border border-green-200 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                          Mijoz
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                        <Icons.Location />
                        <span>{customer.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5 border-t border-gray-50 pt-4">
                    {[
                      { Icon: Icons.Mail,  text: customer.email,  color: "text-blue-400"  },
                      { Icon: Icons.Phone, text: customer.phone,  color: "text-green-400" },
                      { Icon: Icons.Id,    text: customer._id,    color: "text-purple-400", mono: true },
                    ].map(({ Icon, text, color, mono }) => (
                      <div key={text} className="flex items-center gap-2.5">
                        <span className={`${color} flex-shrink-0`}><Icon /></span>
                        <span className={`text-xs text-gray-600 truncate ${mono ? "font-mono text-[10px] text-gray-400" : ""}`}>
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-all">
                      <Icons.Info /> Info
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-green-300 hover:text-green-600 transition-all">
                      <Icons.Edit /> Tahrirlash
                    </button>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <p className="text-sm font-bold text-gray-900 mb-4">Faollik Ko'rsatkichlari</p>
                  <div className="grid grid-cols-2 gap-3">
                    {STATS.map(({ label, value, change, up }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
                        <div className={`flex items-center gap-1 text-[11px] mt-1 font-semibold ${
                          up === true ? "text-green-600" : up === false ? "text-red-500" : "text-gray-400"
                        }`}>
                          {up === true && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="18 15 12 9 6 15"/>
                            </svg>
                          )}
                          {up === false && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                          )}
                          {change}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Balance Card */}
                <div
                  className="rounded-2xl p-5 text-white shadow-lg relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #16a34a 0%, #0f766e 100%)" }}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white opacity-[0.06]" />
                  <div className="absolute -bottom-12 -left-8 w-36 h-36 rounded-full bg-white opacity-[0.04]" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[11px] opacity-70 font-medium uppercase tracking-wider">Balans</p>
                      </div>
                      <button className="flex flex-col gap-1 opacity-40 hover:opacity-70 transition-opacity">
                        <Icons.Dots />
                      </button>
                    </div>
                    <p className="text-[36px] font-bold tracking-tight leading-none">
                      ${(customer.balance || 0).toLocaleString()}
                    </p>
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <p className="text-[11px] opacity-50 font-mono tracking-[0.2em]">
                        {String(customer.balance || "0").padStart(4, "0").slice(0, 4)} •••• •••• ••••
                      </p>
                      <p className="text-[11px] opacity-40 mt-1">
                        {new Date(customer.createdAt).toLocaleDateString("uz-UZ")} dan
                      </p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        <p className="text-[10px] opacity-50 uppercase tracking-wider mb-0.5">Karta egasi</p>
                        <p className="font-semibold text-sm">{customer.name}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-white/30" />
                        <div className="w-6 h-6 rounded-full bg-white/20 -ml-3" />
                        <span className="text-[11px] font-bold ml-1 opacity-80">MASTERCARD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Most Ordered */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Ko'p Buyurtma Berilgan</p>
                      <p className="text-xs text-gray-400 mt-0.5">Eng ko'p buyurtma berilgan taomlar</p>
                    </div>
                    <Tabs active={orderPeriod} onChange={setOrderPeriod} options={["Monthly","Weekly","Daily"]} />
                  </div>
                  <div className="mt-3 space-y-1">
                    {FOOD_DATA[orderPeriod].map((food, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                          {food.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{food.name}</p>
                          <p className="text-[10px] font-bold text-green-600 mt-0.5">{food.tag}</p>
                          <p className="text-[11px] text-gray-400">{food.meta}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-800 flex-shrink-0">{food.price}</p>
                        <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0">
                          <Icons.Dots />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Eng Ko'p Yoqtirilgan</p>
                      <p className="text-xs text-gray-400 mt-0.5">Haftalik statistika ko'rsatkichlari</p>
                    </div>
                    <Tabs active={chartPeriod} onChange={setChartPeriod} options={["Monthly","Weekly","Daily"]} />
                  </div>
                  <div className="mt-3">
                    <ResponsiveContainer width="100%" height={185}>
                      <BarChart data={CHART_DATA[chartPeriod]} barCategoryGap="28%" barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.025)", radius: 6 }} />
                        <Bar dataKey="Spaghetti" fill="#3b82f6" radius={[4,4,0,0]} />
                        <Bar dataKey="Pizza"     fill="#ef4444" radius={[4,4,0,0]} />
                        <Bar dataKey="Burger"    fill="#16a34a" radius={[4,4,0,0]} />
                        <Bar dataKey="Sprite"    fill="#eab308" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {LEGEND[chartPeriod].map(({ key, pct, count, color }) => (
                      <div key={key} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                          <span className="text-xs text-gray-500">{key} <span className="text-gray-400">({pct}%)</span></span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
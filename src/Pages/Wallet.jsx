import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useSelector } from "react-redux";

const apiurl = import.meta.env.VITE_WALLET_PAGE;

// ── Status badge rangi ───────────────────────────────────────
const statusStyle = {
  Pending:   "bg-red-100 text-red-400",
  Completed: "bg-emerald-500 text-white",
  Cancelled: "bg-gray-100 text-gray-400",
};

// ── Donut Chart ──────────────────────────────────────────────
function DonutChart({ income = 0, expense = 0, dark }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    const other   = Math.max(0, 100 - income - expense);
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [income, expense, other],
          backgroundColor: ["#10b981", "#fb7185", dark ? "#334155" : "#e5e7eb"],
          borderWidth: 0,
          hoverOffset: 3,
        }],
      },
      options: {
        cutout: "68%",
        plugins: { legend: { display: false } },
        animation: { duration: 800 },
      },
    });
    return () => chartRef.current?.destroy();
  }, [income, expense, dark]);

  return <canvas ref={canvasRef} width={80} height={80} />;
}

// ── Line Chart ───────────────────────────────────────────────
// monthlyRevenue: [{ month: "Sun", income: 30, expense: 20 }, ...]
function LineChart({ monthlyRevenue = [], dark }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const greenGrad = ctx.createLinearGradient(0, 0, 0, 120);
    greenGrad.addColorStop(0, "rgba(16,185,129,0.18)");
    greenGrad.addColorStop(1, "rgba(16,185,129,0)");

    const redGrad = ctx.createLinearGradient(0, 0, 0, 120);
    redGrad.addColorStop(0, "rgba(251,113,133,0.12)");
    redGrad.addColorStop(1, "rgba(251,113,133,0)");

    // API bo'sh bo'lsa — placeholder data
    const labels  = monthlyRevenue.length ? monthlyRevenue.map((d) => d.month)   : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const incomes  = monthlyRevenue.length ? monthlyRevenue.map((d) => d.income)  : [30,45,60,40,55,65,75];
    const expenses = monthlyRevenue.length ? monthlyRevenue.map((d) => d.expense) : [20,30,25,35,30,40,38];

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Income",
            data: incomes,
            borderColor: "#10b981",
            backgroundColor: greenGrad,
            borderWidth: 2.5,
            tension: 0.4,
            fill: true,
            pointRadius: (c) => (c.dataIndex === 2 ? 5 : 0),
            pointBackgroundColor: "#10b981",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
          },
          {
            label: "Expense",
            data: expenses,
            borderColor: "#fb7185",
            backgroundColor: redGrad,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: dark ? "#64748b" : "#9ca3af", font: { size: 10 } },
            border: { display: false },
          },
          y: { display: false },
        },
        interaction: { intersect: false, mode: "index" },
      },
    });
    return () => chartRef.current?.destroy();
  }, [monthlyRevenue, dark]);

  return <canvas ref={canvasRef} height={120} />;
}

// ── Bitta tranzaksiya qatori ─────────────────────────────────
// transaction: { name, category, date, amount, card, status, avatar, expanded? }
function TransactionRow({ tx, isExpanded, onToggle, dark }) {
  const cancelledStyle = dark ? "bg-slate-700 text-slate-400" : "bg-gray-100 text-gray-400";

  return (
    <>
      {/* Asosiy qator */}
      <div
        onClick={onToggle}
        className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors
          ${isExpanded
            ? dark
              ? "bg-slate-700 rounded-t-xl text-white"
              : "bg-gray-200 rounded-t-xl text-gray-900"
            : dark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={tx.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tx.name)}&background=random&size=40`}
            alt={tx.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {/* Kichik yashil dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
        </div>

        {/* Ism + kategori */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${isExpanded ? "text-white" : dark ? "text-slate-200" : "text-gray-800"}`}>{tx.name}</p>
          <p className={`text-xs truncate ${isExpanded ? "text-slate-300" : dark ? "text-slate-500" : "text-gray-400"}`}>{tx.category}</p>
        </div>

        {/* Sana */}
        <p className={`text-xs w-36 hidden sm:block ${isExpanded ? "text-slate-300" : dark ? "text-slate-500" : "text-gray-400"}`}>{tx.date}</p>

        {/* Summa */}
        <p className={`text-sm font-semibold w-20 text-right ${isExpanded ? "text-white" : dark ? "text-slate-200" : "text-gray-800"}`}>
          +${Number(tx.amount).toLocaleString()}
        </p>

        {/* Karta */}
        <p className={`text-xs w-28 hidden md:block ${isExpanded ? "text-slate-300" : dark ? "text-slate-500" : "text-gray-400"}`}>{tx.card}</p>

        {/* Status badge */}
        <div className="w-24 flex justify-center">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${tx.status === 'Cancelled' ? cancelledStyle : statusStyle[tx.status] || "bg-gray-100 text-gray-500"}`}>
            {tx.status}
          </span>
        </div>

        {/* O'q */}
        <span className={`text-sm ${isExpanded ? "text-white rotate-90 inline-block" : dark ? "text-slate-600" : "text-gray-400"} transition-transform`}>›</span>
      </div>

      {/* Kengaytirilgan qator (expanded detail) */}
      {isExpanded && (
        <div className={`rounded-b-xl px-4 py-3 grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs transition-colors
          ${dark ? "bg-slate-700 text-slate-300" : "bg-gray-200 text-gray-600"}`}>
          <div>
            <p className={`${dark ? "text-slate-400" : "text-gray-400"} mb-0.5`}>ID Payment</p>
            <p className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>{tx.id || "#00123521"}</p>
          </div>
          <div>
            <p className={`${dark ? "text-slate-400" : "text-gray-400"} mb-0.5`}>Payment Method</p>
            <p className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>{tx.card}</p>
          </div>
          <div>
            <p className={`${dark ? "text-slate-400" : "text-gray-400"} mb-0.5`}>Invoice Date</p>
            <p className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>{tx.invoiceDate || tx.date}</p>
          </div>
          <div>
            <p className={`${dark ? "text-slate-400" : "text-gray-400"} mb-0.5`}>Due Date</p>
            <p className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>{tx.dueDate || "June 5, 2020"}</p>
          </div>
          <div>
            <p className={`${dark ? "text-slate-400" : "text-gray-400"} mb-0.5`}>Date Paid</p>
            <p className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>{tx.datePaid || tx.date}</p>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// ASOSIY KOMPONENT
// ============================================================
const Wallet = () => {
  const dark = useSelector((state) => state.theme.mode === 'dark');
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("Today");     // Monthly / Weekly / Today
  const [expandedTx, setExpandedTx] = useState(null);     // kengaytirilgan tranzaksiya id

  // ── API fetch ──────────────────────────────────────────────
  const fetchWallet = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${apiurl}`);
      const json = await res.json();
      setData(json.data ?? json);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWallet(); }, []);

  // ── Loading holati ─────────────────────────────────────────
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dark ? 'bg-slate-900' : 'bg-gray-100'}`}>
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // API dan kelgan qiymatlar (0 bo'lsa fallback)
  const balance       = data?.balance      ?? 0;
  const income        = data?.income       ?? 0;
  const expense       = data?.expense      ?? 0;
  const transactions  = data?.transactions ?? [];
  const monthlyRevenue = data?.monthlyRevenue ?? [];

  // Invoices: transactions ichidan yoki alohida field
  const invoices = (data?.invoices ?? transactions).slice(0, 5);

  return (
    <div className={`min-h-screen p-6 font-sans transition-colors duration-300 ${dark ? 'bg-slate-900' : 'bg-gray-100'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* ════════════════════════════════════════
            YUQORI QISM — Karta + Wallet panel
        ════════════════════════════════════════ */}
        <div className="flex gap-4 w-full">

          {/* CHAP PANEL — Asosiy karta */}
          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 flex-1 flex flex-col gap-6 shadow-sm transition-colors duration-300`}>

            {/* Balans + karta ma'lumotlari */}
            <div className="flex items-start justify-between">
              <div className="flex gap-[200px] w-full items-center">

                {/* Main Balance — DINAMIK: balance */}
                <div>
                  <p className={`text-xs font-medium mb-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>Main Balance</p>
                  <h1 className={`text-3xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                    ${Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </h1>
                </div>

                {/* Karta tafsilotlari */}
                <div className="flex gap-8 items-start">
                  <div>
                    <p className={`text-xs uppercase tracking-wider mb-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>Valid Thru</p>
                    <p className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-gray-700'}`}>08/21</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider mb-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>Card Holder</p>
                    <p className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-gray-700'}`}>Samantha Anderson</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider mb-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>&nbsp;</p>
                    <p className={`text-sm font-semibold tracking-widest ${dark ? 'text-slate-600' : 'text-gray-400'}`}>•••• •••• •••• 1234</p>
                  </div>
                </div>
              </div>

              {/* 3-nuqta */}
              <button className={`${dark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {/* Progress bar — DINAMIK: income foiziga qarab */}
            <div className={`w-full rounded-full h-2 ${dark ? 'bg-slate-700' : 'bg-gray-100'}`}>
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(income, 100)}%` }}
              />
            </div>

            {/* Donut + Line chart */}
            <div className="flex gap-6 items-center">

              {/* Earning Category — DINAMIK: income, expense */}
              <div className="flex flex-col gap-3 min-w-[160px]">
                <p className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-gray-700'}`}>Earning Category</p>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <DonutChart income={income} expense={expense} dark={dark} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>Income</span>
                      <span className={`text-xs font-semibold ml-auto pl-2 ${dark ? 'text-slate-300' : 'text-gray-700'}`}>{income}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 flex-shrink-0" />
                      <span className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>Expense</span>
                      <span className={`text-xs font-semibold ml-auto pl-2 ${dark ? 'text-slate-300' : 'text-gray-700'}`}>{expense}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dark ? 'bg-slate-600' : 'bg-gray-300'}`} />
                      <span className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>Unknown</span>
                      <span className={`text-xs font-semibold ml-auto pl-2 ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                        {Math.max(0, 100 - income - expense)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line chart — DINAMIK: monthlyRevenue */}
              <div className="flex-1 relative">
                <LineChart monthlyRevenue={monthlyRevenue} dark={dark} />
              </div>
            </div>
          </div>
          {/* / CHAP PANEL */}

          {/* O'NG PANEL — Wallet */}
          <div className={`${dark ? 'bg-slate-950' : 'bg-gray-800'} rounded-2xl p-5 w-52 flex flex-col gap-5 shadow-sm flex-shrink-0 transition-colors duration-300`}>
            <div className="flex justify-end">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-500 opacity-90" />
                <div className="w-8 h-8 rounded-full bg-gray-400 opacity-70" />
              </div>
            </div>

            {/* Wallet balans — DINAMIK: balance */}
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">
                ${Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-gray-400 mt-1">Wallet Balance</p>
              <p className="text-xs text-emerald-400 mt-1 font-medium">+0.8% than last week</p>
            </div>

            {/* Top Up / Withdraw tugmalari */}
            <div className={`${dark ? 'bg-slate-900' : 'bg-gray-700'} rounded-xl p-3 transition-colors duration-300`}>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-1.5 group">
                  <div className={`w-10 h-10 ${dark ? 'bg-slate-800' : 'bg-gray-600'} rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-200`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 10h18M8 15h4" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">Top Up</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 group">
                  <div className={`w-10 h-10 ${dark ? 'bg-slate-800' : 'bg-gray-600'} rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-200`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">Withdraw</span>
                </button>
              </div>
            </div>
          </div>
          {/* / O'NG PANEL */}

        </div>
        {/* / YUQORI QISM */}


        {/* ════════════════════════════════════════
            PASTKI QISM — Payment History + Invoices
        ════════════════════════════════════════ */}
        <div className="flex gap-4">

          {/* CHAP: Payment History — DINAMIK: transactions[] */}
          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 flex-1 shadow-sm flex flex-col gap-4`}>

            {/* Sarlavha + tab tugmalar */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`text-base font-bold ${dark ? 'text-slate-100' : 'text-gray-800'}`}>Payment History</h2>
                <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>Lorem ipsum dolor sit amet, consectetur</p>
              </div>
              {/* Tab: Monthly / Weekly / Today */}
              <div className={`flex gap-4 text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                {["Monthly", "Weekly", "Today"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-1 transition-colors font-medium ${
                      activeTab === tab
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : dark ? "hover:text-slate-300" : "hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tranzaksiyalar ro'yxati — DINAMIK: transactions[] */}
            <div className={`flex flex-col divide-y ${dark ? 'divide-slate-700/50' : 'divide-gray-50'}`}>
              {transactions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Tranzaksiyalar mavjud emas</p>
              ) : (
                transactions.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    tx={tx}
                    isExpanded={expandedTx === tx.id}
                    onToggle={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                    dark={dark}
                  />
                ))
              )}
            </div>
          </div>

          {/* O'NG: Invoices Sent — DINAMIK: invoices[] */}
          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 w-60 shadow-sm flex flex-col gap-4 flex-shrink-0`}>
            <div>
              <h2 className={`text-base font-bold ${dark ? 'text-slate-100' : 'text-gray-800'}`}>Invoices Sent</h2>
              <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>Lorem ipsum dolor sit amet, consectetur</p>
            </div>

            {/* Invoice qatorlari */}
            <div className="flex flex-col gap-3">
              {invoices.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Ma'lumot yo'q</p>
              ) : (
                invoices.map((inv, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={inv.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inv.name)}&size=36&background=random`}
                      alt={inv.name}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      {/* DINAMIK: inv.name */}
                      <p className={`text-sm font-semibold truncate ${dark ? 'text-slate-200' : 'text-gray-800'}`}>{inv.name}</p>
                      <p className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>4h ago</p>
                    </div>
                    {/* DINAMIK: inv.amount */}
                    <p className={`text-sm font-bold ${dark ? 'text-slate-200' : 'text-gray-800'}`}>${inv.amount}</p>
                  </div>
                ))
              )}
            </div>

            {/* View More tugmasi */}
            <button className={`mt-auto w-full border border-emerald-500 text-emerald-500 rounded-xl py-2 text-sm font-medium transition-colors ${dark ? 'hover:bg-emerald-500/10' : 'hover:bg-emerald-50'}`}>
              View More
            </button>
          </div>
          {/* / INVOICES */}

        </div>
        {/* / PASTKI QISM */}

      </div>
    </div>
  );
};

export default Wallet;
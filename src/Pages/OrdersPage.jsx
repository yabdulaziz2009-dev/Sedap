import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import OrderTable from "../Components/OrderTable";
import Filters from "../Components/Filters";
import Pagination from "../Components/Pagination";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const PAGE_SIZE = 12;
const POLL_INTERVAL = 5000;

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white pointer-events-auto
          ${t.type === "success" ? "bg-emerald-500" : "bg-red-500"}
          animate-slide-in`}
        style={{ animation: "slideIn 0.25s ease" }}
      >
        {t.type === "success" ? (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {t.message}
      </div>
    ))}
    <style>{`
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
    `}</style>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("Today");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [toasts, setToasts] = useState([]);
  const pollRef = useRef(null);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // ── Fetch orders ───────────────────────────────────────────────────────────
  const fetchOrders = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: PAGE_SIZE,
          sortBy: sortKey,
          sortDir,
          ...(statusFilter !== "All Status" && { status: statusFilter }),
          ...(dateFilter !== "All Time" && { dateRange: dateFilter }),
        };

        const { data } = await axios.get(`${API_URL}/orders`, { params });

        // Support both { data: [], total: N } and plain array responses
        if (Array.isArray(data)) {
          setOrders(data);
          setTotalItems(data.length);
        } else {
          setOrders(data.data ?? data.orders ?? []);
          setTotalItems(data.total ?? data.totalItems ?? 0);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        if (!silent) addToast("Failed to load orders", "error");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [currentPage, sortKey, sortDir, statusFilter, dateFilter, addToast]
  );

  // ── Initial fetch + polling ────────────────────────────────────────────────
  useEffect(() => {
    fetchOrders(false);

    pollRef.current = setInterval(() => {
      fetchOrders(true);
    }, POLL_INTERVAL);

    return () => clearInterval(pollRef.current);
  }, [fetchOrders]);

  // ── Reset to page 1 when filters change ───────────────────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateFilter, sortKey, sortDir]);

  // ── Sort toggle ────────────────────────────────────────────────────────────
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // ── Accept order ───────────────────────────────────────────────────────────
  const handleAccept = async (id) => {
    try {
      await axios.put(`${API_URL}/orders/${id}/accept`);

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "accept" } : o))
      );

      addToast("Order accepted ✓", "success");
    } catch {
      addToast("Failed to accept order", "error");
    }
  };

  // ── Reject order ───────────────────────────────────────────────────────────
  const handleReject = async (id) => {
    try {
      await axios.put(`${API_URL}/orders/${id}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o))
      );
      addToast("Order rejected", "error");
    } catch {
      addToast("Failed to reject order", "error");
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Your Orders</h1>
            <p className="text-sm text-gray-400 mt-0.5">This is your order list data</p>
          </div>

          <Filters
            statusFilter={statusFilter}
            dateFilter={dateFilter}
            onStatusChange={setStatusFilter}
            onDateChange={setDateFilter}
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <OrderTable
            orders={orders}
            loading={loading}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            onAccept={handleAccept}
            onReject={handleReject}
          />

          {!loading && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Toasts */}
      <Toast toasts={toasts} />
    </div>
  );
};

export default OrdersPage;

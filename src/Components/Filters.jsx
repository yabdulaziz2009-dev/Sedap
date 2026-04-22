const STATUS_OPTIONS = ["All Status", "New Order", "On Delivery", "Delivered"];
const DATE_OPTIONS = ["Today", "Last 7 Days", "Last 30 Days", "All Time"];

const Filters = ({ statusFilter, dateFilter, onStatusChange, onDateChange }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Status Filter */}
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:border-gray-300 transition-colors min-w-[140px]">
          <span className="w-4 h-4 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="appearance-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer pr-4 w-full"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <svg className="w-4 h-4 text-gray-400 pointer-events-none absolute right-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Date Filter */}
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:border-gray-300 transition-colors min-w-[130px]">
          <span className="w-4 h-4 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <select
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="appearance-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer pr-4 w-full"
          >
            {DATE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <svg className="w-4 h-4 text-gray-400 pointer-events-none absolute right-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Filters;

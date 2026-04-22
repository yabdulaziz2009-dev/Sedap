import OrderRow from "./OrderRow";
import SkeletonRow from "./SkeletonRow";

const COLUMNS = [
  { key: "id", label: "Order ID", sortable: false, align: "left" },
  { key: "date", label: "Date", sortable: true, align: "left" },
  { key: "customerName", label: "Customer Name", sortable: false, align: "left" },
  { key: "location", label: "Location", sortable: false, align: "left" },
  { key: "amount", label: "Amount", sortable: true, align: "right" },
  { key: "status", label: "Status Order", sortable: false, align: "center" },
  { key: "actions", label: "", sortable: false, align: "right" },
];

const SortIcon = ({ column, sortKey, sortDir }) => {
  const isActive = sortKey === column;
  return (
    <span className="inline-flex flex-col ml-1 gap-[1px]">
      <svg
        className={`w-2.5 h-2.5 transition-colors ${isActive && sortDir === "asc" ? "text-white" : "text-emerald-200"}`}
        fill="currentColor" viewBox="0 0 20 20"
      >
        <path d="M10 3l6 7H4l6-7z" />
      </svg>
      <svg
        className={`w-2.5 h-2.5 transition-colors ${isActive && sortDir === "desc" ? "text-white" : "text-emerald-200"}`}
        fill="currentColor" viewBox="0 0 20 20"
      >
        <path d="M10 17l-6-7h12l-6 7z" />
      </svg>
    </span>
  );
};

const OrderTable = ({ orders, loading, sortKey, sortDir, onSort, onAccept, onReject }) => {
  const alignClass = { left: "text-left", right: "text-right", center: "text-center" };

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full min-w-[820px] border-collapse">
        <thead>
          <tr className="bg-emerald-500">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-4 text-xs font-semibold text-white tracking-wide ${alignClass[col.align]} ${
                  col.sortable ? "cursor-pointer select-none hover:bg-emerald-600 transition-colors" : ""
                }`}
                onClick={col.sortable ? () => onSort(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && <SortIcon column={col.key} sortKey={sortKey} sortDir={sortDir} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          {loading ? (
            [...Array(7)].map((_, i) => <SkeletonRow key={i} />)
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-400 font-medium text-sm">No orders found</p>
                </div>
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                onAccept={onAccept}
                onReject={onReject}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;

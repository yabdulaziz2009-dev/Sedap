import { useState } from "react";
import StatusBadge from "./StatusBadge";
import DropdownMenu from "./DropdownMenu";

const OrderRow = ({ order, onAccept, onReject }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    setDropdownOpen(false);
    await onAccept(order._id);
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    setDropdownOpen(false);
    await onReject(order._id);
    setLoading(false);
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 group">
      <td className="px-4 py-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
        {order.orderId}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
        {order.date}
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
        {order.customerName}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
        {order.location}
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-gray-800 text-right whitespace-nowrap">
        ${(order.totalPrice ?? 0).toFixed(2)}
      </td>
      <td className="px-4 py-4 text-center whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-4 py-4 text-right relative">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          disabled={loading}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-40"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0-4a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          )}
        </button>
        {dropdownOpen && (
          <DropdownMenu
            loading={loading}
            onAccept={handleAccept}
            onReject={handleReject}
            onClose={() => setDropdownOpen(false)}
          />
        )}
      </td>
    </tr>
  );
};

export default OrderRow;

const STATUS_CONFIG = {
  pending: {
    label: "New Order",
    className: "bg-red-100 text-red-500 border border-red-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-600 border border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-500 border border-gray-200",
  },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: "bg-gray-100 text-gray-500 border border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;

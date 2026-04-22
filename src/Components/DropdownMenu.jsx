import { useEffect, useRef } from "react";

const DropdownMenu = ({ onAccept, onReject, onClose, loading }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-8 z-50 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in"
      style={{ animation: "fadeIn 0.15s ease" }}
    >
      <button
        disabled={loading}
        onClick={onAccept}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        Accept Order
      </button>
      <button
        disabled={loading}
        onClick={onReject}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
        Reject Order
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DropdownMenu;

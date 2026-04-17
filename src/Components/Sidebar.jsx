import { useState } from "react";

const menuItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Order List",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    label: "Order Detail",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    label: "Customer",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "Reviews",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "Foods",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    label: "Food Detail",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    label: "Customer Detail",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <line x1="16" y1="11" x2="22" y2="11" />
        <line x1="19" y1="8" x2="19" y2="14" />
      </svg>
    ),
  },
  {
    label: "Calendar",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Chat",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    label: "Wallet",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
];

export default function SedapSidebar() {
  const [active, setActive] = useState("Order List");
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "240px",
      height: "100vh",
      backgroundColor: "#ffffff",
      boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxSizing: "border-box",
    }}>

      {/* Logo */}
      <div style={{ padding: "28px 24px 8px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", margin: 0, letterSpacing: "-0.5px" }}>
          Sedap<span style={{ color: "#10b981" }}>.</span>
        </h1>
        <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "3px", marginBottom: 0, fontWeight: "500" }}>
          Modern Admin Dashboard
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#f3f4f6", margin: "12px 24px 8px 24px" }} />

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "4px 12px" }}>
        {menuItems.map((item) => {
          const isActive = active === item.label;
          const isHovered = hovered === item.label;

          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "13.5px",
                fontWeight: "500",
                textAlign: "left",
                marginBottom: "2px",
                boxSizing: "border-box",
                backgroundColor: isActive ? "#ecfdf5" : isHovered ? "#f9fafb" : "transparent",
                color: isActive ? "#059669" : isHovered ? "#1f2937" : "#6b7280",
                transition: "background-color 0.15s ease, color 0.15s ease",
              }}
            >
              {/* Icon */}
              <span style={{
                flexShrink: 0,
                color: isActive ? "#10b981" : isHovered ? "#4b5563" : "#9ca3af",
                display: "flex",
                alignItems: "center",
                transition: "color 0.15s ease",
              }}>
                {item.icon}
              </span>

              {/* Label */}
              <span style={{ flex: 1 }}>{item.label}</span>

              {/* Active indicator */}
              {isActive && (
                <span style={{
                  width: "6px",
                  height: "20px",
                  borderRadius: "999px",
                  backgroundColor: "#10b981",
                  flexShrink: 0,
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Promo Card */}
      <div style={{
        margin: "8px 16px 16px 16px",
        borderRadius: "16px",
        backgroundColor: "#10b981",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Blobs */}
        <div style={{
          position: "absolute", top: "-16px", right: "-16px",
          width: "64px", height: "64px", borderRadius: "999px",
          backgroundColor: "#34d399", opacity: 0.4,
        }} />
        <div style={{
          position: "absolute", bottom: "-12px", right: "24px",
          width: "40px", height: "40px", borderRadius: "999px",
          backgroundColor: "#6ee7b7", opacity: 0.3,
        }} />

        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", position: "relative", zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#ffffff", fontSize: "12px", fontWeight: "600", lineHeight: "1.5", margin: 0 }}>
              Please, organize your menus through button below!
            </p>
            <button style={{
              marginTop: "12px",
              width: "100%",
              backgroundColor: "#ffffff",
              color: "#059669",
              border: "none",
              borderRadius: "10px",
              padding: "8px 0",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Menus
            </button>
          </div>
          <span style={{ fontSize: "28px", flexShrink: 0, userSelect: "none" }}>🍜</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 20px 20px 20px", borderTop: "1px solid #f3f4f6" }}>
        <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "500", margin: "0 0 2px 0" }}>
          Sedap Restaurant Admin Dashboard
        </p>
        <p style={{ fontSize: "11px", color: "#d1d5db", margin: "0 0 4px 0" }}>
          © 2020 All Rights Reserved
        </p>
        <p style={{ fontSize: "11px", color: "#d1d5db", margin: 0 }}>
          Made with <span style={{ color: "#f87171" }}>♥</span> by Peter Ickx
        </p>
      </div>
    </div>
  );
}
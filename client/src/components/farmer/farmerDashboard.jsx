import React from "react";
import FarmerNavbar from "./FarmerNavbar";
import FarmerHeader from "./farmerHeader";

const FarmerDashboard = () => {
  return (
    <div
      style={{
        background: "#050505",
        minHeight: "100vh",
        padding: "0 40px 60px 40px",
        fontFamily: '"Inter", sans-serif'
      }}
    >
      <FarmerNavbar />

      {/* Header Section */}
      <FarmerHeader />

      {/* ───────────────────────────── */}
      {/* Stats Cards */}
      {/* ───────────────────────────── */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          marginBottom: "40px"
        }}
      >
        {[
          { title: "Total Products", value: "18", icon: "🧺" },
          { title: "Orders This Month", value: "42", icon: "📦" },
          { title: "Revenue (₹)", value: "78,500", icon: "💰" },
          { title: "Pending Deliveries", value: "6", icon: "🚚" },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "25px",
              backdropFilter: "blur(20px)",
              transition: "all 0.3s ease",
              boxShadow: "0 15px 40px rgba(0,0,0,0.4)"
            }}
          >
            <div style={{ fontSize: "1.5rem" }}>{item.icon}</div>
            <div
              style={{
                marginTop: "10px",
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.8rem",
                fontWeight: 600
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "1.8rem",
                fontWeight: 900,
                color: "#4ade80"
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* ───────────────────────────── */}
      {/* Recent Orders + Inventory */}
      {/* ───────────────────────────── */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "30px"
        }}
      >
        {/* Recent Orders */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "30px",
            backdropFilter: "blur(20px)"
          }}
        >
          <h3
            style={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: 800,
              marginBottom: "20px"
            }}
          >
            📦 Recent Orders
          </h3>

          <table style={{ width: "100%", color: "white", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ color: "rgba(255,255,255,0.5)", textAlign: "left" }}>
                <th>Product</th>
                <th>Buyer</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { p: "Tomatoes", b: "Rahul", q: "20kg", s: "Pending" },
                { p: "Carrots", b: "Anita", q: "15kg", s: "Delivered" },
                { p: "Mangoes", b: "Kiran", q: "50kg", s: "Shipped" },
              ].map((order, index) => (
                <tr key={index} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "12px 0" }}>{order.p}</td>
                  <td>{order.b}</td>
                  <td>{order.q}</td>
                  <td
                    style={{
                      color:
                        order.s === "Delivered"
                          ? "#4ade80"
                          : order.s === "Pending"
                          ? "#facc15"
                          : "#60a5fa"
                    }}
                  >
                    {order.s}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inventory Status */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "30px",
            backdropFilter: "blur(20px)"
          }}
        >
          <h3
            style={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: 800,
              marginBottom: "20px"
            }}
          >
            🌱 Inventory Status
          </h3>

          {[
            { name: "Tomatoes", percent: "75%" },
            { name: "Potatoes", percent: "40%" },
            { name: "Mangoes", percent: "60%" },
          ].map((crop) => (
            <div key={crop.name} style={{ marginBottom: "18px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.6)"
                }}
              >
                <span>{crop.name}</span>
                <span>{crop.percent}</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "20px"
                }}
              >
                <div
                  style={{
                    width: crop.percent,
                    height: "100%",
                    background: "linear-gradient(90deg,#4ade80,#22c55e)",
                    borderRadius: "20px"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────── */}
      {/* Quick Tools Section */}
      {/* ───────────────────────────── */}

      <div
        style={{
          marginTop: "50px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "30px"
        }}
      >
        <h3
          style={{
            color: "white",
            fontSize: "1.2rem",
            fontWeight: 800,
            marginBottom: "20px"
          }}
        >
          🚀 Quick Actions
        </h3>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {[
            "Add New Product",
            "Check Market Prices",
            "View Analytics",
            "Plan Next Season"
          ].map((action) => (
            <button
              key={action}
              style={{
                padding: "12px 20px",
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.25)",
                borderRadius: "14px",
                color: "#4ade80",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "rgba(74,222,128,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "rgba(74,222,128,0.08)")
              }
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
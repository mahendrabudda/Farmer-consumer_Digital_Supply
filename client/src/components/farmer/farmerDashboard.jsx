import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../Context/AppContext.jsx";
import { FarmerContent } from "../../Context/farmer/farmerContext.jsx";
import FarmerNavbar from "./FarmerNavbar.jsx";
import FarmerHeader from "./farmerHeader.jsx";

const FarmerDashboard = () => {
  const navigate = useNavigate()
  const { userData } = useContext(AppContent)
  const { farmerData, farmerLoading, getFarmerData } = useContext(FarmerContent)

  useEffect(() => { getFarmerData() }, [])

  const stats = [
    { title: "Total Products", value: farmerData?.totalProductsListed ?? 0, icon: "🧺", color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
    { title: "Orders This Month", value: farmerData?.totalOrders ?? 0, icon: "📦", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
    { title: "Revenue (₹)", value: farmerData?.totalRevenue ? farmerData.totalRevenue.toLocaleString('en-IN') : "0", icon: "💰", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
    { title: "Pending Deliveries", value: farmerData?.pendingOrders ?? 0, icon: "🚚", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  ]

  if (farmerLoading) return (
    <div style={{
      minHeight: "100vh", background: "#fafafa",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: '"Inter", sans-serif', gap: "16px"
    }}>
      <div style={{ fontSize: "2.5rem" }}>🌾</div>
      <div style={{ display: "flex", gap: "6px" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e",
            animation: `bounce 1s ease ${i * 0.2}s infinite`
          }} />
        ))}
      </div>
      <p style={{ color: "#9ca3af", fontSize: "0.8rem", letterSpacing: "2px" }}>Loading dashboard...</p>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  )

  return (
    <div style={{
      background: "#fafafa", minHeight: "100vh",
      padding: "0 40px 60px", fontFamily: '"Inter", sans-serif'
    }}>
      <FarmerNavbar />
      <FarmerHeader />

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px", marginBottom: "28px"
      }}>
        {stats.map((item) => (
          <div key={item.title} style={{
            background: "#ffffff",
            border: `1px solid ${item.border}`,
            borderRadius: "16px", padding: "22px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease"
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: item.bg, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "1.2rem", marginBottom: "14px"
            }}>{item.icon}</div>
            <div style={{ color: "#6b7280", fontSize: "0.78rem", fontWeight: 600, marginBottom: "6px" }}>
              {item.title}
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: item.color }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders + Inventory */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* Recent Orders */}
        <div style={{
          background: "#ffffff", border: "1px solid #e5e7eb",
          borderRadius: "16px", padding: "28px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h3 style={{ color: "#111111", fontSize: "1rem", fontWeight: 700, margin: 0 }}>
              Recent Orders
            </h3>
            <span onClick={() => navigate("/farmerOrder")} style={{
              color: "#22c55e", fontSize: "0.78rem", fontWeight: 600,
              cursor: "pointer"
            }}>View all →</span>
          </div>

          <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                {["Product", "Buyer", "Qty", "Status"].map(h => (
                  <th key={h} style={{ color: "#9ca3af", fontWeight: 600, fontSize: "0.75rem", padding: "0 0 12px", textAlign: "left", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {farmerData?.recentOrders?.length > 0 ? (
                farmerData.recentOrders.map((order, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #f9fafb" }}>
                    <td style={{ padding: "12px 0", color: "#111111", fontWeight: 500 }}>{order.cropName}</td>
                    <td style={{ color: "#374151" }}>{order.customerName}</td>
                    <td style={{ color: "#374151" }}>{order.quantity} kg</td>
                    <td>
                      <span style={{
                        padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
                        background: order.status === "Delivered" ? "#f0fdf4" : order.status === "Pending" ? "#fffbeb" : "#eff6ff",
                        color: order.status === "Delivered" ? "#16a34a" : order.status === "Pending" ? "#d97706" : "#2563eb",
                        border: `1px solid ${order.status === "Delivered" ? "#bbf7d0" : order.status === "Pending" ? "#fde68a" : "#bfdbfe"}`
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: "32px 0", textAlign: "center", color: "#d1d5db", fontSize: "0.85rem" }}>
                    No orders yet — start listing your crops!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Inventory Status */}
        <div style={{
          background: "#ffffff", border: "1px solid #e5e7eb",
          borderRadius: "16px", padding: "28px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
        }}>
          <h3 style={{ color: "#111111", fontSize: "1rem", fontWeight: 700, marginBottom: "20px", margin: "0 0 20px" }}>
            Inventory Status
          </h3>
          {farmerData?.topCrops?.length > 0 ? (
            farmerData.topCrops.map((crop) => {
              const pct = Math.min(100, Math.round((crop.quantityAvailable / 500) * 100))
              return (
                <div key={crop.name} style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.78rem" }}>
                    <span style={{ color: "#374151", fontWeight: 600 }}>{crop.name}</span>
                    <span style={{ color: "#9ca3af" }}>{crop.quantityAvailable} {crop.unit}</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "#f3f4f6", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: pct > 50 ? "#22c55e" : pct > 20 ? "#f59e0b" : "#ef4444",
                      borderRadius: "10px", transition: "width 0.8s ease"
                    }} />
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{ color: "#d1d5db", fontSize: "0.85rem", textAlign: "center", padding: "20px 0" }}>
              No crops listed yet.
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: "#ffffff", border: "1px solid #e5e7eb",
        borderRadius: "16px", padding: "28px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
      }}>
        <h3 style={{ color: "#111111", fontSize: "1rem", fontWeight: 700, marginBottom: "16px", margin: "0 0 16px" }}>
          Quick Actions
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "Add New Product", path: "/farmerProduct", icon: "➕" },
            { label: "Check Market Prices", path: "/farmer-market-prices", icon: "📊" },
            { label: "View Analytics", path: "/farmerAnalytics", icon: "📈" },
            { label: "Plan Next Season", path: "/farmer-season-planner", icon: "📅" },
          ].map((action) => (
            <button key={action.label} onClick={() => navigate(action.path)} style={{
              padding: "10px 18px",
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "10px", color: "#374151",
              fontWeight: 600, fontSize: "0.82rem",
              cursor: "pointer", transition: "all 0.2s ease",
              display: "flex", alignItems: "center", gap: "6px"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "#15803d" }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151" }}
            >
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
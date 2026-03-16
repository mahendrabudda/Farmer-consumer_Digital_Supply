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

  // fetch farmer data when dashboard mounts
  useEffect(() => {
    getFarmerData()
  }, [])

  const stats = [
    {
      title: "Total Products",
      value: farmerData?.totalProductsListed ?? 0,
      icon: "🧺"
    },
    {
      title: "Orders This Month",
      value: farmerData?.totalOrders ?? 0,
      icon: "📦"
    },
    {
      title: "Revenue (₹)",
      value: farmerData?.totalRevenue
        ? farmerData.totalRevenue.toLocaleString('en-IN')
        : "0",
      icon: "💰"
    },
    {
      title: "Pending Deliveries",
      value: farmerData?.pendingOrders ?? 0,
      icon: "🚚"
    },
  ]

  if (farmerLoading) return (
    <div style={{
      minHeight: "100vh", background: "#050505",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: '"Inter", sans-serif', gap: "20px"
    }}>
      <div style={{ fontSize: "2.5rem", filter: "drop-shadow(0 0 20px rgba(74,222,128,0.5))" }}>🌾</div>
      <div style={{ display: "flex", gap: "6px" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: "#4ade80", boxShadow: "0 0 8px #4ade80",
            animation: `bounce 1s ease ${i * 0.2}s infinite`
          }} />
        ))}
      </div>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", letterSpacing: "3px" }}>
        LOADING DASHBOARD...
      </p>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  )

  return (
    <div style={{
      background: "#050505",
      minHeight: "100vh",
      padding: "0 40px 60px 40px",
      fontFamily: '"Inter", sans-serif'
    }}>
      <FarmerNavbar />

      {/* Header */}
      <FarmerHeader />

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "24px",
        marginBottom: "40px"
      }}>
        {stats.map((item) => (
          <div key={item.title} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px", padding: "25px",
            backdropFilter: "blur(20px)",
            transition: "all 0.3s ease",
            boxShadow: "0 15px 40px rgba(0,0,0,0.4)"
          }}>
            <div style={{ fontSize: "1.5rem" }}>{item.icon}</div>
            <div style={{
              marginTop: "10px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.8rem", fontWeight: 600
            }}>
              {item.title}
            </div>
            <div style={{
              marginTop: "8px",
              fontSize: "1.8rem", fontWeight: 900,
              color: "#4ade80"
            }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders + Inventory */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>

        {/* Recent Orders */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "30px",
          backdropFilter: "blur(20px)"
        }}>
          <h3 style={{ color: "white", fontSize: "1.2rem", fontWeight: 800, marginBottom: "20px" }}>
            📦 Recent Orders
          </h3>
          <table style={{ width: "100%", color: "white", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ color: "rgba(255,255,255,0.5)", textAlign: "left" }}>
                <th style={{ paddingBottom: "10px" }}>Product</th>
                <th style={{ paddingBottom: "10px" }}>Buyer</th>
                <th style={{ paddingBottom: "10px" }}>Qty</th>
                <th style={{ paddingBottom: "10px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {farmerData?.recentOrders?.length > 0 ? (
                farmerData.recentOrders.map((order, index) => (
                  <tr key={index} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "12px 0" }}>{order.cropName}</td>
                    <td>{order.customerName}</td>
                    <td>{order.quantity} kg</td>
                    <td style={{
                      color:
                        order.status === "Delivered" ? "#4ade80" :
                        order.status === "Pending" ? "#facc15" : "#60a5fa"
                    }}>
                      {order.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{
                    padding: "30px 0", textAlign: "center",
                    color: "rgba(255,255,255,0.2)", fontSize: "0.82rem"
                  }}>
                    No orders yet — start listing your crops!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Inventory Status */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "30px",
          backdropFilter: "blur(20px)"
        }}>
          <h3 style={{ color: "white", fontSize: "1.2rem", fontWeight: 800, marginBottom: "20px" }}>
            🌱 Inventory Status
          </h3>
          {farmerData?.topCrops?.length > 0 ? (
            farmerData.topCrops.map((crop) => {
              const pct = Math.min(100, Math.round((crop.quantityAvailable / 500) * 100))
              return (
                <div key={crop.name} style={{ marginBottom: "18px" }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    marginBottom: "6px", fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.6)"
                  }}>
                    <span>{crop.name}</span>
                    <span>{crop.quantityAvailable} {crop.unit}</span>
                  </div>
                  <div style={{
                    width: "100%", height: "8px",
                    background: "rgba(255,255,255,0.08)", borderRadius: "20px"
                  }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: "linear-gradient(90deg,#4ade80,#22c55e)",
                      borderRadius: "20px"
                    }} />
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{
              color: "rgba(255,255,255,0.2)", fontSize: "0.82rem",
              textAlign: "center", padding: "20px 0"
            }}>
              No crops listed yet.
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: "50px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px", padding: "30px"
      }}>
        <h3 style={{ color: "white", fontSize: "1.2rem", fontWeight: 800, marginBottom: "20px" }}>
          🚀 Quick Actions
        </h3>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {[
            { label: "Add New Product",     path: "/farmerProduct" },
            { label: "Check Market Prices", path: "/farmer-market-prices" },
            { label: "View Analytics",      path: "/farmerAnalytics" },
            { label: "Plan Next Season",    path: "/farmer-season-planner" },
          ].map((action) => (
            <button key={action.label} onClick={() => navigate(action.path)} style={{
              padding: "12px 20px",
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.25)",
              borderRadius: "14px", color: "#4ade80",
              fontWeight: 700, cursor: "pointer",
              transition: "all 0.3s ease"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(74,222,128,0.08)"}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
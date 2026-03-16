import React, { useEffect, useState } from "react";
import FarmerNavbar from "./FarmerNavbar.jsx";

const FarmerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const mockData = {
      totalRevenue: 124500, netIncome: 98200, totalOrders: 156,
      pendingOrders: 12, cancelledOrders: 3, paymentPending: 15400,
      commission: 6200, transportCost: 4700,
      topProducts: [
        { name: "Organic Basmati Rice", quantity: 450, growth: "+12%", icon: "🌾", revenue: 45000 },
        { name: "Alphonso Mangoes", quantity: 320, growth: "+8%", icon: "🥭", revenue: 32000 },
        { name: "Pure Gir Cow Ghee", quantity: 85, growth: "+24%", icon: "🧈", revenue: 28500 },
        { name: "Organic Turmeric", quantity: 210, growth: "+5%", icon: "🌿", revenue: 19000 },
      ],
      recentTransactions: [
        { id: "TX101", date: "2026-03-02", amount: 4500, status: "Paid", method: "UPI", customer: "Rahul S." },
        { id: "TX102", date: "2026-03-01", amount: 1200, status: "Paid", method: "Bank Transfer", customer: "Anita D." },
        { id: "TX103", date: "2026-02-28", amount: 3000, status: "Pending", method: "COD", customer: "Green Grocers" },
        { id: "TX104", date: "2026-02-27", amount: 8750, status: "Paid", method: "UPI", customer: "Meena R." },
        { id: "TX105", date: "2026-02-26", amount: 2200, status: "Pending", method: "COD", customer: "Suresh P." },
      ],
      monthlyRevenue: [40, 65, 55, 80, 72, 90, 85, 110, 95, 124, 118, 130],
    };
    setTimeout(() => { setAnalytics(mockData); setTimeout(() => setIsLoaded(true), 100); }, 600);
  }, []);

  if (!analytics) return (
    <div style={{ minHeight: "100vh", background: "#fafafa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: '"Inter", sans-serif', gap: "16px" }}>
      <div style={{ fontSize: "2.5rem" }}>📊</div>
      <div style={{ display: "flex", gap: "6px" }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", animation: `bounce 1s ease ${i * 0.2}s infinite` }} />)}
      </div>
      <p style={{ color: "#9ca3af", fontSize: "0.8rem", letterSpacing: "2px" }}>Calculating harvest data...</p>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  );

  const maxRevenue = Math.max(...analytics.monthlyRevenue);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  const statCards = [
    { title: "Total Revenue", value: `₹${analytics.totalRevenue.toLocaleString()}`, icon: "💰", color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", sub: "This season" },
    { title: "Net Income", value: `₹${analytics.netIncome.toLocaleString()}`, icon: "📥", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", sub: "After expenses" },
    { title: "Total Orders", value: analytics.totalOrders, icon: "📦", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", sub: "All time" },
    { title: "Pending", value: analytics.pendingOrders, icon: "⏳", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", sub: "Needs attention" },
    { title: "Payment Due", value: `₹${analytics.paymentPending.toLocaleString()}`, icon: "🔔", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", sub: "Awaiting clearance" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: '"Inter", sans-serif' }}>
      <FarmerNavbar />

      <div style={{
        padding: "32px 40px",
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.6s cubic-bezier(0.2,0,0.2,1)"
      }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ color: "#111111", fontSize: "1.8rem", fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.8px" }}>
              Business Intelligence
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "0.88rem", margin: 0 }}>
              Real-time overview of your farm's financial health
            </p>
          </div>

          {/* Tab Switch */}
          <div style={{
            display: "flex", gap: "4px",
            background: "#f3f4f6", borderRadius: "10px", padding: "4px"
          }}>
            {["overview", "transactions"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "8px 16px", borderRadius: "7px", border: "none",
                background: activeTab === tab ? "#ffffff" : "transparent",
                color: activeTab === tab ? "#111111" : "#9ca3af",
                fontSize: "0.78rem", fontWeight: activeTab === tab ? 700 : 500,
                cursor: "pointer", transition: "all 0.2s ease",
                boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
              }}>
                {tab === "overview" ? "📈 Overview" : "💳 Ledger"}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
          {statCards.map((card, i) => (
            <div key={i} style={{
              background: "#ffffff", border: `1px solid ${card.border}`,
              borderRadius: "14px", padding: "20px",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div style={{ fontSize: "1.3rem", marginBottom: "10px" }}>{card.icon}</div>
              <div style={{ color: card.color, fontSize: "1.5rem", fontWeight: 900 }}>{card.value}</div>
              <div style={{ color: "#6b7280", fontSize: "0.72rem", fontWeight: 600, marginTop: "4px" }}>{card.title}</div>
              <div style={{ color: "#9ca3af", fontSize: "0.68rem", marginTop: "2px" }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Bar Chart */}
            <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ color: "#111111", fontSize: "1rem", fontWeight: 700, margin: 0 }}>Monthly Revenue</h2>
                  <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: "3px 0 0" }}>Annual performance in ₹K</p>
                </div>
                <span style={{ color: "#22c55e", fontSize: "0.75rem", fontWeight: 700, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "5px 12px", borderRadius: "8px" }}>
                  ↑ 24% YoY
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "120px" }}>
                {analytics.monthlyRevenue.map((val, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                      <div style={{
                        width: "100%",
                        height: `${(val / maxRevenue) * 100}%`,
                        background: i === 11 ? "#22c55e" : "#dcfce7",
                        borderRadius: "4px 4px 0 0",
                        border: i === 11 ? "1px solid #16a34a" : "none",
                        transition: "all 0.2s ease", minHeight: "4px",
                        cursor: "pointer"
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#22c55e" }}
                        onMouseLeave={e => { if (i !== 11) e.currentTarget.style.background = "#dcfce7" }}
                      />
                    </div>
                    <span style={{ color: "#9ca3af", fontSize: "0.6rem", fontWeight: 600 }}>{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>

              {/* Top Products */}
              <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                  <div style={{ width: "3px", height: "18px", background: "#22c55e", borderRadius: "2px" }} />
                  <h2 style={{ color: "#111111", fontSize: "1rem", fontWeight: 700, margin: 0 }}>Top Performing Crops</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {analytics.topProducts.map((p, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 14px", background: "#fafafa",
                      border: "1px solid #e5e7eb", borderRadius: "12px",
                      transition: "all 0.2s ease", cursor: "default"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.border = "1px solid #bbf7d0"; e.currentTarget.style.background = "#f0fdf4" }}
                      onMouseLeave={e => { e.currentTarget.style.border = "1px solid #e5e7eb"; e.currentTarget.style.background = "#fafafa" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "9px",
                          background: "#f0fdf4", border: "1px solid #bbf7d0",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem"
                        }}>{p.icon}</div>
                        <div>
                          <div style={{ color: "#111111", fontSize: "0.85rem", fontWeight: 600 }}>{p.name}</div>
                          <div style={{ color: "#9ca3af", fontSize: "0.7rem", marginTop: "1px" }}>{p.quantity} kg · ₹{p.revenue.toLocaleString()}</div>
                        </div>
                      </div>
                      <span style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "3px 10px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}>
                        {p.growth}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Breakdown */}
              <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                  <div style={{ width: "3px", height: "18px", background: "#ef4444", borderRadius: "2px" }} />
                  <h2 style={{ color: "#111111", fontSize: "1rem", fontWeight: 700, margin: 0 }}>Expense Breakdown</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { label: "Platform Commission", value: analytics.commission, icon: "🏛️", color: "#8b5cf6", pct: Math.round(analytics.commission / analytics.totalRevenue * 100) },
                    { label: "Logistics & Transport", value: analytics.transportCost, icon: "🚚", color: "#3b82f6", pct: Math.round(analytics.transportCost / analytics.totalRevenue * 100) },
                    { label: "Cancellation Losses", value: analytics.cancelledOrders * 1200, icon: "❌", color: "#ef4444", pct: Math.round(analytics.cancelledOrders * 1200 / analytics.totalRevenue * 100) },
                  ].map((exp, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{exp.icon}</span>
                          <span style={{ color: "#374151", fontSize: "0.82rem", fontWeight: 600 }}>{exp.label}</span>
                        </div>
                        <span style={{ color: exp.color, fontSize: "0.85rem", fontWeight: 700 }}>₹{exp.value.toLocaleString()}</span>
                      </div>
                      <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${exp.pct}%`, background: exp.color, borderRadius: "3px", transition: "width 1s ease" }} />
                      </div>
                      <div style={{ color: "#9ca3af", fontSize: "0.65rem", marginTop: "3px", textAlign: "right" }}>{exp.pct}% of revenue</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{ width: "3px", height: "18px", background: "#22c55e", borderRadius: "2px" }} />
              <h2 style={{ color: "#111111", fontSize: "1rem", fontWeight: 700, margin: 0 }}>Ledger Transactions</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {analytics.recentTransactions.map((tx, i) => (
                <div key={tx.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", background: "#fafafa",
                  border: "1px solid #e5e7eb", borderRadius: "12px", transition: "all 0.2s ease"
                }}
                  onMouseEnter={e => { e.currentTarget.style.border = "1px solid #bbf7d0"; e.currentTarget.style.background = "#f0fdf4" }}
                  onMouseLeave={e => { e.currentTarget.style.border = "1px solid #e5e7eb"; e.currentTarget.style.background = "#fafafa" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "38px", height: "38px", borderRadius: "10px",
                      background: tx.status === "Paid" ? "#f0fdf4" : "#fffbeb",
                      border: `1px solid ${tx.status === "Paid" ? "#bbf7d0" : "#fde68a"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem"
                    }}>
                      {tx.method === "UPI" ? "📱" : tx.method === "Bank Transfer" ? "🏦" : "💵"}
                    </div>
                    <div>
                      <div style={{ color: "#111111", fontSize: "0.85rem", fontWeight: 600 }}>{tx.customer}</div>
                      <div style={{ color: "#9ca3af", fontSize: "0.7rem", marginTop: "1px" }}>
                        {tx.date} · #{tx.id} · {tx.method}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#111111", fontSize: "0.95rem", fontWeight: 700 }}>₹{tx.amount.toLocaleString()}</div>
                    <span style={{
                      fontSize: "0.65rem", fontWeight: 700,
                      color: tx.status === "Paid" ? "#16a34a" : "#d97706",
                      background: tx.status === "Paid" ? "#f0fdf4" : "#fffbeb",
                      border: `1px solid ${tx.status === "Paid" ? "#bbf7d0" : "#fde68a"}`,
                      padding: "2px 8px", borderRadius: "6px", marginTop: "4px", display: "inline-block"
                    }}>
                      {tx.status === "Paid" ? "✓ Paid" : "⏳ Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerAnalytics;
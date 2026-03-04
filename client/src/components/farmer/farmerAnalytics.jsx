import React, { useEffect, useState } from "react";
import FarmerNavbar from "./FarmerNavbar.jsx";

const FarmerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const mockData = {
      totalRevenue: 124500,
      netIncome: 98200,
      totalOrders: 156,
      pendingOrders: 12,
      cancelledOrders: 3,
      paymentPending: 15400,
      commission: 6200,
      transportCost: 4700,
      topProducts: [
        { name: "Organic Basmati Rice", quantity: 450, growth: "+12%", icon: "🌾", revenue: 45000 },
        { name: "Alphonso Mangoes",      quantity: 320, growth: "+8%",  icon: "🥭", revenue: 32000 },
        { name: "Pure Gir Cow Ghee",     quantity: 85,  growth: "+24%", icon: "🧈", revenue: 28500 },
        { name: "Organic Turmeric",      quantity: 210, growth: "+5%",  icon: "🌿", revenue: 19000 },
      ],
      recentTransactions: [
        { id: "TX101", date: "2026-03-02", amount: 4500,  status: "Paid",    method: "UPI",           customer: "Rahul S." },
        { id: "TX102", date: "2026-03-01", amount: 1200,  status: "Paid",    method: "Bank Transfer", customer: "Anita D." },
        { id: "TX103", date: "2026-02-28", amount: 3000,  status: "Pending", method: "COD",           customer: "Green Grocers" },
        { id: "TX104", date: "2026-02-27", amount: 8750,  status: "Paid",    method: "UPI",           customer: "Meena R." },
        { id: "TX105", date: "2026-02-26", amount: 2200,  status: "Pending", method: "COD",           customer: "Suresh P." },
      ],
      monthlyRevenue: [40, 65, 55, 80, 72, 90, 85, 110, 95, 124, 118, 130],
    };
    setTimeout(() => {
      setAnalytics(mockData);
      setTimeout(() => setIsLoaded(true), 100);
    }, 900);
  }, []);

  // ── Loading ──
  if (!analytics) return (
    <div style={{
      minHeight: "100vh", background: "#050505",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: '"Inter", sans-serif', gap: "20px"
    }}>
      <div style={{ fontSize: "2.5rem", filter: "drop-shadow(0 0 20px rgba(74,222,128,0.5))" }}>📊</div>
      <div style={{ display: "flex", gap: "6px" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80",
            boxShadow: "0 0 8px #4ade80",
            animation: `bounce 1s ease ${i * 0.2}s infinite`
          }} />
        ))}
      </div>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", letterSpacing: "3px" }}>
        CALCULATING HARVEST DATA...
      </p>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  );

  const maxRevenue = Math.max(...analytics.monthlyRevenue);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  return (
    <div style={{
      minHeight: "100vh", background: "#050505",
      fontFamily: '"Inter", sans-serif',
      position: "relative", overflow: "hidden"
    }}>
      <FarmerNavbar />

      {/* ── Grain ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* ── Glows ── */}
      <div style={{ position: "fixed", width: "700px", height: "700px", background: "rgba(74,222,128,0.04)", borderRadius: "50%", filter: "blur(150px)", top: "-250px", right: "-150px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: "500px", height: "500px", background: "rgba(96,165,250,0.03)", borderRadius: "50%", filter: "blur(120px)", bottom: "-150px", left: "-100px", pointerEvents: "none" }} />

      <div style={{
        position: "relative", zIndex: 1, padding: "40px",
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.2,0,0.2,1)"
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem"
            }}>📊</div>
            <div>
              <h1 style={{ color: "white", fontSize: "2rem", fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>
                Business{" "}
                <span style={{ background: "linear-gradient(120deg,#4ade80,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Intelligence
                </span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", margin: 0 }}>
                Real-time overview of your farm's financial health
              </p>
            </div>
          </div>

          {/* Tab Switch */}
          <div style={{
            display: "flex", gap: "4px",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", padding: "4px"
          }}>
            {["overview", "transactions"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "8px 18px", borderRadius: "10px", border: "none",
                background: activeTab === tab ? "linear-gradient(135deg,#4ade80,#22c55e)" : "transparent",
                color: activeTab === tab ? "black" : "rgba(255,255,255,0.4)",
                fontSize: "0.75rem", fontWeight: 900, letterSpacing: "1px",
                textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s ease"
              }}>
                {tab === "overview" ? "📈 Overview" : "💳 Ledger"}
              </button>
            ))}
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px", marginBottom: "32px"
        }}>
          {[
            { title: "Total Revenue",  value: `₹${analytics.totalRevenue.toLocaleString()}`,  icon: "💰", color: "#4ade80",  sub: "This season" },
            { title: "Net Income",     value: `₹${analytics.netIncome.toLocaleString()}`,     icon: "📥", color: "#22c55e",  sub: "After expenses" },
            { title: "Total Orders",   value: analytics.totalOrders,                           icon: "📦", color: "#60a5fa",  sub: "All time" },
            { title: "Pending",        value: analytics.pendingOrders,                         icon: "⏳", color: "#fbbf24",  sub: "Needs attention" },
            { title: "Payment Due",    value: `₹${analytics.paymentPending.toLocaleString()}`, icon: "🔔", color: "#f87171",  sub: "Awaiting clearance" },
          ].map((card, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px", padding: "22px",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.7s cubic-bezier(0.2,0,0.2,1) ${i * 0.08}s`,
              cursor: "default"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `1px solid ${card.color}30`
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 20px ${card.color}08`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{card.icon}</div>
              <div style={{
                color: card.color, fontSize: "1.7rem", fontWeight: 900,
                filter: `drop-shadow(0 0 12px ${card.color}30)`
              }}>{card.value}</div>
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "6px" }}>{card.title}</div>
              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.68rem", marginTop: "3px" }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Revenue Bar Chart */}
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "24px", padding: "28px", marginBottom: "24px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div>
                  <h2 style={{ color: "white", fontSize: "1rem", fontWeight: 800, margin: 0 }}>Monthly Revenue</h2>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", margin: "4px 0 0" }}>Annual performance in ₹K</p>
                </div>
                <div style={{ color: "#4ade80", fontSize: "0.75rem", fontWeight: 900, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", padding: "6px 14px", borderRadius: "10px" }}>
                  ↑ 24% YoY
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
                {analytics.monthlyRevenue.map((val, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                      <div style={{
                        width: "100%",
                        height: `${(val / maxRevenue) * 100}%`,
                        background: i === 11
                          ? "linear-gradient(to top, #4ade80, #22c55e)"
                          : "rgba(74,222,128,0.2)",
                        borderRadius: "6px 6px 0 0",
                        border: i === 11 ? "1px solid rgba(74,222,128,0.4)" : "none",
                        boxShadow: i === 11 ? "0 0 16px rgba(74,222,128,0.3)" : "none",
                        transition: "all 0.3s ease",
                        minHeight: "4px"
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "linear-gradient(to top,#4ade80,#22c55e)"
                          e.currentTarget.style.boxShadow = "0 0 16px rgba(74,222,128,0.3)"
                        }}
                        onMouseLeave={e => {
                          if (i !== 11) {
                            e.currentTarget.style.background = "rgba(74,222,128,0.2)"
                            e.currentTarget.style.boxShadow = "none"
                          }
                        }}
                      />
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem", fontWeight: 700 }}>{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products + Expenses */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>

              {/* Top Products */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                  <div style={{ width: "4px", height: "20px", background: "linear-gradient(#4ade80,#22c55e)", borderRadius: "2px" }} />
                  <h2 style={{ color: "white", fontSize: "1rem", fontWeight: 800, margin: 0 }}>Top Performing Crops</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {analytics.topProducts.map((p, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "14px", transition: "all 0.3s ease"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(74,222,128,0.2)"; e.currentTarget.style.background = "rgba(74,222,128,0.04)" }}
                      onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "38px", height: "38px", borderRadius: "10px",
                          background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem"
                        }}>{p.icon}</div>
                        <div>
                          <div style={{ color: "white", fontSize: "0.85rem", fontWeight: 700 }}>{p.name}</div>
                          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", marginTop: "2px" }}>{p.quantity} kg · ₹{p.revenue.toLocaleString()}</div>
                        </div>
                      </div>
                      <div style={{
                        background: "rgba(74,222,128,0.1)", color: "#4ade80",
                        padding: "4px 10px", borderRadius: "8px",
                        fontSize: "0.72rem", fontWeight: 900
                      }}>{p.growth}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Breakdown */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                  <div style={{ width: "4px", height: "20px", background: "linear-gradient(#f87171,#ef4444)", borderRadius: "2px" }} />
                  <h2 style={{ color: "white", fontSize: "1rem", fontWeight: 800, margin: 0 }}>Expense Breakdown</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { label: "Platform Commission", value: analytics.commission,    icon: "🏛️", color: "#a78bfa", pct: Math.round(analytics.commission / analytics.totalRevenue * 100) },
                    { label: "Logistics & Transport", value: analytics.transportCost, icon: "🚚", color: "#60a5fa", pct: Math.round(analytics.transportCost / analytics.totalRevenue * 100) },
                    { label: "Cancellation Losses", value: analytics.cancelledOrders * 1200, icon: "❌", color: "#f87171", pct: Math.round(analytics.cancelledOrders * 1200 / analytics.totalRevenue * 100) },
                  ].map((exp, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "1rem" }}>{exp.icon}</span>
                          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: 600 }}>{exp.label}</span>
                        </div>
                        <span style={{ color: exp.color, fontSize: "0.85rem", fontWeight: 800 }}>₹{exp.value.toLocaleString()}</span>
                      </div>
                      <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${exp.pct}%`,
                          background: exp.color, borderRadius: "3px",
                          boxShadow: `0 0 8px ${exp.color}60`,
                          transition: "width 1s ease"
                        }} />
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.62rem", marginTop: "4px", textAlign: "right" }}>{exp.pct}% of revenue</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {activeTab === "transactions" && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <div style={{ width: "4px", height: "20px", background: "linear-gradient(#4ade80,#22c55e)", borderRadius: "2px" }} />
              <h2 style={{ color: "white", fontSize: "1rem", fontWeight: 800, margin: 0 }}>Ledger Transactions</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {analytics.recentTransactions.map((tx, i) => (
                <div key={tx.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "16px", transition: "all 0.3s ease",
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? "translateX(0)" : "translateX(-20px)",
                  transitionDelay: `${i * 0.07}s`
                }}
                  onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(74,222,128,0.15)"; e.currentTarget.style.background = "rgba(74,222,128,0.03)" }}
                  onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "12px",
                      background: tx.status === "Paid" ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)",
                      border: `1px solid ${tx.status === "Paid" ? "rgba(74,222,128,0.2)" : "rgba(251,191,36,0.2)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem"
                    }}>
                      {tx.method === "UPI" ? "📱" : tx.method === "Bank Transfer" ? "🏦" : "💵"}
                    </div>
                    <div>
                      <div style={{ color: "white", fontSize: "0.85rem", fontWeight: 700 }}>{tx.customer}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", marginTop: "2px" }}>
                        {tx.date} · #{tx.id} · {tx.method}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "white", fontSize: "1rem", fontWeight: 800 }}>₹{tx.amount.toLocaleString()}</div>
                    <div style={{
                      fontSize: "0.65rem", fontWeight: 900, letterSpacing: "1px",
                      color: tx.status === "Paid" ? "#4ade80" : "#fbbf24",
                      background: tx.status === "Paid" ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)",
                      border: `1px solid ${tx.status === "Paid" ? "rgba(74,222,128,0.2)" : "rgba(251,191,36,0.2)"}`,
                      padding: "3px 10px", borderRadius: "6px", marginTop: "4px", display: "inline-block"
                    }}>
                      {tx.status === "Paid" ? "✓ PAID" : "⏳ PENDING"}
                    </div>
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
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FarmerNavbar from "./FarmerNavbar";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const mockOrders = [
      { _id: "ORD1001", customerName: "Rahul Sharma", productName: "Organic Rice", quantity: 50, totalPrice: 4500, status: "Pending", time: "2 min ago" },
      { _id: "ORD1002", customerName: "Anita Desai", productName: "Mangoes", quantity: 10, totalPrice: 1200, status: "Accepted", time: "15 min ago" },
      { _id: "ORD1003", customerName: "Green Grocers", productName: "Cow Ghee", quantity: 5, totalPrice: 3000, status: "Shipped", time: "1 hr ago" },
      { _id: "ORD1004", customerName: "Suresh P.", productName: "Turmeric", quantity: 2, totalPrice: 800, status: "Pending", time: "5 min ago" },
      { _id: "ORD1005", customerName: "Meena R.", productName: "Wheat Flour", quantity: 20, totalPrice: 1600, status: "Accepted", time: "30 min ago" },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
      setTimeout(() => setIsLoaded(true), 100);
    }, 900);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order)
    );
    const messages = {
      Accepted: "✅ Order accepted!",
      Shipped: "🚚 Order dispatched!",
      Rejected: "❌ Order rejected"
    };
    toast.success(messages[newStatus] || `Moved to ${newStatus}`, { theme: "dark", autoClose: 2000 });
  };

  const columns = [
    { id: "Pending",  title: "Incoming",    icon: "📬", color: "#fbbf24", glow: "rgba(251,191,36,0.15)" },
    { id: "Accepted", title: "Preparing",   icon: "🌿", color: "#4ade80", glow: "rgba(74,222,128,0.15)" },
    { id: "Shipped",  title: "Dispatched",  icon: "🚚", color: "#60a5fa", glow: "rgba(96,165,250,0.15)" },
  ];

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingCount = orders.filter(o => o.status === "Pending").length;

  // ── Loading Screen ──
  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#050505",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: '"Inter", sans-serif', gap: "20px"
    }}>
      <div style={{ fontSize: "2.5rem", filter: "drop-shadow(0 0 20px rgba(74,222,128,0.5))" }}>🌾</div>
      <div style={{ display: "flex", gap: "6px" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80",
            animation: `bounce 1s ease ${i * 0.2}s infinite`,
            boxShadow: "0 0 8px #4ade80"
          }} />
        ))}
      </div>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", letterSpacing: "3px" }}>
        LOADING ORDERS...
      </p>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#050505",
      fontFamily: '"Inter", sans-serif',
      position: "relative", overflow: "hidden"
    }}>
      <FarmerNavbar />

      {/* ── Background Glows ── */}
      <div style={{ position: "fixed", width: "600px", height: "600px", background: "rgba(74,222,128,0.04)", borderRadius: "50%", filter: "blur(120px)", top: "-200px", right: "-100px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: "400px", height: "400px", background: "rgba(251,191,36,0.03)", borderRadius: "50%", filter: "blur(100px)", bottom: "-100px", left: "-100px", pointerEvents: "none" }} />

      {/* ── Grain ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        padding: "40px",
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.2,0,0.2,1)"
      }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "14px",
              background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem"
            }}>📦</div>
            <div>
              <h1 style={{ color: "white", fontSize: "2rem", fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>
                Order <span style={{ background: "linear-gradient(120deg,#4ade80,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Workflow</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", margin: 0 }}>
                Manage and track your farm's fulfillment pipeline
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px", marginBottom: "40px"
        }}>
          {[
            { label: "TOTAL ORDERS", value: orders.length, icon: "📋", color: "#4ade80" },
            { label: "PENDING", value: pendingCount, icon: "⏳", color: "#fbbf24" },
            { label: "TOTAL REVENUE", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰", color: "#60a5fa" },
            { label: "SHIPPED", value: orders.filter(o => o.status === "Shipped").length, icon: "🚚", color: "#a78bfa" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "18px", padding: "20px",
              transition: "all 0.3s ease"
            }}
              onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${stat.color}30`; e.currentTarget.style.boxShadow = `0 0 20px ${stat.color}10` }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none" }}
            >
              <div style={{ fontSize: "1.4rem", marginBottom: "10px" }}>{stat.icon}</div>
              <div style={{ color: stat.color, fontSize: "1.5rem", fontWeight: 900 }}>{stat.value}</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "2px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Kanban Board ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px", alignItems: "start"
        }}>
          {columns.map((col, colIdx) => (
            <div key={col.id} style={{
              background: "rgba(255,255,255,0.015)",
              borderRadius: "24px",
              border: `1px solid rgba(255,255,255,0.06)`,
              padding: "20px",
              minHeight: "420px",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(30px)",
              transition: `all 0.8s cubic-bezier(0.2,0,0.2,1) ${colIdx * 0.1}s`
            }}>

              {/* Column Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "20px", paddingBottom: "16px",
                borderBottom: `1px solid ${col.color}20`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: col.glow, border: `1px solid ${col.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem"
                  }}>{col.icon}</div>
                  <div>
                    <div style={{ color: "white", fontSize: "0.9rem", fontWeight: 800 }}>{col.title}</div>
                    <div style={{ color: col.color, fontSize: "0.6rem", fontWeight: 900, letterSpacing: "1px" }}>
                      {orders.filter(o => o.status === col.id).length} ORDERS
                    </div>
                  </div>
                </div>
                <div style={{
                  background: col.glow, color: col.color,
                  width: "28px", height: "28px", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", fontWeight: 900,
                  border: `1px solid ${col.color}30`
                }}>
                  {orders.filter(o => o.status === col.id).length}
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {orders.filter(o => o.status === col.id).length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "40px 20px",
                    color: "rgba(255,255,255,0.15)", fontSize: "0.8rem",
                    border: "1px dashed rgba(255,255,255,0.06)", borderRadius: "16px"
                  }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px", opacity: 0.3 }}>{col.icon}</div>
                    No orders here
                  </div>
                ) : (
                  orders.filter(o => o.status === col.id).map((order, cardIdx) => (
                    <div key={order._id} style={{
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "18px",
                      border: "1px solid rgba(255,255,255,0.07)",
                      padding: "18px",
                      transition: "all 0.3s ease",
                      opacity: isLoaded ? 1 : 0,
                      transform: isLoaded ? "translateY(0)" : "translateY(10px)",
                      transitionDelay: `${cardIdx * 0.05}s`
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.border = `1px solid ${col.color}25`
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${col.color}08`
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "none"
                      }}
                    >
                      {/* Order ID + Time */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1px" }}>
                          #{order._id}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.62rem" }}>{order.time}</span>
                      </div>

                      {/* Customer */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "10px",
                          background: `linear-gradient(135deg, ${col.color}30, ${col.color}10)`,
                          border: `1px solid ${col.color}20`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: col.color, fontSize: "0.85rem", fontWeight: 900
                        }}>
                          {order.customerName[0]}
                        </div>
                        <div>
                          <div style={{ color: "white", fontSize: "0.88rem", fontWeight: 700 }}>{order.customerName}</div>
                          <div style={{ color: col.color, fontSize: "0.75rem", fontWeight: 600 }}>
                            {order.productName}
                          </div>
                        </div>
                      </div>

                      {/* Details Row */}
                      <div style={{
                        display: "flex", gap: "8px", marginBottom: "14px"
                      }}>
                        <div style={{
                          flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: "10px",
                          padding: "8px 10px", border: "1px solid rgba(255,255,255,0.05)"
                        }}>
                          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.58rem", letterSpacing: "1px", marginBottom: "2px" }}>QTY</div>
                          <div style={{ color: "white", fontSize: "0.82rem", fontWeight: 700 }}>{order.quantity} kg</div>
                        </div>
                        <div style={{
                          flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: "10px",
                          padding: "8px 10px", border: "1px solid rgba(255,255,255,0.05)"
                        }}>
                          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.58rem", letterSpacing: "1px", marginBottom: "2px" }}>AMOUNT</div>
                          <div style={{ color: col.color, fontSize: "0.82rem", fontWeight: 800 }}>₹{order.totalPrice}</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        {order.status === "Pending" && (
                          <>
                            <button onClick={() => updateStatus(order._id, "Accepted")}
                              style={{
                                flex: 1, padding: "9px", borderRadius: "10px", border: "none",
                                background: "linear-gradient(135deg,#4ade80,#22c55e)",
                                color: "black", fontSize: "0.72rem", fontWeight: 900,
                                letterSpacing: "1px", cursor: "pointer", transition: "all 0.2s ease"
                              }}
                              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 16px rgba(74,222,128,0.4)"}
                              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                            >✓ ACCEPT</button>
                            <button onClick={() => updateStatus(order._id, "Rejected")}
                              style={{
                                padding: "9px 14px", borderRadius: "10px",
                                background: "transparent", border: "1px solid rgba(248,113,113,0.3)",
                                color: "#f87171", fontSize: "0.72rem", fontWeight: 900,
                                cursor: "pointer", transition: "all 0.2s ease"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.08)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(248,113,113,0.2)" }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none" }}
                            >✕</button>
                          </>
                        )}
                        {order.status === "Accepted" && (
                          <button onClick={() => updateStatus(order._id, "Shipped")}
                            style={{
                              flex: 1, padding: "9px", borderRadius: "10px", border: "none",
                              background: "linear-gradient(135deg,#60a5fa,#3b82f6)",
                              color: "black", fontSize: "0.72rem", fontWeight: 900,
                              letterSpacing: "1px", cursor: "pointer", transition: "all 0.2s ease"
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 16px rgba(96,165,250,0.4)"}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                          >🚚 DISPATCH</button>
                        )}
                        {order.status === "Shipped" && (
                          <div style={{
                            flex: 1, padding: "9px", borderRadius: "10px", textAlign: "center",
                            background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)",
                            color: "#60a5fa", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "1px"
                          }}>✓ DELIVERED</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerOrders;
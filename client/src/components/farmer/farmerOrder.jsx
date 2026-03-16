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
    }, 600);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    const messages = { Accepted: "Order accepted!", Shipped: "Order dispatched!", Rejected: "Order rejected" };
    toast.success(messages[newStatus], { theme: "light", autoClose: 2000 });
  };

  const columns = [
    { id: "Pending", title: "Incoming", icon: "📬", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
    { id: "Accepted", title: "Preparing", icon: "🌿", color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
    { id: "Shipped", title: "Dispatched", icon: "🚚", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  ];

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingCount = orders.filter(o => o.status === "Pending").length;

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#fafafa",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: '"Inter", sans-serif', gap: "16px"
    }}>
      <div style={{ fontSize: "2.5rem" }}>📦</div>
      <div style={{ display: "flex", gap: "6px" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e",
            animation: `bounce 1s ease ${i * 0.2}s infinite`
          }} />
        ))}
      </div>
      <p style={{ color: "#9ca3af", fontSize: "0.8rem", letterSpacing: "2px" }}>Loading orders...</p>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  );

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
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ color: "#111111", fontSize: "1.8rem", fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.8px" }}>
            Order Workflow
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "0.88rem", margin: 0 }}>
            Manage and track your farm's fulfillment pipeline
          </p>
        </div>

        {/* Stats Strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "14px", marginBottom: "28px"
        }}>
          {[
            { label: "Total Orders", value: orders.length, color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
            { label: "Pending", value: pendingCount, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
            { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
            { label: "Shipped", value: orders.filter(o => o.status === "Shipped").length, color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "#ffffff", border: `1px solid ${stat.border}`,
              borderRadius: "14px", padding: "18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
            }}>
              <div style={{ color: stat.color, fontSize: "1.5rem", fontWeight: 900 }}>{stat.value}</div>
              <div style={{ color: "#9ca3af", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.5px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", alignItems: "start" }}>
          {columns.map((col) => (
            <div key={col.id} style={{
              background: "#ffffff", borderRadius: "16px",
              border: "1px solid #e5e7eb", padding: "18px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
            }}>

              {/* Column Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "16px", paddingBottom: "14px",
                borderBottom: `2px solid ${col.border}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "9px",
                    background: col.bg, display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "0.95rem"
                  }}>{col.icon}</div>
                  <div>
                    <div style={{ color: "#111111", fontSize: "0.88rem", fontWeight: 700 }}>{col.title}</div>
                    <div style={{ color: col.color, fontSize: "0.62rem", fontWeight: 700 }}>
                      {orders.filter(o => o.status === col.id).length} orders
                    </div>
                  </div>
                </div>
                <div style={{
                  background: col.bg, color: col.color,
                  width: "26px", height: "26px", borderRadius: "7px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.82rem", fontWeight: 900, border: `1px solid ${col.border}`
                }}>
                  {orders.filter(o => o.status === col.id).length}
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {orders.filter(o => o.status === col.id).length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "32px 16px",
                    color: "#d1d5db", fontSize: "0.8rem",
                    border: "1px dashed #e5e7eb", borderRadius: "12px"
                  }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: "6px", opacity: 0.4 }}>{col.icon}</div>
                    No orders here
                  </div>
                ) : (
                  orders.filter(o => o.status === col.id).map((order) => (
                    <div key={order._id} style={{
                      background: "#fafafa", borderRadius: "14px",
                      border: "1px solid #e5e7eb", padding: "16px",
                      transition: "all 0.2s ease"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${col.border}`; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)" }}
                      onMouseLeave={e => { e.currentTarget.style.border = "1px solid #e5e7eb"; e.currentTarget.style.boxShadow = "none" }}
                    >
                      {/* Order ID + Time */}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ color: "#9ca3af", fontSize: "0.65rem", fontWeight: 700 }}>#{order._id}</span>
                        <span style={{ color: "#9ca3af", fontSize: "0.65rem" }}>{order.time}</span>
                      </div>

                      {/* Customer */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "8px",
                          background: col.bg, border: `1px solid ${col.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: col.color, fontSize: "0.82rem", fontWeight: 900
                        }}>
                          {order.customerName[0]}
                        </div>
                        <div>
                          <div style={{ color: "#111111", fontSize: "0.85rem", fontWeight: 700 }}>{order.customerName}</div>
                          <div style={{ color: col.color, fontSize: "0.72rem", fontWeight: 600 }}>{order.productName}</div>
                        </div>
                      </div>

                      {/* Details */}
                      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                        {[
                          { label: "QTY", value: `${order.quantity} kg` },
                          { label: "AMOUNT", value: `₹${order.totalPrice}` }
                        ].map(d => (
                          <div key={d.label} style={{
                            flex: 1, background: "#ffffff", borderRadius: "8px",
                            padding: "8px 10px", border: "1px solid #e5e7eb"
                          }}>
                            <div style={{ color: "#9ca3af", fontSize: "0.58rem", letterSpacing: "1px", marginBottom: "2px" }}>{d.label}</div>
                            <div style={{ color: "#111111", fontSize: "0.82rem", fontWeight: 700 }}>{d.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        {order.status === "Pending" && (
                          <>
                            <button onClick={() => updateStatus(order._id, "Accepted")} style={{
                              flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                              background: "#22c55e", color: "#ffffff",
                              fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
                              transition: "all 0.2s ease"
                            }}
                              onMouseEnter={e => e.currentTarget.style.background = "#16a34a"}
                              onMouseLeave={e => e.currentTarget.style.background = "#22c55e"}
                            >✓ Accept</button>
                            <button onClick={() => updateStatus(order._id, "Rejected")} style={{
                              padding: "8px 14px", borderRadius: "8px",
                              background: "#fef2f2", border: "1px solid #fecaca",
                              color: "#ef4444", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer"
                            }}>✕</button>
                          </>
                        )}
                        {order.status === "Accepted" && (
                          <button onClick={() => updateStatus(order._id, "Shipped")} style={{
                            flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                            background: "#3b82f6", color: "#ffffff",
                            fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
                            onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}
                          >🚚 Dispatch</button>
                        )}
                        {order.status === "Shipped" && (
                          <div style={{
                            flex: 1, padding: "8px", borderRadius: "8px", textAlign: "center",
                            background: "#eff6ff", border: "1px solid #bfdbfe",
                            color: "#2563eb", fontSize: "0.72rem", fontWeight: 700
                          }}>✓ Delivered</div>
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
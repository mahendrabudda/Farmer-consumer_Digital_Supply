import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../Context/AppContext.jsx";
import { FarmerContent } from "../../Context/farmer/farmerContext.jsx";

const FarmerHeader = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContent);
  const { farmerData } = useContext(FarmerContent);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // ── Time-based greeting ──
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)  return "Good Morning"
    if (hour >= 12 && hour < 17) return "Good Afternoon"
    if (hour >= 17 && hour < 21) return "Good Evening"
    return "Good Night"
  }

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)  return ""
    if (hour >= 12 && hour < 17) return ""
    if (hour >= 17 && hour < 21) return ""
    return "🌙"
  }

  // ── Dynamic subtitle from real data ──
  const getSubtitle = () => {
    const pending  = farmerData?.pendingOrders || 0
    const products = farmerData?.totalProductsListed || 0
    const revenue  = farmerData?.totalRevenue || 0

    // new farmer — nothing yet
    if (products === 0) {
      return (
        <>
          Welcome to MaMholi! Start by{" "}
          <b style={{ color: "white" }}>listing your first crop</b> and
          connect directly with consumers.
        </>
      )
    }

    // has products but no orders yet
    if (farmerData?.totalOrders === 0) {
      return (
        <>
          You have <b style={{ color: "white" }}>{products} crop{products > 1 ? 's' : ''} listed</b>.
          {" "}Your first order is on the way — keep growing! 🌱
        </>
      )
    }

    // has pending orders
    if (pending > 0) {
      return (
        <>
          You have{" "}
          <b style={{ color: "white" }}>{pending} pending order{pending > 1 ? 's' : ''}</b> waiting
          {" "}and <b style={{ color: "white" }}>₹{revenue.toLocaleString('en-IN')} revenue</b> earned.
          {" "}Keep it up! 💪
        </>
      )
    }

    // all orders fulfilled
    return (
      <>
        Your farm is thriving! All orders fulfilled.{" "}
        <b style={{ color: "white" }}>₹{revenue.toLocaleString('en-IN')}</b> total revenue earned. 🎉
      </>
    )
  }

  return (
    <div style={{
      width: "100%", height: "400px",
      position: "relative", borderRadius: "32px",
      overflow: "hidden", marginBottom: "50px",
      boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
      background: "#0a0a0a",
      transform: isLoaded ? "translateY(0)" : "translateY(20px)",
      opacity: isLoaded ? 1 : 0,
      transition: "all 1.2s cubic-bezier(0.2, 0, 0.2, 1)",
    }}>

      {/* ── Background Image ── */}
      <div style={{
        position: "absolute", inset: 0,
        transform: isLoaded ? "scale(1.05)" : "scale(1.2)",
        transition: "transform 10s ease-out",
      }}>
        <img src="/farmer_1.jpg" alt="Farm Header" style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 30%",
          filter: "brightness(0.5) contrast(1.1)",
        }} />
      </div>

      {/* ── Gradient ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.7) 40%, rgba(5,5,5,0) 100%)`,
        zIndex: 1
      }} />

      {/* ── Grain ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        pointerEvents: "none", opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 3, height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 80px", color: "white", fontFamily: '"Inter", sans-serif',
      }}>

        {/* Status Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
          padding: "6px 14px", borderRadius: "100px", width: "fit-content",
          marginBottom: "20px",
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateX(0)" : "translateX(-20px)",
          transition: "all 0.8s ease 0.5s"
        }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 10px #4ade80" }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#4ade80", letterSpacing: "1px", textTransform: "uppercase" }}>
            Active Session
          </span>
        </div>

        {/* Greeting + Name */}
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 900, lineHeight: 1.1,
          margin: "0 0 15px 0", letterSpacing: "-1px",
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease 0.7s"
        }}>
          {getGreeting()} {getGreetingEmoji()} <br />
          <span style={{
            background: "linear-gradient(120deg, #4ade80, #22c55e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 15px rgba(74,222,128,0.3))"
          }}>
            {userData?.fullName || "Farmer"}
          </span>
        </h1>

        {/* ── Dynamic Subtitle ── */}
        <p style={{
          fontSize: "1.1rem", color: "rgba(255,255,255,0.5)",
          maxWidth: "500px", marginBottom: "35px",
          fontWeight: 300, lineHeight: 1.6,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease 0.9s"
        }}>
          {getSubtitle()}
        </p>

        {/* Quick Actions */}
        <div style={{
          display: "flex", gap: "20px",
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease 1.1s"
        }}>
          <button onClick={() => navigate("/farmerProduct")} style={{
            padding: "16px 32px",
            background: "linear-gradient(135deg, #4ade80, #22c55e)",
            border: "none", borderRadius: "18px",
            fontWeight: 800, fontSize: "0.85rem",
            cursor: "pointer", color: "#050505", letterSpacing: "1px",
            boxShadow: "0 15px 35px rgba(74,222,128,0.25)",
            transition: "all 0.3s ease",
            display: "flex", alignItems: "center", gap: "10px"
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 20px 45px rgba(74,222,128,0.4)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(74,222,128,0.25)" }}
          >
            <span style={{ fontSize: "1.2rem" }}>+</span> LIST NEW PRODUCE
          </button>

          <button onClick={() => navigate("/farmerOrder")} style={{
            padding: "16px 32px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)", borderRadius: "18px",
            fontWeight: 700, fontSize: "0.85rem",
            cursor: "pointer", color: "white",
            letterSpacing: "1px", transition: "all 0.3s ease"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "#4ade80" }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" }}
          >
            MANAGE ORDERS
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerHeader;

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../Context/AppContext.jsx";
import { FarmerContent } from "../../Context/farmer/farmerContext.jsx";

const FarmerHeader = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContent);
  const { farmerData } = useContext(FarmerContent);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { setIsLoaded(true); }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning"
    if (hour >= 12 && hour < 17) return "Good Afternoon"
    if (hour >= 17 && hour < 21) return "Good Evening"
    return "Good Night"
  }

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "🌅"
    if (hour >= 12 && hour < 17) return "☀️"
    if (hour >= 17 && hour < 21) return "🌇"
    return "🌙"
  }

  const getSubtitle = () => {
    const pending = farmerData?.pendingOrders || 0
    const products = farmerData?.totalProductsListed || 0
    const revenue = farmerData?.totalRevenue || 0

    if (products === 0) return (
      <>Welcome to MaMholi! Start by <b style={{ color: "#15803d" }}>listing your first crop</b> and connect directly with consumers.</>
    )
    if (farmerData?.totalOrders === 0) return (
      <>You have <b style={{ color: "#15803d" }}>{products} crop{products > 1 ? 's' : ''} listed</b>. Your first order is on the way — keep growing! 🌱</>
    )
    if (pending > 0) return (
      <>You have <b style={{ color: "#15803d" }}>{pending} pending order{pending > 1 ? 's' : ''}</b> waiting and <b style={{ color: "#15803d" }}>₹{revenue.toLocaleString('en-IN')} revenue</b> earned. Keep it up! 💪</>
    )
    return (
      <>Your farm is thriving! All orders fulfilled. <b style={{ color: "#15803d" }}>₹{revenue.toLocaleString('en-IN')}</b> total revenue earned. 🎉</>
    )
  }

  return (
    <div style={{
      width: "100%", borderRadius: "20px",
      overflow: "hidden", marginBottom: "32px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      position: "relative",
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.8s cubic-bezier(0.2,0,0.2,1)",
      background: "#111111",
      minHeight: "280px"
    }}>

      {/* Background image */}
      <div style={{
        position: "absolute", inset: 0,
        transform: isLoaded ? "scale(1.03)" : "scale(1.1)",
        transition: "transform 10s ease-out",
      }}>
        <img src="/farmer_1.jpg" alt="" style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 30%",
          filter: "brightness(0.45)",
        }} />
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)",
        zIndex: 1
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "48px 56px",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
          padding: "5px 12px", borderRadius: "100px", width: "fit-content",
          marginBottom: "16px",
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateX(0)" : "translateX(-16px)",
          transition: "all 0.8s ease 0.3s"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4ade80", letterSpacing: "1px", textTransform: "uppercase" }}>
            Active Session
          </span>
        </div>

        {/* Greeting */}
        <h1 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: 900, lineHeight: 1.15,
          margin: "0 0 12px", letterSpacing: "-0.5px", color: "#ffffff",
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.8s ease 0.4s"
        }}>
          {getGreeting()}, {getGreetingEmoji()}<br />
          <span style={{ color: "#4ade80" }}>
            {userData?.fullName || "Farmer"}
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "1rem", color: "rgba(255,255,255,0.55)",
          maxWidth: "480px", marginBottom: "28px",
          fontWeight: 400, lineHeight: 1.6,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.8s ease 0.5s"
        }}>
          {getSubtitle()}
        </p>

        {/* Buttons */}
        <div style={{
          display: "flex", gap: "12px",
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.8s ease 0.6s"
        }}>
          <button onClick={() => navigate("/farmerProduct")} style={{
            padding: "12px 24px",
            background: "#22c55e",
            border: "none", borderRadius: "10px",
            fontWeight: 700, fontSize: "0.85rem",
            cursor: "pointer", color: "#ffffff",
            transition: "all 0.2s ease",
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 4px 16px rgba(34,197,94,0.3)"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)" }}
          >
            + List New Produce
          </button>

          <button onClick={() => navigate("/farmerOrder")} style={{
            padding: "12px 24px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "10px",
            fontWeight: 600, fontSize: "0.85rem",
            cursor: "pointer", color: "#ffffff",
            transition: "all 0.2s ease"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
          >
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerHeader;
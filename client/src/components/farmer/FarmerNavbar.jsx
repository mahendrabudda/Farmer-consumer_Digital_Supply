import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContent } from "../../Context/AppContext.jsx";

const FarmerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, setIsLoggedin, setUserData } = useContext(AppContent);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cropDropdown, setCropDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = () => setCropDropdown(false);
    if (cropDropdown) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [cropDropdown]);

  const handleLogout = () => {
    setIsLoggedin(false);
    setUserData(null);
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/farmerdashboard", icon: "📊" },
    { name: "My Products", path: "/farmerProduct", icon: "🧺" },
    { name: "Orders", path: "/farmerOrder", icon: "📦" },
    { name: "Analytics", path: "/farmerAnalytics", icon: "📈" },
  ];

  const cropTools = [
    { name: "Crop Advisor", desc: "Best crop for your soil", icon: "🌱", path: "/farmer-crop-advisor" },
    { name: "Moisture Levels", desc: "Ideal water content guide", icon: "💧", path: "/farmer-moisture" },
    { name: "Crop Health Check", desc: "Diagnose crop issues", icon: "🔬", path: "/farmer-health-check" },
    { name: "Season Planner", desc: "Plan by season & region", icon: "📅", path: "/farmer-season-planner" },
    { name: "Market Prices", desc: "Live crop price trends", icon: "💰", path: "/farmer-market-prices" },
  ];

  return (
    <>
      <nav style={{
        width: "100%", position: "fixed", top: 0, left: 0, zIndex: 1000,
        padding: isScrolled ? "10px 40px" : "14px 40px",
        background: "#ffffff",
        borderBottom: "1px solid #f0f0f0",
        boxShadow: isScrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        transition: "all 0.3s ease",
        fontFamily: '"Inter", sans-serif',
        boxSizing: "border-box"
      }}>

        {/* ── Logo ── */}
        <div onClick={() => navigate("/")} style={{
          display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"
        }}>
          <span style={{ fontSize: "1.5rem" }}>🌾</span>
          <span style={{ color: "#111111", fontSize: "0.9rem", fontWeight: 900, letterSpacing: "4px", textTransform: "uppercase" }}>
            Ma<span style={{ color: "#22c55e" }}>Mholi</span>
          </span>
        </div>

        {/* ── Nav Links ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "2px",
          background: "#f8fafc", borderRadius: "12px",
          border: "1px solid #e5e7eb", padding: "4px"
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.name} onClick={() => navigate(item.path)} style={{
                background: isActive ? "#ffffff" : "transparent",
                border: "none",
                color: isActive ? "#111111" : "#6b7280",
                fontSize: "0.8rem", fontWeight: isActive ? 700 : 500,
                cursor: "pointer", padding: "7px 14px", borderRadius: "8px",
                transition: "all 0.2s ease",
                boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#111111" }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#6b7280" }}
              >
                {item.icon} {item.name}
              </button>
            );
          })}

          {/* ── Crop Tools Dropdown ── */}
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setCropDropdown(p => !p) }}
              style={{
                background: cropDropdown ? "#ffffff" : "transparent",
                border: "none",
                color: cropDropdown ? "#22c55e" : "#6b7280",
                fontSize: "0.8rem", fontWeight: cropDropdown ? 700 : 500,
                cursor: "pointer", padding: "7px 14px", borderRadius: "8px",
                transition: "all 0.2s ease",
                display: "flex", alignItems: "center", gap: "5px",
                boxShadow: cropDropdown ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
              }}
              onMouseEnter={e => { if (!cropDropdown) e.currentTarget.style.color = "#111111" }}
              onMouseLeave={e => { if (!cropDropdown) e.currentTarget.style.color = "#6b7280" }}
            >
              🌿 Crop Tools
              <span style={{
                display: "inline-block",
                transform: cropDropdown ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease", fontSize: "0.55rem"
              }}>▼</span>
            </button>

            {cropDropdown && (
              <div onClick={e => e.stopPropagation()} style={{
                position: "absolute", top: "calc(100% + 8px)", left: "50%",
                transform: "translateX(-50%)",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px", padding: "8px",
                minWidth: "240px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                zIndex: 100
              }}>
                {cropTools.map((tool) => (
                  <button key={tool.name}
                    onClick={() => { navigate(tool.path); setCropDropdown(false) }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 12px", borderRadius: "10px",
                      background: "transparent", border: "none",
                      cursor: "pointer", transition: "background 0.15s ease", textAlign: "left"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{tool.icon}</span>
                    <div>
                      <div style={{ color: "#111111", fontSize: "0.82rem", fontWeight: 600 }}>{tool.name}</div>
                      <div style={{ color: "#9ca3af", fontSize: "0.7rem", marginTop: "1px" }}>{tool.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

          {/* Bell */}
          <button style={{
            background: "#f8fafc", border: "1px solid #e5e7eb",
            borderRadius: "10px", padding: "9px 11px", cursor: "pointer",
            color: "#6b7280", fontSize: "1rem", position: "relative",
            transition: "all 0.2s ease"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "#22c55e" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280" }}
          >
            🔔
            <span style={{
              position: "absolute", top: "5px", right: "5px",
              width: "7px", height: "7px", background: "#22c55e",
              borderRadius: "50%", border: "1.5px solid #ffffff"
            }} />
          </button>

          {/* Profile */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#f8fafc", border: "1px solid #e5e7eb",
            borderRadius: "10px", padding: "6px 12px"
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "linear-gradient(135deg, #4ade80, #22c55e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.85rem", fontWeight: 900, color: "white"
            }}>
              {userData?.fullName ? userData.fullName[0].toUpperCase() : "F"}
            </div>
            <div>
              <div style={{ color: "#111111", fontSize: "0.8rem", fontWeight: 700 }}>
                {userData?.fullName || "Farmer"}
              </div>
              <div style={{ color: "#22c55e", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.5px" }}>
                🌾 FARMER
              </div>
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout} style={{
            background: "#ffffff", color: "#6b7280",
            border: "1px solid #e5e7eb",
            padding: "9px 16px", borderRadius: "10px",
            fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
            transition: "all 0.2s ease"
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#fef2f2"
              e.currentTarget.style.borderColor = "#fca5a5"
              e.currentTarget.style.color = "#ef4444"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#ffffff"
              e.currentTarget.style.borderColor = "#e5e7eb"
              e.currentTarget.style.color = "#6b7280"
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      <div style={{ height: "68px" }} />
    </>
  );
};

export default FarmerNavbar;
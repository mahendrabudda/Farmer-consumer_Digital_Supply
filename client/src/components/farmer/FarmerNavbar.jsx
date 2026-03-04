import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContent } from "../../Context/AppContext.jsx";

const FarmerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, setIsLoggedin, setUserData } = useContext(AppContent);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cropDropdown, setCropDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
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
        padding: isScrolled ? "10px 40px" : "18px 40px",
        background: isScrolled ? "rgba(5,5,5,0.85)" : "transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        fontFamily: '"Inter", sans-serif',
        boxSizing: "border-box"
      }}>

        {/* ── Logo ── */}
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <span style={{ fontSize: "1.8rem", filter: "drop-shadow(0 0 10px rgba(74,222,128,0.5))" }}>🌾</span>
          <span style={{ color: "white", fontSize: "1rem", fontWeight: 900, letterSpacing: "4px", textTransform: "uppercase" }}>
            Ma<span style={{ color: "#4ade80" }}>Mholi</span>
          </span>
        </div>

        {/* ── Nav Links ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "4px",
          background: "rgba(255,255,255,0.03)",
          padding: "6px 16px", borderRadius: "100px",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)"
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.name} onClick={() => navigate(item.path)} style={{
                background: isActive ? "rgba(74,222,128,0.1)" : "none",
                border: isActive ? "1px solid rgba(74,222,128,0.2)" : "1px solid transparent",
                color: isActive ? "#4ade80" : "rgba(255,255,255,0.55)",
                fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
                padding: "7px 16px", borderRadius: "100px",
                transition: "all 0.3s ease", letterSpacing: "0.3px",
                boxShadow: isActive ? "0 0 12px rgba(74,222,128,0.15)" : "none"
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "white" }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.55)" }}
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
                background: cropDropdown ? "rgba(74,222,128,0.1)" : "none",
                border: cropDropdown ? "1px solid rgba(74,222,128,0.2)" : "1px solid transparent",
                color: cropDropdown ? "#4ade80" : "rgba(255,255,255,0.55)",
                fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
                padding: "7px 16px", borderRadius: "100px",
                transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "6px"
              }}
              onMouseEnter={e => { if (!cropDropdown) e.currentTarget.style.color = "white" }}
              onMouseLeave={e => { if (!cropDropdown) e.currentTarget.style.color = "rgba(255,255,255,0.55)" }}
            >
              🌿 Crop Tools
              <span style={{
                display: "inline-block",
                transform: cropDropdown ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease", fontSize: "0.6rem"
              }}>▼</span>
            </button>

            {/* Dropdown */}
            {cropDropdown && (
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: "absolute", top: "calc(100% + 12px)", left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(10,10,10,0.95)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px", padding: "10px",
                  minWidth: "240px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(74,222,128,0.05)",
                  zIndex: 100
                }}
              >
                {cropTools.map((tool) => (
                  <button key={tool.name} onClick={() => { navigate(tool.path); setCropDropdown(false) }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "12px",
                      padding: "12px 14px", borderRadius: "12px",
                      background: "transparent", border: "none",
                      cursor: "pointer", transition: "background 0.2s ease", textAlign: "left"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.07)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: "1.3rem" }}>{tool.icon}</span>
                    <div>
                      <div style={{ color: "white", fontSize: "0.82rem", fontWeight: 700 }}>{tool.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", marginTop: "2px" }}>{tool.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Profile + Logout ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

          {/* Notification Bell */}
          <button style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "10px 12px", cursor: "pointer",
            color: "rgba(255,255,255,0.6)", fontSize: "1rem", position: "relative",
            transition: "all 0.3s ease"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"; e.currentTarget.style.color = "#4ade80" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)" }}
          >
            🔔
            <span style={{
              position: "absolute", top: "6px", right: "6px",
              width: "7px", height: "7px", background: "#4ade80",
              borderRadius: "50%", boxShadow: "0 0 6px #4ade80"
            }} />
          </button>

          {/* Profile Chip */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px", padding: "8px 14px"
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "linear-gradient(135deg, #4ade80, #22c55e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem", fontWeight: 900, color: "black"
            }}>
              {userData?.name ? userData.name[0].toUpperCase() : "F"}
            </div>
            <div>
              <div style={{ color: "white", fontSize: "0.82rem", fontWeight: 700 }}>
                {userData?.name || "Farmer"}
              </div>
              <div style={{ color: "#4ade80", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1px" }}>
                🌾 FARMER
              </div>
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout} style={{
            background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "10px 18px", borderRadius: "12px",
            fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
            letterSpacing: "1px", transition: "all 0.3s ease"
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)"
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"
              e.currentTarget.style.color = "#ef4444"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
              e.currentTarget.style.color = "rgba(255,255,255,0.6)"
            }}
          >
            LOGOUT
          </button>
        </div>
      </nav>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div style={{ height: "80px" }} />
    </>
  );
};

export default FarmerNavbar;
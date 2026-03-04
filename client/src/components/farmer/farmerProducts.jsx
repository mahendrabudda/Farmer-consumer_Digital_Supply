import React, { useEffect, useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import FarmerNavbar from "./FarmerNavbar.jsx";
import { AppContent } from "../../Context/AppContext.jsx";

// ── MOCK Freshness Analyzer (replace with real model later) ──
const analyzeFreshness = async (productName, harvestDate) => {
  const daysSinceHarvest = harvestDate
    ? Math.floor((new Date() - new Date(harvestDate)) / (1000 * 60 * 60 * 24))
    : 0;

  // Mock scoring based on harvest date
  const baseScore = Math.max(40, 98 - daysSinceHarvest * 3);
  const colorScore = Math.min(100, baseScore + Math.floor(Math.random() * 6 - 3));
  const textureScore = Math.min(100, baseScore + Math.floor(Math.random() * 6 - 3));

  const grade = baseScore >= 90 ? "A+" : baseScore >= 80 ? "A" : baseScore >= 65 ? "B" : baseScore >= 50 ? "C" : "D";
  const gasRisk = baseScore >= 80 ? "Low" : baseScore >= 60 ? "Medium" : "High";
  const recommendation = baseScore >= 85 ? "Good for 1 week"
    : baseScore >= 70 ? "Good for 3-5 days"
    : baseScore >= 55 ? "Sell Immediately"
    : baseScore >= 45 ? "Refrigerate"
    : "Do Not List";

  return {
    overallScore: Math.round(baseScore),
    grade,
    colorScore: Math.round(colorScore),
    colorNote: colorScore >= 85 ? "Vibrant and natural color, no discoloration detected" : "Slight color changes observed, monitor closely",
    textureScore: Math.round(textureScore),
    textureNote: textureScore >= 85 ? "Firm texture, no soft spots or bruising" : "Minor texture irregularities detected",
    gasEmissionRisk: gasRisk,
    gasNote: gasRisk === "Low"
      ? "Minimal ethylene emission, no spoilage gases detected"
      : gasRisk === "Medium"
      ? "Moderate ethylene levels, early ripening stage"
      : "High volatile compound emission, spoilage likely",
    harvestNote: harvestDate
      ? `Harvested ${daysSinceHarvest} day(s) ago — ${daysSinceHarvest <= 2 ? "very fresh" : daysSinceHarvest <= 5 ? "acceptably fresh" : "aging, sell soon"}`
      : "No harvest date provided",
    recommendation,
    summary: `${productName} shows ${grade} grade freshness with an overall score of ${Math.round(baseScore)}%. ${recommendation === "Do Not List" ? "Not recommended for listing." : "Safe to list on the marketplace."}`
  };
};
const FarmerProducts = () => {
  const { userData } = useContext(AppContent);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [freshnessResult, setFreshnessResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [uploadMode, setUploadMode] = useState("upload");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  const [newProduct, setNewProduct] = useState({
    name: "", category: "", price: "",
    quantity: "", unit: "kg", harvestDate: ""
  });

  const CATEGORIES = ["Grains", "Fruits", "Vegetables", "Dairy", "Spices", "Pulses", "Oils", "Other"];
useEffect(() => {
  const mockProducts = [
    { _id: "P1", name: "Organic Basmati Rice", category: "Grains", price: 90, quantity: 450, unit: "kg", freshnessScore: 94, grade: "A+", recommendation: "Good for 1 week", image: "/basmatiRice.png" },
    { _id: "P2", name: "Alphonso Mangoes", category: "Fruits", price: 120, quantity: 8, unit: "kg", freshnessScore: 87, grade: "A", recommendation: "Sell Immediately", image: "/mango.png" },
    { _id: "P3", name: "Pure Gir Cow Ghee", category: "Vegetables", price: 600, quantity: 85, unit: "litre", freshnessScore: 99, grade: "A+", recommendation: "Good for 1 week", image: "/carrot.png" },
  ];
    setProducts(mockProducts);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // ── Camera ──
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      toast.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setImagePreview(dataUrl);
    setImageBase64(dataUrl.split(",")[1]);
    stopCamera();
    setFreshnessResult(null);
  };

  // ── File Upload ──
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setImageBase64(ev.target.result.split(",")[1]);
      setFreshnessResult(null);
    };
    reader.readAsDataURL(file);
  };

  // ── Run Freshness Analysis ──
 const runAnalysis = async () => {
  if (!imageBase64) return toast.error("Please upload or capture an image first");
  if (!newProduct.name) return toast.error("Please enter product name first");
  setAnalyzing(true);
  setFreshnessResult(null);
  try {
    // simulate delay
    await new Promise(res => setTimeout(res, 1200));
    const result = await analyzeFreshness(newProduct.name, newProduct.harvestDate);
    setFreshnessResult(result);
    toast.success("Freshness analysis complete!");
  } catch {
    toast.error("Analysis failed. Try again.");
  } finally {
    setAnalyzing(false);
  }
}; 
  // ── Add Product ──
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return toast.error("Name and price are required");
    if (!freshnessResult) return toast.error("Please run freshness analysis first");
    if (freshnessResult.recommendation === "Do Not List") return toast.error("Product failed freshness check — cannot list");

    const product = {
      ...newProduct,
      _id: Date.now().toString(),
      image: imagePreview,
      freshnessScore: freshnessResult.overallScore,
      grade: freshnessResult.grade,
      recommendation: freshnessResult.recommendation,
    };
    setProducts([product, ...products]);
    setShowForm(false);
    setFreshnessResult(null);
    setImagePreview(null);
    setImageBase64(null);
    setNewProduct({ name: "", category: "", price: "", quantity: "", unit: "kg", harvestDate: "" });
    toast.success("Product listed successfully!");
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p._id !== id));
    toast.info("Product removed");
  };

  const scoreColor = (score) => {
    if (score >= 85) return "#4ade80";
    if (score >= 65) return "#fbbf24";
    if (score >= 45) return "#f97316";
    return "#f87171";
  };

  const gasColor = (risk) => {
    if (risk === "Low") return "#4ade80";
    if (risk === "Medium") return "#fbbf24";
    return "#f87171";
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "12px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "white", outline: "none", fontSize: "0.85rem",
    transition: "all 0.3s ease", boxSizing: "border-box"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", fontFamily: '"Inter", sans-serif', position: "relative", overflow: "hidden" }}>
      <FarmerNavbar />

      {/* ── Grain ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* ── Glows ── */}
      <div style={{ position: "fixed", width: "600px", height: "600px", background: "rgba(74,222,128,0.05)", borderRadius: "50%", filter: "blur(150px)", top: "-200px", left: "-100px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: "400px", height: "400px", background: "rgba(96,165,250,0.03)", borderRadius: "50%", filter: "blur(120px)", bottom: "-100px", right: "-100px", pointerEvents: "none" }} />

      <div style={{
        position: "relative", zIndex: 1, padding: "40px",
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.2,0,0.2,1)"
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🧺</div>
            <div>
              <h1 style={{ color: "white", fontSize: "2rem", fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>
                My{" "}
                <span style={{ background: "linear-gradient(120deg,#4ade80,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Inventory</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", margin: 0 }}>
                {products.length} products · All AI freshness verified
              </p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setFreshnessResult(null); setImagePreview(null); stopCamera(); }}
            style={{
              padding: "13px 26px", borderRadius: "14px", border: "none",
              background: showForm ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#4ade80,#22c55e)",
              color: showForm ? "white" : "black",
              fontSize: "0.82rem", fontWeight: 900, letterSpacing: "1px",
              cursor: "pointer", transition: "all 0.3s ease",
              boxShadow: showForm ? "none" : "0 0 30px rgba(74,222,128,0.25)"
            }}
          >
            {showForm ? "✕ CLOSE" : "+ LIST PRODUCT"}
          </button>
        </div>

        {/* ════════════ ADD PRODUCT FORM ════════════ */}
        {showForm && (
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "28px", padding: "36px", marginBottom: "40px",
            backdropFilter: "blur(20px)",
            animation: "fadeSlideIn 0.4s cubic-bezier(0.2,0,0.2,1)"
          }}>
            <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 900, marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#4ade80" }}>🌱</span> New Product Listing
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "28px" }}>
              <input style={inputStyle} type="text" placeholder="Product Name *"
                value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                onFocus={e => e.target.style.border = "1px solid rgba(74,222,128,0.5)"}
                onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
              />
              <select style={{ ...inputStyle, cursor: "pointer" }}
                value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="" style={{ background: "#111" }}>Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#111" }}>{c}</option>)}
              </select>
              <input style={inputStyle} type="number" placeholder="Price (₹) *"
                value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                onFocus={e => e.target.style.border = "1px solid rgba(74,222,128,0.5)"}
                onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Quantity *"
                  value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  onFocus={e => e.target.style.border = "1px solid rgba(74,222,128,0.5)"}
                  onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
                />
                <select style={{ ...inputStyle, width: "80px", cursor: "pointer" }}
                  value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}>
                  {["kg", "g", "litre", "dozen", "piece"].map(u => <option key={u} value={u} style={{ background: "#111" }}>{u}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", letterSpacing: "1px", fontWeight: 700, display: "block", marginBottom: "6px" }}>HARVEST DATE</label>
                <input style={inputStyle} type="date"
                  value={newProduct.harvestDate} onChange={e => setNewProduct({ ...newProduct, harvestDate: e.target.value })}
                  onFocus={e => e.target.style.border = "1px solid rgba(74,222,128,0.5)"}
                  onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
                />
              </div>
            </div>

            {/* ── Image Upload Section ── */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "3px", height: "18px", background: "linear-gradient(#4ade80,#22c55e)", borderRadius: "2px" }} />
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontWeight: 700, margin: 0 }}>
                  Product Image for AI Freshness Analysis
                </p>
              </div>

              {/* Upload Mode Toggle */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                {[
                  { id: "upload", label: "📁 Upload File" },
                  { id: "camera", label: "📷 Camera" }
                ].map(mode => (
                  <button key={mode.id} type="button"
                    onClick={() => { setUploadMode(mode.id); if (mode.id !== "camera") stopCamera(); }}
                    style={{
                      padding: "9px 20px", borderRadius: "10px",
                      background: uploadMode === mode.id ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)",
                      color: uploadMode === mode.id ? "#4ade80" : "rgba(255,255,255,0.4)",
                      fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                      border: uploadMode === mode.id ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      transition: "all 0.3s ease"
                    }}>
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Upload Area */}
              {uploadMode === "upload" && (
                <div
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    border: "2px dashed rgba(74,222,128,0.2)", borderRadius: "18px",
                    padding: "32px", textAlign: "center", cursor: "pointer",
                    background: "rgba(74,222,128,0.02)", transition: "all 0.3s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)"; e.currentTarget.style.background = "rgba(74,222,128,0.05)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.2)"; e.currentTarget.style.background = "rgba(74,222,128,0.02)" }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📁</div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: 0 }}>Click to upload product image</p>
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", margin: "4px 0 0" }}>JPG, PNG supported</p>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
                </div>
              )}

              {/* Camera Area */}
              {uploadMode === "camera" && (
                <div style={{ borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {!cameraActive ? (
                    <div
                      onClick={startCamera}
                      style={{
                        padding: "32px", textAlign: "center", cursor: "pointer",
                        background: "rgba(255,255,255,0.02)", transition: "all 0.3s ease"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.04)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    >
                      <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📷</div>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: 0 }}>Click to start camera</p>
                    </div>
                  ) : (
                    <div style={{ position: "relative" }}>
                      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: "300px", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "10px" }}>
                        <button onClick={capturePhoto} style={{
                          padding: "10px 24px", background: "linear-gradient(135deg,#4ade80,#22c55e)",
                          border: "none", borderRadius: "12px", color: "black",
                          fontSize: "0.8rem", fontWeight: 900, cursor: "pointer"
                        }}>📸 CAPTURE</button>
                        <button onClick={stopCamera} style={{
                          padding: "10px 16px", background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px",
                          color: "white", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer"
                        }}>✕</button>
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div style={{ marginTop: "16px", position: "relative", display: "inline-block" }}>
                  <img src={imagePreview} alt="preview" style={{ width: "180px", height: "140px", objectFit: "cover", borderRadius: "14px", border: "1px solid rgba(74,222,128,0.3)" }} />
                  <button onClick={() => { setImagePreview(null); setImageBase64(null); setFreshnessResult(null); }}
                    style={{
                      position: "absolute", top: "8px", right: "8px",
                      background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "6px",
                      color: "white", width: "24px", height: "24px", cursor: "pointer", fontSize: "0.7rem"
                    }}>✕</button>
                </div>
              )}
            </div>

            {/* ── Freshness Analysis Button ── */}
            {imagePreview && !freshnessResult && (
              <button onClick={runAnalysis} disabled={analyzing} style={{
                width: "100%", padding: "16px", borderRadius: "16px", 
                background: analyzing ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,rgba(74,222,128,0.15),rgba(34,197,94,0.1))",
                color: analyzing ? "rgba(255,255,255,0.3)" : "#4ade80",
                border: analyzing ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(74,222,128,0.3)",
                fontSize: "0.85rem", fontWeight: 900, letterSpacing: "2px",
                cursor: analyzing ? "not-allowed" : "pointer",
                transition: "all 0.3s ease", marginBottom: "20px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
              }}>
                {analyzing ? (
                  <>
                    <div style={{ width: "16px", height: "16px", border: "2px solid rgba(74,222,128,0.3)", borderTop: "2px solid #4ade80", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    ANALYZING FRESHNESS...
                  </>
                ) : "🔬 RUN AI FRESHNESS ANALYSIS"}
              </button>
            )}

            {/* ── Freshness Result ── */}
            {freshnessResult && (
              <div style={{
                background: "rgba(255,255,255,0.02)", border: `1px solid ${scoreColor(freshnessResult.overallScore)}30`,
                borderRadius: "20px", padding: "24px", marginBottom: "24px",
                boxShadow: `0 0 30px ${scoreColor(freshnessResult.overallScore)}08`
              }}>
                {/* Score Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "70px", height: "70px", borderRadius: "50%",
                      background: `conic-gradient(${scoreColor(freshnessResult.overallScore)} ${freshnessResult.overallScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 0 20px ${scoreColor(freshnessResult.overallScore)}30`
                    }}>
                      <div style={{
                        width: "54px", height: "54px", borderRadius: "50%", background: "#050505",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                      }}>
                        <span style={{ color: scoreColor(freshnessResult.overallScore), fontSize: "1rem", fontWeight: 900, lineHeight: 1 }}>{freshnessResult.overallScore}</span>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.5rem", letterSpacing: "1px" }}>SCORE</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "white", fontSize: "1rem", fontWeight: 900 }}>Freshness Grade: <span style={{ color: scoreColor(freshnessResult.overallScore) }}>{freshnessResult.grade}</span></div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", marginTop: "4px" }}>{freshnessResult.summary}</div>
                    </div>
                  </div>
                  <div style={{
                    padding: "8px 18px", borderRadius: "12px",
                    background: freshnessResult.recommendation === "Do Not List" ? "rgba(248,113,113,0.1)" : "rgba(74,222,128,0.1)",
                    border: `1px solid ${freshnessResult.recommendation === "Do Not List" ? "rgba(248,113,113,0.3)" : "rgba(74,222,128,0.3)"}`,
                    color: freshnessResult.recommendation === "Do Not List" ? "#f87171" : "#4ade80",
                    fontSize: "0.75rem", fontWeight: 900
                  }}>
                    {freshnessResult.recommendation === "Do Not List" ? "❌" : "✓"} {freshnessResult.recommendation}
                  </div>
                </div>

                {/* Metric Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
                  {[
                    { label: "COLOR ANALYSIS", score: freshnessResult.colorScore, note: freshnessResult.colorNote, icon: "🎨" },
                    { label: "TEXTURE GRADE", score: freshnessResult.textureScore, note: freshnessResult.textureNote, icon: "🔍" },
                  ].map((m, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.1rem" }}>{m.icon}</span>
                        <span style={{ color: scoreColor(m.score), fontSize: "1rem", fontWeight: 900 }}>{m.score}%</span>
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1px", marginBottom: "4px" }}>{m.label}</div>
                      <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden", marginBottom: "6px" }}>
                        <div style={{ height: "100%", width: `${m.score}%`, background: scoreColor(m.score), borderRadius: "2px", boxShadow: `0 0 6px ${scoreColor(m.score)}60` }} />
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem" }}>{m.note}</div>
                    </div>
                  ))}

                  {/* Gas Emission */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "1.1rem" }}>🧪</span>
                      <span style={{
                        padding: "3px 10px", borderRadius: "8px", fontSize: "0.68rem", fontWeight: 900,
                        background: `${gasColor(freshnessResult.gasEmissionRisk)}15`,
                        color: gasColor(freshnessResult.gasEmissionRisk),
                        border: `1px solid ${gasColor(freshnessResult.gasEmissionRisk)}30`
                      }}>{freshnessResult.gasEmissionRisk}</span>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1px", marginBottom: "6px" }}>GAS EMISSION RISK</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem" }}>{freshnessResult.gasNote}</div>
                  </div>

                  {/* Harvest Age */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px" }}>
                    <div style={{ fontSize: "1.1rem", marginBottom: "8px" }}>📅</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1px", marginBottom: "6px" }}>HARVEST AGE</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem" }}>{freshnessResult.harvestNote}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Submit Button ── */}
            <button onClick={handleAddProduct} style={{
              padding: "15px 40px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg,#4ade80,#22c55e)",
              color: "black", fontSize: "0.85rem", fontWeight: 900,
              letterSpacing: "2px", cursor: "pointer",
              boxShadow: "0 0 30px rgba(74,222,128,0.2)",
              transition: "all 0.3s ease"
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 40px rgba(74,222,128,0.4)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(74,222,128,0.2)"}
            >
              ✓ CONFIRM LISTING
            </button>
          </div>
        )}

        {/* ════════════ PRODUCT GRID ════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {products.map((product, idx) => (
            <div key={product._id} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "24px", overflow: "hidden",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.7s cubic-bezier(0.2,0,0.2,1) ${idx * 0.08}s`
            }}
              onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(74,222,128,0.2)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(0,0,0,0.4)" }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
            >
              {/* Image */}
              <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                <img src={product.image || "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=400"}
                  alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(5,5,5,0.8) 100%)" }} />

                {/* Category Badge */}
                <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(5,5,5,0.7)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.65rem", fontWeight: 800, color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
                  {product.category}
                </div>

                {/* Freshness Score Badge */}
                {product.freshnessScore && (
                  <div style={{
                    position: "absolute", top: "12px", right: "12px",
                    background: "rgba(5,5,5,0.8)", border: `1px solid ${scoreColor(product.freshnessScore)}40`,
                    padding: "4px 10px", borderRadius: "20px", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", gap: "5px"
                  }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: scoreColor(product.freshnessScore), boxShadow: `0 0 6px ${scoreColor(product.freshnessScore)}` }} />
                    <span style={{ color: scoreColor(product.freshnessScore), fontSize: "0.7rem", fontWeight: 900 }}>{product.freshnessScore}% Fresh</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 800, margin: 0, flex: 1 }}>{product.name}</h3>
                  {product.grade && (
                    <span style={{
                      background: `${scoreColor(product.freshnessScore)}15`,
                      color: scoreColor(product.freshnessScore),
                      border: `1px solid ${scoreColor(product.freshnessScore)}30`,
                      padding: "2px 10px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: 900, marginLeft: "8px"
                    }}>{product.grade}</span>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ color: "white", fontSize: "1.1rem", fontWeight: 900 }}>
                    ₹{product.price}
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: 400 }}> / {product.unit || "kg"}</span>
                  </div>
                  <div style={{ color: product.quantity < 10 ? "#f87171" : "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontWeight: 600 }}>
                    {product.quantity < 10 ? `⚠ Low: ${product.quantity}` : `✓ ${product.quantity}`} {product.unit || "kg"}
                  </div>
                </div>

                {/* Recommendation */}
                {product.recommendation && (
                  <div style={{ marginBottom: "14px", padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>
                    ⏱ {product.recommendation}
                  </div>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{
                    flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                    color: "rgba(255,255,255,0.7)", fontSize: "0.72rem", fontWeight: 700,
                    cursor: "pointer", transition: "all 0.3s ease"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"; e.currentTarget.style.color = "#4ade80" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)" }}
                  >✏ EDIT</button>
                  <button onClick={() => handleDelete(product._id)} style={{
                    flex: 1, padding: "10px", background: "rgba(248,113,113,0.06)",
                    border: "1px solid rgba(248,113,113,0.15)", borderRadius: "10px",
                    color: "#f87171", fontSize: "0.72rem", fontWeight: 700,
                    cursor: "pointer", transition: "all 0.3s ease"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(248,113,113,0.15)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(248,113,113,0.06)"; e.currentTarget.style.boxShadow = "none" }}
                  >🗑 DELETE</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(-12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
};

export default FarmerProducts;
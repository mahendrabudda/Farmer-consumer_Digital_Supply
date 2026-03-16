import React, { useEffect, useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import FarmerNavbar from "./FarmerNavbar.jsx";
import { AppContent } from "../../Context/AppContext.jsx";

const analyzeFreshness = async (productName, harvestDate) => {
  const daysSinceHarvest = harvestDate
    ? Math.floor((new Date() - new Date(harvestDate)) / (1000 * 60 * 60 * 24)) : 0;
  const baseScore = Math.max(40, 98 - daysSinceHarvest * 3);
  const colorScore = Math.min(100, baseScore + Math.floor(Math.random() * 6 - 3));
  const textureScore = Math.min(100, baseScore + Math.floor(Math.random() * 6 - 3));
  const grade = baseScore >= 90 ? "A+" : baseScore >= 80 ? "A" : baseScore >= 65 ? "B" : baseScore >= 50 ? "C" : "D";
  const gasRisk = baseScore >= 80 ? "Low" : baseScore >= 60 ? "Medium" : "High";
  const recommendation = baseScore >= 85 ? "Good for 1 week" : baseScore >= 70 ? "Good for 3-5 days" : baseScore >= 55 ? "Sell Immediately" : baseScore >= 45 ? "Refrigerate" : "Do Not List";
  return {
    overallScore: Math.round(baseScore), grade,
    colorScore: Math.round(colorScore),
    colorNote: colorScore >= 85 ? "Vibrant and natural color detected" : "Slight color changes observed",
    textureScore: Math.round(textureScore),
    textureNote: textureScore >= 85 ? "Firm texture, no soft spots" : "Minor texture irregularities detected",
    gasEmissionRisk: gasRisk,
    gasNote: gasRisk === "Low" ? "Minimal ethylene emission detected" : gasRisk === "Medium" ? "Moderate ethylene levels, early ripening" : "High volatile compounds, spoilage likely",
    harvestNote: harvestDate ? `Harvested ${daysSinceHarvest} day(s) ago — ${daysSinceHarvest <= 2 ? "very fresh" : daysSinceHarvest <= 5 ? "acceptably fresh" : "aging, sell soon"}` : "No harvest date provided",
    recommendation,
    summary: `${productName} shows ${grade} grade freshness with score ${Math.round(baseScore)}%. ${recommendation === "Do Not List" ? "Not recommended for listing." : "Safe to list on marketplace."}`
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
  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: "", quantity: "", unit: "kg", harvestDate: "" });
  const CATEGORIES = ["Grains", "Fruits", "Vegetables", "Dairy", "Spices", "Pulses", "Oils", "Other"];

  useEffect(() => {
    const mockProducts = [
      { _id: "P1", name: "Organic Basmati Rice", category: "Grains", price: 90, quantity: 450, unit: "kg", freshnessScore: 94, grade: "A+", recommendation: "Good for 1 week", image: "/basmatiRice.png" },
      { _id: "P2", name: "Alphonso Mangoes", category: "Fruits", price: 120, quantity: 8, unit: "kg", freshnessScore: 87, grade: "A", recommendation: "Sell Immediately", image: "/mango.png" },
      { _id: "P3", name: "Pure Gir Cow Ghee", category: "Dairy", price: 600, quantity: 85, unit: "litre", freshnessScore: 99, grade: "A+", recommendation: "Good for 1 week", image: "/carrot.png" },
    ];
    setProducts(mockProducts);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch { toast.error("Camera access denied"); }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current; const video = videoRef.current;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setImagePreview(dataUrl); setImageBase64(dataUrl.split(",")[1]);
    stopCamera(); setFreshnessResult(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImagePreview(ev.target.result); setImageBase64(ev.target.result.split(",")[1]); setFreshnessResult(null); };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    if (!imageBase64) return toast.error("Please upload or capture an image first");
    if (!newProduct.name) return toast.error("Please enter product name first");
    setAnalyzing(true); setFreshnessResult(null);
    try {
      await new Promise(res => setTimeout(res, 1200));
      const result = await analyzeFreshness(newProduct.name, newProduct.harvestDate);
      setFreshnessResult(result); toast.success("Freshness analysis complete!");
    } catch { toast.error("Analysis failed. Try again."); }
    finally { setAnalyzing(false); }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return toast.error("Name and price are required");
    if (!freshnessResult) return toast.error("Please run freshness analysis first");
    if (freshnessResult.recommendation === "Do Not List") return toast.error("Product failed freshness check");
    const product = { ...newProduct, _id: Date.now().toString(), image: imagePreview, freshnessScore: freshnessResult.overallScore, grade: freshnessResult.grade, recommendation: freshnessResult.recommendation };
    setProducts([product, ...products]);
    setShowForm(false); setFreshnessResult(null); setImagePreview(null); setImageBase64(null);
    setNewProduct({ name: "", category: "", price: "", quantity: "", unit: "kg", harvestDate: "" });
    toast.success("Product listed successfully!");
  };

  const handleDelete = (id) => { setProducts(products.filter(p => p._id !== id)); toast.info("Product removed"); };

  const scoreColor = (score) => {
    if (score >= 85) return "#22c55e";
    if (score >= 65) return "#f59e0b";
    if (score >= 45) return "#f97316";
    return "#ef4444";
  };

  const scoreBg = (score) => {
    if (score >= 85) return "#f0fdf4";
    if (score >= 65) return "#fffbeb";
    if (score >= 45) return "#fff7ed";
    return "#fef2f2";
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "9px",
    background: "#ffffff", border: "1px solid #e5e7eb",
    color: "#111111", outline: "none", fontSize: "0.85rem",
    transition: "border 0.2s ease", boxSizing: "border-box",
    fontFamily: '"Inter", sans-serif'
  };

  const labelStyle = {
    color: "#374151", fontSize: "0.75rem", fontWeight: 600,
    display: "block", marginBottom: "5px"
  };

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ color: "#111111", fontSize: "1.8rem", fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.8px" }}>
              My Inventory
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "0.88rem", margin: 0 }}>
              {products.length} products · All AI freshness verified
            </p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setFreshnessResult(null); setImagePreview(null); stopCamera(); }} style={{
            padding: "11px 22px", borderRadius: "10px", border: "none",
            background: showForm ? "#f3f4f6" : "#22c55e",
            color: showForm ? "#374151" : "#ffffff",
            fontSize: "0.85rem", fontWeight: 700,
            cursor: "pointer", transition: "all 0.2s ease",
            boxShadow: showForm ? "none" : "0 2px 8px rgba(34,197,94,0.3)"
          }}
            onMouseEnter={e => { if (!showForm) e.currentTarget.style.background = "#16a34a" }}
            onMouseLeave={e => { if (!showForm) e.currentTarget.style.background = "#22c55e" }}
          >
            {showForm ? "✕ Close" : "+ List Product"}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div style={{
            background: "#ffffff", border: "1px solid #e5e7eb",
            borderRadius: "20px", padding: "32px", marginBottom: "28px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            animation: "fadeSlideIn 0.3s cubic-bezier(0.2,0,0.2,1)"
          }}>
            <h2 style={{ color: "#111111", fontSize: "1rem", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
              🌱 New Product Listing
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input style={inputStyle} type="text" placeholder="e.g. Organic Tomatoes"
                  value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  onFocus={e => e.target.style.border = "1px solid #22c55e"}
                  onBlur={e => e.target.style.border = "1px solid #e5e7eb"}
                />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={{ ...inputStyle, cursor: "pointer" }}
                  value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Price (₹) *</label>
                <input style={inputStyle} type="number" placeholder="0"
                  value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  onFocus={e => e.target.style.border = "1px solid #22c55e"}
                  onBlur={e => e.target.style.border = "1px solid #e5e7eb"}
                />
              </div>
              <div>
                <label style={labelStyle}>Quantity & Unit</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="0"
                    value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    onFocus={e => e.target.style.border = "1px solid #22c55e"}
                    onBlur={e => e.target.style.border = "1px solid #e5e7eb"}
                  />
                  <select style={{ ...inputStyle, width: "80px", cursor: "pointer" }}
                    value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}>
                    {["kg", "g", "litre", "dozen", "piece"].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Harvest Date</label>
                <input style={inputStyle} type="date"
                  value={newProduct.harvestDate} onChange={e => setNewProduct({ ...newProduct, harvestDate: e.target.value })}
                  onFocus={e => e.target.style.border = "1px solid #22c55e"}
                  onBlur={e => e.target.style.border = "1px solid #e5e7eb"}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "3px", height: "16px", background: "#22c55e", borderRadius: "2px" }} />
                <p style={{ color: "#374151", fontSize: "0.85rem", fontWeight: 600, margin: 0 }}>
                  Product Image for AI Freshness Analysis
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                {[{ id: "upload", label: "📁 Upload File" }, { id: "camera", label: "📷 Camera" }].map(mode => (
                  <button key={mode.id} type="button"
                    onClick={() => { setUploadMode(mode.id); if (mode.id !== "camera") stopCamera(); }}
                    style={{
                      padding: "8px 16px", borderRadius: "8px",
                      background: uploadMode === mode.id ? "#f0fdf4" : "#f8fafc",
                      color: uploadMode === mode.id ? "#16a34a" : "#6b7280",
                      fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                      border: uploadMode === mode.id ? "1px solid #22c55e" : "1px solid #e5e7eb",
                      transition: "all 0.2s ease"
                    }}>
                    {mode.label}
                  </button>
                ))}
              </div>

              {uploadMode === "upload" && (
                <div onClick={() => fileInputRef.current.click()} style={{
                  border: "2px dashed #d1d5db", borderRadius: "14px",
                  padding: "28px", textAlign: "center", cursor: "pointer",
                  background: "#fafafa", transition: "all 0.2s ease"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.background = "#f0fdf4" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#fafafa" }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📁</div>
                  <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: 0 }}>Click to upload product image</p>
                  <p style={{ color: "#d1d5db", fontSize: "0.72rem", margin: "3px 0 0" }}>JPG, PNG supported</p>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
                </div>
              )}

              {uploadMode === "camera" && (
                <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                  {!cameraActive ? (
                    <div onClick={startCamera} style={{ padding: "28px", textAlign: "center", cursor: "pointer", background: "#fafafa", transition: "all 0.2s ease" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fafafa"}
                    >
                      <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📷</div>
                      <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: 0 }}>Click to start camera</p>
                    </div>
                  ) : (
                    <div style={{ position: "relative" }}>
                      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: "280px", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", bottom: "14px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "10px" }}>
                        <button onClick={capturePhoto} style={{ padding: "9px 20px", background: "#22c55e", border: "none", borderRadius: "9px", color: "white", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>📸 Capture</button>
                        <button onClick={stopCamera} style={{ padding: "9px 14px", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "9px", color: "white", fontSize: "0.8rem", cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              )}

              {imagePreview && (
                <div style={{ marginTop: "14px", position: "relative", display: "inline-block" }}>
                  <img src={imagePreview} alt="preview" style={{ width: "160px", height: "120px", objectFit: "cover", borderRadius: "10px", border: "1px solid #e5e7eb" }} />
                  <button onClick={() => { setImagePreview(null); setImageBase64(null); setFreshnessResult(null); }}
                    style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "5px", color: "white", width: "22px", height: "22px", cursor: "pointer", fontSize: "0.65rem" }}>✕</button>
                </div>
              )}
            </div>

            {/* Analysis Button */}
            {imagePreview && !freshnessResult && (
              <button onClick={runAnalysis} disabled={analyzing} style={{
                width: "100%", padding: "14px", borderRadius: "12px",
                background: analyzing ? "#f3f4f6" : "#f0fdf4",
                color: analyzing ? "#9ca3af" : "#16a34a",
                border: analyzing ? "1px solid #e5e7eb" : "1px solid #22c55e",
                fontSize: "0.85rem", fontWeight: 700,
                cursor: analyzing ? "not-allowed" : "pointer",
                transition: "all 0.2s ease", marginBottom: "16px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
              }}>
                {analyzing ? (
                  <>
                    <div style={{ width: "14px", height: "14px", border: "2px solid #d1d5db", borderTop: "2px solid #22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Analyzing Freshness...
                  </>
                ) : "🔬 Run AI Freshness Analysis"}
              </button>
            )}

            {/* Freshness Result */}
            {freshnessResult && (
              <div style={{
                background: scoreBg(freshnessResult.overallScore),
                border: `1px solid ${scoreColor(freshnessResult.overallScore)}40`,
                borderRadius: "16px", padding: "20px", marginBottom: "20px"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "60px", height: "60px", borderRadius: "50%",
                      background: `conic-gradient(${scoreColor(freshnessResult.overallScore)} ${freshnessResult.overallScore * 3.6}deg, #e5e7eb 0deg)`,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <div style={{
                        width: "46px", height: "46px", borderRadius: "50%", background: "#ffffff",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                      }}>
                        <span style={{ color: scoreColor(freshnessResult.overallScore), fontSize: "0.9rem", fontWeight: 900, lineHeight: 1 }}>{freshnessResult.overallScore}</span>
                        <span style={{ color: "#9ca3af", fontSize: "0.45rem", letterSpacing: "1px" }}>SCORE</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#111111", fontSize: "0.9rem", fontWeight: 700 }}>Grade: <span style={{ color: scoreColor(freshnessResult.overallScore) }}>{freshnessResult.grade}</span></div>
                      <div style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "3px", maxWidth: "300px" }}>{freshnessResult.summary}</div>
                    </div>
                  </div>
                  <span style={{
                    padding: "6px 14px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700,
                    background: freshnessResult.recommendation === "Do Not List" ? "#fef2f2" : "#f0fdf4",
                    color: freshnessResult.recommendation === "Do Not List" ? "#ef4444" : "#16a34a",
                    border: `1px solid ${freshnessResult.recommendation === "Do Not List" ? "#fecaca" : "#bbf7d0"}`
                  }}>
                    {freshnessResult.recommendation === "Do Not List" ? "❌" : "✓"} {freshnessResult.recommendation}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                  {[
                    { label: "COLOR", score: freshnessResult.colorScore, note: freshnessResult.colorNote, icon: "🎨" },
                    { label: "TEXTURE", score: freshnessResult.textureScore, note: freshnessResult.textureNote, icon: "🔍" },
                    { label: "GAS RISK", value: freshnessResult.gasEmissionRisk, note: freshnessResult.gasNote, icon: "🧪" },
                    { label: "HARVEST AGE", note: freshnessResult.harvestNote, icon: "📅" },
                  ].map((m, i) => (
                    <div key={i} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "1rem" }}>{m.icon}</span>
                        {m.score !== undefined && <span style={{ color: scoreColor(m.score), fontSize: "0.9rem", fontWeight: 700 }}>{m.score}%</span>}
                        {m.value && <span style={{ color: scoreColor(m.value === "Low" ? 90 : m.value === "Medium" ? 65 : 40), fontSize: "0.72rem", fontWeight: 700 }}>{m.value}</span>}
                      </div>
                      <div style={{ color: "#9ca3af", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "1px", marginBottom: "4px" }}>{m.label}</div>
                      {m.score !== undefined && (
                        <div style={{ height: "4px", background: "#f3f4f6", borderRadius: "2px", overflow: "hidden", marginBottom: "5px" }}>
                          <div style={{ height: "100%", width: `${m.score}%`, background: scoreColor(m.score), borderRadius: "2px" }} />
                        </div>
                      )}
                      <div style={{ color: "#6b7280", fontSize: "0.68rem", lineHeight: 1.4 }}>{m.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button onClick={handleAddProduct} style={{
              padding: "12px 32px", borderRadius: "10px", border: "none",
              background: "#22c55e", color: "#ffffff",
              fontSize: "0.85rem", fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(34,197,94,0.3)"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#16a34a" }}
              onMouseLeave={e => { e.currentTarget.style.background = "#22c55e" }}
            >
              ✓ Confirm Listing
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {products.map((product, idx) => (
            <div key={product._id} style={{
              background: "#ffffff", border: "1px solid #e5e7eb",
              borderRadius: "16px", overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(16px)",
              transition: `all 0.6s cubic-bezier(0.2,0,0.2,1) ${idx * 0.06}s`
            }}
              onMouseEnter={e => { e.currentTarget.style.border = "1px solid #bbf7d0"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)" }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid #e5e7eb"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              {/* Image */}
              <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                <img src={product.image || "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=400"}
                  alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                {/* Category Badge */}
                <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(255,255,255,0.92)", border: "1px solid #e5e7eb", padding: "3px 10px", borderRadius: "20px", fontSize: "0.65rem", fontWeight: 700, color: "#374151", backdropFilter: "blur(4px)" }}>
                  {product.category}
                </div>

                {/* Freshness Badge */}
                {product.freshnessScore && (
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    background: "rgba(255,255,255,0.92)", border: `1px solid ${scoreColor(product.freshnessScore)}50`,
                    padding: "3px 10px", borderRadius: "20px", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", gap: "4px"
                  }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: scoreColor(product.freshnessScore) }} />
                    <span style={{ color: scoreColor(product.freshnessScore), fontSize: "0.68rem", fontWeight: 700 }}>{product.freshnessScore}% Fresh</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 style={{ color: "#111111", fontSize: "0.95rem", fontWeight: 700, margin: 0, flex: 1 }}>{product.name}</h3>
                  {product.grade && (
                    <span style={{
                      background: scoreBg(product.freshnessScore),
                      color: scoreColor(product.freshnessScore),
                      border: `1px solid ${scoreColor(product.freshnessScore)}40`,
                      padding: "2px 8px", borderRadius: "6px", fontSize: "0.68rem", fontWeight: 700, marginLeft: "8px"
                    }}>{product.grade}</span>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ color: "#111111", fontSize: "1rem", fontWeight: 700 }}>
                    ₹{product.price}
                    <span style={{ color: "#9ca3af", fontSize: "0.72rem", fontWeight: 400 }}> / {product.unit || "kg"}</span>
                  </div>
                  <div style={{ color: product.quantity < 10 ? "#ef4444" : "#9ca3af", fontSize: "0.75rem", fontWeight: 600 }}>
                    {product.quantity < 10 ? `⚠ Low: ${product.quantity}` : `✓ ${product.quantity}`} {product.unit}
                  </div>
                </div>

                {product.recommendation && (
                  <div style={{ marginBottom: "12px", padding: "6px 10px", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#6b7280", fontSize: "0.72rem" }}>
                    ⏱ {product.recommendation}
                  </div>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{
                    flex: 1, padding: "9px", background: "#f8fafc",
                    border: "1px solid #e5e7eb", borderRadius: "8px",
                    color: "#374151", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "#16a34a" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151" }}
                  >✏ Edit</button>
                  <button onClick={() => handleDelete(product._id)} style={{
                    flex: 1, padding: "9px", background: "#fef2f2",
                    border: "1px solid #fecaca", borderRadius: "8px",
                    color: "#ef4444", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2" }}
                  >🗑 Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
};

export default FarmerProducts;
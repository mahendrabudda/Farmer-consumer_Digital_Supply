import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // ── Crop Details ──
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Grains", "Fruits", "Vegetables", "Dairy", "Spices", "Pulses", "Oils", "Other"],
      required: true,
    },
    description: { type: String, default: "", maxlength: 500 },
    image: { type: String, default: "" },

    // ── Pricing & Stock ──
    pricePerUnit: { type: Number, required: true },
    unit: {
      type: String,
      enum: ["kg", "g", "litre", "dozen", "piece"],
      default: "kg",
    },
    quantityAvailable: { type: Number, required: true, default: 0 },
    minimumOrderQuantity: { type: Number, default: 1 },

    // ── Freshness (AI analysis result) ──
    harvestDate: { type: Date, default: null },
    freshnessScore: { type: Number, default: null, min: 0, max: 100 },
    freshnessGrade: {
      type: String,
      enum: ["A+", "A", "B", "C", "D", ""],
      default: "",
    },
    freshnessRecommendation: { type: String, default: "" },

    // ── Listing Status ──
    isListed: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },

    // ── Stats (updated as orders arrive) ──
    totalUnitsSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const cropModel = mongoose.models.crop || mongoose.model("crop", cropSchema);
export default cropModel;
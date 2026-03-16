import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    // ── Link ──
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // ── Revenue ──
    totalRevenue: { type: Number, default: 0 },
    netIncome: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    totalTransportCost: { type: Number, default: 0 },
    paymentPending: { type: Number, default: 0 },

    // ── Orders ──
    totalOrders: { type: Number, default: 0 },
    pendingOrders: { type: Number, default: 0 },
    acceptedOrders: { type: Number, default: 0 },
    shippedOrders: { type: Number, default: 0 },
    deliveredOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
    rejectedOrders: { type: Number, default: 0 },

    // ── Monthly Revenue (array of 12, index 0 = Jan) ──
    monthlyRevenue: {
      type: [Number],
      default: Array(12).fill(0),
    },

    // ── Top Products (top 5 by revenue, refreshed periodically) ──
    topProducts: [
      {
        cropId: { type: mongoose.Schema.Types.ObjectId, ref: "crop" },
        name: { type: String },
        icon: { type: String, default: "🌾" },
        totalUnitsSold: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
        totalOrders: { type: Number, default: 0 },
        growthPercent: { type: Number, default: 0 },
      },
    ],

    // ── Recent Transactions (last 20, acts as quick ledger) ──
    recentTransactions: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
        customerName: { type: String },
        amount: { type: Number },
        paymentMethod: { type: String },
        paymentStatus: { type: String },
        date: { type: Date },
      },
    ],

    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const analyticsModel =
  mongoose.models.analytics || mongoose.model("analytics", analyticsSchema);

export default analyticsModel;

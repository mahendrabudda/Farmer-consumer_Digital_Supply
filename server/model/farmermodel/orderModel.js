import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ── Who placed it ──
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // ── Who fulfills it ──
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },

    // ── What was ordered ──
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "crop",
      required: true,
    },
    cropName: { type: String, required: true },  // snapshot at order time
    cropImage: { type: String, default: "" },

    // ── Order Details ──
    quantity: { type: Number, required: true },
    unit: { type: String, default: "kg" },
    pricePerUnit: { type: Number, required: true }, // snapshot at order time
    totalAmount: { type: Number, required: true },

    // ── Delivery ──
    deliveryAddress: { type: String, required: true },
    deliveryInstructions: { type: String, default: "" },

    // ── Status Pipeline ──
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    // ── Payment ──
    paymentMethod: {
      type: String,
      enum: ["UPI", "Bank Transfer", "COD", "Card"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded", "Failed"],
      default: "Pending",
    },
    paymentDate: { type: Date, default: null },

    // ── Consumer Rating (after delivery) ──
    rating: { type: Number, default: null, min: 1, max: 5 },
    review: { type: String, default: "" },
    reviewedAt: { type: Date, default: null },

    // ── Timestamps for each stage ──
    acceptedAt: { type: Date, default: null },
    shippedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
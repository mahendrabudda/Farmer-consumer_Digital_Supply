import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    // ── Link to User ──
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    // ── Farm Info ──
    farmName: { type: String, trim: true, default: "" },
    farmLocation: { type: String, trim: true, default: "" },
    farmSizeAcres: { type: Number, default: 0 },
    farmingType: {
      type: String,
      enum: ["organic", "conventional", "mixed", ""],
      default: "",
    },

    // ── Public Profile ──
    profileImage: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 300 },
    isVerifiedFarmer: { type: Boolean, default: false },

    // ── Ratings (computed from orders) ──
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const farmerModel = mongoose.models.farmer || mongoose.model("farmer", farmerSchema);
export default farmerModel;
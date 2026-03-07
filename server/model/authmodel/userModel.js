import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["farmer", "consumer"],
      required: true,
    },

    // 🔐 Account Verification
    verifyOtp: {
      type: String,
      default: "",
    },

    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    // 🔑 Password Reset
    resetOtp: {
      type: String,
      default: "",
    },

    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


const userModel = mongoose.models.user || mongoose.model('user',userSchema)
export default userModel;
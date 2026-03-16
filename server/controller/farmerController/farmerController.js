import userModel from "../../model/authmodel/userModel.js";
import farmerModel from "../../model/farmermodel/farmerModel.js";
import analyticsModel from "../../model/farmermodel/analyticsModel.js";

// ══════════════════════════════════════
// ── HELPERS (called from authController) ──
// ══════════════════════════════════════

export const createFarmerProfileHelper = async (userId) => {
  const existing = await farmerModel.findOne({ userId })
  if (existing) return existing

  const farmer = new farmerModel({ userId })
  await farmer.save()

  const analytics = new analyticsModel({
    farmerId: farmer._id,
    userId,
  })
  await analytics.save()

  return farmer
}

export const getFarmerDashboardHelper = async (userId) => {
  const user = await userModel.findById(userId).select("-password -resetOtp -verifyOtp")
  if (!user) return null

  const farmer = await farmerModel.findOne({ userId })
  if (!farmer) return null

  const analytics = await analyticsModel.findOne({ farmerId: farmer._id })

  return {
    // user info
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,

    // farmer info
    farmerId: farmer._id,
    farmName: farmer.farmName || '',
    farmLocation: farmer.farmLocation || '',
    farmSizeAcres: farmer.farmSizeAcres || 0,
    farmingType: farmer.farmingType || '',
    profileImage: farmer.profileImage || '',
    bio: farmer.bio || '',
    isVerifiedFarmer: farmer.isVerifiedFarmer || false,
    rating: farmer.rating || 0,
    totalRatings: farmer.totalRatings || 0,

    // analytics
    totalRevenue: analytics?.totalRevenue || 0,
    totalOrders: analytics?.totalOrders || 0,
    pendingOrders: analytics?.pendingOrders || 0,
    deliveredOrders: analytics?.deliveredOrders || 0,
    cancelledOrders: analytics?.cancelledOrders || 0,
    monthlyRevenue: analytics?.monthlyRevenue || Array(12).fill(0),
  }
}

// ══════════════════════════════════════
// ── ROUTE HANDLERS ──
// ══════════════════════════════════════

export const createFarmerProfile = async (req, res) => {
  const { userId } = req.body
  try {
    const existing = await farmerModel.findOne({ userId })
    if (existing) {
      return res.json({ success: false, message: "Farmer profile already exists" })
    }
    const farmer = await createFarmerProfileHelper(userId)
    return res.json({ success: true, message: "Farmer profile created", farmerId: farmer._id })
  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}

export const getFarmerDashboard = async (req, res) => {
  const userId = req.userId
  try {
    const dashboard = await getFarmerDashboardHelper(userId)
    if (!dashboard) {
      return res.json({ success: false, message: "Farmer profile not found" })
    }
    return res.json({ success: true, dashboard })
  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}

export const updateFarmerProfile = async (req, res) => {
  const userId = req.userId
  const { farmName, farmLocation, farmSizeAcres, farmingType, bio, profileImage } = req.body
  try {
    const farmer = await farmerModel.findOneAndUpdate(
      { userId },
      { farmName, farmLocation, farmSizeAcres, farmingType, bio, profileImage },
      { new: true }
    )
    if (!farmer) {
      return res.json({ success: false, message: "Farmer profile not found" })
    }
    return res.json({ success: true, message: "Profile updated successfully", farmer })
  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}
import analyticsModel from "../../model/farmermodel/analyticsModel.js";
import farmerModel from "../../model/farmermodel/farmerModel.js";
import cropModel from "../../model/farmermodel/cropModel.js";
import orderModel from "../../model/farmermodel/orderModel.js";

// ── GET full analytics for farmer dashboard ──
export const getFarmerAnalytics = async (req, res) => {
  const userId = req.userId;

  try {
    const farmer = await farmerModel.findOne({ userId });
    if (!farmer) {
      return res.json({ success: false, message: "Farmer profile not found" });
    }

    const analytics = await analyticsModel.findOne({ farmerId: farmer._id });
    if (!analytics) {
      return res.json({ success: false, message: "Analytics not found" });
    }

    // get top 5 crops by revenue
    const topCrops = await cropModel
      .find({ farmerId: farmer._id })
      .sort({ totalRevenue: -1 })
      .limit(5)
      .select("name category totalUnitsSold totalRevenue totalOrders");

    // get last 10 delivered orders as recent transactions
    const recentTransactions = await orderModel
      .find({ farmerId: farmer._id, status: "Delivered" })
      .populate("consumerId", "fullName")
      .sort({ deliveredAt: -1 })
      .limit(10)
      .select("consumerId totalAmount paymentMethod paymentStatus deliveredAt cropName");

    return res.json({
      success: true,
      analytics: {
        totalRevenue: analytics.totalRevenue,
        netIncome: analytics.netIncome,
        totalCommission: analytics.totalCommission,
        totalTransportCost: analytics.totalTransportCost,
        paymentPending: analytics.paymentPending,

        totalOrders: analytics.totalOrders,
        pendingOrders: analytics.pendingOrders,
        acceptedOrders: analytics.acceptedOrders,
        shippedOrders: analytics.shippedOrders,
        deliveredOrders: analytics.deliveredOrders,
        cancelledOrders: analytics.cancelledOrders,
        rejectedOrders: analytics.rejectedOrders,

        monthlyRevenue: analytics.monthlyRevenue,

        topProducts: topCrops.map(c => ({
          cropId: c._id,
          name: c.name,
          quantity: c.totalUnitsSold,
          revenue: c.totalRevenue,
          totalOrders: c.totalOrders,
        })),

        recentTransactions: recentTransactions.map(o => ({
          orderId: o._id,
          customer: o.consumerId?.fullName || "Unknown",
          amount: o.totalAmount,
          method: o.paymentMethod,
          status: o.paymentStatus,
          date: o.deliveredAt,
          cropName: o.cropName,
        })),

        lastUpdated: analytics.lastUpdated,
      },
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
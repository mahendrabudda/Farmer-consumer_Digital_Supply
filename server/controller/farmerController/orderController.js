import orderModel from "../../model/farmermodel/orderModel.js";
import cropModel from "../../model/farmermodel/cropModel.js";
import farmerModel from "../../model/farmermodel/farmerModel.js";
import analyticsModel from "../../model/farmermodel/analyticsModel.js";
import userModel from "../../model/authmodel/userModel.js";

// ── GET all orders for this farmer ──
export const getFarmerOrders = async (req, res) => {
  const userId = req.userId;

  try {
    const farmer = await farmerModel.findOne({ userId });
    if (!farmer) {
      return res.json({ success: false, message: "Farmer profile not found" });
    }

    const orders = await orderModel
      .find({ farmerId: farmer._id })
      .populate("consumerId", "fullName email phoneNumber address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ── UPDATE order status (Accept / Reject / Ship / Deliver) ──
export const updateOrderStatus = async (req, res) => {
  const userId = req.userId;
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["Accepted", "Rejected", "Shipped", "Delivered", "Cancelled"];
  if (!allowedStatuses.includes(status)) {
    return res.json({ success: false, message: "Invalid status" });
  }

  try {
    const farmer = await farmerModel.findOne({ userId });
    if (!farmer) {
      return res.json({ success: false, message: "Farmer profile not found" });
    }

    const order = await orderModel.findOne({ _id: orderId, farmerId: farmer._id });
    if (!order) {
      return res.json({ success: false, message: "Order not found or unauthorized" });
    }

    const prevStatus = order.status;
    order.status = status;

    // set timestamps per stage
    if (status === "Accepted")  order.acceptedAt  = Date.now();
    if (status === "Shipped")   order.shippedAt   = Date.now();
    if (status === "Delivered") order.deliveredAt = Date.now();
    if (status === "Cancelled") order.cancelledAt = Date.now();
    if (status === "Rejected")  order.cancelledAt = Date.now();

    await order.save();

    // ── update analytics counters ──
    const analyticsUpdate = {};

    // decrement previous status counter
    if (prevStatus === "Pending")   analyticsUpdate["$inc"] = { pendingOrders: -1 };
    if (prevStatus === "Accepted")  analyticsUpdate["$inc"] = { acceptedOrders: -1 };
    if (prevStatus === "Shipped")   analyticsUpdate["$inc"] = { shippedOrders: -1 };

    // increment new status counter
    const incMap = {
      Accepted:  "acceptedOrders",
      Rejected:  "rejectedOrders",
      Shipped:   "shippedOrders",
      Delivered: "deliveredOrders",
      Cancelled: "cancelledOrders",
    };
    if (incMap[status]) {
      analyticsUpdate["$inc"] = {
        ...(analyticsUpdate["$inc"] || {}),
        [incMap[status]]: 1,
      };
    }

    // if delivered — add revenue to analytics + crop stats
    if (status === "Delivered") {
      const month = new Date(order.deliveredAt).getMonth(); // 0-11

      await analyticsModel.findOneAndUpdate(
        { farmerId: farmer._id },
        {
          $inc: {
            totalRevenue: order.totalAmount,
            netIncome: order.totalAmount,
            deliveredOrders: 1,
            ...(analyticsUpdate["$inc"] || {}),
          },
          $set: {
            [`monthlyRevenue.${month}`]: 0, // placeholder, will add below
            lastUpdated: Date.now(),
          },
        }
      );

      // increment monthly revenue properly
      await analyticsModel.findOneAndUpdate(
        { farmerId: farmer._id },
        { $inc: { [`monthlyRevenue.${month}`]: order.totalAmount } }
      );

      // update crop stats
      await cropModel.findByIdAndUpdate(order.cropId, {
        $inc: {
          totalUnitsSold: order.quantity,
          totalRevenue: order.totalAmount,
          totalOrders: 1,
        },
      });

    } else {
      await analyticsModel.findOneAndUpdate(
        { farmerId: farmer._id },
        { ...analyticsUpdate, $set: { lastUpdated: Date.now() } }
      );
    }

    return res.json({ success: true, message: `Order ${status}`, order });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
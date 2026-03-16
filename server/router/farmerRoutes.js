import express from "express";
import { createFarmerProfile, getFarmerDashboard, updateFarmerProfile } from "../controller/farmerController/farmerController.js";
import { addCrop, getFarmerCrops, getCropById, updateCrop, deleteCrop, toggleCropListing } from "../controller/farmerController/cropController.js";
import { getFarmerOrders, updateOrderStatus } from "../controller/farmerController/orderController.js";
import { getFarmerAnalytics } from "../controller/farmerController/analyticsController.js";
import userAuth from "../middleware/userAuth.js";

const farmerRouter = express.Router();

// ── Farmer Profile ──
farmerRouter.post("/create-profile",    userAuth, createFarmerProfile);
farmerRouter.get("/dashboard",          userAuth, getFarmerDashboard);
farmerRouter.put("/update-profile",     userAuth, updateFarmerProfile);

// ── Crops ──
farmerRouter.post("/crop/add",          userAuth, addCrop);
farmerRouter.get("/crop/all",           userAuth, getFarmerCrops);
farmerRouter.get("/crop/:cropId",       userAuth, getCropById);
farmerRouter.put("/crop/:cropId",       userAuth, updateCrop);
farmerRouter.delete("/crop/:cropId",    userAuth, deleteCrop);
farmerRouter.patch("/crop/:cropId/toggle", userAuth, toggleCropListing);

// ── Orders ──
farmerRouter.get("/orders",             userAuth, getFarmerOrders);
farmerRouter.patch("/order/:orderId/status", userAuth, updateOrderStatus);

// ── Analytics ──
farmerRouter.get("/analytics",          userAuth, getFarmerAnalytics);

export default farmerRouter;
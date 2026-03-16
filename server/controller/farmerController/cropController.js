import cropModel from "../../model/farmermodel/cropModel.js";
import farmerModel from "../../model/farmermodel/farmerModel.js";
import analyticsModel from "../../model/farmermodel/analyticsModel.js";

// ── ADD new crop listing ──
export const addCrop = async (req, res) => {
  const userId = req.userId;
  const {
    name, category, description, image,
    pricePerUnit, unit, quantityAvailable, minimumOrderQuantity,
    harvestDate, freshnessScore, freshnessGrade, freshnessRecommendation
  } = req.body;

  if (!name || !category || !pricePerUnit || !quantityAvailable) {
    return res.json({ success: false, message: "Name, category, price and quantity are required" });
  }

  try {
    const farmer = await farmerModel.findOne({ userId });
    if (!farmer) {
      return res.json({ success: false, message: "Farmer profile not found" });
    }

    // block listing if freshness failed
    if (freshnessRecommendation === "Do Not List") {
      return res.json({ success: false, message: "Product failed freshness check — cannot be listed" });
    }

    const crop = new cropModel({
      farmerId: farmer._id,
      userId,
      name, category, description, image,
      pricePerUnit, unit,
      quantityAvailable, minimumOrderQuantity,
      harvestDate, freshnessScore, freshnessGrade, freshnessRecommendation
    });

    await crop.save();

    // update analytics total products count
    await analyticsModel.findOneAndUpdate(
      { farmerId: farmer._id },
      { $inc: { totalProductsListed: 1 } }
    );

    return res.json({ success: true, message: "Crop listed successfully", crop });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ── GET all crops by this farmer ──
export const getFarmerCrops = async (req, res) => {
  const userId = req.userId;

  try {
    const farmer = await farmerModel.findOne({ userId });
    if (!farmer) {
      return res.json({ success: false, message: "Farmer profile not found" });
    }

    const crops = await cropModel
      .find({ farmerId: farmer._id })
      .sort({ createdAt: -1 });

    return res.json({ success: true, crops });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ── GET single crop ──
export const getCropById = async (req, res) => {
  const { cropId } = req.params;

  try {
    const crop = await cropModel.findById(cropId);
    if (!crop) {
      return res.json({ success: false, message: "Crop not found" });
    }

    return res.json({ success: true, crop });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ── UPDATE crop ──
export const updateCrop = async (req, res) => {
  const userId = req.userId;
  const { cropId } = req.params;
  const updates = req.body;

  try {
    const crop = await cropModel.findOne({ _id: cropId, userId });
    if (!crop) {
      return res.json({ success: false, message: "Crop not found or unauthorized" });
    }

    const updatedCrop = await cropModel.findByIdAndUpdate(cropId, updates, { new: true });

    return res.json({ success: true, message: "Crop updated", crop: updatedCrop });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ── DELETE crop ──
export const deleteCrop = async (req, res) => {
  const userId = req.userId;
  const { cropId } = req.params;

  try {
    const crop = await cropModel.findOne({ _id: cropId, userId });
    if (!crop) {
      return res.json({ success: false, message: "Crop not found or unauthorized" });
    }

    await cropModel.findByIdAndDelete(cropId);

    // decrement analytics count
    const farmer = await farmerModel.findOne({ userId });
    await analyticsModel.findOneAndUpdate(
      { farmerId: farmer._id },
      { $inc: { totalProductsListed: -1 } }
    );

    return res.json({ success: true, message: "Crop deleted" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ── TOGGLE listing (hide/show without deleting) ──
export const toggleCropListing = async (req, res) => {
  const userId = req.userId;
  const { cropId } = req.params;

  try {
    const crop = await cropModel.findOne({ _id: cropId, userId });
    if (!crop) {
      return res.json({ success: false, message: "Crop not found or unauthorized" });
    }

    crop.isListed = !crop.isListed;
    await crop.save();

    return res.json({
      success: true,
      message: crop.isListed ? "Crop is now visible" : "Crop hidden from marketplace",
      isListed: crop.isListed
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
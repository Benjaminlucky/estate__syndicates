import Vendor from "../models/Vendor.js";

// ============================================
// CREATE VENDOR
// ============================================
export const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create({
      name: req.body.name,
      vendorType: req.body.vendorType,
      email: req.body.email,
      phone: req.body.phone,
      contactPerson: req.body.contactPerson,
      vendorState: req.body.vendorState,
      address: req.body.address,
      vendorBank: req.body.vendorBank,
      accountNumber: req.body.accountNumber,
      vendorAccountName: req.body.vendorAccountName,
    });

    res.status(201).json({
      success: true,
      message: "Vendor added successfully",
      vendor,
    });
  } catch (error) {
    console.error("Create Vendor Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create vendor",
    });
  }
};

// ============================================
// GET ALL VENDORS
// ============================================
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      vendors,
    });
  } catch (error) {
    console.error("Get Vendors Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// UPDATE VENDOR
// ============================================
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        vendorType: req.body.vendorType,
        email: req.body.email,
        phone: req.body.phone,
        contactPerson: req.body.contactPerson,
        vendorState: req.body.vendorState,
        address: req.body.address,
        vendorBank: req.body.vendorBank,
        accountNumber: req.body.accountNumber,
        vendorAccountName: req.body.vendorAccountName,
      },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      vendor,
    });
  } catch (error) {
    console.error("Update Vendor Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// TOGGLE VENDOR STATUS
// ============================================
export const toggleVendorStatus = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    res.status(200).json({
      success: true,
      message: `Vendor ${vendor.isActive ? "activated" : "deactivated"}`,
      vendor,
    });
  } catch (error) {
    console.error("Toggle Vendor Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

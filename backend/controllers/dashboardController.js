
const User = require("../models/User");

// GET the current user's dashboard
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      dashboard: user.dashboard,
    });
  } catch (error) {
    console.error("Get dashboard error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load your dashboard.",
    });
  }
};

// SAVE the current user's dashboard
const updateDashboard = async (req, res) => {
  try {
    const allowedFields = [
      "tasks",
      "universities",
      "careerInterests",
      "development",
      "community",
    ];

    const updates = Object.keys(req.body || {});

    if (
      updates.length === 0 ||
      updates.some((field) => !allowedFields.includes(field))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid dashboard data.",
      });
    }

    if (
      ("tasks" in req.body && !Array.isArray(req.body.tasks)) ||
      ("universities" in req.body &&
        !Array.isArray(req.body.universities)) ||
      ("careerInterests" in req.body &&
        !Array.isArray(req.body.careerInterests))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid dashboard data format.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    updates.forEach((field) => {
      user.dashboard[field] = req.body[field];
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Dashboard saved successfully.",
      dashboard: user.dashboard,
    });
  } catch (error) {
    console.error("Update dashboard error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to save your dashboard.",
    });
  }
};

module.exports = {
  getDashboard,
  updateDashboard,
};

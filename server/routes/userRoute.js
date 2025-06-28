const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const userModel = require("../models/userModel");
const { Connection, Client } = require("@temporalio/client");

const userRoute = express.Router();

// Get user profile
userRoute.get("/", authenticateToken, async (req, res) => {
  try {
    let user = await userModel.findOne({ auth0Id: req.user.sub });
    console.log(req.user.given_name);
    console.log(req.user.family_name);

    if (!user) {
      // Create user if doesn't exist
      user = new userModel({
        auth0Id: req.user.sub,
        email: req.user.email || "",
        firstName: req.user.given_name || "",
        lastName: req.user.family_name || "",
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user profile via Temporal
userRoute.put("/", authenticateToken, async (req, res) => {
  const { firstName, lastName, phoneNumber, city, pincode } = req.body;
  const userId = req.user.sub;

  try {
    const connection = await Connection.connect();
    const client = new Client({ connection });

    const workflow = await client.workflow.start("saveUserDataWorkflow", {
      args: [userId, { firstName, lastName, phoneNumber, city, pincode }],
      taskQueue: "profile-updates",
      workflowId: `profile-${userId}-${Date.now()}`,
    });

    res.json({
      message: "Profile update initiated",
      runId: workflow.workflowId,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
});

module.exports = userRoute;

const express = require("express");
const axios = require("axios");
const userModel = require("../models/userModel");
const userRoute = express.Router();

// Get user profile
userRoute.get("/", async (req, res) => {
  try {
    const auth0Id = req.user.sub;
    let user = await userModel.findOne({ auth0Id });

    if (!user) {
      // Create user if doesn't exist
      user = new userModel({
        auth0Id,
        email:
          req.user.email ||
          req.user[`${process.env.AUTH0_AUDIENCE}/email`] ||
          "",
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile (this will trigger Temporal workflow)
userRoute.put("/", async (req, res) => {
  try {
    const auth0Id = req.user.sub;
    const { firstName, lastName, phoneNumber, city, pincode } = req.body;

    // Start Temporal workflow
    const temporalClient = require("../temporal-client");
    await temporalClient.startWorkflow({
      taskQueue: "profile-updates",
      workflowType: "profileUpdateWorkflow",
      workflowId: `profile-update-${auth0Id}-${Date.now()}`,
      args: [auth0Id, { firstName, lastName, phoneNumber, city, pincode }],
    });

    res.json({ message: "Profile update started", status: "processing" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = userRoute;

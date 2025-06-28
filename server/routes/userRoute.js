import express from "express";
import userModel from "../models/userModel.js";
import { authenticateToken } from "../middleware/auth.js";
import { Connection, Client } from "@temporalio/client";

const userRoute = express.Router();

const connection = await Connection.connect();
const client = new Client({ connection });

// Get user profile
userRoute.get("/", authenticateToken, async (req, res) => {
  try {
    let user = await userModel.findOne({ auth0Id: req.user.sub });

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
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user profile using Temporal workflow
userRoute.put("/", authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, city, pincode } = req.body;
    const userId = req.user.sub;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: "userModel ID is required" });
    }

    console.log(`🚀 Starting Temporal workflow for user: ${userId}`);

    // Start Temporal workflow
    const workflow = await client.workflow.start("updateProfileWorkflow", {
      args: [
        {
          userId,
          profileData: {
            firstName: firstName || "",
            lastName: lastName || "",
            phoneNumber: phoneNumber || "",
            city: city || "",
            pincode: pincode || "",
          },
        },
      ],
      taskQueue: "profile-update-queue",
      workflowId: `profile-update-${userId}-${Date.now()}`,
    });

    console.log(`✅ Temporal workflow started: ${workflow.workflowId}`);

    // Return success immediately (workflow runs asynchronously)
    res.json({
      message: "Profile update initiated successfully",
      workflowId: workflow.workflowId,
      status: "processing",
    });
  } catch (error) {
    console.error("❌ Profile update failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default userRoute;

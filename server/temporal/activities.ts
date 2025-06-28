import { log } from "@temporalio/activity";
import mongoose from "mongoose";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Define User schema for activities.
const userSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    city: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  pincode: string;
}

//  Activity: Update user profile in MongoDB
export async function updateDatabase(
  userId: string,
  profileData: ProfileData
): Promise<void> {
  try {
    log.info("Updating database for user", { userId });

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const updatedUser = await User.findOneAndUpdate(
      { auth0Id: userId },
      {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        city: profileData.city,
        pincode: profileData.pincode,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error(`User not found: ${userId}`);
    }

    log.info("Database update successful", {
      userId,
      updatedFields: Object.keys(profileData),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error("Database update failed", { userId, error: error.message });
      throw new Error(`Failed to update database: ${error.message}`);
    } else {
      log.error("Database update failed with unknown error", { userId, error });
      throw new Error("Failed to update database: Unknown error");
    }
  }
}

//  Activity: Sync profile data to CrudCrud API
export async function syncToCrudCrud(profileData: ProfileData): Promise<void> {
  try {
    log.info("Starting CrudCrud sync", { profileData });

    const crudCrudUrl = process.env.CRUDCRUD_API_URL;
    if (!crudCrudUrl) {
      throw new Error("CRUDCRUD_API_URL environment variable not set");
    }

    const crudData = {
      ...profileData,
      syncedAt: new Date().toISOString(),
      source: "profile-app",
    };

    // POST to CrudCrud API
    const response = await axios.post(crudCrudUrl, crudData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout
    });

    if (response.status >= 200 && response.status < 300) {
      log.info("CrudCrud sync successful", {
        status: response.status,
        responseData: response.data,
      });
    } else {
      throw new Error(`CrudCrud API returned status: ${response.status}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error("Something failed", { error: error.message });
      throw new Error(`Failed: ${error.message}`);
    } else {
      log.error("Something failed", { error });
      throw new Error("Unknown error occurred");
    }
  }
}

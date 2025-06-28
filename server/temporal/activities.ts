// server/temporal/activities.ts
import axios from "axios";
// @ts-ignore – your model is JavaScript, so we bypass TS here
import userModel from "../models/userModel.js";

/** Shape of data your profile can accept */
interface ProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  pincode?: string;
}

export async function updateProfileAndSyncCrudCrud(
  userId: string,
  profileData: ProfileData
) {
  /* ---------- 1. Update MongoDB ---------- */
  const user = await userModel.findOneAndUpdate(
    { auth0Id: userId },
    profileData,
    { new: true } // return updated document
  );

  if (!user) {
    throw new Error("User not found");
  }
  console.log("✅ Profile saved to database successfully");

  /* ---------- 2. Send to CrudCrud after DB save ---------- */
  const CRUD_API = process.env.CRUDCRUD_API_URL;

  if (!CRUD_API) {
    throw new Error(
      "CRUDCRUD_API_URL is not defined in environment variables."
    );
  }

  console.log("🔄 Temporal Activity: Updating CrudCrud API…");

  try {
    await axios.post(CRUD_API, { userId, ...profileData });
    console.log("✅ CrudCrud API updated successfully");
  } catch (error: any) {
    // If CrudCrud record doesn’t exist (404), create one instead
    if (error.response?.status === 404) {
      await axios.post(CRUD_API, { userId, ...profileData });
      console.log("✅ CrudCrud API record created successfully");
    } else {
      console.error("❌ CrudCrud API error:", error.message);
      throw error;
    }
  }

  return user; // optional: return updated user
}

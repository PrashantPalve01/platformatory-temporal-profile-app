import { proxyActivities, sleep, log } from "@temporalio/workflow";
import type * as activities from "./activities";

const { updateDatabase, syncToCrudCrud } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

export interface ProfileUpdateData {
  userId: string;
  profileData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    city: string;
    pincode: string;
  };
}

/**
 * Main workflow for updating user profile
 * 1. Save to MongoDB immediately
 * 2. Wait 10 seconds
 * 3. Sync to CrudCrud API
 */
export async function updateProfileWorkflow(
  data: ProfileUpdateData
): Promise<void> {
  log.info("Starting profile update workflow", { userId: data.userId });

  try {
    // Step 1: Update database immediately
    log.info("Updating database...");
    await updateDatabase(data.userId, data.profileData);
    log.info("Database updated successfully");

    // Step 2: Wait 10 seconds as per requirement
    log.info("Waiting 10 seconds before syncing to CrudCrud...");
    await sleep("10 seconds");

    // Step 3: Sync to CrudCrud
    log.info("Syncing to CrudCrud...");
    await syncToCrudCrud(data.profileData);
    log.info("Successfully synced to CrudCrud");

    log.info("Profile update workflow completed successfully");
  } catch (error) {
    log.error("Profile update workflow failed", { error: error.message });
    throw error;
  }
}

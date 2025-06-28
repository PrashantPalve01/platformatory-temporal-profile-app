// server/temporal/workflows.ts

import { proxyActivities } from "@temporalio/workflow";
import { sleep } from "@temporalio/workflow";

const { updateProfileAndSyncCrudCrud } = proxyActivities({
  startToCloseTimeout: "20 seconds",
});

export async function saveUserDataWorkflow(userId: string, profileData: any) {
  await sleep(10000); // 10 seconds delay
  await updateProfileAndSyncCrudCrud(userId, profileData);
}

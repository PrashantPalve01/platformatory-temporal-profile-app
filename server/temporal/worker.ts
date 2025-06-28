import { Worker } from "@temporalio/worker";
import * as activities from "./activities";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  console.log("🚀 Starting Temporal Worker...");

  // Create a Worker to handle workflows and activities
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows"),
    activities,
    taskQueue: "profile-update-queue",
  });

  console.log("✅ Temporal Worker created successfully");
  console.log("📋 Task Queue: profile-update-queue");
  console.log("🔄 Worker is ready to process workflows...");

  // Start accepting tasks and running workflows
  await worker.run();
}

run().catch((err) => {
  console.error("❌ Temporal Worker failed to start:", err);
  process.exit(1);
});

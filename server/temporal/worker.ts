// server/temporal/worker.ts

import { Worker } from "@temporalio/worker";
import * as activities from "./activities";
import path from "path";

async function run() {
  console.log("🏗️  Starting Temporal Worker...");

  const worker = await Worker.create({
    workflowsPath: path.join(__dirname, "./workflows.js"),
    activities,
    taskQueue: "profile-updates",
  });

  console.log("✅ Temporal Worker started successfully");
  console.log("📋 Task Queue: profile-update-queue");

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

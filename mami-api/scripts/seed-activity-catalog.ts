import mongoose from "mongoose";
import { seedActivityCategories } from "./seed-activity-categories.ts";
import { seedMasterActivities } from "./seed-master-activities.ts";

const MONGO_URI = Deno.env.get("MONGO_URI") ||
  "mongodb://localhost:27017/mami-db";

try {
  await mongoose.connect(MONGO_URI);
  await seedActivityCategories({ manageConnection: false });
  await seedMasterActivities({ manageConnection: false });
  console.log("Activity catalog seed completed.");
} catch (error) {
  console.error("Error seeding activity catalog:", error);
  Deno.exitCode = 1;
} finally {
  await mongoose.connection.close();
}

import mongoose from "mongoose";

const MONGO_URI = Deno.env.get("MONGO_URI") || "mongodb://localhost:27017/mami-db";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("MongoDB database handle is not available.");
    }

    console.log("Running migration: 20260407_094800_fix_admin_role");

    const result = await db.collection("users").updateMany(
      { role: "ADMIN" },
      { $set: { role: "SUPER_ADMIN" } },
    );

    console.log(`Matched ${result.matchedCount} document(s)`);
    console.log(`Modified ${result.modifiedCount} document(s)`);
    console.log("Migration completed: 20260407_094800_fix_admin_role");
  } catch (error) {
    console.error("Migration failed:", error);
    Deno.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  }
}

await run();

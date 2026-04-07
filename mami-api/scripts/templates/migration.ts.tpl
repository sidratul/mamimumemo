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

    console.log("Running migration: __MIGRATION_NAME__");

    // Example:
    // await db.collection("users").updateMany(
    //   { role: "ADMIN" },
    //   { $set: { role: "SUPER_ADMIN" } },
    // );

    console.log("Migration completed: __MIGRATION_NAME__");
  } catch (error) {
    console.error("Migration failed:", error);
    Deno.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  }
}

await run();

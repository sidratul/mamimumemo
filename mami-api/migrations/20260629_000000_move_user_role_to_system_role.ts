import mongoose from "mongoose";

const MONGO_URI = Deno.env.get("MONGO_URI") ||
  "mongodb://localhost:27017/mami-db";

async function migrate() {
  await mongoose.connect(MONGO_URI);

  try {
    const users = mongoose.connection.collection("users");
    const adminResult = await users.updateMany(
      {
        $or: [
          { role: "SUPER_ADMIN" },
          { role: "ADMIN" },
        ],
      },
      { $set: { systemRole: "SUPER_ADMIN" } },
    );
    const cleanupResult = await users.updateMany(
      { role: { $exists: true } },
      { $unset: { role: "" } },
    );

    console.log(
      `System role migrated for ${adminResult.modifiedCount} user(s).`,
    );
    console.log(
      `Legacy role removed from ${cleanupResult.modifiedCount} user(s).`,
    );
  } finally {
    await mongoose.connection.close();
  }
}

await migrate();

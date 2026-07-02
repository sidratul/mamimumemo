/**
 * Seed Super Admin User Script
 *
 * Purpose: Create SUPER_ADMIN user in database for admin app testing
 *
 * Usage:
 *   deno run -A scripts/seed-admin.ts
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const MONGO_URI = Deno.env.get("MONGO_URI") ||
  "mongodb://localhost:27017/mami-db";

const ADMIN_USER = {
  name: "System Super Admin",
  email: "admin@mami.com",
  password: "admin123",
  phone: "0812-3456-7896",
  systemRole: "SUPER_ADMIN",
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  systemRole: {
    type: String,
    enum: ["SUPER_ADMIN"],
    default: null,
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10);
    console.log("-----------------------------------------");
    console.log("HASH PASSWORD UNTUK ATLAS (admin123):");
    console.log(hashedPassword);
    console.log("-----------------------------------------");

    const adminUser = await User.findOneAndUpdate(
      { email: ADMIN_USER.email },
      {
        $set: {
          name: ADMIN_USER.name,
          email: ADMIN_USER.email,
          password: hashedPassword,
          phone: ADMIN_USER.phone,
          systemRole: ADMIN_USER.systemRole,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    await mongoose.connection.collection("users").updateOne(
      { _id: adminUser._id },
      { $unset: { role: "" } },
    );

    console.log("SUPER_ADMIN siap digunakan:");
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${ADMIN_USER.password}`);
    console.log(`System role: ${adminUser.systemRole}`);

    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding super admin user:", error);
    await mongoose.connection.close();
    Deno.exit(1);
  }
}

await seedAdmin();

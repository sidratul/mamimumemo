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

const MONGO_URI = Deno.env.get("MONGO_URI") || "mongodb://localhost:27017/mami-db";

const ADMIN_USER = {
  name: "System Super Admin",
  email: "admin@mami.com",
  password: "admin123",
  phone: "0812-3456-7896",
  role: "SUPER_ADMIN",
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  role: {
    type: String,
    enum: ["SUPER_ADMIN", "DAYCARE_OWNER", "DAYCARE_ADMIN", "DAYCARE_SITTER", "PARENT"],
    default: "PARENT",
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

    const adminUser = await User.findOneAndUpdate(
      { email: ADMIN_USER.email },
      {
        name: ADMIN_USER.name,
        email: ADMIN_USER.email,
        password: hashedPassword,
        phone: ADMIN_USER.phone,
        role: ADMIN_USER.role,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("SUPER_ADMIN siap digunakan:");
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${ADMIN_USER.password}`);
    console.log(`Role: ${adminUser.role}`);

    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding super admin user:", error);
    await mongoose.connection.close();
    Deno.exit(1);
  }
}

await seedAdmin();

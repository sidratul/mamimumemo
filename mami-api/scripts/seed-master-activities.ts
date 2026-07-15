/**
 * Seed global master activities.
 *
 * Usage:
 *   deno task seed:master-activities
 */

import mongoose from "mongoose";
import UserModel from "@/users/users.schema.ts";
import ActivityCategoryModel from "@/activity_categories/activity_categories.schema.ts";
import MasterActivityModel from "@/master_activities/master_activities.schema.ts";

const MONGO_URI = Deno.env.get("MONGO_URI") ||
  "mongodb://localhost:27017/mami-db";

const activities = [
  { name: "Makan", category: "MEAL", defaultDuration: 30, isStarter: true },
  { name: "Minum", category: "DRINK", defaultDuration: 10, isStarter: true },
  {
    name: "Tidur Siang",
    category: "NAP",
    defaultDuration: 90,
    isStarter: true,
  },
  {
    name: "Ke Toilet",
    category: "TOILETING",
    defaultDuration: 10,
    isStarter: true,
  },
  {
    name: "Cuci Tangan",
    category: "HYGIENE",
    defaultDuration: 10,
    isStarter: true,
  },
  { name: "Mandi", category: "HYGIENE", defaultDuration: 30, isStarter: true },
  {
    name: "Bermain Bebas",
    category: "PLAY",
    defaultDuration: 45,
    isStarter: true,
  },
  {
    name: "Belajar Terarah",
    category: "LEARNING",
    defaultDuration: 45,
    isStarter: true,
  },
  {
    name: "Minum Obat",
    category: "MEDICATION",
    defaultDuration: 10,
    isStarter: false,
  },
] as const;

export async function seedMasterActivities(
  options: { manageConnection?: boolean } = {},
) {
  const manageConnection = options.manageConnection ?? true;
  try {
    if (manageConnection) {
      await mongoose.connect(MONGO_URI);
    }

    const admin = await UserModel.findOne({ systemRole: "SUPER_ADMIN" });
    if (!admin) {
      throw new Error(
        "SUPER_ADMIN tidak ditemukan. Jalankan `deno task seed:admin` terlebih dahulu.",
      );
    }

    for (const activity of activities) {
      const category = await ActivityCategoryModel.findOne({
        code: activity.category,
        isActive: true,
      });
      if (!category) {
        throw new Error(`Kategori ${activity.category} belum tersedia.`);
      }

      await MasterActivityModel.findOneAndUpdate(
        { name: activity.name, category: activity.category },
        {
          $set: {
            ...activity,
            active: true,
            icon: category.defaultIcon,
            color: category.defaultColor,
            fieldConfig: category.defaultFieldConfig,
            createdBy: {
              userId: admin._id,
              name: admin.name,
              role: "SUPER_ADMIN",
            },
          },
          $setOnInsert: { version: 1 },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    console.log(`Seeded ${activities.length} global master activities.`);
  } finally {
    if (manageConnection) {
      await mongoose.connection.close();
    }
  }
}

if (import.meta.main) {
  try {
    await seedMasterActivities();
  } catch (error) {
    console.error("Error seeding master activities:", error);
    Deno.exitCode = 1;
  }
}

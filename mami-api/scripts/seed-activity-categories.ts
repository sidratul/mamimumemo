/**
 * Seed global activity categories.
 *
 * Usage:
 *   deno task seed:categories
 */

import mongoose from "mongoose";
import ActivityCategoryModel from "@/activity_categories/activity_categories.schema.ts";

const MONGO_URI = Deno.env.get("MONGO_URI") ||
  "mongodb://localhost:27017/mami-db";

const categories = [
  {
    code: "MEAL",
    defaultLabel: "Makan",
    behaviorType: "MEAL",
    defaultColor: "#F59E0B",
    defaultIcon: "silverware-fork-knife",
    defaultFieldConfig: { mealType: true, menu: true, eaten: true, mood: true },
  },
  {
    code: "NAP",
    defaultLabel: "Tidur",
    behaviorType: "NAP",
    defaultColor: "#6366F1",
    defaultIcon: "sleep",
    defaultFieldConfig: { quality: true, mood: true },
  },
  {
    code: "TOILETING",
    defaultLabel: "Toileting",
    behaviorType: "TOILETING",
    defaultColor: "#14B8A6",
    defaultIcon: "toilet",
    defaultFieldConfig: { toiletingType: true, toiletingNotes: true },
  },
  {
    code: "CARE",
    defaultLabel: "Perawatan",
    behaviorType: "CARE",
    defaultColor: "#EC4899",
    defaultIcon: "hand-heart",
    defaultFieldConfig: { mood: true, photos: true, description: true },
  },
  {
    code: "PLAY",
    defaultLabel: "Bermain",
    behaviorType: "PLAY",
    defaultColor: "#22C55E",
    defaultIcon: "puzzle",
    defaultFieldConfig: { mood: true, photos: true, description: true },
  },
  {
    code: "LEARNING",
    defaultLabel: "Belajar",
    behaviorType: "LEARNING",
    defaultColor: "#3B82F6",
    defaultIcon: "book-open-variant",
    defaultFieldConfig: { mood: true, photos: true, description: true },
  },
  {
    code: "CREATIVE",
    defaultLabel: "Kreativitas",
    behaviorType: "GENERIC",
    defaultColor: "#A855F7",
    defaultIcon: "palette",
    defaultFieldConfig: { materials: true, photos: true, description: true },
  },
  {
    code: "PHYSICAL",
    defaultLabel: "Aktivitas Fisik",
    behaviorType: "GENERIC",
    defaultColor: "#EF4444",
    defaultIcon: "run",
    defaultFieldConfig: { intensity: true, mood: true },
  },
  {
    code: "OUTDOOR",
    defaultLabel: "Aktivitas Luar",
    behaviorType: "GENERIC",
    defaultColor: "#84CC16",
    defaultIcon: "tree",
    defaultFieldConfig: { location: true, photos: true, description: true },
  },
  {
    code: "ROUTINE",
    defaultLabel: "Rutinitas",
    behaviorType: "GENERIC",
    defaultColor: "#64748B",
    defaultIcon: "calendar-check",
    defaultFieldConfig: { mood: true, description: true },
  },
  {
    code: "SOCIAL",
    defaultLabel: "Sosial",
    behaviorType: "GENERIC",
    defaultColor: "#06B6D4",
    defaultIcon: "account-group",
    defaultFieldConfig: { mood: true, photos: true, description: true },
  },
  {
    code: "DEVELOPMENT",
    defaultLabel: "Perkembangan",
    behaviorType: "GENERIC",
    defaultColor: "#8B5CF6",
    defaultIcon: "chart-timeline-variant",
    defaultFieldConfig: { mood: true, photos: true, description: true },
  },
] as const;

async function seedActivityCategories() {
  try {
    await mongoose.connect(MONGO_URI);

    for (const [sortOrder, category] of categories.entries()) {
      await ActivityCategoryModel.findOneAndUpdate(
        { code: category.code },
        {
          $set: {
            ...category,
            sortOrder,
            isActive: true,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    console.log(`Seeded ${categories.length} activity categories.`);
  } catch (error) {
    console.error("Error seeding activity categories:", error);
    Deno.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

await seedActivityCategories();

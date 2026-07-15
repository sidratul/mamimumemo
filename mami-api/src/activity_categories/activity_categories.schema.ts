import mongoose from "mongoose";

export const activityCategoryFieldConfigSchema = new mongoose.Schema({
  mealType: { type: Boolean, default: false },
  menu: { type: Boolean, default: false },
  eaten: { type: Boolean, default: false },
  quality: { type: Boolean, default: false },
  toiletingType: { type: Boolean, default: false },
  toiletingNotes: { type: Boolean, default: false },
  mood: { type: Boolean, default: false },
  photos: { type: Boolean, default: false },
  description: { type: Boolean, default: false },
  intensity: { type: Boolean, default: false },
  location: { type: Boolean, default: false },
  materials: { type: Boolean, default: false },
  drinkName: { type: Boolean, default: false },
  drinkAmountMl: { type: Boolean, default: false },
  hygieneType: { type: Boolean, default: false },
  medicationName: { type: Boolean, default: false },
  medicationDose: { type: Boolean, default: false },
  medicationUnit: { type: Boolean, default: false },
  administeredAt: { type: Boolean, default: false },
  parentConsent: { type: Boolean, default: false },
}, { _id: false });

const activityCategorySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  defaultLabel: { type: String, required: true, trim: true },
  behaviorType: {
    type: String,
    enum: [
      "MEAL", "DRINK", "NAP", "TOILETING", "HYGIENE",
      "MEDICATION", "CARE", "PLAY", "LEARNING", "GENERIC",
    ],
    default: "GENERIC",
  },
  defaultColor: { type: String, default: "" },
  defaultIcon: { type: String, default: "" },
  defaultFieldConfig: {
    type: activityCategoryFieldConfigSchema,
    default: () => ({}),
  },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

activityCategorySchema.index({ isActive: 1, sortOrder: 1 });

export default mongoose.model("ActivityCategory", activityCategorySchema);

import mongoose from "mongoose";

const brandingSchema = new mongoose.Schema({
  primaryColor: { type: String, default: "" },
  secondaryColor: { type: String, default: "" },
  logoUrl: { type: String, default: "" },
}, { _id: false });

const activityCategoryOverrideSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ActivityCategory",
    required: true,
  },
  label: { type: String, default: "" },
  color: { type: String, default: "" },
  icon: { type: String, default: "" },
  enabled: { type: Boolean, default: true },
  sortOrder: { type: Number },
}, { _id: false });

const preferencesSchema = new mongoose.Schema({
  timezone: { type: String, default: "Asia/Jakarta" },
  locale: { type: String, default: "id-ID" },
}, { _id: false });

const daycareConfigSchema = new mongoose.Schema({
  daycareId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Daycare",
    required: true,
    unique: true,
  },
  schemaVersion: { type: Number, default: 1 },
  branding: { type: brandingSchema, default: () => ({}) },
  activityCategories: {
    type: [activityCategoryOverrideSchema],
    default: [],
  },
  preferences: { type: preferencesSchema, default: () => ({}) },
}, { timestamps: true });

daycareConfigSchema.index({ daycareId: 1 }, { unique: true });

export default mongoose.model("DaycareConfig", daycareConfigSchema);

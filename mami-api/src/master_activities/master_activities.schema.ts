import mongoose from "mongoose";
import { userRefSchema } from "#shared/schemas/user-refs.schema.ts";

const fieldConfigSchema = new mongoose.Schema({
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
}, { _id: false });

const masterActivitySchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  name: { type: String, required: true }, // Free text, contoh: "Makan Pagi Ceria"
  category: { 
    type: String, 
    enum: [
      "meal", "nap", "toileting", "care", "play",
      "learning", "creative", "physical", "outdoor",
      "routine", "social", "development"
    ],
    required: true 
  },
  defaultDuration: { type: Number, default: 30 }, // menit
  icon: String,
  color: String,
  active: { type: Boolean, default: true },
  fieldConfig: { type: fieldConfigSchema, default: () => ({}) },
  createdBy: { type: userRefSchema, required: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
masterActivitySchema.index({ daycareId: 1, active: 1 });
masterActivitySchema.index({ category: 1 });

export default mongoose.model("MasterActivity", masterActivitySchema);

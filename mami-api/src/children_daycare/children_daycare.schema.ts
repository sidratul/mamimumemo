import mongoose from "mongoose";

const childProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  photo: String,
  gender: { type: String, enum: ["MALE", "FEMALE"], required: true },
}, { _id: false });

const childMedicalSchema = new mongoose.Schema({
  allergies: { type: [String], default: [] },
  medicalNotes: String,
  medications: {
    type: [{
      name: String,
      dosage: String,
      schedule: String,
    }],
    default: [],
  },
}, { _id: false });

const childPreferencesSchema = new mongoose.Schema({
  favoriteFoods: { type: [String], default: [] },
  favoriteActivities: { type: [String], default: [] },
  comfortItems: { type: [String], default: [] }, // selimut, boneka, dll
  napRoutine: String,
}, { _id: false });

const childCustomDataSchema = new mongoose.Schema({
  customName: String, // nama panggilan di daycare
  customPhoto: String, // foto custom untuk daycare
  notes: String,
  cognitiveNotes: String,
  developmentNotes: String,
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
}, { _id: false });

const childrenDaycareSchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
  globalChildId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" }, // optional, null jika anak hanya di daycare ini
  profile: { type: childProfileSchema, required: true },
  medical: { type: childMedicalSchema, default: () => ({}) },
  preferences: { type: childPreferencesSchema, default: () => ({}) },
  customData: { type: childCustomDataSchema, default: () => ({}) },
  enrolledAt: { type: Date, default: Date.now },
  exitedAt: Date,
  active: { type: Boolean, default: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
childrenDaycareSchema.index({ daycareId: 1, active: 1 });
childrenDaycareSchema.index({ parentId: 1 });
childrenDaycareSchema.index({ globalChildId: 1 });

export default mongoose.model("ChildrenDaycare", childrenDaycareSchema);

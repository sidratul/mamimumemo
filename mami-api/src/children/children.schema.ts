import mongoose from "mongoose";

const guardianUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ["parent", "guardian"], required: true },
}, { _id: false });

const sharedBySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  relation: { type: String, required: true },
}, { _id: false });

const guardianSchema = new mongoose.Schema({
  user: { type: guardianUserSchema, required: true },
  relation: { 
    type: String, 
    enum: ["father", "mother", "guardian", "grandfather", "grandmother", "other"],
    required: true 
  },
  permissions: [{
    type: String,
    enum: [
      "view_reports",
      "input_activity",
      "input_health",
      "enroll_daycare",
      "edit_profile",
      "manage_guardians",
    ],
  }],
  sharedAt: { type: Date, default: Date.now },
  sharedBy: { type: sharedBySchema, required: true },
  active: { type: Boolean, default: true },
});

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  schedule: { type: String, required: true },
}, { _id: false });

const childMedicalSchema = new mongoose.Schema({
  allergies: [String],
  medicalNotes: String,
  medications: [medicationSchema],
}, { _id: false });

const childProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  photo: String,
  gender: { type: String, enum: ["male", "female"], required: true },
}, { _id: false });

const childrenSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profile: { type: childProfileSchema, required: true },
  medical: { type: childMedicalSchema, default: () => ({}) },
  guardians: [guardianSchema],
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
childrenSchema.index({ ownerId: 1 });
childrenSchema.index({ "guardians.user.userId": 1 });

export default mongoose.model("Child", childrenSchema);

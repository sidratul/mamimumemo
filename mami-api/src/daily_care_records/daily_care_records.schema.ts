import mongoose from "mongoose";
import { simpleUserRefSchema, assignedUserRefSchema } from "#shared/schemas/user-refs.schema.ts";

// Attendance subdocument schema
const attendanceSchema = new mongoose.Schema<Record<string, unknown>>({
  checkIn: {
    time: { type: String, required: true }, // Format: "HH:mm"
    photo: { type: String, required: true }, // URL foto
    by: { type: simpleUserRefSchema, required: true },
  },
  checkOut: {
    time: String,
    photo: String,
    by: { type: simpleUserRefSchema },
  },
  status: { 
    type: String, 
    enum: ["present", "absent", "late", "early_pickup"],
    default: "present"
  },
}, { _id: false });

// Activity subdocument schema (sama seperti global activities tapi lebih simple)
const dailyActivitySchema = new mongoose.Schema<Record<string, unknown>>({
  _id: false,
  daycareActivityId: { type: mongoose.Schema.Types.ObjectId, ref: "DaycareActivity" },
  activityName: { type: String, required: true },
  category: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  duration: { type: Number }, // menit
  
  // Dynamic fields (optional)
  mealType: { type: String, enum: ["breakfast", "snack", "lunch", "dinner"] },
  menu: String,
  eaten: { type: String, enum: ["all", "some", "none"] },
  quality: { type: String, enum: ["good", "restless", "short"] },
  toiletingType: { type: String, enum: ["urine", "bowel"] },
  toiletingNotes: String,
  mood: { type: String, enum: ["happy", "sleepy", "fussy", "energetic", "neutral"] },
  photos: [String],
  description: String,
  intensity: { type: String, enum: ["low", "medium", "high"] },
  location: String,
  materials: String,
  drinkName: String,
  drinkAmountMl: Number,
  hygieneType: String,
  medicationName: String,
  medicationDose: Number,
  medicationUnit: String,
  administeredAt: Date,
  parentConsent: Boolean,
  
  loggedBy: { type: simpleUserRefSchema, required: true },
  loggedAt: { type: Date, default: Date.now },
});

const plannedDailyActivitySchema = new mongoose.Schema<Record<string, unknown>>({
  _id: false,
  daycareActivityId: { type: mongoose.Schema.Types.ObjectId, ref: "DaycareActivity" },
  activityName: { type: String, required: true },
  category: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  duration: { type: Number },
  defaultSitterRole: {
    type: String,
    enum: ["any", "senior_sitter", "junior_sitter"],
    default: "any",
  },
});

// Assigned Sitter subdocument
const assignedSitterSchema = new mongoose.Schema<Record<string, unknown>>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  shift: { 
    type: String, 
    enum: ["morning", "afternoon", "full"],
    required: true 
  },
}, { _id: false });

// Child daily record subdocument
const childDailyRecordSchema = new mongoose.Schema<Record<string, unknown>>({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildrenDaycare", required: true },
  childName: { type: String, required: true },
  childPhoto: String,
  attendance: { type: attendanceSchema },
  assignedSitters: [assignedSitterSchema],
  activities: [dailyActivitySchema],
  notes: String,
}, { _id: false });

// Main Daily Care Record schema
const dailyCareRecordSchema = new mongoose.Schema<Record<string, unknown>>({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  date: { type: Date, required: true },
  appliedTemplate: {
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "ScheduleTemplate" },
    templateName: String,
    appliedAt: Date,
  },
  plannedActivities: [plannedDailyActivitySchema],
  children: [childDailyRecordSchema],
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
dailyCareRecordSchema.index({ daycareId: 1, date: -1 });
dailyCareRecordSchema.index({ "children.childId": 1, date: -1 });

// Virtual untuk calculate total children
dailyCareRecordSchema.virtual("totalChildren").get(function() {
  return ((this as { children?: unknown[] }).children ?? []).length;
});

export default mongoose.model("DailyCareRecord", dailyCareRecordSchema);

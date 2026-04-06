import mongoose from "mongoose";

const weeklyActivitySchema = new mongoose.Schema({
  masterActivityId: { type: mongoose.Schema.Types.ObjectId, ref: "MasterActivity" },
  activityName: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      "meal", "nap", "toileting", "care", "play",
      "learning", "creative", "physical", "outdoor",
      "routine", "social", "development"
    ],
    required: true 
  },
  assignedSitters: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
  }],
  notes: String,
}, { _id: false });

const childAssignmentSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildrenDaycare", required: true },
  childName: { type: String, required: true },
  childPhoto: String,
  assignedSitters: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    shift: { 
      type: String, 
      enum: ["morning", "afternoon", "full"],
      required: true 
    },
  }],
  activities: [weeklyActivitySchema],
}, { _id: false });

const weeklyScheduleDaySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dayOfWeek: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6], required: true }, // 0=Sunday, 6=Saturday
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "ScheduleTemplate" },
  childAssignments: [childAssignmentSchema],
}, { _id: false });

const weeklyScheduleSchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  days: [weeklyScheduleDaySchema],
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
weeklyScheduleSchema.index({ daycareId: 1, weekStart: -1 });
weeklyScheduleSchema.index({ "days.date": 1 });
weeklyScheduleSchema.index({ "days.childAssignments.childId": 1 });

// Virtual untuk check if week is in the past
weeklyScheduleSchema.virtual("isPast").get(function() {
  return new Date() > this.weekEnd;
});

weeklyScheduleSchema.virtual("isCurrent").get(function() {
  const now = new Date();
  return now >= this.weekStart && now <= this.weekEnd;
});

export default mongoose.model("WeeklySchedule", weeklyScheduleSchema);

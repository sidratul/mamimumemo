import mongoose from "mongoose";

const templateActivitySchema = new mongoose.Schema({
  masterActivityId: { type: mongoose.Schema.Types.ObjectId, ref: "MasterActivity" },
  activityName: { type: String, required: true },
  startTime: { type: String, required: true }, // Format: "HH:mm"
  endTime: { type: String, required: true }, // Format: "HH:mm"
  duration: { type: Number }, // menit, auto-calculated
  category: { 
    type: String, 
    enum: [
      "meal", "nap", "toileting", "care", "play",
      "learning", "creative", "physical", "outdoor",
      "routine", "social", "development"
    ],
    required: true 
  },
  defaultSitterRole: { 
    type: String, 
    enum: ["any", "senior_sitter", "junior_sitter"],
    default: "any"
  },
}, { _id: false });

const scheduleTemplateSchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  name: { type: String, required: true }, // contoh: "Routine Harian", "Weekend Special"
  dayOfWeek: [{ 
    type: Number, 
    enum: [0, 1, 2, 3, 4, 5, 6], // JavaScript standard: 0=Sunday, 6=Saturday
  }],
  activities: [templateActivitySchema],
  active: { type: Boolean, default: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
scheduleTemplateSchema.index({ daycareId: 1, active: 1 });
scheduleTemplateSchema.index({ dayOfWeek: 1 });

export default mongoose.model("ScheduleTemplate", scheduleTemplateSchema);

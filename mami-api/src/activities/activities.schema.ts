import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare" }, // null jika di rumah
  masterActivityId: { type: mongoose.Schema.Types.ObjectId, ref: "MasterActivity" },
  activityName: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      "meal", "nap", "toileting", "care", "play", 
      "learning", "creative", "physical", "outdoor", 
      "routine", "social", "development"
    ],
    required: true 
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // Format: "HH:mm"
  endTime: { type: String }, // Format: "HH:mm"
  duration: { type: Number }, // menit, auto-calculated
  
  // Dynamic fields (optional, sesuai kebutuhan)
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
  
  // Metadata
  source: { 
    type: String, 
    enum: ["parent", "guardian", "daycare"],
    default: "parent"
  },
  loggedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    relation: { type: String, required: true },
    role: { type: String, enum: ["parent", "guardian", "sitter", "admin"] },
  },
  visibleTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // guardians yang bisa lihat
  notes: String,
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
activitySchema.index({ childId: 1, date: -1 });
activitySchema.index({ daycareId: 1, date: -1 });
activitySchema.index({ category: 1 });
activitySchema.index({ "loggedBy.userId": 1 });

// Virtual untuk calculate duration jika startTime & endTime ada
activitySchema.virtual("calculatedDuration").get(function() {
  if (this.startTime && this.endTime) {
    const start = new Date(`2000-01-01 ${this.startTime}`);
    const end = new Date(`2000-01-01 ${this.endTime}`);
    return Math.round((end.getTime() - start.getTime()) / 60000);
  }
  return this.duration;
});

export default mongoose.model("Activity", activitySchema);

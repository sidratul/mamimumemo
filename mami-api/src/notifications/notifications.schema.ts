import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { 
    type: String, 
    enum: ["attendance", "activity", "health", "invoice", "schedule", "general"],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: mongoose.Schema.Types.Mixed, // flexible data payload
  read: { type: Boolean, default: false },
  readAt: Date,
  expiresAt: Date,
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ daycareId: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-delete

export default mongoose.model("Notification", notificationSchema);

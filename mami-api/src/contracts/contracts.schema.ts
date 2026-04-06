import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
  childIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChildrenDaycare" }],
  serviceType: { 
    type: String, 
    enum: ["daily", "weekly", "monthly"],
    required: true 
  },
  price: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["active", "expired", "terminated"],
    default: "active"
  },
  terms: String,
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
contractSchema.index({ daycareId: 1, status: 1 });
contractSchema.index({ parentId: 1, status: 1 });
contractSchema.index({ startDate: 1, endDate: 1 });

// Virtual untuk check if expired
contractSchema.virtual("isExpired").get(function() {
  return new Date() > this.endDate;
});

export default mongoose.model("Contract", contractSchema);

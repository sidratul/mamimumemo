import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: { type: String, required: true },
}, { _id: false });

const pickupAuthorizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: { type: String, required: true },
}, { _id: false });

const parentUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ["PARENT", "parent"], required: true },
}, { _id: false });

const parentCustomDataSchema = new mongoose.Schema({
  deskripsi: String, // No rekening, catatan khusus, dll
  emergencyContact: { type: emergencyContactSchema },
  pickupAuthorization: [pickupAuthorizationSchema],
  notes: String,
}, { _id: false });

const parentSchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  user: { type: parentUserSchema, required: true },
  customData: { type: parentCustomDataSchema, default: () => ({}) },
  childrenIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChildrenDaycare" }],
  enrolledAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
parentSchema.index({ daycareId: 1, active: 1 });
parentSchema.index({ "user.userId": 1 });

export default mongoose.model("Parent", parentSchema);

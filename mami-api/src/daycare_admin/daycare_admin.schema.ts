import mongoose from "mongoose";

const approvalHistoryActorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
}, { _id: false });

const approvalHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["DRAFT", "SUBMITTED", "IN_REVIEW", "NEEDS_REVISION", "APPROVED", "REJECTED", "SUSPENDED"],
    required: true,
  },
  note: { type: String, default: "" },
  changedBy: { type: approvalHistoryActorSchema, required: true },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const daycareOwnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
}, { _id: false });

const legalDocumentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  url: { type: String, required: true },
  verified: { type: Boolean, default: false },
}, { _id: false });

const approvalSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["DRAFT", "SUBMITTED", "IN_REVIEW", "NEEDS_REVISION", "APPROVED", "REJECTED", "SUSPENDED"],
    default: "DRAFT",
  },
  note: { type: String, default: "" },
  reviewedBy: { type: approvalHistoryActorSchema },
  reviewedAt: { type: Date },
  history: { type: [approvalHistorySchema], default: [] },
}, { _id: false });

const daycareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  address: { type: String, required: true },
  city: { type: String, required: true },
  owner: { type: daycareOwnerSchema, required: true },
  legalDocuments: { type: [legalDocumentSchema], default: [] },
  submittedAt: { type: Date },
  approvedAt: { type: Date },
  isActive: { type: Boolean, default: false },
  approval: { type: approvalSchema, default: () => ({}) },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

daycareSchema.index({ "approval.status": 1, createdAt: -1 });
daycareSchema.index({ "owner.userId": 1, createdAt: -1 });
daycareSchema.index({ name: "text", city: "text", "owner.name": "text" });

export default mongoose.model("Daycare", daycareSchema);

import mongoose from "mongoose";
import { userSubDocumentSchema } from "@/auth/auth.schema.ts";
import { DAYCARE_APPROVAL_STATUSES, DaycareApprovalStatus } from "./daycare.enum.ts";

const approvalHistoryActorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
}, { _id: false });

const approvalHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: DAYCARE_APPROVAL_STATUSES,
    required: true,
  },
  note: { type: String, default: "" },
  changedBy: { type: approvalHistoryActorSchema, required: true },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const legalDocumentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  url: { type: String, required: true },
  verified: { type: Boolean, default: false },
}, { _id: false });

const approvalSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: DAYCARE_APPROVAL_STATUSES,
    default: DaycareApprovalStatus.DRAFT,
  },
  note: { type: String, default: "" },
  reviewedBy: { type: approvalHistoryActorSchema },
  reviewedAt: { type: Date },
  history: { type: [approvalHistorySchema], default: [] },
}, { _id: false });

const deletedBySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
}, { _id: false });

const daycareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  address: { type: String, required: true },
  city: { type: String, required: true },
  owner: { type: userSubDocumentSchema, required: true },
  legalDocuments: { type: [legalDocumentSchema], default: [] },
  submittedAt: { type: Date },
  approvedAt: { type: Date },
  isActive: { type: Boolean, default: false },
  approval: { type: approvalSchema, default: () => ({}) },
  deletedAt: { type: Date },
  deletedBy: { type: deletedBySchema },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

daycareSchema.index({ "approval.status": 1, createdAt: -1 });
daycareSchema.index({ name: "text", city: "text", "owner.name": "text" });

export default mongoose.model("Daycare", daycareSchema);

import mongoose from "mongoose";
import { userSubDocumentSchema } from "@/auth/auth.schema.ts";
import {
  DAYCARE_MEMBERSHIP_PERSONAS,
  DAYCARE_MEMBERSHIP_STATUSES,
  DaycareMembershipStatus,
} from "./daycare_memberships.enum.ts";

const daycareMembershipDaycareSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Daycare",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, { _id: false });

const daycareMembershipSchema = new mongoose.Schema({
  user: { type: userSubDocumentSchema, required: true },
  daycare: { type: daycareMembershipDaycareSchema, required: true },
  persona: {
    type: String,
    enum: DAYCARE_MEMBERSHIP_PERSONAS,
    required: true,
  },
  status: {
    type: String,
    enum: DAYCARE_MEMBERSHIP_STATUSES,
    default: DaycareMembershipStatus.ACTIVE,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: { type: Date },
  notes: { type: String, default: "" },
}, {
  timestamps: true,
});

daycareMembershipSchema.index({ "user._id": 1, status: 1 });
daycareMembershipSchema.index({ "daycare._id": 1, status: 1 });
daycareMembershipSchema.index({ "user._id": 1, "daycare._id": 1, persona: 1, status: 1 });

export default mongoose.model("DaycareMembership", daycareMembershipSchema);

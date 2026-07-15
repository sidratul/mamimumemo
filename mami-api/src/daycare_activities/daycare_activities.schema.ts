import mongoose from "mongoose";
import { userRefSchema } from "#shared/schemas/user-refs.schema.ts";
import { activityCategoryFieldConfigSchema } from "@/activity_categories/activity_categories.schema.ts";

const daycareActivitySchema = new mongoose.Schema({
  daycareId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Daycare",
    required: true,
  },
  sourceMasterActivityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterActivity",
  },
  sourceMasterVersion: { type: Number },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, required: true },
  defaultDuration: { type: Number, default: 30 },
  icon: { type: String, default: "" },
  color: { type: String, default: "" },
  active: { type: Boolean, default: true },
  fieldConfig: {
    type: activityCategoryFieldConfigSchema,
    default: () => ({}),
  },
  createdBy: { type: userRefSchema, required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

daycareActivitySchema.index({ daycareId: 1, active: 1, name: 1 });
daycareActivitySchema.index(
  { daycareId: 1, sourceMasterActivityId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sourceMasterActivityId: { $type: "objectId" },
    },
  },
);

export default mongoose.model("DaycareActivity", daycareActivitySchema);

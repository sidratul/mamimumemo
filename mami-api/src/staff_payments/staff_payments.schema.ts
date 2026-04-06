import mongoose from "mongoose";
import { staffRefSchema } from "#shared/schemas/user-refs.schema.ts";

const deductionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
}, { _id: false });

const staffPaymentSchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  staff: { type: staffRefSchema, required: true },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  daysWorked: { type: Number, required: true },
  rate: { type: Number, required: true }, // daily rate
  amount: { type: Number, required: true }, // gross amount
  deductions: [deductionSchema],
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending"
  },
  paidAt: Date,
  notes: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
staffPaymentSchema.index({ daycareId: 1, status: 1 });
staffPaymentSchema.index({ "staff.userId": 1 });
staffPaymentSchema.index({ period: 1 });

// Virtual untuk calculate total (net amount = gross - deductions)
staffPaymentSchema.virtual("total").get(function() {
  const totalDeductions = this.deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
  return this.amount - totalDeductions;
});

export default mongoose.model("StaffPayment", staffPaymentSchema);

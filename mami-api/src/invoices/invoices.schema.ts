import mongoose from "mongoose";
import { parentRefSchema } from "#shared/schemas/user-refs.schema.ts";

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: "Contract", required: true },
  parent: { type: parentRefSchema, required: true },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  items: [invoiceItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "paid", "overdue", "cancelled"],
    default: "pending"
  },
  dueDate: { type: Date, required: true },
  paidAt: Date,
  notes: String,
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
invoiceSchema.index({ daycareId: 1, status: 1 });
invoiceSchema.index({ contractId: 1 });
invoiceSchema.index({ "parent.userId": 1 });
invoiceSchema.index({ dueDate: 1 });

// Virtual untuk check if overdue
invoiceSchema.virtual("isOverdue").get(function() {
  return this.status === "pending" && new Date() > this.dueDate;
});

export default mongoose.model("Invoice", invoiceSchema);

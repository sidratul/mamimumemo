import mongoose from "mongoose";

const medicationRecordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hospital: String,
  phone: String,
}, { _id: false });

const reportedBySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  relation: { type: String, required: true },
}, { _id: false });

const medicalRecordSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
  type: { 
    type: String, 
    enum: ["illness", "injury", "chronic_condition", "allergy", "medication"],
    required: true 
  },
  name: { type: String, required: true },
  diagnosis: { type: String, required: true },
  symptoms: [String],
  startDate: { type: Date, required: true },
  endDate: Date,
  status: { 
    type: String, 
    enum: ["active", "recovered", "chronic", "recurring"],
    default: "active"
  },
  severity: { 
    type: String, 
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  treatment: String,
  medications: [medicationRecordSchema],
  doctor: { type: doctorSchema },
  attachments: [String],
  notes: String,
  reportedBy: { type: reportedBySchema, required: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
medicalRecordSchema.index({ childId: 1 });
medicalRecordSchema.index({ type: 1 });
medicalRecordSchema.index({ status: 1 });
medicalRecordSchema.index({ reportedBy: 1 });

export default mongoose.model("MedicalRecord", medicalRecordSchema);

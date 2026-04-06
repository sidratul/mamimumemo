import mongoose from "mongoose";

// User reference subdocument - untuk createdBy, updatedBy, dll
export const userRefSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  role: { type: String, required: true },
}, { _id: false });

// Staff reference subdocument - untuk staff di daycare
export const staffRefSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
}, { _id: false });

// Parent reference subdocument - untuk parent di contract/invoice
export const parentRefSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
}, { _id: false });

// Guardian reference subdocument - untuk guardian di children
export const guardianUserRefSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ["parent", "guardian"], required: true },
}, { _id: false });

// Simple user reference (tanpa email/phone) - untuk loggedBy, uploadedBy, dll
export const simpleUserRefSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
}, { _id: false });

// Assigned user reference - untuk assignedSitters
export const assignedUserRefSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  shift: { type: String, enum: ["morning", "afternoon", "full"] },
}, { _id: false });

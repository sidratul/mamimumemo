import mongoose from "mongoose";
import { simpleUserRefSchema } from "#shared/schemas/user-refs.schema.ts";

const gallerySchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  childName: String, // null untuk general/gallery album
  photos: [{ type: String, required: true }], // array of URLs
  caption: String,
  date: { type: Date, required: true },
  event: String,
  uploadedBy: { type: simpleUserRefSchema, required: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
gallerySchema.index({ daycareId: 1, date: -1 });
gallerySchema.index({ daycareId: 1, childName: 1 });

export default mongoose.model("Gallery", gallerySchema);

import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["breakfast", "snack", "lunch", "dinner"],
    required: true 
  },
  menu: { type: String, required: true },
  ingredients: [String],
  allergens: [String],
  notes: String,
}, { _id: false });

const menuSchema = new mongoose.Schema({
  daycareId: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare", required: true },
  date: { type: Date, required: true },
  meals: [mealSchema],
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query yang sering digunakan
menuSchema.index({ daycareId: 1, date: -1 });

export default mongoose.model("Menu", menuSchema);

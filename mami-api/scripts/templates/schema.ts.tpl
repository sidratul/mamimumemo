import { Schema, model } from "mongoose";
import { __NAME__ } from "./__NAME_LOWER__.d.ts";

const __NAME_CAMEL__Schema = new Schema<__NAME__>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const __NAME__Model = model<__NAME__>("__NAME__", __NAME_CAMEL__Schema);
export default __NAME__Model;

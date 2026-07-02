import mongoose from "mongoose";
import { SYSTEM_ROLES } from "#shared/enums/enum.ts";

export const userSubDocumentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
  systemRole: {
    type: String,
    enum: SYSTEM_ROLES,
    default: null,
  },
}, {
  timestamps: true,
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
export { UserModel };

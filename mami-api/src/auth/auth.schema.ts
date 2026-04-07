import mongoose from "mongoose";
import { USER_ROLES, UserRole } from "#shared/enums/enum.ts";

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
  role: {
    type: String,
    enum: USER_ROLES,
    default: UserRole.PARENT,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const AuthModel = mongoose.model("User", userSchema);

export default AuthModel;
export { AuthModel as User };

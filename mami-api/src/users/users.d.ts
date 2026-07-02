import { HydratedDocument } from "mongoose";
import { ObjectId, PaginationOptions, SortOptions } from "#shared/index.ts";
import { SystemRoleType, UserAccess } from "#shared/enums/enum.ts";

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  systemRole?: SystemRoleType | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDoc = HydratedDocument<User>;

export type UserSubDoc = Pick<User, "_id" | "name" | "email" | "phone">;

export interface UserFilter {
  search?: string;
  accesses?: UserAccess[];
}

export interface UserQueryOptions
  extends UserFilter, PaginationOptions, SortOptions {}

import { HydratedDocument } from "mongoose";
import { ObjectId, PaginationOptions, SortOptions } from "#shared/index.ts";
import { RoleType } from "#shared/enums/enum.ts";

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: RoleType;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDoc = HydratedDocument<User>;

export type UserSubDoc = Pick<User, "_id" | "name" | "email" | "phone">;

export type UserPersona =
  | "SUPER_ADMIN"
  | "PARENT"
  | "OWNER"
  | "DAYCARE_ADMIN"
  | "DAYCARE_SITTER";

export interface UserFilter {
  search?: string;
  personas?: UserPersona[];
}

export interface UserQueryOptions extends UserFilter, PaginationOptions, SortOptions {}

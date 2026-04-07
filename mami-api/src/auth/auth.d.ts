import { HydratedDocument } from "mongoose";
import { ObjectId, SortOptions, PaginationOptions } from "#shared/index.ts";
import { RoleType } from "#shared/enums/enum.ts";

export interface Auth {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: RoleType; // Add role property
  createdAt: Date;
  updatedAt: Date;
}

export type AuthDoc = HydratedDocument<Auth>;

export type AuthSubDoc = Pick<Auth, "_id" | "name" | "email" | "phone">;
export type UserSubDoc = AuthSubDoc;

export interface AuthFilter {
  search?: string;
}

export interface AuthQueryOptions extends AuthFilter, PaginationOptions, SortOptions {}

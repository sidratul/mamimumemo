import { HydratedDocument } from "mongoose";
import { ObjectId, SortOptions, PaginationOptions } from "#shared/index.ts";

export interface __NAME__ {
  _id: ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type __NAME__Doc = HydratedDocument<__NAME__>;

export interface __NAME__Filter {
  search?: string;
}

export interface __NAME__QueryOptions extends __NAME__Filter, PaginationOptions, SortOptions {}

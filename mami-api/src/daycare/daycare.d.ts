import { HydratedDocument } from "mongoose";
import { ObjectId, PaginationOptions, SortOptions } from "#shared/index.ts";
import { DaycareApprovalStatus } from "./daycare.enum.ts";
import type { UserSubDoc } from "@/auth/auth.d.ts";

export type DaycareLegalDocument = {
  type: string;
  url: string;
  verified: boolean;
};

export type DaycareApprovalHistoryActor = {
  userId?: ObjectId;
  name: string;
};

export type DaycareApprovalHistory = {
  status: DaycareApprovalStatus;
  note?: string;
  changedBy: DaycareApprovalHistoryActor;
  changedAt: Date;
};

export type DaycareApproval = {
  status: DaycareApprovalStatus;
  note?: string;
  reviewedBy?: DaycareApprovalHistoryActor;
  reviewedAt?: Date;
  history: DaycareApprovalHistory[];
};

export type DaycareDeletedBy = {
  userId: ObjectId;
  name: string;
};

export type DaycareDocShape = {
  id?: string;
  name: string;
  logoUrl?: string;
  description?: string;
  address: string;
  city: string;
  owner: UserSubDoc;
  legalDocuments: DaycareLegalDocument[];
  submittedAt?: Date;
  approvedAt?: Date;
  isActive: boolean;
  approval: DaycareApproval;
  deletedAt?: Date;
  deletedBy?: DaycareDeletedBy;
  createdAt: Date;
  updatedAt: Date;
};

export type DaycareCreateData = Omit<
  DaycareDocShape,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "deletedBy"
>;

export type DaycareRecord = DaycareDocShape & {
  _id: ObjectId;
  id?: string;
};

export type DaycareDoc = HydratedDocument<DaycareDocShape>;

export interface DaycareFilter {
  statuses?: DaycareApprovalStatus[];
  ownerIds?: ObjectId[];
  cities?: string[];
  isActive?: boolean;
  search?: string;
}

export interface DaycareQueryOptions extends DaycareFilter, PaginationOptions {
  sort?: SortOptions["sort"];
}

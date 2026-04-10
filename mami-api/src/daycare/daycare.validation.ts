import { Types } from "mongoose";
import { z } from "zod";
import { DaycareApprovalStatus } from "./daycare.enum.ts";

export const daycareApprovalStatusEnum = z.nativeEnum(DaycareApprovalStatus);

export const legalDocumentInput = z.object({
  type: z.string().min(1, "Document type is required"),
  url: z.string().min(1, "Document file path is required"),
  verified: z.boolean().optional(),
});

export const registerDaycareOwnerInput = z.object({
  name: z.string().min(1, "Owner name is required"),
  email: z.string().email("Owner email must be valid"),
  password: z.string().min(6, "Owner password must be at least 6 characters"),
  phone: z.string().optional(),
});

export const registerDaycareDataInput = z.object({
  name: z.string().min(1, "Daycare name is required"),
  logoUrl: z.string().url("Logo URL must be valid").optional().or(z.literal("")),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  legalDocuments: z.array(legalDocumentInput).optional(),
});

export const registerDaycareInput = z.object({
  owner: registerDaycareOwnerInput,
  daycare: registerDaycareDataInput,
});

export const updateDaycareDocumentsInput = z.object({
  legalDocuments: z.array(legalDocumentInput),
});

export const daycareFilterInput = z.object({
  statuses: z.array(daycareApprovalStatusEnum).optional(),
  ownerIds: z.array(z.string().min(1)).optional(),
  cities: z.array(z.string().min(1)).optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

export const sortInput = z.object({
  sortBy: z.string().optional(),
  sortType: z.enum(["ASC", "DESC"]).optional(),
});

export const paginationInput = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export const listDaycaresInput = z.object({
  filter: daycareFilterInput.optional(),
  sort: sortInput.optional(),
  pagination: paginationInput.optional(),
});

export const daycareCountInput = z.object({
  filter: daycareFilterInput.optional(),
});

export const updateDaycareApprovalInput = z.object({
  status: daycareApprovalStatusEnum,
  note: z.string().optional(),
});

export const deleteDaycareInput = z.object({
  id: z.instanceof(Types.ObjectId),
});

export const purgeDaycareInput = z.object({
  id: z.instanceof(Types.ObjectId),
  input: z.object({
    deleteOwner: z.boolean().optional(),
  }).optional(),
});

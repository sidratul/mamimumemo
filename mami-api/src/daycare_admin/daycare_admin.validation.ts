import { z } from "zod";

export const daycareApprovalStatusEnum = z.enum([
  "DRAFT",
  "SUBMITTED",
  "IN_REVIEW",
  "NEEDS_REVISION",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
]);

export const legalDocumentInput = z.object({
  type: z.string().min(1, "Document type is required"),
  url: z.string().url("Document URL must be valid"),
  verified: z.boolean().optional(),
});

export const createDaycareDraftInput = z.object({
  name: z.string().min(1, "Daycare name is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  legalDocuments: z.array(legalDocumentInput).optional(),
});

export const listSystemDaycaresInput = z.object({
  status: daycareApprovalStatusEnum.optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

export const updateDaycareApprovalInput = z.object({
  status: daycareApprovalStatusEnum,
  note: z.string().optional(),
});

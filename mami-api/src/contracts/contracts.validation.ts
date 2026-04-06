import { z } from "zod";
import { ServiceTypeEnum, ContractStatusEnum } from "#shared/types/enums.ts";

export const createContractInput = z.object({
  daycareId: z.string(),
  parentId: z.string(),
  childIds: z.array(z.string()),
  serviceType: z.nativeEnum(ServiceTypeEnum),
  price: z.number().positive("Price must be positive"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  terms: z.string().optional(),
});

export const updateContractInput = z.object({
  serviceType: z.nativeEnum(ServiceTypeEnum).optional(),
  price: z.number().positive().optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  status: z.nativeEnum(ContractStatusEnum).optional(),
  terms: z.string().optional(),
});

export const contractStatusUpdateInput = z.object({
  status: z.nativeEnum(ContractStatusEnum),
});

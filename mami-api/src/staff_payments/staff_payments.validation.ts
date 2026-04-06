import { z } from "zod";
import { StaffPaymentStatusEnum } from "#shared/types/enums.ts";

export const deductionInput = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
});

export const staffRefInput = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
});

export const createStaffPaymentInput = z.object({
  daycareId: z.string(),
  staff: staffRefInput,
  period: z.object({
    start: z.string().or(z.date()),
    end: z.string().or(z.date()),
  }),
  daysWorked: z.number().positive("Days worked must be positive"),
  rate: z.number().positive("Rate must be positive"),
  amount: z.number().positive("Amount must be positive"),
  deductions: z.array(deductionInput).optional(),
  notes: z.string().optional(),
});

export const updateStaffPaymentInput = z.object({
  daysWorked: z.number().positive().optional(),
  rate: z.number().positive().optional(),
  amount: z.number().positive().optional(),
  deductions: z.array(deductionInput).optional(),
  status: z.nativeEnum(StaffPaymentStatusEnum).optional(),
  notes: z.string().optional(),
});

export const markStaffPaymentAsPaidInput = z.object({
  paidAt: z.string().or(z.date()).optional(),
});

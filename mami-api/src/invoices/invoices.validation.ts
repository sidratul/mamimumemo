import { z } from "zod";
import { InvoiceStatusEnum } from "#shared/types/enums.ts";

export const invoiceItemInput = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().positive("Unit price must be positive"),
  subtotal: z.number().positive("Subtotal must be positive"),
});

export const parentRefInput = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

export const createInvoiceInput = z.object({
  daycareId: z.string(),
  contractId: z.string(),
  parent: parentRefInput,
  period: z.object({
    start: z.string().or(z.date()),
    end: z.string().or(z.date()),
  }),
  items: z.array(invoiceItemInput),
  total: z.number().positive("Total must be positive"),
  dueDate: z.string().or(z.date()),
  notes: z.string().optional(),
});

export const updateInvoiceInput = z.object({
  items: z.array(invoiceItemInput).optional(),
  total: z.number().positive().optional(),
  status: z.nativeEnum(InvoiceStatusEnum).optional(),
  dueDate: z.string().or(z.date()).optional(),
  notes: z.string().optional(),
});

export const markAsPaidInput = z.object({
  paidAt: z.string().or(z.date()).optional(),
});

import { z } from "zod";

const colorSchema = z.string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Color must use #RRGGBB")
  .or(z.literal(""));

export const updateDaycareBrandingInput = z.object({
  primaryColor: colorSchema.optional(),
  secondaryColor: colorSchema.optional(),
  logoUrl: z.string().trim().url().or(z.literal("")).optional(),
});

export const updateDaycareActivityCategoryInput = z.object({
  label: z.string().trim().min(1).optional(),
  color: colorSchema.optional(),
  icon: z.string().trim().optional(),
  enabled: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

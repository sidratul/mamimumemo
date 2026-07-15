import { z } from "zod";

export const categoryCodeSchema = z.string()
  .trim()
  .min(1)
  .regex(/^[A-Za-z][A-Za-z0-9_]*$/, "Code must use letters, numbers, and underscores")
  .transform((value) => value.toUpperCase());

export const storedCategoryCodeSchema = z.string()
  .trim()
  .min(1)
  .regex(/^[A-Za-z][A-Za-z0-9_]*$/, "Code must use letters, numbers, and underscores")
  .transform((value) => value.toLowerCase());

export const activityCategoryFieldConfigInput = z.object({
  mealType: z.boolean().optional(),
  menu: z.boolean().optional(),
  eaten: z.boolean().optional(),
  quality: z.boolean().optional(),
  toiletingType: z.boolean().optional(),
  toiletingNotes: z.boolean().optional(),
  mood: z.boolean().optional(),
  photos: z.boolean().optional(),
  description: z.boolean().optional(),
  intensity: z.boolean().optional(),
  location: z.boolean().optional(),
  materials: z.boolean().optional(),
  drinkName: z.boolean().optional(),
  drinkAmountMl: z.boolean().optional(),
  hygieneType: z.boolean().optional(),
  medicationName: z.boolean().optional(),
  medicationDose: z.boolean().optional(),
  medicationUnit: z.boolean().optional(),
  administeredAt: z.boolean().optional(),
  parentConsent: z.boolean().optional(),
});

export const createActivityCategoryInput = z.object({
  code: categoryCodeSchema,
  defaultLabel: z.string().trim().min(1),
  behaviorType: z.enum([
    "MEAL", "DRINK", "NAP", "TOILETING", "HYGIENE",
    "MEDICATION", "CARE", "PLAY", "LEARNING", "GENERIC",
  ]).optional(),
  defaultColor: z.string().trim().optional(),
  defaultIcon: z.string().trim().optional(),
  defaultFieldConfig: activityCategoryFieldConfigInput.optional(),
  sortOrder: z.number().int().optional(),
});

export const updateActivityCategoryInput = createActivityCategoryInput
  .omit({ code: true })
  .partial()
  .extend({ isActive: z.boolean().optional() });

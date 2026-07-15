import { z } from "zod";
import { storedCategoryCodeSchema } from "@/activity_categories/activity_categories.validation.ts";

export const fieldConfigInput = z.object({
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

export const createMasterActivityInput = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().trim().optional(),
  category: storedCategoryCodeSchema,
  defaultDuration: z.number().positive().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  fieldConfig: fieldConfigInput.optional(),
  isStarter: z.boolean().optional(),
});

export const updateMasterActivityInput = z.object({
  name: z.string().min(1).optional(),
  description: z.string().trim().optional(),
  category: storedCategoryCodeSchema.optional(),
  defaultDuration: z.number().positive().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  active: z.boolean().optional(),
  fieldConfig: fieldConfigInput.optional(),
  isStarter: z.boolean().optional(),
});

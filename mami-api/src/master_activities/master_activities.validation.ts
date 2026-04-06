import { z } from "zod";
import { ActivityCategoryEnum } from "#shared/types/enums.ts";

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
});

export const createMasterActivityInput = z.object({
  daycareId: z.string(),
  name: z.string().min(1, "Name is required"),
  category: z.nativeEnum(ActivityCategoryEnum),
  defaultDuration: z.number().positive().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  fieldConfig: fieldConfigInput.optional(),
});

export const updateMasterActivityInput = z.object({
  name: z.string().min(1).optional(),
  category: z.nativeEnum(ActivityCategoryEnum).optional(),
  defaultDuration: z.number().positive().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  active: z.boolean().optional(),
  fieldConfig: fieldConfigInput.optional(),
});

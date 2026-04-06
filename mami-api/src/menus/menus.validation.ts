import { z } from "zod";
import { MealTypeEnum } from "#shared/types/enums.ts";

export const mealInput = z.object({
  type: z.nativeEnum(MealTypeEnum),
  menu: z.string().min(1, "Menu is required"),
  ingredients: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const createMenuInput = z.object({
  daycareId: z.string(),
  date: z.string().or(z.date()),
  meals: z.array(mealInput),
});

export const updateMenuInput = z.object({
  meals: z.array(mealInput).optional(),
});

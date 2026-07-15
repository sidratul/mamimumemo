import { z } from "zod";
import { fieldConfigInput } from "@/master_activities/master_activities.validation.ts";
import { storedCategoryCodeSchema } from "@/activity_categories/activity_categories.validation.ts";

const objectIdString = z.preprocess(
  (value) =>
    value && typeof value === "object" && "toString" in value
      ? value.toString()
      : value,
  z.string(),
);

export const createDaycareActivityInput = z.object({
  daycareId: objectIdString,
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  category: storedCategoryCodeSchema,
  defaultDuration: z.number().positive().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  fieldConfig: fieldConfigInput.optional(),
});

export const updateDaycareActivityInput = createDaycareActivityInput
  .omit({ daycareId: true })
  .partial()
  .extend({ active: z.boolean().optional() });

export const adoptMasterActivityInput = z.object({
  daycareId: objectIdString,
  masterActivityId: objectIdString,
});

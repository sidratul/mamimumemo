import { z } from "zod";
import { ActivityCategoryEnum, DayOfWeekEnum, SitterRoleEnum } from "#shared/types/enums.ts";

export const templateActivityInput = z.object({
  masterActivityId: z.string().optional(),
  activityName: z.string().min(1, "Activity name is required"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  duration: z.number().positive().optional(),
  category: z.nativeEnum(ActivityCategoryEnum),
  defaultSitterRole: z.nativeEnum(SitterRoleEnum).optional(),
});

export const createScheduleTemplateInput = z.object({
  daycareId: z.string(),
  name: z.string().min(1, "Template name is required"),
  dayOfWeek: z.array(z.nativeEnum(DayOfWeekEnum)),
  activities: z.array(templateActivityInput),
});

export const updateScheduleTemplateInput = z.object({
  name: z.string().min(1).optional(),
  dayOfWeek: z.array(z.nativeEnum(DayOfWeekEnum)).optional(),
  activities: z.array(templateActivityInput).optional(),
  active: z.boolean().optional(),
});

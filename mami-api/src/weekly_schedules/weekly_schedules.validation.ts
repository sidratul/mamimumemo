import { z } from "zod";
import { ActivityCategoryEnum, DayOfWeekEnum, ShiftTypeEnum } from "#shared/types/enums.ts";

export const weeklyActivityInput = z.object({
  masterActivityId: z.string().optional(),
  activityName: z.string().min(1, "Activity name is required"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  category: z.nativeEnum(ActivityCategoryEnum),
  assignedSitters: z.array(z.object({
    userId: z.string(),
    name: z.string(),
  })).optional(),
  notes: z.string().optional(),
});

export const childAssignmentInput = z.object({
  childId: z.string(),
  childName: z.string(),
  childPhoto: z.string().url().optional(),
  assignedSitters: z.array(z.object({
    userId: z.string(),
    name: z.string(),
    shift: z.nativeEnum(ShiftTypeEnum),
  })).optional(),
  activities: z.array(weeklyActivityInput).optional(),
});

export const weeklyScheduleDayInput = z.object({
  date: z.string().or(z.date()),
  dayOfWeek: z.nativeEnum(DayOfWeekEnum),
  templateId: z.string().optional(),
  childAssignments: z.array(childAssignmentInput).optional(),
});

export const createWeeklyScheduleInput = z.object({
  daycareId: z.string(),
  weekStart: z.string().or(z.date()),
  weekEnd: z.string().or(z.date()),
  days: z.array(weeklyScheduleDayInput),
});

export const updateWeeklyScheduleInput = z.object({
  days: z.array(weeklyScheduleDayInput).optional(),
});

export const assignSitterInput = z.object({
  daycareId: z.string(),
  weekStart: z.string().or(z.date()),
  date: z.string().or(z.date()),
  childId: z.string(),
  sitters: z.array(z.object({
    userId: z.string(),
    name: z.string(),
    shift: z.nativeEnum(ShiftTypeEnum),
  })),
});

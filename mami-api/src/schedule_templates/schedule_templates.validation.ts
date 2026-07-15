import { z } from "zod";
import {
  DayOfWeekEnum,
  ScheduleTemplateTargetTypeEnum,
  SitterRoleEnum,
} from "#shared/types/enums.ts";
import { storedCategoryCodeSchema } from "@/activity_categories/activity_categories.validation.ts";

export const templateActivityInput = z.object({
  daycareActivityId: z.string().optional(),
  activityName: z.string().min(1, "Activity name is required"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  duration: z.number().positive().optional(),
  category: storedCategoryCodeSchema,
  defaultSitterRole: z.nativeEnum(SitterRoleEnum).optional(),
});

export const createScheduleTemplateInput = z.object({
  daycareId: z.string(),
  name: z.string().min(1, "Template name is required"),
  targetType: z.nativeEnum(ScheduleTemplateTargetTypeEnum),
  dayOfWeek: z.array(z.nativeEnum(DayOfWeekEnum)).optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  specificDate: z.string().or(z.date()).optional(),
  activities: z.array(templateActivityInput),
}).superRefine((value, ctx) => {
  if (value.targetType === ScheduleTemplateTargetTypeEnum.DAY_OF_WEEK && (!value.dayOfWeek || value.dayOfWeek.length === 0)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "dayOfWeek wajib diisi untuk target harian.", path: ["dayOfWeek"] });
  }

  if (value.targetType === ScheduleTemplateTargetTypeEnum.DATE_RANGE && (!value.startDate || !value.endDate)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "startDate dan endDate wajib diisi untuk target rentang tanggal.", path: ["startDate"] });
  }

  if (value.targetType === ScheduleTemplateTargetTypeEnum.SPECIFIC_DATE && !value.specificDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "specificDate wajib diisi untuk target tanggal tertentu.", path: ["specificDate"] });
  }
});

export const updateScheduleTemplateInput = z.object({
  name: z.string().min(1).optional(),
  targetType: z.nativeEnum(ScheduleTemplateTargetTypeEnum).optional(),
  dayOfWeek: z.array(z.nativeEnum(DayOfWeekEnum)).optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  specificDate: z.string().or(z.date()).optional(),
  activities: z.array(templateActivityInput).optional(),
  active: z.boolean().optional(),
});

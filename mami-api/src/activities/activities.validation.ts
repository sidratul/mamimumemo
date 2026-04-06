import { z } from "zod";
import {
  ActivityCategoryEnum,
  MealTypeEnum,
  EatenAmountEnum,
  NapQualityEnum,
  ToiletingTypeEnum,
  MoodEnum,
  IntensityEnum,
  ActivitySourceEnum,
} from "#shared/types/enums.ts";

export const loggedByInput = z.object({
  userId: z.string(),
  name: z.string(),
  relation: z.string(),
  role: z.enum(["parent", "guardian", "sitter", "admin"]),
});

export const createActivityInput = z.object({
  childId: z.string(),
  daycareId: z.string().optional(),
  masterActivityId: z.string().optional(),
  activityName: z.string().min(1, "Activity name is required"),
  category: z.nativeEnum(ActivityCategoryEnum),
  date: z.string().or(z.date()),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)").optional(),
  
  // Dynamic fields (optional)
  mealType: z.nativeEnum(MealTypeEnum).optional(),
  menu: z.string().optional(),
  eaten: z.nativeEnum(EatenAmountEnum).optional(),
  quality: z.nativeEnum(NapQualityEnum).optional(),
  toiletingType: z.nativeEnum(ToiletingTypeEnum).optional(),
  toiletingNotes: z.string().optional(),
  mood: z.nativeEnum(MoodEnum).optional(),
  photos: z.array(z.string().url()).optional(),
  description: z.string().optional(),
  intensity: z.nativeEnum(IntensityEnum).optional(),
  location: z.string().optional(),
  materials: z.string().optional(),
  
  visibleTo: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const updateActivityInput = z.object({
  activityName: z.string().min(1).optional(),
  category: z.nativeEnum(ActivityCategoryEnum).optional(),
  date: z.string().or(z.date()).optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  
  mealType: z.nativeEnum(MealTypeEnum).optional(),
  menu: z.string().optional(),
  eaten: z.nativeEnum(EatenAmountEnum).optional(),
  quality: z.nativeEnum(NapQualityEnum).optional(),
  toiletingType: z.nativeEnum(ToiletingTypeEnum).optional(),
  toiletingNotes: z.string().optional(),
  mood: z.nativeEnum(MoodEnum).optional(),
  photos: z.array(z.string().url()).optional(),
  description: z.string().optional(),
  intensity: z.nativeEnum(IntensityEnum).optional(),
  location: z.string().optional(),
  materials: z.string().optional(),
  
  notes: z.string().optional(),
});

export const activityTimelineInput = z.object({
  childId: z.string(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  includeDaycare: z.boolean().optional().default(true),
});

import { z } from "zod";
import {
  ActivityCategoryEnum,
  MealTypeEnum,
  EatenAmountEnum,
  NapQualityEnum,
  ToiletingTypeEnum,
  MoodEnum,
  IntensityEnum,
} from "#shared/types/enums.ts";

function normalizeEnumValue<TSchema extends z.ZodTypeAny>(schema: TSchema) {
  return z.preprocess((value) => {
    if (typeof value === "string") {
      return value.toLowerCase();
    }

    return value;
  }, schema);
}

// Attendance schemas
export const checkInInput = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  photo: z.string().url("Must be a valid URL"),
  by: z.object({
    userId: z.string(),
    name: z.string(),
  }),
});

export const checkOutInput = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  photo: z.string().url("Must be a valid URL"),
  by: z.object({
    userId: z.string(),
    name: z.string(),
  }),
});

// Activity schema
export const dailyActivityInput = z.object({
  masterActivityId: z.string().optional(),
  activityName: z.string().min(1, "Activity name is required"),
  category: normalizeEnumValue(z.nativeEnum(ActivityCategoryEnum)),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)").optional(),
  duration: z.number().positive().optional(),
  
  // Dynamic fields
  mealType: normalizeEnumValue(z.nativeEnum(MealTypeEnum)).optional(),
  menu: z.string().optional(),
  eaten: normalizeEnumValue(z.nativeEnum(EatenAmountEnum)).optional(),
  quality: normalizeEnumValue(z.nativeEnum(NapQualityEnum)).optional(),
  toiletingType: normalizeEnumValue(z.nativeEnum(ToiletingTypeEnum)).optional(),
  toiletingNotes: z.string().optional(),
  mood: normalizeEnumValue(z.nativeEnum(MoodEnum)).optional(),
  photos: z.array(z.string().url()).optional(),
  description: z.string().optional(),
  intensity: normalizeEnumValue(z.nativeEnum(IntensityEnum)).optional(),
  location: z.string().optional(),
  materials: z.string().optional(),
});

// Assigned Sitter schema
export const assignedSitterInput = z.object({
  userId: z.string(),
  name: z.string(),
  shift: normalizeEnumValue(z.enum(["morning", "afternoon", "full"])),
});

// Child daily record schema
export const childDailyRecordInput = z.object({
  childId: z.string(),
  childName: z.string(),
  childPhoto: z.string().url().optional(),
  attendance: z.object({
    checkIn: checkInInput,
    checkOut: checkOutInput.optional(),
    status: normalizeEnumValue(z.enum(["present", "absent", "late", "early_pickup"])).optional(),
  }).optional(),
  assignedSitters: z.array(assignedSitterInput).optional(),
  activities: z.array(dailyActivityInput).optional(),
  notes: z.string().optional(),
});

// Create Daily Care Record schema
export const createDailyCareRecordInput = z.object({
  daycareId: z.string(),
  date: z.string().or(z.date()),
  children: z.array(childDailyRecordInput),
});

// Update Daily Care Record schema
export const updateDailyCareRecordInput = z.object({
  children: z.array(childDailyRecordInput).optional(),
});

// Check-in mutation input
export const checkInChildInput = z.object({
  daycareId: z.string(),
  childId: z.string(),
  date: z.string().or(z.date()),
  checkIn: checkInInput,
});

// Check-out mutation input
export const checkOutChildInput = z.object({
  daycareId: z.string(),
  childId: z.string(),
  date: z.string().or(z.date()),
  checkOut: checkOutInput,
});

// Log activity input
export const logDailyActivityInput = z.object({
  daycareId: z.string(),
  childId: z.string(),
  date: z.string().or(z.date()),
  activity: dailyActivityInput,
});

import { z } from "zod";
import { GenderEnum } from "#shared/types/enums.ts";

const genderInput = z.preprocess((value) => {
  if (typeof value === "string") {
    return value.toLowerCase();
  }
  return value;
}, z.nativeEnum(GenderEnum));

export const childProfileInput = z.object({
  name: z.string().min(1, "Name is required"),
  birthDate: z.string().or(z.date()),
  photo: z.string().url().optional().or(z.literal("")),
  gender: genderInput,
});

export const childMedicalInput = z.object({
  allergies: z.array(z.string()).optional(),
  medicalNotes: z.string().optional(),
  medications: z.array(z.object({
    name: z.string().min(1),
    dosage: z.string().min(1),
    schedule: z.string().min(1),
  })).optional(),
});

export const childPreferencesInput = z.object({
  favoriteFoods: z.array(z.string()).optional(),
  favoriteActivities: z.array(z.string()).optional(),
  comfortItems: z.array(z.string()).optional(),
  napRoutine: z.string().optional(),
});

export const childCustomDataInput = z.object({
  customName: z.string().optional(),
  customPhoto: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const createChildrenDaycareInput = z.object({
  daycareId: z.string(),
  parentId: z.string(),
  globalChildId: z.string().optional(),
  profile: childProfileInput,
  medical: childMedicalInput.optional(),
  preferences: childPreferencesInput.optional(),
  customData: childCustomDataInput.optional(),
});

export const updateChildrenDaycareInput = z.object({
  profile: childProfileInput.optional(),
  medical: childMedicalInput.optional(),
  preferences: childPreferencesInput.optional(),
  customData: childCustomDataInput.optional(),
  exitedAt: z.string().or(z.date()).optional(),
  active: z.boolean().optional(),
});

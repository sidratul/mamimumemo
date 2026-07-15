import { z } from "zod";

const objectIdString = z.preprocess(
  (value) =>
    value && typeof value === "object" && "toString" in value
      ? value.toString()
      : value,
  z.string(),
);

const genderInput = z.preprocess((value) => {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value;
}, z.enum(["MALE", "FEMALE"]));

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
  notes: z.string().nullable().optional(),
  cognitiveNotes: z.string().nullable().optional(),
  developmentNotes: z.string().nullable().optional(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
});

export const createChildrenDaycareInput = z.object({
  daycareId: objectIdString,
  parentId: objectIdString,
  globalChildId: objectIdString.optional(),
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

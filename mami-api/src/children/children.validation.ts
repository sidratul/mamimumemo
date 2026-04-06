import { z } from "zod";
import { GenderEnum, RelationEnum, GuardianPermissionEnum } from "#shared/types/enums.ts";

export const childProfileInput = z.object({
  name: z.string().min(1, "Name is required"),
  birthDate: z.string().or(z.date()),
  photo: z.string().url().optional().or(z.literal("")),
  gender: z.nativeEnum(GenderEnum),
});

export const medicationInput = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  schedule: z.string().min(1, "Schedule is required"),
});

export const childMedicalInput = z.object({
  allergies: z.array(z.string()).optional(),
  medicalNotes: z.string().optional(),
  medications: z.array(medicationInput).optional(),
});

export const guardianInput = z.object({
  userId: z.string(),
  relation: z.nativeEnum(RelationEnum),
  permissions: z.array(z.nativeEnum(GuardianPermissionEnum)),
});

export const createChildInput = z.object({
  profile: childProfileInput,
  medical: childMedicalInput.optional(),
  guardians: z.array(guardianInput).optional(),
});

export const updateChildInput = z.object({
  profile: childProfileInput.optional(),
  medical: childMedicalInput.optional(),
  guardians: z.array(guardianInput).optional(),
});

export const addGuardianInput = z.object({
  userId: z.string(),
  relation: z.nativeEnum(RelationEnum),
  permissions: z.array(z.nativeEnum(GuardianPermissionEnum)),
});

export const removeGuardianInput = z.object({
  guardianUserId: z.string(),
});

import { z } from "zod";
import {
  MedicalRecordTypeEnum,
  MedicalRecordStatusEnum,
  MedicalRecordSeverityEnum,
} from "#shared/types/enums.ts";

export const medicationRecordInput = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
});

export const doctorInput = z.object({
  name: z.string().min(1, "Doctor name is required"),
  hospital: z.string().optional(),
  phone: z.string().optional(),
});

export const reportedByInput = z.object({
  userId: z.string(),
  name: z.string(),
  relation: z.string(),
});

export const createMedicalRecordInput = z.object({
  childId: z.string(),
  type: z.nativeEnum(MedicalRecordTypeEnum),
  name: z.string().min(1, "Name is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  symptoms: z.array(z.string()).optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  status: z.nativeEnum(MedicalRecordStatusEnum).optional(),
  severity: z.nativeEnum(MedicalRecordSeverityEnum).optional(),
  treatment: z.string().optional(),
  medications: z.array(medicationRecordInput).optional(),
  doctor: doctorInput.optional(),
  attachments: z.array(z.string().url()).optional(),
  notes: z.string().optional(),
  reportedBy: reportedByInput,
});

export const updateMedicalRecordInput = z.object({
  type: z.nativeEnum(MedicalRecordTypeEnum).optional(),
  name: z.string().min(1).optional(),
  diagnosis: z.string().min(1).optional(),
  symptoms: z.array(z.string()).optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  status: z.nativeEnum(MedicalRecordStatusEnum).optional(),
  severity: z.nativeEnum(MedicalRecordSeverityEnum).optional(),
  treatment: z.string().optional(),
  medications: z.array(medicationRecordInput).optional(),
  doctor: doctorInput.optional(),
  attachments: z.array(z.string().url()).optional(),
  notes: z.string().optional(),
});

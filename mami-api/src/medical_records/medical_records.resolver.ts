import { MedicalRecordsService } from "./medical_records.service.ts";
import { createMedicalRecordInput, updateMedicalRecordInput } from "./medical_records.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const medicalRecordsService = new MedicalRecordsService();

export const resolvers = {
  Query: {
    medicalRecords: (
      _: unknown,
      { childId, status }: { childId: string; status?: string },
      context: AppContext
    ) => {
      return medicalRecordsService.getMedicalRecords(childId, status, context);
    },
    medicalRecord: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return medicalRecordsService.getMedicalRecord(id, context);
    },
    activeMedicalRecords: (
      _: unknown,
      { childId }: { childId: string },
      context: AppContext
    ) => {
      return medicalRecordsService.getActiveMedicalRecords(childId, context);
    },
  },
  Mutation: {
    createMedicalRecord: (
      _: unknown,
      { input }: { input: typeof createMedicalRecordInput._type },
      context: AppContext
    ) => {
      createMedicalRecordInput.parse(input);
      return medicalRecordsService.createMedicalRecord(input, context);
    },
    updateMedicalRecord: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateMedicalRecordInput._type },
      context: AppContext
    ) => {
      updateMedicalRecordInput.parse(input);
      return medicalRecordsService.updateMedicalRecord(id, input, context);
    },
    deleteMedicalRecord: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return medicalRecordsService.deleteMedicalRecord(id, context);
    },
  },
};

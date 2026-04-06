import { MedicalRecordsRepository } from "./medical_records.repository.ts";
import { createMedicalRecordInput, updateMedicalRecordInput } from "./medical_records.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

const medicalRecordsRepository = new MedicalRecordsRepository();

export class MedicalRecordsService {
  async getMedicalRecords(childId: string, status: string | undefined, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const hasAccess = await medicalRecordsRepository.userHasAccess(childId, context.user.id);
    if (!hasAccess) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return await medicalRecordsRepository.findByChildId(childId, status);
  }

  async getMedicalRecord(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const record = await medicalRecordsRepository.findById(id);
    if (!record) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const hasAccess = await medicalRecordsRepository.userHasAccess(record.childId.toString(), context.user.id);
    if (!hasAccess) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return record;
  }

  async getActiveMedicalRecords(childId: string, context: AppContext) {
    return await this.getMedicalRecords(childId, "active", context);
  }

  async createMedicalRecord(
    input: typeof createMedicalRecordInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const hasAccess = await medicalRecordsRepository.userHasAccess(input.childId, context.user.id);
    if (!hasAccess) {
      throw new GraphQLError("You don't have permission to add medical records for this child");
    }

    // Check if user has input_health permission
    const child = await medicalRecordsRepository.userHasAccess(input.childId, context.user.id);
    if (!child) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const recordData = {
      ...input,
      reportedBy: {
        userId: context.user.id,
        name: context.user.name,
        relation: input.reportedBy.relation,
      },
    };

    return await medicalRecordsRepository.create(recordData);
  }

  async updateMedicalRecord(
    id: string,
    input: typeof updateMedicalRecordInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const existingRecord = await medicalRecordsRepository.findById(id);
    if (!existingRecord) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const hasAccess = await medicalRecordsRepository.userHasAccess(
      existingRecord.childId.toString(),
      context.user.id
    );
    if (!hasAccess) {
      throw new GraphQLError("You don't have permission to update this medical record");
    }

    return await medicalRecordsRepository.update(id, input);
  }

  async deleteMedicalRecord(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const record = await medicalRecordsRepository.findById(id);
    if (!record) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Only the person who created the record can delete it
    if (record.reportedBy.userId.toString() !== context.user.id) {
      throw new GraphQLError("You can only delete your own medical records");
    }

    return await medicalRecordsRepository.delete(id);
  }
}

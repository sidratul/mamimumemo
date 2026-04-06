import MedicalRecordModel from "./medical_records.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { ChildrenRepository } from "@/children/children.repository.ts";

const childrenRepository = new ChildrenRepository();

export class MedicalRecordsRepository {
  async findByChildId(childId: string, status?: string) {
    const query: any = { childId };
    if (status) {
      query.status = status;
    }
    return await MedicalRecordModel.find(query)
      .sort({ startDate: -1 })
      .exec();
  }

  async findById(id: string) {
    return await MedicalRecordModel.findById(id).exec();
  }

  async create(data: any) {
    const record = new MedicalRecordModel(data);
    return await record.save();
  }

  async update(id: string, data: any) {
    return await MedicalRecordModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    const result = await MedicalRecordModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async userHasAccess(childId: string, userId: string): Promise<boolean> {
    return await childrenRepository.userHasAccess(childId, userId);
  }
}

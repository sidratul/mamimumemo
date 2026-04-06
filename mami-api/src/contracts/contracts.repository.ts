import ContractModel from "./contracts.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class ContractsRepository {
  async findByDaycareId(daycareId: string, status?: string) {
    const query: any = { daycareId };
    if (status) {
      query.status = status;
    }
    return await ContractModel.find(query)
      .populate("parentId")
      .populate("childIds")
      .exec();
  }

  async findByParentId(parentId: string, status?: string) {
    const query: any = { parentId };
    if (status) {
      query.status = status;
    }
    return await ContractModel.find(query)
      .populate("childIds")
      .exec();
  }

  async findById(id: string) {
    return await ContractModel.findById(id)
      .populate("parentId")
      .populate("childIds")
      .populate("daycareId")
      .exec();
  }

  async create(data: any) {
    const contract = new ContractModel(data);
    return await contract.save();
  }

  async update(id: string, data: any) {
    return await ContractModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async updateStatus(id: string, status: string) {
    return await ContractModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();
  }

  async terminate(id: string) {
    return await this.updateStatus(id, "terminated");
  }

  async findActiveContracts(daycareId: string) {
    const now = new Date();
    return await ContractModel.find({
      daycareId,
      status: "active",
      endDate: { $gte: now },
    }).populate("parentId").populate("childIds").exec();
  }

  async findExpiringContracts(daycareId: string, daysThreshold: number = 7) {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);
    
    return await ContractModel.find({
      daycareId,
      status: "active",
      endDate: { $lte: thresholdDate, $gte: now },
    }).populate("parentId").populate("childIds").exec();
  }
}

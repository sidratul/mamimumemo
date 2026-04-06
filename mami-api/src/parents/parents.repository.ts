import ParentModel from "./parents.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class ParentsRepository {
  async findByDaycareId(daycareId: string, active?: boolean) {
    const query: any = { daycareId };
    if (active !== undefined) {
      query.active = active;
    }
    return await ParentModel.find(query)
      .populate("childrenIds")
      .exec();
  }

  async findById(id: string) {
    return await ParentModel.findById(id)
      .populate("childrenIds")
      .exec();
  }

  async findByUserIdAndDaycare(daycareId: string, userId: string) {
    return await ParentModel.findOne({
      daycareId,
      "user.userId": userId,
    }).populate("childrenIds").exec();
  }

  async create(data: any) {
    const parent = new ParentModel(data);
    return await parent.save();
  }

  async update(id: string, data: any) {
    return await ParentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deactivate(id: string) {
    return await ParentModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    ).exec();
  }

  async daycareExists(daycareId: string): Promise<boolean> {
    const DaycareModel = mongoose.model("Daycare");
    const daycare = await DaycareModel.findById(daycareId).exec();
    return !!daycare;
  }
}

// Import mongoose dynamically untuk daycareExists check
import mongoose from "mongoose";

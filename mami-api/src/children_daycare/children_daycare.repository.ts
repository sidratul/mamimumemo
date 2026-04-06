import ChildrenDaycareModel from "./children_daycare.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class ChildrenDaycareRepository {
  async findByDaycareId(daycareId: string, active?: boolean) {
    const query: any = { daycareId };
    if (active !== undefined) {
      query.active = active;
    }
    return await ChildrenDaycareModel.find(query)
      .populate("parentId")
      .populate("globalChildId")
      .exec();
  }

  async findById(id: string) {
    return await ChildrenDaycareModel.findById(id)
      .populate("parentId")
      .populate("globalChildId")
      .exec();
  }

  async findByGlobalChildIdAndDaycare(daycareId: string, globalChildId: string) {
    return await ChildrenDaycareModel.findOne({
      daycareId,
      globalChildId,
    }).populate("parentId").exec();
  }

  async findByParentIdAndDaycare(daycareId: string, parentId: string) {
    return await ChildrenDaycareModel.find({
      daycareId,
      parentId,
    }).exec();
  }

  async create(data: any) {
    const child = new ChildrenDaycareModel(data);
    return await child.save();
  }

  async update(id: string, data: any) {
    return await ChildrenDaycareModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deactivate(id: string) {
    return await ChildrenDaycareModel.findByIdAndUpdate(
      id,
      { active: false, exitedAt: new Date() },
      { new: true }
    ).exec();
  }

  async daycareExists(daycareId: string): Promise<boolean> {
    const DaycareModel = mongoose.model("Daycare");
    const daycare = await DaycareModel.findById(daycareId).exec();
    return !!daycare;
  }

  async parentExists(parentId: string): Promise<boolean> {
    const ParentModel = mongoose.model("Parent");
    const parent = await ParentModel.findById(parentId).exec();
    return !!parent;
  }
}

import mongoose from "mongoose";

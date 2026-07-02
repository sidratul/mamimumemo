import MasterActivityModel from "./master_activities.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

function exactCaseInsensitive(value: string) {
  return {
    $regex: `^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    $options: "i",
  };
}

export class MasterActivitiesRepository {
  async findByDaycareId(daycareId: string, filters: any) {
    const query: any = { daycareId };
    
    if (filters.active !== undefined) {
      query.active = filters.active;
    }
    
    if (filters.category) {
      query.category = exactCaseInsensitive(filters.category);
    }
    
    return await MasterActivityModel.find(query).exec();
  }

  async findById(id: string) {
    return await MasterActivityModel.findById(id).exec();
  }

  async create(data: any) {
    const activity = new MasterActivityModel(data);
    return await activity.save();
  }

  async update(id: string, data: any) {
    return await MasterActivityModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deactivate(id: string) {
    return await MasterActivityModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    ).exec();
  }

}

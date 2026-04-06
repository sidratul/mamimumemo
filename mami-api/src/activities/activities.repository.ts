import ActivityModel from "./activities.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { ChildrenRepository } from "@/children/children.repository.ts";

const childrenRepository = new ChildrenRepository();

export class ActivitiesRepository {
  async findByChildId(childId: string, filters: any) {
    const query: any = { childId };
    
    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    return await ActivityModel.find(query)
      .sort({ startTime: 1 })
      .populate("daycareId")
      .populate("masterActivityId")
      .exec();
  }

  async findById(id: string) {
    return await ActivityModel.findById(id)
      .populate("childId")
      .populate("daycareId")
      .populate("masterActivityId")
      .exec();
  }

  async findByUserId(userId: string, date?: Date) {
    const query: any = { "loggedBy.userId": userId };
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    return await ActivityModel.find(query).sort({ startTime: 1 }).exec();
  }

  async create(data: any) {
    const activity = new ActivityModel(data);
    return await activity.save();
  }

  async update(id: string, data: any) {
    return await ActivityModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    const result = await ActivityModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findTimeline(childId: string, startDate: Date, endDate: Date, includeDaycare: boolean = true) {
    const query: any = {
      childId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    const activities = await ActivityModel.find(query)
      .sort({ date: 1, startTime: 1 })
      .exec();

    return activities;
  }

  async userHasAccess(childId: string, userId: string): Promise<boolean> {
    return await childrenRepository.userHasAccess(childId, userId);
  }

  async isActivityOwner(activityId: string, userId: string): Promise<boolean> {
    const activity = await this.findById(activityId);
    if (!activity) return false;
    return activity.loggedBy.userId.toString() === userId;
  }
}

import MasterActivityModel from "./master_activities.schema.ts";

function exactCaseInsensitive(value: string) {
  return {
    $regex: `^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    $options: "i",
  };
}

export class MasterActivitiesRepository {
  async list(
    filters: { active?: boolean; category?: string; isStarter?: boolean },
  ) {
    const query: Record<string, unknown> = {};

    if (filters.active !== undefined) {
      query.active = filters.active;
    }

    if (filters.category) {
      query.category = exactCaseInsensitive(filters.category);
    }
    if (filters.isStarter !== undefined) {
      query.isStarter = filters.isStarter;
    }

    return await MasterActivityModel.find(query).sort({ name: 1 }).exec();
  }

  async findById(id: string) {
    return await MasterActivityModel.findById(id).exec();
  }

  async create(data: Record<string, unknown>) {
    const activity = new MasterActivityModel(data);
    return await activity.save();
  }

  async update(id: string, data: Record<string, unknown>) {
    return await MasterActivityModel.findByIdAndUpdate(
      id,
      { $set: data, $inc: { version: 1 } },
      { new: true },
    ).exec();
  }

  async deactivate(id: string) {
    return await MasterActivityModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    ).exec();
  }
}

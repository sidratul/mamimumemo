import { ClientSession } from "mongoose";
import DaycareActivityModel from "./daycare_activities.schema.ts";

export class DaycareActivitiesRepository {
  list(daycareId: string, active?: boolean) {
    const filter: Record<string, unknown> = { daycareId };
    if (active !== undefined) {
      filter.active = active;
    }
    return DaycareActivityModel.find(filter).sort({ name: 1 }).exec();
  }

  findById(id: string) {
    return DaycareActivityModel.findById(id).exec();
  }

  countActiveByIds(daycareId: string, ids: string[]) {
    return DaycareActivityModel.countDocuments({
      _id: { $in: ids },
      daycareId,
      active: true,
    }).exec();
  }

  findBySource(
    daycareId: string,
    sourceMasterActivityId: string,
    options?: { session?: ClientSession },
  ) {
    return DaycareActivityModel.findOne({
      daycareId,
      sourceMasterActivityId,
    }).session(options?.session ?? null).exec();
  }

  async create(
    data: Record<string, unknown>,
    options?: { session?: ClientSession },
  ) {
    const [created] = await DaycareActivityModel.create([data], options);
    return created;
  }

  update(id: string, data: Record<string, unknown>) {
    return DaycareActivityModel.findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  deactivate(id: string) {
    return DaycareActivityModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    ).exec();
  }
}

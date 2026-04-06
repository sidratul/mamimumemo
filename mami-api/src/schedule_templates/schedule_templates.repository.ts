import ScheduleTemplateModel from "./schedule_templates.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class ScheduleTemplatesRepository {
  async findByDaycareId(daycareId: string, active?: boolean) {
    const query: any = { daycareId };
    if (active !== undefined) {
      query.active = active;
    }
    return await ScheduleTemplateModel.find(query).exec();
  }

  async findById(id: string) {
    return await ScheduleTemplateModel.findById(id).exec();
  }

  async findByDayOfWeek(daycareId: string, dayOfWeek: number) {
    return await ScheduleTemplateModel.find({
      daycareId,
      dayOfWeek: dayOfWeek,
      active: true,
    }).exec();
  }

  async create(data: any) {
    const template = new ScheduleTemplateModel(data);
    return await template.save();
  }

  async update(id: string, data: any) {
    return await ScheduleTemplateModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deactivate(id: string) {
    return await ScheduleTemplateModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    ).exec();
  }
}

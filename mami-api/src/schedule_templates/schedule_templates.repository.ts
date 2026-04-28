import ScheduleTemplateModel from "./schedule_templates.schema.ts";

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
      targetType: "day_of_week",
      dayOfWeek: dayOfWeek,
      active: true,
    }).exec();
  }

  async findMatchingTemplateForDate(daycareId: string, date: Date) {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    const dayOfWeek = normalized.getDay();

    return await ScheduleTemplateModel.findOne({
      daycareId,
      active: true,
      $or: [
        {
          targetType: "specific_date",
          specificDate: {
            $gte: normalized,
            $lte: new Date(normalized.getTime() + 24 * 60 * 60 * 1000 - 1),
          },
        },
        {
          targetType: "date_range",
          startDate: { $lte: normalized },
          endDate: { $gte: normalized },
        },
        {
          targetType: "day_of_week",
          dayOfWeek,
        },
      ],
    }).sort({ targetType: -1, updatedAt: -1 }).exec();
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

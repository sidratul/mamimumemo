import MenuModel from "./menus.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class MenusRepository {
  async findByDaycareAndDate(daycareId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await MenuModel.findOne({
      daycareId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).exec();
  }

  async findByDaycareAndDateRange(daycareId: string, startDate: Date, endDate: Date) {
    return await MenuModel.find({
      daycareId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 }).exec();
  }

  async findById(id: string) {
    return await MenuModel.findById(id).exec();
  }

  async upsert(daycareId: string, date: Date, data: any) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await MenuModel.findOneAndUpdate(
      {
        daycareId,
        date: { $gte: startOfDay, $lte: endOfDay },
      },
      data,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    ).exec();
  }

  async update(id: string, data: any) {
    return await MenuModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    const result = await MenuModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}

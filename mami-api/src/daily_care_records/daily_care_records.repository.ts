import DailyCareRecordModel from "./daily_care_records.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class DailyCareRecordsRepository {
  async findByDaycareAndDate(daycareId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await DailyCareRecordModel.findOne({
      daycareId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("children.childId").exec();
  }

  async findByDaycareAndDateRange(daycareId: string, startDate: Date, endDate: Date) {
    return await DailyCareRecordModel.find({
      daycareId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 }).exec();
  }

  async findByChildIdAndDateRange(childId: string, startDate: Date, endDate: Date) {
    return await DailyCareRecordModel.find({
      date: { $gte: startDate, $lte: endDate },
      "children.childId": childId,
    }).sort({ date: -1 }).exec();
  }

  async findById(id: string) {
    return await DailyCareRecordModel.findById(id).exec();
  }

  async create(data: any) {
    const record = new DailyCareRecordModel(data);
    return await record.save();
  }

  async update(id: string, data: any) {
    return await DailyCareRecordModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async upsert(daycareId: string, date: Date, data: any) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await DailyCareRecordModel.findOneAndUpdate(
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

  async addChildActivity(
    daycareId: string,
    date: Date,
    childId: string,
    activity: any
  ) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await DailyCareRecordModel.findOneAndUpdate(
      {
        daycareId,
        date: { $gte: startOfDay, $lte: endOfDay },
        "children.childId": childId,
      },
      {
        $push: { "children.$.activities": activity },
      },
      { new: true }
    ).exec();
  }

  async updateChildAttendance(
    daycareId: string,
    date: Date,
    childId: string,
    attendance: any
  ) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await DailyCareRecordModel.findOneAndUpdate(
      {
        daycareId,
        date: { $gte: startOfDay, $lte: endOfDay },
        "children.childId": childId,
      },
      {
        $set: { "children.$.attendance": attendance },
      },
      { new: true, upsert: false }
    ).exec();
  }
}

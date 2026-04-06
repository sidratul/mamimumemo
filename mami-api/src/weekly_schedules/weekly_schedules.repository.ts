import WeeklyScheduleModel from "./weekly_schedules.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class WeeklySchedulesRepository {
  async findByDaycareAndWeekStart(daycareId: string, weekStart: Date) {
    return await WeeklyScheduleModel.findOne({
      daycareId,
      weekStart,
    }).exec();
  }

  async findCurrentWeek(daycareId: string) {
    const now = new Date();
    const weekStart = this.getWeekStart(now);
    const weekEnd = this.getWeekEnd(now);
    
    return await WeeklyScheduleModel.findOne({
      daycareId,
      weekStart,
      weekEnd,
    }).exec();
  }

  async findByDate(daycareId: string, date: Date) {
    const schedule = await WeeklyScheduleModel.findOne({
      daycareId,
      "days.date": date,
    }).exec();
    
    if (!schedule) return null;
    
    const day = schedule.days.find(d => 
      d.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );
    
    return day || null;
  }

  async findById(id: string) {
    return await WeeklyScheduleModel.findById(id).exec();
  }

  async findByChildIdAndWeek(childId: string, weekStart: Date) {
    return await WeeklyScheduleModel.findOne({
      weekStart,
      "days.childAssignments.childId": childId,
    }).exec();
  }

  async create(data: any) {
    const schedule = new WeeklyScheduleModel(data);
    return await schedule.save();
  }

  async update(id: string, data: any) {
    return await WeeklyScheduleModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async assignSitter(
    daycareId: string,
    weekStart: Date,
    date: Date,
    childId: string,
    sitters: any[]
  ) {
    const schedule = await this.findByDaycareAndWeekStart(daycareId, weekStart);
    if (!schedule) {
      throw new GraphQLError("Weekly schedule not found");
    }

    const dayIndex = schedule.days.findIndex(d => 
      d.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );

    if (dayIndex === -1) {
      throw new GraphQLError("Day not found in weekly schedule");
    }

    const childAssignmentIndex = schedule.days[dayIndex].childAssignments.findIndex(
      ca => ca.childId.toString() === childId
    );

    if (childAssignmentIndex === -1) {
      throw new GraphQLError("Child assignment not found");
    }

    schedule.days[dayIndex].childAssignments[childAssignmentIndex].assignedSitters = sitters;
    
    return await schedule.save();
  }

  // Helper methods
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getWeekEnd(date: Date): Date {
    const start = this.getWeekStart(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }
}

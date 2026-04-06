import { DailyCareRecordsService } from "./daily_care_records.service.ts";
import {
  createDailyCareRecordInput,
  updateDailyCareRecordInput,
  checkInChildInput,
  checkOutChildInput,
  logDailyActivityInput,
} from "./daily_care_records.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const dailyCareRecordsService = new DailyCareRecordsService();

export const resolvers = {
  ChildDailyRecord: {
    childId: (childRecord: { childId?: { id?: string; _id?: string } | string }) => {
      if (!childRecord.childId || typeof childRecord.childId === "string") {
        return childRecord.childId;
      }

      return childRecord.childId.id || childRecord.childId._id || childRecord.childId;
    },
  },
  Attendance: {
    status: (attendance: { status?: string }) => {
      if (!attendance.status) {
        return "PRESENT";
      }

      return attendance.status.toUpperCase();
    },
  },
  AssignedSitter: {
    shift: (assignedSitter: { shift?: string }) => {
      if (!assignedSitter.shift) {
        return "FULL";
      }

      return assignedSitter.shift.toUpperCase();
    },
  },
  DailyActivity: {
    category: (activity: { category?: string }) => activity.category?.toUpperCase(),
    mealType: (activity: { mealType?: string | null }) => activity.mealType ? activity.mealType.toUpperCase() : null,
    eaten: (activity: { eaten?: string | null }) => activity.eaten ? activity.eaten.toUpperCase() : null,
    quality: (activity: { quality?: string | null }) => activity.quality ? activity.quality.toUpperCase() : null,
    toiletingType: (activity: { toiletingType?: string | null }) => activity.toiletingType ? activity.toiletingType.toUpperCase() : null,
    mood: (activity: { mood?: string | null }) => activity.mood ? activity.mood.toUpperCase() : null,
    intensity: (activity: { intensity?: string | null }) => activity.intensity ? activity.intensity.toUpperCase() : null,
  },
  Query: {
    dailyCareRecord: (
      _: unknown,
      { daycareId, date }: { daycareId: string; date: Date },
      context: AppContext
    ) => {
      return dailyCareRecordsService.getDailyCareRecord(daycareId, date, context);
    },
    dailyCareRecords: (
      _: unknown,
      { daycareId, startDate, endDate }: { daycareId: string; startDate: Date; endDate: Date },
      context: AppContext
    ) => {
      return dailyCareRecordsService.getDailyCareRecords(daycareId, startDate, endDate, context);
    },
    childDailyRecords: (
      _: unknown,
      { childId, startDate, endDate }: { childId: string; startDate: Date; endDate: Date },
      context: AppContext
    ) => {
      return dailyCareRecordsService.getChildDailyRecords(childId, startDate, endDate, context);
    },
    todayDailyCare: (
      _: unknown,
      { daycareId }: { daycareId: string },
      context: AppContext
    ) => {
      return dailyCareRecordsService.getTodayDailyCare(daycareId, context);
    },
  },
  Mutation: {
    createDailyCareRecord: (
      _: unknown,
      { input }: { input: typeof createDailyCareRecordInput._type },
      context: AppContext
    ) => {
      createDailyCareRecordInput.parse(input);
      return dailyCareRecordsService.createDailyCareRecord(input, context);
    },
    updateDailyCareRecord: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateDailyCareRecordInput._type },
      context: AppContext
    ) => {
      updateDailyCareRecordInput.parse(input);
      return dailyCareRecordsService.updateDailyCareRecord(id, input, context);
    },
    checkInChild: (
      _: unknown,
      { input }: { input: typeof checkInChildInput._type },
      context: AppContext
    ) => {
      checkInChildInput.parse(input);
      return dailyCareRecordsService.checkInChild(input, context);
    },
    checkOutChild: (
      _: unknown,
      { input }: { input: typeof checkOutChildInput._type },
      context: AppContext
    ) => {
      checkOutChildInput.parse(input);
      return dailyCareRecordsService.checkOutChild(input, context);
    },
    logDailyActivity: (
      _: unknown,
      { input }: { input: typeof logDailyActivityInput._type },
      context: AppContext
    ) => {
      logDailyActivityInput.parse(input);
      return dailyCareRecordsService.logDailyActivity(input, context);
    },
  },
};

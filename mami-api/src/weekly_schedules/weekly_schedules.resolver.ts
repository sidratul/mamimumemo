import { WeeklySchedulesService } from "./weekly_schedules.service.ts";
import {
  createWeeklyScheduleInput,
  updateWeeklyScheduleInput,
  assignSitterInput,
} from "./weekly_schedules.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const weeklySchedulesService = new WeeklySchedulesService();

export const resolvers = {
  Query: {
    weeklySchedule: (
      _: unknown,
      { daycareId, weekStart }: { daycareId: string; weekStart: Date },
      context: AppContext
    ) => {
      return weeklySchedulesService.getWeeklySchedule(daycareId, weekStart, context);
    },
    currentWeekSchedule: (
      _: unknown,
      { daycareId }: { daycareId: string },
      context: AppContext
    ) => {
      return weeklySchedulesService.getCurrentWeekSchedule(daycareId, context);
    },
    scheduleForDate: (
      _: unknown,
      { daycareId, date }: { daycareId: string; date: Date },
      context: AppContext
    ) => {
      return weeklySchedulesService.getScheduleForDate(daycareId, date, context);
    },
    childSchedule: (
      _: unknown,
      { childId, weekStart }: { childId: string; weekStart: Date },
      context: AppContext
    ) => {
      return weeklySchedulesService.getChildSchedule(childId, weekStart, context);
    },
  },
  Mutation: {
    createWeeklySchedule: (
      _: unknown,
      { input }: { input: typeof createWeeklyScheduleInput._type },
      context: AppContext
    ) => {
      createWeeklyScheduleInput.parse(input);
      return weeklySchedulesService.createWeeklySchedule(input, context);
    },
    updateWeeklySchedule: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateWeeklyScheduleInput._type },
      context: AppContext
    ) => {
      updateWeeklyScheduleInput.parse(input);
      return weeklySchedulesService.updateWeeklySchedule(id, input, context);
    },
    assignSitter: (
      _: unknown,
      { input }: { input: typeof assignSitterInput._type },
      context: AppContext
    ) => {
      assignSitterInput.parse(input);
      return weeklySchedulesService.assignSitter(input, context);
    },
  },
};

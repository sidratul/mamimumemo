import { WeeklySchedulesRepository } from "./weekly_schedules.repository.ts";
import {
  createWeeklyScheduleInput,
  updateWeeklyScheduleInput,
  assignSitterInput,
} from "./weekly_schedules.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const weeklySchedulesRepository = new WeeklySchedulesRepository();

export class WeeklySchedulesService {
  async getWeeklySchedule(
    daycareId: string,
    weekStart: Date,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await weeklySchedulesRepository.findByDaycareAndWeekStart(daycareId, weekStart);
  }

  async getCurrentWeekSchedule(daycareId: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await weeklySchedulesRepository.findCurrentWeek(daycareId);
  }

  async getScheduleForDate(
    daycareId: string,
    date: Date,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await weeklySchedulesRepository.findByDate(daycareId, date);
  }

  async getChildSchedule(
    childId: string,
    weekStart: Date,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await weeklySchedulesRepository.findByChildIdAndWeek(childId, weekStart);
  }

  async createWeeklySchedule(
    input: typeof createWeeklyScheduleInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can create weekly schedules
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    // Validate dates
    if (new Date(input.weekEnd) <= new Date(input.weekStart)) {
      throw new GraphQLError("weekEnd must be after weekStart");
    }

    const scheduleData = {
      ...input,
      days: input.days.map(day => ({
        ...day,
        date: new Date(day.date),
      })),
    };

    return await weeklySchedulesRepository.create(scheduleData);
  }

  async updateWeeklySchedule(
    id: string,
    input: typeof updateWeeklyScheduleInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const schedule = await weeklySchedulesRepository.findById(id);
    if (!schedule) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Only daycare staff can update schedules
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const updateData: any = { ...input };
    if (input.days) {
      updateData.days = input.days.map(day => ({
        ...day,
        date: new Date(day.date),
      }));
    }

    return await weeklySchedulesRepository.update(id, updateData);
  }

  async assignSitter(
    input: typeof assignSitterInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can assign sitters
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await weeklySchedulesRepository.assignSitter(
      input.daycareId,
      new Date(input.weekStart),
      new Date(input.date),
      input.childId,
      input.sitters
    );
  }
}

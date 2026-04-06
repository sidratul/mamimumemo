import { ScheduleTemplatesRepository } from "./schedule_templates.repository.ts";
import { createScheduleTemplateInput, updateScheduleTemplateInput } from "./schedule_templates.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const scheduleTemplatesRepository = new ScheduleTemplatesRepository();

export class ScheduleTemplatesService {
  async getScheduleTemplates(
    daycareId: string,
    active: boolean | undefined,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await scheduleTemplatesRepository.findByDaycareId(daycareId, active);
  }

  async getScheduleTemplate(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const template = await scheduleTemplatesRepository.findById(id);
    if (!template) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return template;
  }

  async getTemplatesForDay(
    daycareId: string,
    dayOfWeek: number,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await scheduleTemplatesRepository.findByDayOfWeek(daycareId, dayOfWeek);
  }

  async createScheduleTemplate(
    input: typeof createScheduleTemplateInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can create templates
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const templateData = {
      ...input,
    };

    return await scheduleTemplatesRepository.create(templateData);
  }

  async updateScheduleTemplate(
    id: string,
    input: typeof updateScheduleTemplateInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const template = await scheduleTemplatesRepository.findById(id);
    if (!template) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Only daycare staff can update templates
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await scheduleTemplatesRepository.update(id, input);
  }

  async deactivateScheduleTemplate(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const template = await scheduleTemplatesRepository.findById(id);
    if (!template) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Only daycare staff can deactivate templates
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await scheduleTemplatesRepository.deactivate(id);
  }
}

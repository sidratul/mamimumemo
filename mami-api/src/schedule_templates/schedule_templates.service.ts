import { ScheduleTemplatesRepository } from "./schedule_templates.repository.ts";
import {
  createScheduleTemplateInput,
  updateScheduleTemplateInput,
} from "./schedule_templates.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { ActivityCategoriesService } from "@/activity_categories/activity_categories.service.ts";
import { DaycareActivitiesService } from "@/daycare_activities/daycare_activities.service.ts";

const scheduleTemplatesRepository = new ScheduleTemplatesRepository();
const activityCategoriesService = new ActivityCategoriesService();
const daycareActivitiesService = new DaycareActivitiesService();

type DaycareIdLike = string | { toString(): string };

export class ScheduleTemplatesService {
  private readonly readRoles = [
    UserRole.SUPER_ADMIN,
    UserRole.DAYCARE_OWNER,
    UserRole.DAYCARE_ADMIN,
    UserRole.DAYCARE_SITTER,
  ];

  private readonly writeRoles = [
    UserRole.SUPER_ADMIN,
    UserRole.DAYCARE_OWNER,
    UserRole.DAYCARE_ADMIN,
  ];

  async getScheduleTemplates(
    daycareId: string,
    active: boolean | undefined,
    context: AppContext,
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }
    this.requireRead(daycareId, context);

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
    this.requireRead(template.daycareId.toString(), context);

    return template;
  }

  async getTemplatesForDay(
    daycareId: string,
    dayOfWeek: number,
    context: AppContext,
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }
    this.requireRead(daycareId, context);

    return await scheduleTemplatesRepository.findByDayOfWeek(
      daycareId,
      dayOfWeek,
    );
  }

  async createScheduleTemplate(
    input: typeof createScheduleTemplateInput._type,
    context: AppContext,
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const parsed = createScheduleTemplateInput.parse(input);
    this.requireWrite(parsed.daycareId, context);
    await Promise.all(
      parsed.activities.map((activity) =>
        activityCategoriesService.getDefaultFieldConfig(activity.category)
      ),
    );
    await daycareActivitiesService.assertBelongToDaycare(
      parsed.daycareId,
      parsed.activities.map((activity) => activity.daycareActivityId),
    );

    return await scheduleTemplatesRepository.create(parsed);
  }

  async updateScheduleTemplate(
    id: string,
    input: typeof updateScheduleTemplateInput._type,
    context: AppContext,
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const template = await scheduleTemplatesRepository.findById(id);
    if (!template) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }
    this.requireWrite(template.daycareId.toString(), context);

    const parsed = updateScheduleTemplateInput.parse(input);
    if (parsed.activities) {
      await Promise.all(
        parsed.activities.map((activity) =>
          activityCategoriesService.getDefaultFieldConfig(activity.category)
        ),
      );
      await daycareActivitiesService.assertBelongToDaycare(
        template.daycareId.toString(),
        parsed.activities.map((activity) => activity.daycareActivityId),
      );
    }
    return await scheduleTemplatesRepository.update(id, parsed);
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
    this.requireWrite(template.daycareId.toString(), context);

    return await scheduleTemplatesRepository.deactivate(id);
  }

  private requireRead(daycareId: DaycareIdLike, context: AppContext) {
    isAuthenticated(context);
    if (!context.user?.role || !this.readRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError("Akses ditolak.");
    }

    if (context.user.role === UserRole.SUPER_ADMIN) {
      return;
    }

    if (
      context.user?.daycareId?.toString() !== daycareId.toString()
    ) {
      throw new GraphQLError("Akses ditolak.");
    }
  }

  private requireWrite(daycareId: DaycareIdLike, context: AppContext) {
    this.requireRead(daycareId, context);
    if (!context.user?.role || !this.writeRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError("Akses ditolak.");
    }
  }
}

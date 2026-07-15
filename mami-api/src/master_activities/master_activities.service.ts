import { MasterActivitiesRepository } from "./master_activities.repository.ts";
import {
  createMasterActivityInput,
  updateMasterActivityInput,
} from "./master_activities.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { ActivityCategoriesService } from "@/activity_categories/activity_categories.service.ts";

const masterActivitiesRepository = new MasterActivitiesRepository();
const activityCategoriesService = new ActivityCategoriesService();

export class MasterActivitiesService {
  async getMasterActivities(
    active: boolean | undefined,
    category: string | undefined,
    isStarter: boolean | undefined,
    context: AppContext,
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const filters: {
      active?: boolean;
      category?: string;
      isStarter?: boolean;
    } = {};
    if (active !== undefined) filters.active = active;
    if (category) filters.category = category.toLowerCase();

    if (isStarter !== undefined) filters.isStarter = isStarter;
    return await masterActivitiesRepository.list(filters);
  }

  async getMasterActivity(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const activity = await masterActivitiesRepository.findById(id);
    if (!activity) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return activity;
  }

  getDefaultFieldConfig(category: string) {
    return activityCategoriesService.getDefaultFieldConfig(category);
  }

  async createMasterActivity(
    input: typeof createMasterActivityInput._type,
    context: AppContext,
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (context.user.role !== UserRole.SUPER_ADMIN) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const parsed = createMasterActivityInput.parse(input);
    const defaultConfig = await activityCategoriesService.getDefaultFieldConfig(
      parsed.category,
    );

    const activityData = {
      ...parsed,
      fieldConfig: parsed.fieldConfig || defaultConfig,
      createdBy: {
        userId: context.user.id,
        name: context.user.name,
        role: context.user.role,
      },
    };

    return await masterActivitiesRepository.create(activityData);
  }

  async updateMasterActivity(
    id: string,
    input: typeof updateMasterActivityInput._type,
    context: AppContext,
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const activity = await masterActivitiesRepository.findById(id);
    if (!activity) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    if (context.user.role !== UserRole.SUPER_ADMIN) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const parsed = updateMasterActivityInput.parse(input);
    if (parsed.category) {
      await activityCategoriesService.getDefaultFieldConfig(parsed.category);
    }
    return await masterActivitiesRepository.update(id, parsed);
  }

  async deactivateMasterActivity(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const activity = await masterActivitiesRepository.findById(id);
    if (!activity) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    if (context.user.role !== UserRole.SUPER_ADMIN) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await masterActivitiesRepository.deactivate(id);
  }
}

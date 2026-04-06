import { MasterActivitiesRepository } from "./master_activities.repository.ts";
import { createMasterActivityInput, updateMasterActivityInput } from "./master_activities.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const masterActivitiesRepository = new MasterActivitiesRepository();

export class MasterActivitiesService {
  async getMasterActivities(
    daycareId: string,
    active: boolean | undefined,
    category: string | undefined,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const filters: any = {};
    if (active !== undefined) filters.active = active;
    if (category) filters.category = category;

    return await masterActivitiesRepository.findByDaycareId(daycareId, filters);
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

  async getDefaultFieldConfig(category: string) {
    return masterActivitiesRepository.getDefaultFieldConfig(category);
  }

  async createMasterActivity(
    input: typeof createMasterActivityInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can create master activities
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    // Get default field config for category if not provided
    const defaultConfig = await masterActivitiesRepository.getDefaultFieldConfig(input.category);
    
    const activityData = {
      ...input,
      fieldConfig: input.fieldConfig || defaultConfig,
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
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const activity = await masterActivitiesRepository.findById(id);
    if (!activity) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Only daycare staff can update master activities
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await masterActivitiesRepository.update(id, input);
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

    // Only daycare staff can deactivate master activities
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await masterActivitiesRepository.deactivate(id);
  }
}

import { MasterActivitiesService } from "./master_activities.service.ts";
import {
  createMasterActivityInput,
  updateMasterActivityInput,
} from "./master_activities.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const masterActivitiesService = new MasterActivitiesService();

export const resolvers = {
  MasterActivity: {
    category: (activity: { category?: string }) =>
      activity.category?.toUpperCase(),
  },
  Query: {
    masterActivities: (
      _: unknown,
      { active, category, isStarter }: {
        active?: boolean;
        category?: string;
        isStarter?: boolean;
      },
      context: AppContext,
    ) => {
      return masterActivitiesService.getMasterActivities(
        active,
        category,
        isStarter,
        context,
      );
    },
    masterActivity: (
      _: unknown,
      { id }: { id: string },
      context: AppContext,
    ) => {
      return masterActivitiesService.getMasterActivity(id, context);
    },
    defaultFieldConfig: (
      _: unknown,
      { category }: { category: string },
      _context: AppContext,
    ) => {
      return masterActivitiesService.getDefaultFieldConfig(category);
    },
  },
  Mutation: {
    createMasterActivity: (
      _: unknown,
      { input }: { input: typeof createMasterActivityInput._type },
      context: AppContext,
    ) => {
      createMasterActivityInput.parse(input);
      return masterActivitiesService.createMasterActivity(input, context);
    },
    updateMasterActivity: (
      _: unknown,
      { id, input }: {
        id: string;
        input: typeof updateMasterActivityInput._type;
      },
      context: AppContext,
    ) => {
      updateMasterActivityInput.parse(input);
      return masterActivitiesService.updateMasterActivity(id, input, context);
    },
    deactivateMasterActivity: (
      _: unknown,
      { id }: { id: string },
      context: AppContext,
    ) => {
      return masterActivitiesService.deactivateMasterActivity(id, context);
    },
  },
};

import { MasterActivitiesService } from "./master_activities.service.ts";
import { createMasterActivityInput, updateMasterActivityInput } from "./master_activities.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const masterActivitiesService = new MasterActivitiesService();

export const resolvers = {
  Query: {
    masterActivities: (
      _: unknown,
      { daycareId, active, category }: { daycareId: string; active?: boolean; category?: string },
      context: AppContext
    ) => {
      return masterActivitiesService.getMasterActivities(daycareId, active, category, context);
    },
    masterActivity: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return masterActivitiesService.getMasterActivity(id, context);
    },
    defaultFieldConfig: (
      _: unknown,
      { category }: { category: string },
      context: AppContext
    ) => {
      return masterActivitiesService.getDefaultFieldConfig(category);
    },
  },
  Mutation: {
    createMasterActivity: (
      _: unknown,
      { input }: { input: typeof createMasterActivityInput._type },
      context: AppContext
    ) => {
      createMasterActivityInput.parse(input);
      return masterActivitiesService.createMasterActivity(input, context);
    },
    updateMasterActivity: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateMasterActivityInput._type },
      context: AppContext
    ) => {
      updateMasterActivityInput.parse(input);
      return masterActivitiesService.updateMasterActivity(id, input, context);
    },
    deactivateMasterActivity: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return masterActivitiesService.deactivateMasterActivity(id, context);
    },
  },
};

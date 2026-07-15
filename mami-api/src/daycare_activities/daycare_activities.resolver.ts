import { AppContext } from "#shared/config/context.ts";
import { DaycareActivitiesService } from "./daycare_activities.service.ts";
import {
  adoptMasterActivityInput,
  createDaycareActivityInput,
  updateDaycareActivityInput,
} from "./daycare_activities.validation.ts";

const service = new DaycareActivitiesService();

export const resolvers = {
  Query: {
    daycareActivities: (
      _: unknown,
      { daycareId, active }: { daycareId: string; active?: boolean },
      context: AppContext,
    ) => service.list(daycareId, active, context),
    daycareActivity: (
      _: unknown,
      { id }: { id: string },
      context: AppContext,
    ) => service.get(id, context),
  },
  Mutation: {
    createDaycareActivity: (
      _: unknown,
      { input }: { input: typeof createDaycareActivityInput._type },
      context: AppContext,
    ) => service.create(input, context),
    adoptMasterActivity: (
      _: unknown,
      { input }: { input: typeof adoptMasterActivityInput._type },
      context: AppContext,
    ) => service.adopt(input, context),
    updateDaycareActivity: (
      _: unknown,
      { id, input }: {
        id: string;
        input: typeof updateDaycareActivityInput._type;
      },
      context: AppContext,
    ) => service.update(id, input, context),
    deactivateDaycareActivity: (
      _: unknown,
      { id }: { id: string },
      context: AppContext,
    ) => service.deactivate(id, context),
  },
};

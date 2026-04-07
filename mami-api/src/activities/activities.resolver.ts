import { ActivitiesService } from "./activities.service.ts";
import { createActivityInput, updateActivityInput } from "./activities.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const activitiesService = new ActivitiesService();

export const resolvers = {
  Query: {
    childActivities: (
      _: unknown,
      { childId, date, category }: { childId: string; date?: Date; category?: string },
      context: AppContext
    ) => {
      return activitiesService.getChildActivities(childId, date, category, context);
    },
    activity: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return activitiesService.getActivity(id, context);
    },
    activityTimeline: (
      _: unknown,
      { input }: { input: { childId: string; startDate: Date; endDate: Date; includeDaycare?: boolean } },
      context: AppContext
    ) => {
      return activitiesService.getActivityTimeline(
        input.childId,
        input.startDate,
        input.endDate,
        input.includeDaycare ?? true,
        context
      );
    },
    myActivities: (
      _: unknown,
      { date }: { date?: Date },
      context: AppContext
    ) => {
      return activitiesService.getMyActivities(date, context);
    },
  },
  Mutation: {
    createActivity: (
      _: unknown,
      { input }: { input: typeof createActivityInput._type },
      context: AppContext
    ) => {
      createActivityInput.parse(input);
      return activitiesService.createActivity(input, context);
    },
    updateActivity: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateActivityInput._type },
      context: AppContext
    ) => {
      updateActivityInput.parse(input);
      return activitiesService.updateActivity(id, input, context);
    },
    deleteActivity: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return activitiesService.deleteActivity(id, context);
    },
  },
};

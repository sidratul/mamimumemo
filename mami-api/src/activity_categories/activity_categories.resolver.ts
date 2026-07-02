import { AppContext } from "#shared/config/context.ts";
import { ActivityCategoriesService } from "./activity_categories.service.ts";
import {
  createActivityCategoryInput,
  updateActivityCategoryInput,
} from "./activity_categories.validation.ts";

const service = new ActivityCategoriesService();

export const resolvers = {
  Query: {
    activityCategories: (
      _: unknown,
      { daycareId, active }: { daycareId?: string; active?: boolean },
      context: AppContext,
    ) => service.list(daycareId, active, context),
  },
  Mutation: {
    createActivityCategory: (
      _: unknown,
      { input }: { input: typeof createActivityCategoryInput._type },
      context: AppContext,
    ) => service.create(input, context),
    updateActivityCategory: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateActivityCategoryInput._type },
      context: AppContext,
    ) => service.update(id, input, context),
  },
};

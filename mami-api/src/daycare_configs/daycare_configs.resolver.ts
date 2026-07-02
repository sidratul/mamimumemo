import { AppContext } from "#shared/config/context.ts";
import { DaycareConfigsService } from "./daycare_configs.service.ts";
import {
  updateDaycareActivityCategoryInput,
  updateDaycareBrandingInput,
} from "./daycare_configs.validation.ts";

const service = new DaycareConfigsService();

export const resolvers = {
  Query: {
    daycareConfig: (
      _: unknown,
      { daycareId }: { daycareId: string },
      context: AppContext,
    ) => service.get(daycareId, context),
  },
  Mutation: {
    updateDaycareBranding: (
      _: unknown,
      { daycareId, input }: {
        daycareId: string;
        input: typeof updateDaycareBrandingInput._type;
      },
      context: AppContext,
    ) => service.updateBranding(daycareId, input, context),
    updateDaycareActivityCategory: (
      _: unknown,
      { daycareId, categoryId, input }: {
        daycareId: string;
        categoryId: string;
        input: typeof updateDaycareActivityCategoryInput._type;
      },
      context: AppContext,
    ) => service.updateActivityCategory(daycareId, categoryId, input, context),
  },
};

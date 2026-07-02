import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { ActivityCategoriesRepository } from "@/activity_categories/activity_categories.repository.ts";
import { DaycareConfigsRepository } from "./daycare_configs.repository.ts";
import {
  updateDaycareActivityCategoryInput,
  updateDaycareBrandingInput,
} from "./daycare_configs.validation.ts";

const repository = new DaycareConfigsRepository();
const categoriesRepository = new ActivityCategoriesRepository();

export class DaycareConfigsService {
  async get(daycareId: string, context: AppContext) {
    this.requireManageDaycare(daycareId, context);
    return await repository.findByDaycareId(daycareId) ?? {
      daycareId,
      schemaVersion: 1,
      branding: {},
      activityCategories: [],
      preferences: {
        timezone: "Asia/Jakarta",
        locale: "id-ID",
      },
    };
  }

  async updateBranding(
    daycareId: string,
    input: typeof updateDaycareBrandingInput._type,
    context: AppContext,
  ) {
    this.requireManageDaycare(daycareId, context);
    return await repository.upsertBranding(daycareId, updateDaycareBrandingInput.parse(input));
  }

  async updateActivityCategory(
    daycareId: string,
    categoryId: string,
    input: typeof updateDaycareActivityCategoryInput._type,
    context: AppContext,
  ) {
    this.requireManageDaycare(daycareId, context);
    const category = await categoriesRepository.findById(categoryId);
    if (!category) {
      throw new GraphQLError("Kategori aktivitas tidak ditemukan.");
    }
    return await repository.upsertActivityCategory(
      daycareId,
      categoryId,
      updateDaycareActivityCategoryInput.parse(input),
    );
  }

  private requireManageDaycare(daycareId: string, context: AppContext) {
    isAuthenticated(context);
    if (context.user?.role === UserRole.SUPER_ADMIN) {
      return;
    }
    const allowed = [UserRole.DAYCARE_OWNER, UserRole.DAYCARE_ADMIN];
    if (
      !context.user?.role ||
      !allowed.includes(context.user.role) ||
      context.user.daycareId?.toString() !== daycareId
    ) {
      throw new GraphQLError("Akses ditolak.");
    }
  }
}

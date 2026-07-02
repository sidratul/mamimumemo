import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { DaycareConfigsRepository } from "@/daycare_configs/daycare_configs.repository.ts";
import { ActivityCategoriesRepository } from "./activity_categories.repository.ts";
import {
  createActivityCategoryInput,
  updateActivityCategoryInput,
} from "./activity_categories.validation.ts";

const repository = new ActivityCategoriesRepository();
const daycareConfigsRepository = new DaycareConfigsRepository();

export class ActivityCategoriesService {
  async list(daycareId: string | undefined, active: boolean | undefined, context: AppContext) {
    isAuthenticated(context);
    const [categories, config] = await Promise.all([
      repository.list(active),
      daycareId ? daycareConfigsRepository.findByDaycareId(daycareId) : null,
    ]);
    const overrides = new Map(
      (config?.activityCategories ?? []).map((item) => [item.categoryId.toString(), item]),
    );

    return categories.map((category) => {
      const override = overrides.get(category._id.toString());
      return {
        ...category,
        label: override?.label?.trim() || category.defaultLabel,
        color: override?.color?.trim() || category.defaultColor,
        icon: override?.icon?.trim() || category.defaultIcon,
        enabled: override?.enabled ?? true,
        resolvedSortOrder: override?.sortOrder ?? category.sortOrder,
      };
    }).sort((a, b) => a.resolvedSortOrder - b.resolvedSortOrder);
  }

  async getDefaultFieldConfig(code: string) {
    const category = await repository.findByCode(code);
    if (!category || !category.isActive) {
      throw new GraphQLError("Kategori aktivitas tidak ditemukan atau tidak aktif.");
    }
    return category.defaultFieldConfig;
  }

  async create(input: typeof createActivityCategoryInput._type, context: AppContext) {
    this.requireSuperAdmin(context);
    const parsed = createActivityCategoryInput.parse(input);
    if (await repository.findByCode(parsed.code)) {
      throw new GraphQLError("Kode kategori sudah digunakan.");
    }
    return await repository.create(parsed);
  }

  async update(id: string, input: typeof updateActivityCategoryInput._type, context: AppContext) {
    this.requireSuperAdmin(context);
    const updated = await repository.update(id, updateActivityCategoryInput.parse(input));
    if (!updated) {
      throw new GraphQLError("Kategori aktivitas tidak ditemukan.");
    }
    return updated;
  }

  private requireSuperAdmin(context: AppContext) {
    isAuthenticated(context);
    if (context.user?.role !== UserRole.SUPER_ADMIN) {
      throw new GraphQLError("Akses ditolak.");
    }
  }
}

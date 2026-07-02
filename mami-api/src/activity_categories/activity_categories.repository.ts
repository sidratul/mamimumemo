import { Types } from "mongoose";
import ActivityCategoryModel from "./activity_categories.schema.ts";

export class ActivityCategoriesRepository {
  list(active?: boolean) {
    const filter = active === undefined ? {} : { isActive: active };
    return ActivityCategoryModel.find(filter).sort({ sortOrder: 1, defaultLabel: 1 }).lean().exec();
  }

  findById(id: string | Types.ObjectId) {
    return ActivityCategoryModel.findById(id).exec();
  }

  findByCode(code: string) {
    return ActivityCategoryModel.findOne({ code: code.toUpperCase() }).exec();
  }

  create(data: Record<string, unknown>) {
    return ActivityCategoryModel.create(data);
  }

  update(id: string, data: Record<string, unknown>) {
    return ActivityCategoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}

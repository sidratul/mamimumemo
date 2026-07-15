import DaycareConfigModel from "./daycare_configs.schema.ts";
import type { ClientSession } from "mongoose";

export class DaycareConfigsRepository {
  findByDaycareId(daycareId: string) {
    return DaycareConfigModel.findOne({ daycareId }).lean().exec();
  }

  ensure(daycareId: string, options?: { session?: ClientSession }) {
    return DaycareConfigModel.findOneAndUpdate(
      { daycareId },
      { $setOnInsert: { daycareId, schemaVersion: 1 } },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session: options?.session,
      },
    ).exec();
  }

  upsertBranding(daycareId: string, branding: Record<string, unknown>) {
    return DaycareConfigModel.findOneAndUpdate(
      { daycareId },
      {
        $set: Object.fromEntries(
          Object.entries(branding).map((
            [key, value],
          ) => [`branding.${key}`, value]),
        ),
        $setOnInsert: { daycareId, schemaVersion: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();
  }

  async upsertActivityCategory(
    daycareId: string,
    categoryId: string,
    input: Record<string, unknown>,
  ) {
    const setData = Object.fromEntries(
      Object.entries(input).map((
        [key, value],
      ) => [`activityCategories.$.${key}`, value]),
    );
    const updated = await DaycareConfigModel.findOneAndUpdate(
      { daycareId, "activityCategories.categoryId": categoryId },
      { $set: setData },
      { new: true },
    ).exec();
    if (updated) {
      return updated;
    }

    return DaycareConfigModel.findOneAndUpdate(
      { daycareId },
      {
        $setOnInsert: { daycareId, schemaVersion: 1 },
        $push: {
          activityCategories: {
            categoryId,
            ...input,
          },
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();
  }
}

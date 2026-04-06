import MasterActivityModel from "./master_activities.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

// Default field config untuk setiap category
const DEFAULT_FIELD_CONFIGS: Record<string, any> = {
  meal: { mealType: true, menu: true, eaten: true, mood: true },
  nap: { quality: true, mood: true },
  toileting: { toiletingType: true, toiletingNotes: true },
  care: { mood: true, photos: true, description: true },
  play: { mood: true, photos: true, description: true },
  learning: { mood: true, photos: true, description: true },
  creative: { materials: true, photos: true, description: true },
  physical: { intensity: true, mood: true },
  outdoor: { location: true, photos: true, description: true },
  routine: { mood: true, description: true },
  social: { mood: true, photos: true, description: true },
  development: { mood: true, photos: true, description: true },
};

export class MasterActivitiesRepository {
  async findByDaycareId(daycareId: string, filters: any) {
    const query: any = { daycareId };
    
    if (filters.active !== undefined) {
      query.active = filters.active;
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    return await MasterActivityModel.find(query).exec();
  }

  async findById(id: string) {
    return await MasterActivityModel.findById(id).exec();
  }

  async create(data: any) {
    const activity = new MasterActivityModel(data);
    return await activity.save();
  }

  async update(id: string, data: any) {
    return await MasterActivityModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deactivate(id: string) {
    return await MasterActivityModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    ).exec();
  }

  async getDefaultFieldConfig(category: string) {
    return DEFAULT_FIELD_CONFIGS[category] || DEFAULT_FIELD_CONFIGS.play;
  }
}

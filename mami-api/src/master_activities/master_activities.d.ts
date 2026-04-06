import { Types } from "mongoose";

export interface IMasterActivity {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  name: string;
  category: ActivityCategory;
  defaultDuration: number;
  icon?: string;
  color?: string;
  active: boolean;
  fieldConfig: IFieldConfig;
  createdBy: ICreatedBy;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityCategory =
  | "meal"
  | "nap"
  | "toileting"
  | "care"
  | "play"
  | "learning"
  | "creative"
  | "physical"
  | "outdoor"
  | "routine"
  | "social"
  | "development";

export interface IFieldConfig {
  mealType: boolean;
  menu: boolean;
  eaten: boolean;
  quality: boolean;
  toiletingType: boolean;
  toiletingNotes: boolean;
  mood: boolean;
  photos: boolean;
  description: boolean;
  intensity: boolean;
  location: boolean;
  materials: boolean;
}

export interface ICreatedBy {
  userId: Types.ObjectId;
  name: string;
  role: string;
}

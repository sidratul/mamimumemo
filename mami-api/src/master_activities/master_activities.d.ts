import { Types } from "mongoose";

export interface IMasterActivity {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  category: ActivityCategory;
  defaultDuration: number;
  icon?: string;
  color?: string;
  active: boolean;
  version: number;
  isStarter: boolean;
  fieldConfig: IFieldConfig;
  createdBy: ICreatedBy;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityCategory = string;

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
  drinkName: boolean;
  drinkAmountMl: boolean;
  hygieneType: boolean;
  medicationName: boolean;
  medicationDose: boolean;
  medicationUnit: boolean;
  administeredAt: boolean;
  parentConsent: boolean;
}

export interface ICreatedBy {
  userId: Types.ObjectId;
  name: string;
  role: string;
}

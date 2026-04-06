import { Types } from "mongoose";
import { MealType } from "#shared/types/enums.ts";

export interface IMenu {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  date: Date;
  meals: IMeal[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMeal {
  type: MealType;
  menu: string;
  ingredients: string[];
  allergens: string[];
  notes?: string;
}

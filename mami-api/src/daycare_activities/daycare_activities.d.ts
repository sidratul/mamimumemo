import { Types } from "mongoose";
import type {
  ICreatedBy,
  IFieldConfig,
} from "@/master_activities/master_activities.d.ts";

export interface IDaycareActivity {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  sourceMasterActivityId?: Types.ObjectId;
  sourceMasterVersion?: number;
  name: string;
  description?: string;
  category: string;
  defaultDuration: number;
  icon?: string;
  color?: string;
  active: boolean;
  fieldConfig: IFieldConfig;
  createdBy: ICreatedBy;
  createdAt: Date;
  updatedAt: Date;
}

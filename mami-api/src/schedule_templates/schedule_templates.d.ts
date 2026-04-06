import { Types } from "mongoose";
import { ActivityCategory, SitterRole } from "#shared/types/enums.ts";

export interface IScheduleTemplate {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  name: string;
  dayOfWeek: number[]; // JavaScript standard: 0=Sunday, 6=Saturday
  activities: ITemplateActivity[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type DayOfWeek = number; // 0-6

export interface ITemplateActivity {
  masterActivityId?: Types.ObjectId;
  activityName: string;
  startTime: string;
  endTime: string;
  duration?: number;
  category: ActivityCategory;
  defaultSitterRole: SitterRole;
}

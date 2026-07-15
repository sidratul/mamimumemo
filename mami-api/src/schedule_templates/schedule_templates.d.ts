import { Types } from "mongoose";
import { ActivityCategory, DayOfWeek, ScheduleTemplateTargetType, SitterRole } from "#shared/types/enums.ts";

export interface IScheduleTemplate {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  name: string;
  targetType: ScheduleTemplateTargetType;
  dayOfWeek?: DayOfWeek[];
  startDate?: Date;
  endDate?: Date;
  specificDate?: Date;
  activities: ITemplateActivity[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITemplateActivity {
  daycareActivityId?: Types.ObjectId;
  activityName: string;
  startTime: string;
  endTime: string;
  duration?: number;
  category: ActivityCategory;
  defaultSitterRole: SitterRole;
}

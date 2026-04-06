import { Types } from "mongoose";
import { ActivityCategory, ShiftType } from "#shared/types/enums.ts";

export interface IWeeklySchedule {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  weekStart: Date;
  weekEnd: Date;
  days: IWeeklyScheduleDay[];
  isPast: boolean;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWeeklyScheduleDay {
  date: Date;
  dayOfWeek: number; // JavaScript standard: 0=Sunday, 6=Saturday
  templateId?: Types.ObjectId;
  childAssignments: IChildAssignment[];
}

export type DayOfWeek = number; // 0-6

export interface IChildAssignment {
  childId: Types.ObjectId;
  childName: string;
  childPhoto?: string;
  assignedSitters: ISitterAssignment[];
  activities: IWeeklyActivity[];
}

export interface ISitterAssignment {
  userId: Types.ObjectId;
  name: string;
  shift: ShiftType;
}

export interface IWeeklyActivity {
  masterActivityId?: Types.ObjectId;
  activityName: string;
  startTime: string;
  endTime: string;
  category: ActivityCategory;
  assignedSitters?: IUserRef[];
  notes?: string;
}

export interface IUserRef {
  userId: Types.ObjectId;
  name: string;
}

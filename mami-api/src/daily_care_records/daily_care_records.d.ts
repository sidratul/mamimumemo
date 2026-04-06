import { Types } from "mongoose";
import { ActivityCategory, MealType, EatenAmount, NapQuality, ToiletingType, Mood, Intensity } from "#shared/types/enums.ts";

export interface IDailyCareRecord {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  date: Date;
  children: IChildDailyRecord[];
  totalChildren: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChildDailyRecord {
  childId: Types.ObjectId;
  childName: string;
  childPhoto?: string;
  attendance?: IAttendance;
  assignedSitters: IAssignedSitter[];
  activities: IDailyActivity[];
  notes?: string;
}

export interface IAttendance {
  checkIn: ICheckIn;
  checkOut?: ICheckOut;
  status: AttendanceStatus;
}

export interface ICheckIn {
  time: string;
  photo: string;
  by: IUserRef;
}

export interface ICheckOut {
  time: string;
  photo: string;
  by: IUserRef;
}

export interface IUserRef {
  userId: Types.ObjectId;
  name: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "early_pickup";
export type ShiftType = "morning" | "afternoon" | "full";

export interface IAssignedSitter {
  userId: Types.ObjectId;
  name: string;
  shift: ShiftType;
}

export interface IDailyActivity {
  masterActivityId?: Types.ObjectId;
  activityName: string;
  category: ActivityCategory;
  startTime: string;
  endTime?: string;
  duration?: number;
  
  // Dynamic fields
  mealType?: MealType;
  menu?: string;
  eaten?: EatenAmount;
  quality?: NapQuality;
  toiletingType?: ToiletingType;
  toiletingNotes?: string;
  mood?: Mood;
  photos: string[];
  description?: string;
  intensity?: Intensity;
  location?: string;
  materials?: string;
  
  loggedBy: IUserRef;
  loggedAt: Date;
}

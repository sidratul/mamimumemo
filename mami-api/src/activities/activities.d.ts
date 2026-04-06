import { Types } from "mongoose";

export interface IActivity {
  _id: Types.ObjectId;
  childId: Types.ObjectId;
  daycareId?: Types.ObjectId;
  masterActivityId?: Types.ObjectId;
  activityName: string;
  category: ActivityCategory;
  date: Date;
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
  
  // Metadata
  source: ActivitySource;
  loggedBy: ILoggedBy;
  visibleTo: Types.ObjectId[];
  notes?: string;
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

export type MealType = "breakfast" | "snack" | "lunch" | "dinner";
export type EatenAmount = "all" | "some" | "none";
export type NapQuality = "good" | "restless" | "short";
export type ToiletingType = "urine" | "bowel";
export type Mood = "happy" | "sleepy" | "fussy" | "energetic" | "neutral";
export type Intensity = "low" | "medium" | "high";
export type ActivitySource = "parent" | "guardian" | "daycare";

export interface ILoggedBy {
  userId: Types.ObjectId;
  name: string;
  relation: string;
  role: "parent" | "guardian" | "sitter" | "admin";
}

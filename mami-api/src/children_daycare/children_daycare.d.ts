import { Types } from "mongoose";

export interface IChildrenDaycare {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  parentId: Types.ObjectId;
  globalChildId?: Types.ObjectId;
  profile: IChildProfile;
  medical: IChildMedical;
  preferences: IChildPreferences;
  customData: IChildCustomData;
  enrolledAt: Date;
  exitedAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChildProfile {
  name: string;
  birthDate: Date;
  photo?: string;
  gender: "male" | "female";
}

export interface IChildMedical {
  allergies: string[];
  medicalNotes?: string;
  medications: {
    name: string;
    dosage: string;
    schedule: string;
  }[];
}

export interface IChildPreferences {
  favoriteFoods: string[];
  favoriteActivities: string[];
  comfortItems: string[];
  napRoutine?: string;
}

export interface IChildCustomData {
  customName?: string;
  customPhoto?: string;
  notes?: string;
}

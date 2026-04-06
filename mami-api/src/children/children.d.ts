import { Types } from "mongoose";

export interface IChild {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  profile: {
    name: string;
    birthDate: Date;
    photo?: string;
    gender: "male" | "female";
  };
  medical: {
    allergies: string[];
    medicalNotes?: string;
    medications: {
      name: string;
      dosage: string;
      schedule: string;
    }[];
  };
  guardians: IGuardian[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IGuardian {
  user: {
    userId: Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    role: "parent" | "guardian";
  };
  relation: "father" | "mother" | "guardian" | "grandfather" | "grandmother" | "other";
  permissions: GuardianPermission[];
  sharedAt: Date;
  sharedBy: {
    userId: Types.ObjectId;
    name: string;
    relation: string;
  };
  active: boolean;
}

export type GuardianPermission =
  | "VIEW_REPORTS"
  | "INPUT_ACTIVITY"
  | "INPUT_HEALTH"
  | "ENROLL_DAYCARE"
  | "EDIT_PROFILE"
  | "MANAGE_GUARDIANS";

export interface IChildMedical {
  allergies: string[];
  medicalNotes?: string;
  medications: {
    name: string;
    dosage: string;
    schedule: string;
  }[];
}

export interface IChildProfile {
  name: string;
  birthDate: Date;
  photo?: string;
  gender: "male" | "female";
}

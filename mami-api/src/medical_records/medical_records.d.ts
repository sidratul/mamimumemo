import { Types } from "mongoose";

export interface IMedicalRecord {
  _id: Types.ObjectId;
  childId: Types.ObjectId;
  type: "illness" | "injury" | "chronic_condition" | "allergy" | "medication";
  name: string;
  diagnosis: string;
  symptoms: string[];
  startDate: Date;
  endDate?: Date;
  status: "active" | "recovered" | "chronic" | "recurring";
  severity: "low" | "medium" | "high" | "critical";
  treatment?: string;
  medications: IMedicationRecord[];
  doctor?: IDoctor;
  attachments: string[];
  notes?: string;
  reportedBy: IReportedBy;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedicationRecord {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
}

export interface IDoctor {
  name: string;
  hospital?: string;
  phone?: string;
}

export interface IReportedBy {
  userId: Types.ObjectId;
  name: string;
  relation: string;
}

import { Types } from "mongoose";
import { StaffPaymentStatus } from "#shared/types/enums.ts";

export interface IStaffPayment {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  staff: IStaffRef;
  period: IPaymentPeriod;
  daysWorked: number;
  rate: number;
  amount: number;
  deductions: IDeduction[];
  total: number;
  status: StaffPaymentStatus;
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStaffRef {
  userId?: Types.ObjectId;
  name: string;
  role: string;
}

export interface IPaymentPeriod {
  start: Date;
  end: Date;
}

export interface IDeduction {
  description: string;
  amount: number;
}

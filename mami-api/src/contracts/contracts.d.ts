import { Types } from "mongoose";

export interface IContract {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  parentId: Types.ObjectId;
  childIds: Types.ObjectId[];
  serviceType: ServiceType;
  price: number;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;
  terms?: string;
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceType = "daily" | "weekly" | "monthly";
export type ContractStatus = "active" | "expired" | "terminated";

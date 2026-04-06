import { Types } from "mongoose";

export interface IParent {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  user: IParentUser;
  customData: IParentCustomData;
  childrenIds: Types.ObjectId[];
  enrolledAt: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IParentUser {
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  role: "parent";
}

export interface IParentCustomData {
  deskripsi?: string;
  emergencyContact?: IEmergencyContact;
  pickupAuthorization: IPickupAuthorization[];
  notes?: string;
}

export interface IEmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface IPickupAuthorization {
  name: string;
  phone: string;
  relation: string;
}

import { Types } from "mongoose";

export interface IGallery {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  childName?: string;
  photos: string[];
  caption?: string;
  date: Date;
  event?: string;
  uploadedBy: IUploadedBy;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUploadedBy {
  userId: Types.ObjectId;
  name: string;
}

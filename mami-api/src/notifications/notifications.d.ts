import { Types } from "mongoose";
import { NotificationType } from "#shared/types/enums.ts";

export interface INotification {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  readAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

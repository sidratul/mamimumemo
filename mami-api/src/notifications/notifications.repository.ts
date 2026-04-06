import NotificationModel from "./notifications.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class NotificationsRepository {
  async findByUserId(userId: string, limit: number = 50, unreadOnly: boolean = false) {
    const query: any = { userId };
    if (unreadOnly) {
      query.read = false;
    }
    return await NotificationModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findById(id: string) {
    return await NotificationModel.findById(id).exec();
  }

  async countUnread(userId: string) {
    return await NotificationModel.countDocuments({
      userId,
      read: false,
    }).exec();
  }

  async create(data: any) {
    const notification = new NotificationModel(data);
    return await notification.save();
  }

  async createMany(data: any[]) {
    return await NotificationModel.insertMany(data);
  }

  async markAsRead(id: string, readAt?: Date) {
    return await NotificationModel.findByIdAndUpdate(
      id,
      { 
        read: true,
        readAt: readAt || new Date(),
      },
      { new: true }
    ).exec();
  }

  async markAllAsRead(userId: string, readAt?: Date) {
    return await NotificationModel.updateMany(
      {
        userId,
        read: false,
      },
      {
        read: true,
        readAt: readAt || new Date(),
      }
    ).exec();
  }

  async delete(id: string) {
    const result = await NotificationModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async deleteExpired() {
    const now = new Date();
    return await NotificationModel.deleteMany({
      expiresAt: { $lte: now },
    }).exec();
  }
}

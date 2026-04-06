import { NotificationsRepository } from "./notifications.repository.ts";
import {
  createNotificationInput,
  createBulkNotificationsInput,
  markAsReadInput,
} from "./notifications.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const notificationsRepository = new NotificationsRepository();

export class NotificationsService {
  async getNotifications(
    limit: number,
    unreadOnly: boolean,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await notificationsRepository.findByUserId(context.user.id, limit, unreadOnly);
  }

  async getNotification(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const notification = await notificationsRepository.findById(id);
    if (!notification) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Check if user owns this notification
    if (notification.userId.toString() !== context.user.id) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return notification;
  }

  async getUnreadNotificationCount(context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await notificationsRepository.countUnread(context.user.id);
  }

  async createNotification(
    input: typeof createNotificationInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [
      UserRole.DAYCARE_ADMIN,
      UserRole.DAYCARE_OWNER,
      UserRole.SUPER_ADMIN,
    ];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const notificationData = {
      ...input,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    };

    return await notificationsRepository.create(notificationData);
  }

  async createBulkNotifications(
    input: typeof createBulkNotificationsInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [
      UserRole.DAYCARE_ADMIN,
      UserRole.DAYCARE_OWNER,
      UserRole.SUPER_ADMIN,
    ];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const notifications = input.userIds.map(userId => ({
      daycareId: input.daycareId,
      userId,
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    }));

    return await notificationsRepository.createMany(notifications);
  }

  async markNotificationAsRead(
    id: string,
    input: typeof markAsReadInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const notification = await notificationsRepository.findById(id);
    if (!notification) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Check if user owns this notification
    if (notification.userId.toString() !== context.user.id) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await notificationsRepository.markAsRead(id, input.readAt ? new Date(input.readAt) : undefined);
  }

  async markAllNotificationsAsRead(context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    await notificationsRepository.markAllAsRead(context.user.id);
    return true;
  }

  async deleteNotification(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const notification = await notificationsRepository.findById(id);
    if (!notification) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Check if user owns this notification
    if (notification.userId.toString() !== context.user.id) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await notificationsRepository.delete(id);
  }
}

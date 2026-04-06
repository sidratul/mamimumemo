import { NotificationsService } from "./notifications.service.ts";
import {
  createNotificationInput,
  createBulkNotificationsInput,
  markAsReadInput,
} from "./notifications.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const notificationsService = new NotificationsService();

export const resolvers = {
  Query: {
    notifications: (
      _: unknown,
      { limit, unreadOnly }: { limit?: number; unreadOnly?: boolean },
      context: AppContext
    ) => {
      return notificationsService.getNotifications(limit || 50, unreadOnly || false, context);
    },
    notification: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return notificationsService.getNotification(id, context);
    },
    unreadNotificationCount: (
      _: unknown,
      __: unknown,
      context: AppContext
    ) => {
      return notificationsService.getUnreadNotificationCount(context);
    },
  },
  Mutation: {
    createNotification: (
      _: unknown,
      { input }: { input: typeof createNotificationInput._type },
      context: AppContext
    ) => {
      createNotificationInput.parse(input);
      return notificationsService.createNotification(input, context);
    },
    createBulkNotifications: (
      _: unknown,
      { input }: { input: typeof createBulkNotificationsInput._type },
      context: AppContext
    ) => {
      createBulkNotificationsInput.parse(input);
      return notificationsService.createBulkNotifications(input, context);
    },
    markNotificationAsRead: (
      _: unknown,
      { id, input }: { id: string; input: typeof markAsReadInput._type },
      context: AppContext
    ) => {
      markAsReadInput.parse(input);
      return notificationsService.markNotificationAsRead(id, input, context);
    },
    markAllNotificationsAsRead: (
      _: unknown,
      __: unknown,
      context: AppContext
    ) => {
      return notificationsService.markAllNotificationsAsRead(context);
    },
    deleteNotification: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return notificationsService.deleteNotification(id, context);
    },
  },
};

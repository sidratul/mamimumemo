import { z } from "zod";
import { NotificationTypeEnum } from "#shared/types/enums.ts";
import { objectIdString } from "#shared/validation/object-id.validation.ts";

export const createNotificationInput = z.object({
  daycareId: objectIdString,
  userId: z.string(),
  type: z.nativeEnum(NotificationTypeEnum),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  data: z.record(z.any()).optional(),
  expiresAt: z.string().or(z.date()).optional(),
});

export const createBulkNotificationsInput = z.object({
  daycareId: objectIdString,
  userIds: z.array(z.string()),
  type: z.nativeEnum(NotificationTypeEnum),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  data: z.record(z.any()).optional(),
  expiresAt: z.string().or(z.date()).optional(),
});

export const markAsReadInput = z.object({
  readAt: z.string().or(z.date()).optional(),
});

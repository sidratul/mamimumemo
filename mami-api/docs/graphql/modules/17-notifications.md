# Notifications

Notifikasi user, unread count, mark read, dan notifikasi bulk oleh daycare/admin.

Source schema: `src/notifications/notifications.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Query notification hanya untuk user aktif.
- Create/bulk create: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`.
- Mark/delete hanya untuk notification milik user aktif.

## Queries

- `notifications(limit: Int, unreadOnly: Boolean): [Notification!]!`
- `notification(id: ObjectId!): Notification`
- `unreadNotificationCount: Int!`

## Mutations

- `createNotification(input: CreateNotificationInput!): Notification!`
- `createBulkNotifications(input: CreateBulkNotificationsInput!): [Notification!]!`
- `markNotificationAsRead(id: ObjectId!, input: MarkAsReadInput): Notification!`
- `markAllNotificationsAsRead: Boolean!`
- `deleteNotification(id: ObjectId!): Boolean!`

## Schema Definitions

Types:

- `Notification`

Inputs:

- `CreateBulkNotificationsInput`
- `CreateNotificationInput`
- `MarkAsReadInput`

Enums:

- `NotificationType`

Scalars:

- `JSON`

## Notes

- Field `data` memakai scalar `JSON` lokal pada module ini.

export const typeDefs = `
  type Notification {
    id: ObjectId!
    daycareId: ObjectId!
    userId: ObjectId!
    type: NotificationType!
    title: String!
    message: String!
    data: JSON
    read: Boolean!
    readAt: Date
    expiresAt: Date
    createdAt: Date!
    updatedAt: Date!
  }

  enum NotificationType {
    ATTENDANCE
    ACTIVITY
    HEALTH
    INVOICE
    SCHEDULE
    GENERAL
  }

  scalar JSON

  input CreateNotificationInput {
    daycareId: ObjectId!
    userId: ObjectId!
    type: NotificationType!
    title: String!
    message: String!
    data: JSON
    expiresAt: Date
  }

  input CreateBulkNotificationsInput {
    daycareId: ObjectId!
    userIds: [ObjectId!]!
    type: NotificationType!
    title: String!
    message: String!
    data: JSON
    expiresAt: Date
  }

  input MarkAsReadInput {
    readAt: Date
  }

  extend type Query {
    "Get notifications for current user"
    notifications(limit: Int, unreadOnly: Boolean): [Notification!]!
    
    "Get notification by ID"
    notification(id: ObjectId!): Notification
    
    "Get unread notification count"
    unreadNotificationCount: Int!
  }

  extend type Mutation {
    "Create a notification"
    createNotification(input: CreateNotificationInput!): Notification!
    
    "Create notifications for multiple users"
    createBulkNotifications(input: CreateBulkNotificationsInput!): [Notification!]!
    
    "Mark notification as read"
    markNotificationAsRead(id: ObjectId!, input: MarkAsReadInput): Notification!
    
    "Mark all notifications as read"
    markAllNotificationsAsRead: Boolean!
    
    "Delete notification"
    deleteNotification(id: ObjectId!): Boolean!
  }
`;

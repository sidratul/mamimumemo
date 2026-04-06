/**
 * Unit Tests for Notifications Module
 * 
 * Run with: deno test -A src/notifications/notifications.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { NotificationsService } from "./notifications.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const notificationsService = new NotificationsService();

Deno.test({
  name: "Notifications Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const adminContext = createMockContext({
      id: mockUsers.daycareAdmin._id,
      name: mockUsers.daycareAdmin.name,
      role: mockUsers.daycareAdmin.role,
    });
    
    const parentContext = createMockContext({
      id: mockUsers.parent._id,
      name: mockUsers.parent.name,
      role: mockUsers.parent.role,
    });
    
    await t.step("Create Notification", async (step) => {
      await step.test("should create notification successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          userId: mockUsers.parent._id,
          type: "ATTENDANCE",
          title: "Check-in berhasil",
          message: "Budi telah check-in pada jam 07:30",
          data: {
            childId: "65child123",
            time: "07:30",
          },
        };
        
        const result = await notificationsService.createNotification(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.type, "ATTENDANCE");
        assertEquals(result.read, false);
      });
      
      await step.test("should create invoice notification", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          userId: mockUsers.parent._id,
          type: "INVOICE",
          title: "Invoice baru",
          message: "Invoice untuk bulan Maret telah diterbitkan",
          data: {
            invoiceId: "65invoice123",
            amount: 500000,
          },
        };
        
        const result = await notificationsService.createNotification(input, adminContext as any);
        
        assertEquals(result.type, "INVOICE");
      });
      
      await step.test("should fail without title", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          userId: mockUsers.parent._id,
          type: "GENERAL",
          title: "",
          message: "Test",
        };
        
        await assertRejects(
          async () => await notificationsService.createNotification(input, adminContext as any),
          Error,
          "Title is required"
        );
      });
    });
    
    await t.step("Get Notifications", async (step) => {
      await step.test("should get all notifications for user", async () => {
        const notifications = await notificationsService.getNotifications(undefined, false, parentContext as any);
        
        assertEquals(Array.isArray(notifications), true);
        assertEquals(notifications.length, 2);
      });
      
      await step.test("should get only unread notifications", async () => {
        const notifications = await notificationsService.getNotifications(undefined, true, parentContext as any);
        
        assertEquals(Array.isArray(notifications), true);
        assertEquals(notifications.length, 2);
      });
      
      await step.test("should get unread count", async () => {
        const count = await notificationsService.getUnreadNotificationCount(parentContext as any);
        
        assertEquals(count, 2);
      });
      
      await step.test("should get notification by ID", async () => {
        const notifications = await notificationsService.getNotifications(undefined, false, parentContext as any);
        const notification = await notificationsService.getNotification(notifications[0].id, parentContext as any);
        
        assertExists(notification.id);
        assertEquals(notification.id, notifications[0].id);
      });
    });
    
    await t.step("Mark Notification as Read", async (step) => {
      const notifications = await notificationsService.getNotifications(undefined, false, parentContext as any);
      const notificationId = notifications[0].id;
      
      await step.test("should mark notification as read", async () => {
        const input = {
          readAt: new Date().toISOString(),
        };
        
        const result = await notificationsService.markNotificationAsRead(notificationId, input, parentContext as any);
        
        assertEquals(result.read, true);
        assertExists(result.readAt);
      });
      
      await step.test("should decrease unread count", async () => {
        const count = await notificationsService.getUnreadNotificationCount(parentContext as any);
        
        assertEquals(count, 1);
      });
    });
    
    await t.step("Mark All as Read", async (step) => {
      await step.test("should mark all notifications as read", async () => {
        const result = await notificationsService.markAllNotificationsAsRead(parentContext as any);
        
        assertEquals(result, true);
      });
      
      await step.test("should have zero unread count", async () => {
        const count = await notificationsService.getUnreadNotificationCount(parentContext as any);
        
        assertEquals(count, 0);
      });
      
      await step.test("should not show in unread list", async () => {
        const notifications = await notificationsService.getNotifications(undefined, true, parentContext as any);
        
        assertEquals(notifications.length, 0);
      });
    });
    
    await t.step("Delete Notification", async (step) => {
      const notifications = await notificationsService.getNotifications(undefined, false, parentContext as any);
      
      if (notifications.length > 0) {
        const notificationId = notifications[0].id;
        
        await step.test("should delete notification successfully", async () => {
          const result = await notificationsService.deleteNotification(notificationId, parentContext as any);
          
          assertEquals(result, true);
        });
        
        await step.test("should not show after delete", async () => {
          const notifications = await notificationsService.getNotifications(undefined, false, parentContext as any);
          
          assertEquals(notifications.length, 1);
        });
      }
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

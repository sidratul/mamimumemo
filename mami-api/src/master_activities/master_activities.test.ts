/**
 * Unit Tests for Master Activities Module
 * 
 * Run with: deno test -A src/master_activities/master_activities.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { MasterActivitiesService } from "./master_activities.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const masterActivitiesService = new MasterActivitiesService();

Deno.test({
  name: "Master Activities Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const adminContext = createMockContext({
      id: mockUsers.daycareAdmin._id,
      name: mockUsers.daycareAdmin.name,
      role: mockUsers.daycareAdmin.role,
    });
    
    await t.step("Create Master Activity", async (step) => {
      await step.test("should create master activity successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          name: "Makan Pagi Ceria",
          category: "MEAL",
          defaultDuration: 30,
          fieldConfig: {
            mealType: true,
            menu: true,
            eaten: true,
            mood: true,
          },
        };
        
        const result = await masterActivitiesService.createMasterActivity(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.name, "Makan Pagi Ceria");
      });
      
      await step.test("should create with default field config", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          name: "Tidur Siang",
          category: "NAP",
          defaultDuration: 120,
        };
        
        const result = await masterActivitiesService.createMasterActivity(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.category, "NAP");
      });
      
      await step.test("should fail without name", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          name: "",
          category: "MEAL",
        };
        
        await assertRejects(
          async () => await masterActivitiesService.createMasterActivity(input, adminContext as any),
          Error,
          "Name is required"
        );
      });
    });
    
    await t.step("Get Master Activities", async (step) => {
      await step.test("should get all master activities", async () => {
        const activities = await masterActivitiesService.getMasterActivities(mockDaycares.active._id, undefined, undefined, adminContext as any);
        
        assertEquals(Array.isArray(activities), true);
        assertEquals(activities.length, 2);
      });
      
      await step.test("should get only active activities", async () => {
        const activities = await masterActivitiesService.getMasterActivities(mockDaycares.active._id, true, undefined, adminContext as any);
        
        assertEquals(Array.isArray(activities), true);
        assertEquals(activities.length, 2);
      });
      
      await step.test("should filter by category", async () => {
        const activities = await masterActivitiesService.getMasterActivities(mockDaycares.active._id, undefined, "MEAL", adminContext as any);
        
        assertEquals(Array.isArray(activities), true);
        assertEquals(activities.length, 1);
      });
      
      await step.test("should get default field config", async () => {
        const config = await masterActivitiesService.getDefaultFieldConfig("MEAL", adminContext as any);
        
        assertExists(config);
        assertEquals(config.mealType, true);
      });
    });
    
    await t.step("Update Master Activity", async (step) => {
      const activities = await masterActivitiesService.getMasterActivities(mockDaycares.active._id, undefined, undefined, adminContext as any);
      const activityId = activities[0].id;
      
      await step.test("should update activity successfully", async () => {
        const input = {
          name: "Updated Name",
          defaultDuration: 45,
        };
        
        const updated = await masterActivitiesService.updateMasterActivity(activityId, input, adminContext as any);
        
        assertEquals(updated.name, "Updated Name");
        assertEquals(updated.defaultDuration, 45);
      });
      
      await step.test("should update field config", async () => {
        const input = {
          fieldConfig: {
            mealType: false,
            menu: true,
            eaten: true,
          },
        };
        
        const updated = await masterActivitiesService.updateMasterActivity(activityId, input, adminContext as any);
        
        assertEquals(updated.fieldConfig.mealType, false);
      });
      
      await step.test("should deactivate activity", async () => {
        const input = {
          active: false,
        };
        
        const updated = await masterActivitiesService.updateMasterActivity(activityId, input, adminContext as any);
        
        assertEquals(updated.active, false);
      });
    });
    
    await t.step("Deactivate Master Activity", async (step) => {
      const activities = await masterActivitiesService.getMasterActivities(mockDaycares.active._id, undefined, undefined, adminContext as any);
      const activityId = activities[0].id;
      
      await step.test("should deactivate successfully", async () => {
        const result = await masterActivitiesService.deactivateMasterActivity(activityId, adminContext as any);
        
        assertEquals(result.active, false);
      });
      
      await step.test("should not show in active list", async () => {
        const activities = await masterActivitiesService.getMasterActivities(mockDaycares.active._id, true, undefined, adminContext as any);
        
        assertEquals(activities.length, 1);
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

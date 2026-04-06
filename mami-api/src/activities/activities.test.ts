/**
 * Unit Tests for Activities Module
 * 
 * Run with: deno test -A src/activities/activities.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { ActivitiesService } from "./activities.service.ts";
import { ChildrenService } from "../children/children.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers } from "../../mocks/index.ts";

const activitiesService = new ActivitiesService();
const childrenService = new ChildrenService();

Deno.test({
  name: "Activities Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const parentContext = createMockContext({
      id: mockUsers.parent._id,
      name: mockUsers.parent.name,
      role: mockUsers.parent.role,
    });
    
    // Create child first
    const child = await childrenService.createChild(
      {
        profile: {
          name: "Test Child Activity",
          birthDate: "2023-01-15",
          photo: "",
          gender: "MALE",
        },
      },
      parentContext as any
    );
    
    await t.step("Create Activity", async (step) => {
      await step.test("should create meal activity successfully", async () => {
        const input = {
          childId: child.id,
          activityName: "Makan Siang",
          category: "MEAL",
          date: new Date().toISOString(),
          startTime: "11:00",
          endTime: "11:45",
          mealType: "LUNCH",
          menu: "Nasi ayam",
          eaten: "ALL",
          mood: "HAPPY",
        };
        
        const result = await activitiesService.createActivity(input, parentContext as any);
        
        assertExists(result.id);
        assertEquals(result.category, "MEAL");
        assertEquals(result.mealType, "LUNCH");
      });
      
      await step.test("should create nap activity", async () => {
        const input = {
          childId: child.id,
          activityName: "Tidur Siang",
          category: "NAP",
          date: new Date().toISOString(),
          startTime: "12:00",
          endTime: "14:00",
          quality: "GOOD",
          mood: "SLEEPY",
        };
        
        const result = await activitiesService.createActivity(input, parentContext as any);
        
        assertEquals(result.category, "NAP");
        assertEquals(result.quality, "GOOD");
      });
      
      await step.test("should create play activity with photos", async () => {
        const input = {
          childId: child.id,
          activityName: "Main Balok",
          category: "PLAY",
          date: new Date().toISOString(),
          startTime: "15:00",
          endTime: "16:00",
          mood: "HAPPY",
          photos: ["https://example.com/photo1.jpg"],
          description: "Senang bermain",
        };
        
        const result = await activitiesService.createActivity(input, parentContext as any);
        
        assertEquals(result.category, "PLAY");
        assertEquals(result.photos.length, 1);
      });
      
      await step.test("should fail without activity name", async () => {
        const input = {
          childId: child.id,
          activityName: "",
          category: "PLAY",
          date: new Date().toISOString(),
          startTime: "10:00",
        };
        
        await assertRejects(
          async () => await activitiesService.createActivity(input, parentContext as any),
          Error,
          "Activity name is required"
        );
      });
      
      await step.test("should fail with invalid time format", async () => {
        const input = {
          childId: child.id,
          activityName: "Test",
          category: "PLAY",
          date: new Date().toISOString(),
          startTime: "25:00", // Invalid
        };
        
        await assertRejects(
          async () => await activitiesService.createActivity(input, parentContext as any),
          Error,
          "Invalid time format"
        );
      });
    });
    
    await t.step("Get Child Activities", async (step) => {
      await step.test("should get all activities for child", async () => {
        const activities = await activitiesService.getChildActivities(child.id, undefined, undefined, parentContext as any);
        
        assertEquals(Array.isArray(activities), true);
        assertEquals(activities.length, 3);
      });
      
      await step.test("should filter by date", async () => {
        const activities = await activitiesService.getChildActivities(
          child.id,
          new Date().toISOString(),
          undefined,
          parentContext as any
        );
        
        assertEquals(Array.isArray(activities), true);
        assertExists(activities[0]);
      });
      
      await step.test("should filter by category", async () => {
        const activities = await activitiesService.getChildActivities(
          child.id,
          undefined,
          "MEAL",
          parentContext as any
        );
        
        assertEquals(Array.isArray(activities), true);
        assertEquals(activities.length, 1);
        assertEquals(activities[0].category, "MEAL");
      });
    });
    
    await t.step("Get Activity Timeline", async (step) => {
      await step.test("should get activity timeline", async () => {
        const input = {
          childId: child.id,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          includeDaycare: true,
        };
        
        const timeline = await activitiesService.getActivityTimeline(input, parentContext as any);
        
        assertEquals(Array.isArray(timeline), true);
        assertExists(timeline[0]);
      });
    });
    
    await t.step("Update Activity", async (step) => {
      const activities = await activitiesService.getChildActivities(child.id, undefined, undefined, parentContext as any);
      const activityId = activities[0].id;
      
      await step.test("should update activity successfully", async () => {
        const input = {
          mood: "ENERGETIC",
          description: "Updated description",
        };
        
        const updated = await activitiesService.updateActivity(activityId, input, parentContext as any);
        
        assertEquals(updated.mood, "ENERGETIC");
        assertEquals(updated.description, "Updated description");
      });
      
      await step.test("should update photos", async () => {
        const input = {
          photos: [
            "https://example.com/new1.jpg",
            "https://example.com/new2.jpg",
          ],
        };
        
        const updated = await activitiesService.updateActivity(activityId, input, parentContext as any);
        
        assertEquals(updated.photos.length, 2);
      });
    });
    
    await t.step("Delete Activity", async (step) => {
      const activities = await activitiesService.getChildActivities(child.id, undefined, undefined, parentContext as any);
      const activityId = activities[0].id;
      
      await step.test("should delete activity successfully", async () => {
        const result = await activitiesService.deleteActivity(activityId, parentContext as any);
        
        assertEquals(result, true);
      });
      
      await step.test("should fail deleting non-existent activity", async () => {
        await assertRejects(
          async () => await activitiesService.deleteActivity(activityId, parentContext as any),
          Error,
          "Activity not found"
        );
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

/**
 * Unit Tests for Schedule Templates Module
 * 
 * Run with: deno test -A src/schedule_templates/schedule_templates.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { ScheduleTemplatesService } from "./schedule_templates.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const scheduleTemplatesService = new ScheduleTemplatesService();

Deno.test({
  name: "Schedule Templates Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const adminContext = createMockContext({
      id: mockUsers.daycareAdmin._id,
      name: mockUsers.daycareAdmin.name,
      role: mockUsers.daycareAdmin.role,
    });
    
    await t.step("Create Schedule Template", async (step) => {
      await step.test("should create schedule template successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          name: "Routine Harian",
          dayOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
          activities: [
            {
              activityName: "Makan Pagi",
              category: "MEAL",
              startTime: "08:00",
              endTime: "08:30",
              defaultSitterRole: "ANY",
            },
            {
              activityName: "Main Bebas",
              category: "PLAY",
              startTime: "08:30",
              endTime: "09:30",
            },
          ],
        };
        
        const result = await scheduleTemplatesService.createScheduleTemplate(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.name, "Routine Harian");
        assertEquals(result.dayOfWeek.length, 5);
      });
      
      await step.test("should fail without activities", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          name: "Empty Template",
          dayOfWeek: [1],
          activities: [],
        };
        
        await assertRejects(
          async () => await scheduleTemplatesService.createScheduleTemplate(input, adminContext as any),
          Error,
          "Activities are required"
        );
      });
    });
    
    await t.step("Get Schedule Templates", async (step) => {
      await step.test("should get all templates", async () => {
        const templates = await scheduleTemplatesService.getScheduleTemplates(mockDaycares.active._id, undefined, adminContext as any);
        
        assertEquals(Array.isArray(templates), true);
        assertEquals(templates.length, 1);
      });
      
      await step.test("should get only active templates", async () => {
        const templates = await scheduleTemplatesService.getScheduleTemplates(mockDaycares.active._id, true, adminContext as any);
        
        assertEquals(Array.isArray(templates), true);
        assertEquals(templates.length, 1);
      });
      
      await step.test("should get templates for specific day", async () => {
        const templates = await scheduleTemplatesService.getTemplatesForDay(mockDaycares.active._id, 1, adminContext as any);
        
        assertEquals(Array.isArray(templates), true);
        assertExists(templates[0]);
      });
    });
    
    await t.step("Update Schedule Template", async (step) => {
      const templates = await scheduleTemplatesService.getScheduleTemplates(mockDaycares.active._id, undefined, adminContext as any);
      const templateId = templates[0].id;
      
      await step.test("should update template successfully", async () => {
        const input = {
          name: "Updated Routine",
        };
        
        const updated = await scheduleTemplatesService.updateScheduleTemplate(templateId, input, adminContext as any);
        
        assertEquals(updated.name, "Updated Routine");
      });
      
      await step.test("should update activities", async () => {
        const input = {
          activities: [
            {
              activityName: "Updated Activity",
              category: "LEARNING",
              startTime: "09:00",
              endTime: "10:00",
            },
          ],
        };
        
        const updated = await scheduleTemplatesService.updateScheduleTemplate(templateId, input, adminContext as any);
        
        assertEquals(updated.activities.length, 1);
      });
      
      await step.test("should deactivate template", async () => {
        const input = {
          active: false,
        };
        
        const updated = await scheduleTemplatesService.updateScheduleTemplate(templateId, input, adminContext as any);
        
        assertEquals(updated.active, false);
      });
    });
    
    await t.step("Deactivate Schedule Template", async (step) => {
      const templates = await scheduleTemplatesService.getScheduleTemplates(mockDaycares.active._id, undefined, adminContext as any);
      const templateId = templates[0].id;
      
      await step.test("should deactivate successfully", async () => {
        const result = await scheduleTemplatesService.deactivateScheduleTemplate(templateId, adminContext as any);
        
        assertEquals(result.active, false);
      });
      
      await step.test("should not show in active list", async () => {
        const templates = await scheduleTemplatesService.getScheduleTemplates(mockDaycares.active._id, true, adminContext as any);
        
        assertEquals(templates.length, 0);
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

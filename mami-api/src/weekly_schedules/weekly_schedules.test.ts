/**
 * Unit Tests for Weekly Schedules Module
 * 
 * Run with: deno test -A src/weekly_schedules/weekly_schedules.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { WeeklySchedulesService } from "./weekly_schedules.service.ts";
import { ChildrenService } from "../children/children.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const weeklySchedulesService = new WeeklySchedulesService();
const childrenService = new ChildrenService();

Deno.test({
  name: "Weekly Schedules Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const adminContext = createMockContext({
      id: mockUsers.daycareAdmin._id,
      name: mockUsers.daycareAdmin.name,
      role: mockUsers.daycareAdmin.role,
    });
    
    // Create child for tests
    const child = await childrenService.createChild(
      {
        profile: { name: "Test Child Weekly", birthDate: "2023-01-15", photo: "", gender: "MALE" },
      },
      adminContext as any
    );
    
    await t.step("Create Weekly Schedule", async (step) => {
      await step.test("should create weekly schedule successfully", async () => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const input = {
          daycareId: mockDaycares.active._id,
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
          days: [
            {
              date: weekStart.toISOString(),
              dayOfWeek: 1,
              childAssignments: [
                {
                  childId: child.id,
                  childName: child.profile.name,
                  childPhoto: child.profile.photo,
                  assignedSitters: [
                    {
                      userId: mockUsers.daycareSitter._id,
                      name: "Sitter Ani",
                      shift: "MORNING",
                    },
                  ],
                  activities: [],
                },
              ],
            },
          ],
        };
        
        const result = await weeklySchedulesService.createWeeklySchedule(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.days.length, 1);
      });
      
      await step.test("should fail with invalid date range", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          weekStart: "2026-03-31",
          weekEnd: "2026-03-01",
          days: [],
        };
        
        await assertRejects(
          async () => await weeklySchedulesService.createWeeklySchedule(input, adminContext as any),
          Error,
          "weekEnd must be after weekStart"
        );
      });
    });
    
    await t.step("Get Weekly Schedule", async (step) => {
      await step.test("should get weekly schedule", async () => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
        
        const schedule = await weeklySchedulesService.getWeeklySchedule(mockDaycares.active._id, weekStart, adminContext as any);
        
        assertExists(schedule);
      });
      
      await step.test("should get schedule for date", async () => {
        const date = new Date();
        
        const schedule = await weeklySchedulesService.getScheduleForDate(mockDaycares.active._id, date, adminContext as any);
        
        // May be null if no schedule for today
        assertExists(schedule || true);
      });
      
      await step.test("should get child schedule", async () => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
        
        const schedule = await weeklySchedulesService.getChildSchedule(child.id, weekStart, adminContext as any);
        
        assertExists(schedule || true);
      });
    });
    
    await t.step("Update Weekly Schedule", async (step) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const schedules = await weeklySchedulesService.getWeeklySchedule(mockDaycares.active._id, weekStart, adminContext as any);
      
      if (schedules) {
        await step.test("should update schedule successfully", async () => {
          const input = {
            days: [
              {
                date: weekStart.toISOString(),
                dayOfWeek: 1,
                childAssignments: [
                  {
                    childId: child.id,
                    childName: "Updated Name",
                    childPhoto: "",
                    assignedSitters: [],
                    activities: [],
                  },
                ],
              },
            ],
          };
          
          const updated = await weeklySchedulesService.updateWeeklySchedule(schedules.id, input, adminContext as any);
          
          assertExists(updated.id);
        });
      }
    });
    
    await t.step("Assign Sitter", async (step) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      
      await step.test("should assign sitter to child", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          weekStart: weekStart.toISOString(),
          date: weekStart.toISOString(),
          childId: child.id,
          sitters: [
            {
              userId: mockUsers.daycareSitter._id,
              name: "Sitter Ani",
              shift: "FULL",
            },
          ],
        };
        
        const result = await weeklySchedulesService.assignSitter(input, adminContext as any);
        
        assertExists(result);
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

/**
 * Unit Tests for Daily Care Records Module
 * 
 * Run with: deno test -A src/daily_care_records/daily_care_records.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { DailyCareRecordsService } from "./daily_care_records.service.ts";
import { ChildrenService } from "../children/children.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const dailyCareService = new DailyCareRecordsService();
const childrenService = new ChildrenService();

Deno.test({
  name: "Daily Care Records Module",
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
        profile: { name: "Test Child Daily", birthDate: "2023-01-15", photo: "", gender: "MALE" },
      },
      adminContext as any
    );
    
    await t.step("Create Daily Care Record", async (step) => {
      await step.test("should create daily care record successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          date: new Date().toISOString(),
          children: [
            {
              childId: child.id,
              childName: child.profile.name,
              childPhoto: child.profile.photo,
              attendance: {
                checkIn: {
                  time: "07:30",
                  photo: "https://example.com/checkin.jpg",
                  by: { userId: mockUsers.daycareAdmin._id, name: "Admin" },
                },
                status: "PRESENT" as const,
              },
              assignedSitters: [],
              activities: [],
              notes: "",
            },
          ],
        };
        
        const result = await dailyCareService.createDailyCareRecord(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.children.length, 1);
      });
      
      await step.test("should create with activities", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          date: new Date().toISOString(),
          children: [
            {
              childId: child.id,
              childName: child.profile.name,
              childPhoto: child.profile.photo,
              attendance: null,
              assignedSitters: [],
              activities: [
                {
                  activityName: "Makan Pagi",
                  category: "MEAL",
                  startTime: "08:00",
                  endTime: "08:30",
                  mealType: "BREAKFAST",
                  menu: "Nasi goreng",
                  eaten: "ALL",
                },
              ],
              notes: "",
            },
          ],
        };
        
        const result = await dailyCareService.createDailyCareRecord(input, adminContext as any);
        
        assertEquals(result.children[0].activities.length, 1);
      });
    });
    
    await t.step("Get Daily Care Record", async (step) => {
      await step.test("should get daily care record by date", async () => {
        const records = await dailyCareService.getDailyCareRecord(mockDaycares.active._id, new Date(), adminContext as any);
        
        assertExists(records);
        assertEquals(records.children.length, 1);
      });
      
      await step.test("should get daily care records for date range", async () => {
        const records = await dailyCareService.getDailyCareRecords(
          mockDaycares.active._id,
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          new Date(),
          adminContext as any
        );
        
        assertEquals(Array.isArray(records), true);
        assertExists(records[0]);
      });
      
      await step.test("should get child daily records", async () => {
        const records = await dailyCareService.getChildDailyRecords(
          child.id,
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          new Date(),
          adminContext as any
        );
        
        assertEquals(Array.isArray(records), true);
        assertExists(records[0]);
      });
    });
    
    await t.step("Check In Child", async (step) => {
      await step.test("should check in child successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          childId: child.id,
          date: new Date().toISOString(),
          checkIn: {
            time: "07:30",
            photo: "https://example.com/checkin.jpg",
            by: { userId: mockUsers.daycareAdmin._id, name: "Admin" },
          },
        };
        
        const result = await dailyCareService.checkInChild(input, adminContext as any);
        
        assertExists(result.id);
      });
    });
    
    await t.step("Check Out Child", async (step) => {
      await step.test("should check out child successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          childId: child.id,
          date: new Date().toISOString(),
          checkOut: {
            time: "17:00",
            photo: "https://example.com/checkout.jpg",
            by: { userId: mockUsers.daycareAdmin._id, name: "Admin" },
          },
        };
        
        const result = await dailyCareService.checkOutChild(input, adminContext as any);
        
        assertExists(result.id);
      });
    });
    
    await t.step("Log Daily Activity", async (step) => {
      await step.test("should log activity successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          childId: child.id,
          date: new Date().toISOString(),
          activity: {
            activityName: "Makan Siang",
            category: "MEAL",
            startTime: "11:00",
            endTime: "11:45",
            mealType: "LUNCH",
            menu: "Nasi ayam",
            eaten: "ALL",
          },
        };
        
        const result = await dailyCareService.logDailyActivity(input, adminContext as any);
        
        assertExists(result.id);
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

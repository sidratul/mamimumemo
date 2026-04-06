/**
 * Unit Tests for Staff Payments Module
 * 
 * Run with: deno test -A src/staff_payments/staff_payments.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { StaffPaymentsService } from "./staff_payments.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const staffPaymentsService = new StaffPaymentsService();

Deno.test({
  name: "Staff Payments Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const adminContext = createMockContext({
      id: mockUsers.daycareAdmin._id,
      name: mockUsers.daycareAdmin.name,
      role: mockUsers.daycareAdmin.role,
    });
    
    await t.step("Create Staff Payment", async (step) => {
      await step.test("should create staff payment successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          staff: {
            userId: mockUsers.daycareSitter._id,
            name: "Sitter Ani",
            role: "DAYCARE_SITTER",
          },
          period: {
            start: "2026-03-01",
            end: "2026-03-31",
          },
          daysWorked: 22,
          rate: 100000,
          amount: 2200000,
          deductions: [
            {
              description: "Kasbon",
              amount: 200000,
            },
          ],
          notes: "Bonus akhir bulan",
        };
        
        const result = await staffPaymentsService.createStaffPayment(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.daysWorked, 22);
        assertEquals(result.rate, 100000);
      });
      
      await step.test("should create without deductions", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          staff: {
            userId: mockUsers.daycareSitter._id,
            name: "Sitter Budi",
            role: "DAYCARE_SITTER",
          },
          period: {
            start: "2026-03-01",
            end: "2026-03-31",
          },
          daysWorked: 20,
          rate: 100000,
          amount: 2000000,
          deductions: [],
        };
        
        const result = await staffPaymentsService.createStaffPayment(input, adminContext as any);
        
        assertEquals(result.deductions.length, 0);
      });
      
      await step.test("should fail with invalid days worked", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          staff: {
            userId: mockUsers.daycareSitter._id,
            name: "Sitter Test",
            role: "DAYCARE_SITTER",
          },
          period: {
            start: "2026-03-01",
            end: "2026-03-31",
          },
          daysWorked: 0,
          rate: 100000,
          amount: 0,
        };
        
        await assertRejects(
          async () => await staffPaymentsService.createStaffPayment(input, adminContext as any),
          Error,
          "Days worked must be positive"
        );
      });
    });
    
    await t.step("Get Staff Payments", async (step) => {
      await step.test("should get all staff payments for daycare", async () => {
        const payments = await staffPaymentsService.getDaycareStaffPayments(mockDaycares.active._id, undefined, adminContext as any);
        
        assertEquals(Array.isArray(payments), true);
        assertEquals(payments.length, 2);
      });
      
      await step.test("should get only pending payments", async () => {
        const payments = await staffPaymentsService.getDaycareStaffPayments(mockDaycares.active._id, "PENDING", adminContext as any);
        
        assertEquals(Array.isArray(payments), true);
        assertEquals(payments.length, 2);
      });
      
      await step.test("should get payments for staff", async () => {
        const payments = await staffPaymentsService.getStaffPayments(mockUsers.daycareSitter._id, undefined, adminContext as any);
        
        assertEquals(Array.isArray(payments), true);
        assertExists(payments[0]);
      });
      
      await step.test("should get pending payments", async () => {
        const payments = await staffPaymentsService.getPendingStaffPayments(mockDaycares.active._id, adminContext as any);
        
        assertEquals(Array.isArray(payments), true);
        assertExists(payments[0]);
      });
    });
    
    await t.step("Update Staff Payment", async (step) => {
      const payments = await staffPaymentsService.getDaycareStaffPayments(mockDaycares.active._id, undefined, adminContext as any);
      const paymentId = payments[0].id;
      
      await step.test("should update payment successfully", async () => {
        const input = {
          daysWorked: 23,
          amount: 2300000,
        };
        
        const updated = await staffPaymentsService.updateStaffPayment(paymentId, input, adminContext as any);
        
        assertEquals(updated.daysWorked, 23);
        assertEquals(updated.amount, 2300000);
      });
      
      await step.test("should update deductions", async () => {
        const input = {
          deductions: [
            {
              description: "Updated kasbon",
              amount: 100000,
            },
          ],
        };
        
        const updated = await staffPaymentsService.updateStaffPayment(paymentId, input, adminContext as any);
        
        assertEquals(updated.deductions.length, 1);
      });
    });
    
    await t.step("Mark Staff Payment as Paid", async (step) => {
      const payments = await staffPaymentsService.getDaycareStaffPayments(mockDaycares.active._id, undefined, adminContext as any);
      const paymentId = payments[0].id;
      
      await step.test("should mark payment as paid", async () => {
        const input = {
          paidAt: new Date().toISOString(),
        };
        
        const result = await staffPaymentsService.markStaffPaymentAsPaid(paymentId, input, adminContext as any);
        
        assertEquals(result.status, "PAID");
        assertExists(result.paidAt);
      });
      
      await step.test("should not show in pending list after paid", async () => {
        const payments = await staffPaymentsService.getPendingStaffPayments(mockDaycares.active._id, adminContext as any);
        
        assertEquals(payments.length, 1);
      });
    });
    
    await t.step("Cancel Staff Payment", async (step) => {
      const payments = await staffPaymentsService.getDaycareStaffPayments(mockDaycares.active._id, undefined, adminContext as any);
      
      if (payments.length > 0) {
        const paymentId = payments[0].id;
        
        await step.test("should cancel payment successfully", async () => {
          const result = await staffPaymentsService.cancelStaffPayment(paymentId, adminContext as any);
          
          assertEquals(result.status, "CANCELLED");
        });
      }
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

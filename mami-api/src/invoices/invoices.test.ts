/**
 * Unit Tests for Invoices Module
 * 
 * Run with: deno test -A src/invoices/invoices.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { InvoicesService } from "./invoices.service.ts";
import { ParentsService } from "../parents/parents.service.ts";
import { ChildrenService } from "../children/children.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const invoicesService = new InvoicesService();
const parentsService = new ParentsService();
const childrenService = new ChildrenService();

Deno.test({
  name: "Invoices Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const adminContext = createMockContext({
      id: mockUsers.daycareAdmin._id,
      name: mockUsers.daycareAdmin.name,
      role: mockUsers.daycareAdmin.role,
    });
    
    // Create parent and child for tests
    const parent = await parentsService.createParent(
      {
        daycareId: mockDaycares.active._id,
        user: {
          userId: mockUsers.parent._id,
          name: mockUsers.parent.name,
          email: mockUsers.parent.email,
          phone: mockUsers.parent.phone,
          role: "PARENT",
        },
        customData: { deskripsi: "", emergencyContact: null, pickupAuthorization: [], notes: "" },
      },
      adminContext as any
    );
    
    const child = await childrenService.createChild(
      {
        profile: { name: "Test Child Invoice", birthDate: "2023-01-15", photo: "", gender: "MALE" },
      },
      adminContext as any
    );
    
    await t.step("Create Invoice", async (step) => {
      await step.test("should create invoice successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          contractId: "65contract123",
          parent: {
            userId: mockUsers.parent._id,
            name: mockUsers.parent.name,
            email: mockUsers.parent.email,
          },
          period: {
            start: "2026-03-01",
            end: "2026-03-31",
          },
          items: [
            {
              description: "Daycare - March 2026",
              quantity: 1,
              unitPrice: 500000,
              subtotal: 500000,
            },
          ],
          total: 500000,
          dueDate: "2026-03-07",
          notes: "Pembayaran di awal bulan",
        };
        
        const result = await invoicesService.createInvoice(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.total, 500000);
        assertEquals(result.status, "PENDING");
      });
      
      await step.test("should fail without items", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          contractId: "65contract123",
          parent: {
            userId: mockUsers.parent._id,
            name: mockUsers.parent.name,
            email: mockUsers.parent.email,
          },
          period: {
            start: "2026-03-01",
            end: "2026-03-31",
          },
          items: [],
          total: 0,
          dueDate: "2026-03-07",
        };
        
        await assertRejects(
          async () => await invoicesService.createInvoice(input, adminContext as any),
          Error,
          "Items are required"
        );
      });
      
      await step.test("should fail with invalid total", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          contractId: "65contract123",
          parent: {
            userId: mockUsers.parent._id,
            name: mockUsers.parent.name,
            email: mockUsers.parent.email,
          },
          period: {
            start: "2026-03-01",
            end: "2026-03-31",
          },
          items: [
            {
              description: "Test",
              quantity: 1,
              unitPrice: 100,
              subtotal: 100,
            },
          ],
          total: 500, // Doesn't match items
          dueDate: "2026-03-07",
        };
        
        await assertRejects(
          async () => await invoicesService.createInvoice(input, adminContext as any),
          Error,
          "Total must match items subtotal"
        );
      });
    });
    
    await t.step("Get Invoices", async (step) => {
      await step.test("should get all invoices for daycare", async () => {
        const invoices = await invoicesService.getDaycareInvoices(mockDaycares.active._id, undefined, adminContext as any);
        
        assertEquals(Array.isArray(invoices), true);
        assertEquals(invoices.length, 1);
      });
      
      await step.test("should get only pending invoices", async () => {
        const invoices = await invoicesService.getDaycareInvoices(mockDaycares.active._id, "PENDING", adminContext as any);
        
        assertEquals(Array.isArray(invoices), true);
        assertEquals(invoices.length, 1);
      });
      
      await step.test("should get invoices for parent", async () => {
        const invoices = await invoicesService.getParentInvoices(mockUsers.parent._id, undefined, adminContext as any);
        
        assertEquals(Array.isArray(invoices), true);
        assertEquals(invoices.length, 1);
      });
      
      await step.test("should get overdue invoices", async () => {
        const invoices = await invoicesService.getOverdueInvoices(mockDaycares.active._id, adminContext as any);
        
        assertEquals(Array.isArray(invoices), true);
      });
    });
    
    await t.step("Update Invoice", async (step) => {
      const invoices = await invoicesService.getDaycareInvoices(mockDaycares.active._id, undefined, adminContext as any);
      const invoiceId = invoices[0].id;
      
      await step.test("should update invoice successfully", async () => {
        const input = {
          notes: "Updated notes",
        };
        
        const updated = await invoicesService.updateInvoice(invoiceId, input, adminContext as any);
        
        assertEquals(updated.notes, "Updated notes");
      });
    });
    
    await t.step("Mark Invoice as Paid", async (step) => {
      const invoices = await invoicesService.getDaycareInvoices(mockDaycares.active._id, undefined, adminContext as any);
      const invoiceId = invoices[0].id;
      
      await step.test("should mark invoice as paid", async () => {
        const input = {
          paidAt: new Date().toISOString(),
        };
        
        const result = await invoicesService.markInvoiceAsPaid(invoiceId, input, adminContext as any);
        
        assertEquals(result.status, "PAID");
        assertExists(result.paidAt);
      });
      
      await step.test("should not show in pending list after paid", async () => {
        const invoices = await invoicesService.getDaycareInvoices(mockDaycares.active._id, "PENDING", adminContext as any);
        
        assertEquals(invoices.length, 0);
      });
    });
    
    await t.step("Cancel Invoice", async (step) => {
      const invoices = await invoicesService.getDaycareInvoices(mockDaycares.active._id, undefined, adminContext as any);
      
      if (invoices.length > 0) {
        const invoiceId = invoices[0].id;
        
        await step.test("should cancel invoice successfully", async () => {
          const result = await invoicesService.cancelInvoice(invoiceId, adminContext as any);
          
          assertEquals(result.status, "CANCELLED");
        });
      }
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

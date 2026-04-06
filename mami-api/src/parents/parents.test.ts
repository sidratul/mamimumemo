/**
 * Unit Tests for Parents Module
 * 
 * Run with: deno test -A src/parents/parents.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { ParentsService } from "./parents.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const parentsService = new ParentsService();

Deno.test({
  name: "Parents Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const adminContext = createMockContext({
      id: mockUsers.daycareAdmin._id,
      name: mockUsers.daycareAdmin.name,
      role: mockUsers.daycareAdmin.role,
    });
    
    await t.step("Create Parent", async (step) => {
      await step.test("should create parent successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          user: {
            userId: mockUsers.parent._id,
            name: mockUsers.parent.name,
            email: mockUsers.parent.email,
            phone: mockUsers.parent.phone,
            role: "PARENT" as const,
          },
          customData: {
            deskripsi: "No rek: 123456",
            emergencyContact: {
              name: "Ayah Budi",
              phone: "0812-3456-7890",
              relation: "father",
            },
            pickupAuthorization: [],
            notes: "",
          },
        };
        
        const result = await parentsService.createParent(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.user.name, mockUsers.parent.name);
      });
      
      await step.test("should create parent with pickup authorization", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          user: {
            userId: mockUsers.guardian._id,
            name: mockUsers.guardian.name,
            email: mockUsers.guardian.email,
            phone: mockUsers.guardian.phone,
            role: "PARENT" as const,
          },
          customData: {
            deskripsi: "",
            emergencyContact: null,
            pickupAuthorization: [
              {
                name: "Nenek",
                phone: "0813-4567-8901",
                relation: "grandmother",
              },
            ],
            notes: "Jemput setelah jam 4",
          },
        };
        
        const result = await parentsService.createParent(input, adminContext as any);
        
        assertEquals(result.customData.pickupAuthorization.length, 1);
      });
      
      await step.test("should fail creating duplicate parent", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          user: {
            userId: mockUsers.parent._id,
            name: mockUsers.parent.name,
            email: mockUsers.parent.email,
            phone: mockUsers.parent.phone,
            role: "PARENT" as const,
          },
          customData: {
            deskripsi: "",
            emergencyContact: null,
            pickupAuthorization: [],
            notes: "",
          },
        };
        
        await assertRejects(
          async () => await parentsService.createParent(input, adminContext as any),
          Error,
          "Parent already exists"
        );
      });
    });
    
    await t.step("Get Daycare Parents", async (step) => {
      await step.test("should get all parents for daycare", async () => {
        const parents = await parentsService.getDaycareParents(mockDaycares.active._id, undefined, adminContext as any);
        
        assertEquals(Array.isArray(parents), true);
        assertEquals(parents.length, 2);
      });
      
      await step.test("should get only active parents", async () => {
        const parents = await parentsService.getDaycareParents(mockDaycares.active._id, true, adminContext as any);
        
        assertEquals(Array.isArray(parents), true);
        assertEquals(parents.length, 2);
      });
    });
    
    await t.step("Update Parent", async (step) => {
      const parents = await parentsService.getDaycareParents(mockDaycares.active._id, undefined, adminContext as any);
      const parentId = parents[0].id;
      
      await step.test("should update parent customData", async () => {
        const input = {
          customData: {
            deskripsi: "No rek: 987654",
            emergencyContact: {
              name: "Updated Contact",
              phone: "0814-5678-9012",
              relation: "father",
            },
            pickupAuthorization: [],
            notes: "Updated notes",
          },
        };
        
        const updated = await parentsService.updateParent(parentId, input, adminContext as any);
        
        assertEquals(updated.customData.deskripsi, "No rek: 987654");
        assertEquals(updated.customData.emergencyContact.name, "Updated Contact");
      });
    });
    
    await t.step("Deactivate Parent", async (step) => {
      const parents = await parentsService.getDaycareParents(mockDaycares.active._id, undefined, adminContext as any);
      const parentId = parents[0].id;
      
      await step.test("should deactivate parent successfully", async () => {
        const result = await parentsService.deactivateParent(parentId, adminContext as any);
        
        assertEquals(result.active, false);
      });
      
      await step.test("should not show deactivated parent in active list", async () => {
        const parents = await parentsService.getDaycareParents(mockDaycares.active._id, true, adminContext as any);
        
        assertEquals(parents.length, 1);
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

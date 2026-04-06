/**
 * Unit Tests for Children Module
 * 
 * Run with: deno test -A src/children/children.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { ChildrenService } from "./children.service.ts";
import { connectTestDatabase, teardownTestDatabase, createTestChild, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockChildren } from "../../mocks/index.ts";

const childrenService = new ChildrenService();

// Test setup
Deno.test({
  name: "Children Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const ownerContext = createMockContext({
      id: mockUsers.parent._id,
      name: mockUsers.parent.name,
      email: mockUsers.parent.email,
      role: mockUsers.parent.role,
    });
    
    await t.step("Get My Children", async (step) => {
      await step.test("should return empty array for new user", async () => {
        const children = await childrenService.getMyChildren(ownerContext as any);
        
        assertEquals(Array.isArray(children), true);
        assertEquals(children.length, 0);
      });
      
      await step.test("should return children after creation", async () => {
        // Create a child first
        const input = createTestChild();
        const created = await childrenService.createChild(input, ownerContext as any);
        
        assertExists(created.id);
        assertEquals(created.profile.name, input.profile.name);
        
        // Get all children
        const children = await childrenService.getMyChildren(ownerContext as any);
        
        assertEquals(Array.isArray(children), true);
        assertEquals(children.length, 1);
        assertEquals(children[0].profile.name, input.profile.name);
      });
    });
    
    await t.step("Create Child", async (step) => {
      await step.test("should create child successfully", async () => {
        const input = createTestChild({
          profile: {
            name: "Test Child Create",
            birthDate: "2023-05-15",
            photo: "https://example.com/test.jpg",
            gender: "FEMALE",
          },
        });
        
        const result = await childrenService.createChild(input, ownerContext as any);
        
        assertExists(result.id);
        assertEquals(result.profile.name, input.profile.name);
        assertEquals(result.profile.gender, input.profile.gender);
      });
      
      await step.test("should create child with allergies", async () => {
        const input = createTestChild({
          medical: {
            allergies: ["Susu sapi", "Telur", "Kacang"],
            medicalNotes: "Perlu epipen",
            medications: [],
          },
        });
        
        const result = await childrenService.createChild(input, ownerContext as any);
        
        assertExists(result.id);
        assertEquals(result.medical.allergies.length, 3);
        assertEquals(result.medical.allergies[0], "Susu sapi");
      });
      
      await step.test("should fail without name", async () => {
        const input = createTestChild({
          profile: {
            name: "",
            birthDate: "2023-05-15",
            photo: "",
            gender: "MALE",
          },
        });
        
        await assertRejects(
          async () => await childrenService.createChild(input, ownerContext as any),
          Error,
          "Name is required"
        );
      });
      
      await step.test("should fail without birthDate", async () => {
        const input = createTestChild({
          profile: {
            name: "Test Child",
            birthDate: "",
            photo: "",
            gender: "MALE",
          },
        });
        
        await assertRejects(
          async () => await childrenService.createChild(input, ownerContext as any),
          Error,
          "Birth date is required"
        );
      });
    });
    
    await t.step("Update Child", async (step) => {
      let childId: string;
      
      await step.test("should update child successfully", async () => {
        // Create child first
        const input = createTestChild();
        const created = await childrenService.createChild(input, ownerContext as any);
        childId = created.id;
        
        // Update
        const updateInput = {
          profile: {
            name: "Updated Name",
            photo: "https://example.com/updated.jpg",
          },
        };
        
        const updated = await childrenService.updateChild(childId, updateInput, ownerContext as any);
        
        assertEquals(updated.profile.name, "Updated Name");
        assertEquals(updated.profile.photo, "https://example.com/updated.jpg");
      });
      
      await step.test("should update medical info", async () => {
        const updateInput = {
          medical: {
            allergies: ["Alergi baru"],
            medicalNotes: "Catatan baru",
          },
        };
        
        const updated = await childrenService.updateChild(childId, updateInput, ownerContext as any);
        
        assertEquals(updated.medical.allergies.length, 1);
        assertEquals(updated.medical.allergies[0], "Alergi baru");
      });
      
      await step.test("should fail for non-existent child", async () => {
        const fakeId = "65fake123456789012345678";
        
        await assertRejects(
          async () => await childrenService.updateChild(fakeId, {}, ownerContext as any),
          Error,
          "Child not found"
        );
      });
    });
    
    await t.step("Add Guardian", async (step) => {
      let childId: string;
      
      await step.test("should add guardian successfully", async () => {
        // Create child first
        const input = createTestChild();
        const created = await childrenService.createChild(input, ownerContext as any);
        childId = created.id;
        
        const guardianInput = {
          userId: mockUsers.guardian._id,
          relation: "FATHER",
          permissions: ["VIEW_REPORTS", "INPUT_ACTIVITY"],
        };
        
        const result = await childrenService.addGuardian(childId, guardianInput, ownerContext as any);
        
        assertExists(result.id);
        assertEquals(result.guardians.length, 2); // Owner + new guardian
        assertEquals(result.guardians[1].relation, "FATHER");
      });
      
      await step.test("should fail adding duplicate guardian", async () => {
        const guardianInput = {
          userId: mockUsers.guardian._id,
          relation: "FATHER",
          permissions: ["VIEW_REPORTS"],
        };
        
        await assertRejects(
          async () => await childrenService.addGuardian(childId, guardianInput, ownerContext as any),
          Error,
          "Guardian already exists"
        );
      });
    });
    
    await t.step("Remove Guardian", async (step) => {
      let childId: string;
      
      await step.test("should remove guardian successfully", async () => {
        // Create child with guardian
        const input = createTestChild();
        const created = await childrenService.createChild(input, ownerContext as any);
        childId = created.id;
        
        // Add guardian
        const guardianInput = {
          userId: mockUsers.guardian._id,
          relation: "FATHER",
          permissions: ["VIEW_REPORTS"],
        };
        await childrenService.addGuardian(childId, guardianInput, ownerContext as any);
        
        // Remove guardian
        const result = await childrenService.removeGuardian(
          childId,
          { guardianUserId: mockUsers.guardian._id },
          ownerContext as any
        );
        
        assertEquals(result.guardians.length, 1); // Only owner remains
      });
    });
    
    await t.step("Get Child", async (step) => {
      await step.test("should get child by ID", async () => {
        // Create child first
        const input = createTestChild();
        const created = await childrenService.createChild(input, ownerContext as any);
        
        const child = await childrenService.getChild(created.id, ownerContext as any);
        
        assertExists(child.id);
        assertEquals(child.profile.name, input.profile.name);
      });
      
      await step.test("should fail for non-existent child", async () => {
        const fakeId = "65fake123456789012345678";
        
        await assertRejects(
          async () => await childrenService.getChild(fakeId, ownerContext as any),
          Error,
          "Child not found"
        );
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

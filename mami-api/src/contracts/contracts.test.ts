/**
 * Unit Tests for Contracts Module
 * 
 * Run with: deno test -A src/contracts/contracts.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { ContractsService } from "./contracts.service.ts";
import { ParentsService } from "../parents/parents.service.ts";
import { ChildrenService } from "../children/children.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const contractsService = new ContractsService();
const parentsService = new ParentsService();
const childrenService = new ChildrenService();

Deno.test({
  name: "Contracts Module",
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
        profile: { name: "Test Child", birthDate: "2023-01-15", photo: "", gender: "MALE" },
      },
      adminContext as any
    );
    
    await t.step("Create Contract", async (step) => {
      await step.test("should create monthly contract successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          parentId: parent.id,
          childIds: [child.id],
          serviceType: "MONTHLY",
          price: 500000,
          startDate: "2026-03-01",
          endDate: "2026-03-31",
          terms: "Pembayaran di awal bulan",
        };
        
        const result = await contractsService.createContract(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.serviceType, "MONTHLY");
        assertEquals(result.status, "ACTIVE");
      });
      
      await step.test("should create weekly contract", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          parentId: parent.id,
          childIds: [child.id],
          serviceType: "WEEKLY",
          price: 150000,
          startDate: "2026-03-01",
          endDate: "2026-03-07",
          terms: "",
        };
        
        const result = await contractsService.createContract(input, adminContext as any);
        
        assertEquals(result.serviceType, "WEEKLY");
      });
      
      await step.test("should fail with invalid date range", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          parentId: parent.id,
          childIds: [child.id],
          serviceType: "MONTHLY",
          price: 500000,
          startDate: "2026-03-31",
          endDate: "2026-03-01", // End before start
          terms: "",
        };
        
        await assertRejects(
          async () => await contractsService.createContract(input, adminContext as any),
          Error,
          "End date must be after start date"
        );
      });
    });
    
    await t.step("Get Contracts", async (step) => {
      await step.test("should get all contracts for daycare", async () => {
        const contracts = await contractsService.getDaycareContracts(mockDaycares.active._id, undefined, adminContext as any);
        
        assertEquals(Array.isArray(contracts), true);
        assertEquals(contracts.length, 2);
      });
      
      await step.test("should get only active contracts", async () => {
        const contracts = await contractsService.getDaycareContracts(mockDaycares.active._id, "ACTIVE", adminContext as any);
        
        assertEquals(Array.isArray(contracts), true);
        assertEquals(contracts.length, 2);
      });
      
      await step.test("should get contracts for parent", async () => {
        const contracts = await contractsService.getParentContracts(parent.id, undefined, adminContext as any);
        
        assertEquals(Array.isArray(contracts), true);
        assertEquals(contracts.length, 2);
      });
    });
    
    await t.step("Update Contract", async (step) => {
      const contracts = await contractsService.getDaycareContracts(mockDaycares.active._id, undefined, adminContext as any);
      const contractId = contracts[0].id;
      
      await step.test("should update contract successfully", async () => {
        const input = {
          serviceType: "WEEKLY",
          price: 150000,
        };
        
        const updated = await contractsService.updateContract(contractId, input, adminContext as any);
        
        assertEquals(updated.serviceType, "WEEKLY");
        assertEquals(updated.price, 150000);
      });
      
      await step.test("should update contract status", async () => {
        const input = {
          status: "TERMINATED" as const,
        };
        
        const updated = await contractsService.updateContract(contractId, input, adminContext as any);
        
        assertEquals(updated.status, "TERMINATED");
      });
    });
    
    await t.step("Terminate Contract", async (step) => {
      const contracts = await contractsService.getDaycareContracts(mockDaycares.active._id, undefined, adminContext as any);
      const contractId = contracts[0].id;
      
      await step.test("should terminate contract successfully", async () => {
        const result = await contractsService.terminateContract(contractId, adminContext as any);
        
        assertEquals(result.status, "TERMINATED");
      });
      
      await step.test("should not show terminated in active list", async () => {
        const contracts = await contractsService.getDaycareContracts(mockDaycares.active._id, "ACTIVE", adminContext as any);
        
        assertEquals(contracts.length, 1);
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

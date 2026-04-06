/**
 * Unit Tests for Medical Records Module
 * 
 * Run with: deno test -A src/medical_records/medical_records.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { MedicalRecordsService } from "./medical_records.service.ts";
import { ChildrenService } from "../children/children.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockChildren } from "../../mocks/index.ts";

const medicalRecordsService = new MedicalRecordsService();
const childrenService = new ChildrenService();

Deno.test({
  name: "Medical Records Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const parentContext = createMockContext({
      id: mockUsers.parent._id,
      name: mockUsers.parent.name,
      role: mockUsers.parent.role,
    });
    
    // Create child first for tests
    const child = await childrenService.createChild(
      {
        profile: {
          name: "Test Child Medical",
          birthDate: "2023-01-15",
          photo: "",
          gender: "MALE",
        },
      },
      parentContext as any
    );
    
    await t.step("Create Medical Record", async (step) => {
      await step.test("should create illness record successfully", async () => {
        const input = {
          childId: child.id,
          type: "ILLNESS",
          name: "Demam Berdarah",
          diagnosis: "DBD Grade II",
          symptoms: ["Demam tinggi", "Bintik merah"],
          severity: "HIGH",
          startDate: new Date().toISOString(),
          treatment: "Rawat inap",
          reportedBy: {
            userId: mockUsers.parent._id,
            name: "Ibu Budi",
            relation: "mother",
          },
        };
        
        const result = await medicalRecordsService.createMedicalRecord(input, parentContext as any);
        
        assertExists(result.id);
        assertEquals(result.type, "ILLNESS");
        assertEquals(result.name, "Demam Berdarah");
      });
      
      await step.test("should create allergy record", async () => {
        const input = {
          childId: child.id,
          type: "ALLERGY",
          name: "Alergi Susu",
          diagnosis: "Alergi protein susu",
          symptoms: ["Ruam"],
          severity: "MEDIUM",
          startDate: new Date().toISOString(),
          status: "CHRONIC" as const,
          reportedBy: {
            userId: mockUsers.parent._id,
            name: "Ibu Budi",
            relation: "mother",
          },
        };
        
        const result = await medicalRecordsService.createMedicalRecord(input, parentContext as any);
        
        assertEquals(result.type, "ALLERGY");
        assertEquals(result.status, "CHRONIC");
      });
      
      await step.test("should fail without diagnosis", async () => {
        const input = {
          childId: child.id,
          type: "ILLNESS",
          name: "Test",
          diagnosis: "",
          severity: "HIGH",
          startDate: new Date().toISOString(),
          reportedBy: {
            userId: mockUsers.parent._id,
            name: "Test",
            relation: "mother",
          },
        };
        
        await assertRejects(
          async () => await medicalRecordsService.createMedicalRecord(input, parentContext as any),
          Error,
          "Diagnosis is required"
        );
      });
    });
    
    await t.step("Get Medical Records", async (step) => {
      await step.test("should get all records for child", async () => {
        const records = await medicalRecordsService.getMedicalRecords(child.id, undefined, parentContext as any);
        
        assertEquals(Array.isArray(records), true);
        assertEquals(records.length, 2);
      });
      
      await step.test("should get only active records", async () => {
        const records = await medicalRecordsService.getMedicalRecords(child.id, "ACTIVE", parentContext as any);
        
        assertEquals(Array.isArray(records), true);
        assertEquals(records.length, 2);
      });
      
      await step.test("should get active medical records", async () => {
        const records = await medicalRecordsService.getActiveMedicalRecords(child.id, parentContext as any);
        
        assertEquals(Array.isArray(records), true);
        assertExists(records[0]);
      });
      
      await step.test("should get single record by ID", async () => {
        const records = await medicalRecordsService.getMedicalRecords(child.id, undefined, parentContext as any);
        const record = await medicalRecordsService.getMedicalRecord(records[0].id, parentContext as any);
        
        assertExists(record.id);
        assertEquals(record.id, records[0].id);
      });
    });
    
    await t.step("Update Medical Record", async (step) => {
      const records = await medicalRecordsService.getMedicalRecords(child.id, undefined, parentContext as any);
      const recordId = records[0].id;
      
      await step.test("should update record successfully", async () => {
        const input = {
          name: "Updated Name",
          status: "RECOVERED" as const,
        };
        
        const updated = await medicalRecordsService.updateMedicalRecord(recordId, input, parentContext as any);
        
        assertEquals(updated.name, "Updated Name");
        assertEquals(updated.status, "RECOVERED");
      });
      
      await step.test("should update medications", async () => {
        const input = {
          medications: [
            {
              name: "Paracetamol",
              dosage: "10mg",
              frequency: "3x sehari",
              startDate: new Date().toISOString(),
            },
          ],
        };
        
        const updated = await medicalRecordsService.updateMedicalRecord(recordId, input, parentContext as any);
        
        assertEquals(updated.medications.length, 1);
        assertEquals(updated.medications[0].name, "Paracetamol");
      });
    });
    
    await t.step("Delete Medical Record", async (step) => {
      const records = await medicalRecordsService.getMedicalRecords(child.id, undefined, parentContext as any);
      const recordId = records[0].id;
      
      await step.test("should delete record successfully", async () => {
        const result = await medicalRecordsService.deleteMedicalRecord(recordId, parentContext as any);
        
        assertEquals(result, true);
      });
      
      await step.test("should fail deleting non-existent record", async () => {
        await assertRejects(
          async () => await medicalRecordsService.deleteMedicalRecord(recordId, parentContext as any),
          Error,
          "Medical record not found"
        );
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

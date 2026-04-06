/**
 * Unit Tests for Daycare Admin Module
 *
 * Run with: deno test -A src/daycare_admin/daycare_admin.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { DaycareAdminService } from "./daycare_admin.service.ts";
import DaycareModel from "./daycare_admin.schema.ts";
import AuthModel from "@/auth/auth.schema.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { UserRole } from "#shared/enums/enum.ts";

const daycareAdminService = new DaycareAdminService();

Deno.test({
  name: "Daycare Admin Module",
  fn: async (t) => {
    await connectTestDatabase();

    const owner = await new AuthModel({
      name: "Owner Daycare",
      email: "owner.daycare@example.com",
      password: "hashed-password",
      phone: "081200000001",
      role: UserRole.DAYCARE_OWNER,
    }).save();

    const superAdmin = await new AuthModel({
      name: "Super Admin",
      email: "super.admin@example.com",
      password: "hashed-password",
      phone: "081200000002",
      role: UserRole.SUPER_ADMIN,
    }).save();

    const ownerContext = createMockContext({
      id: owner.id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
    });

    const superAdminContext = createMockContext({
      id: superAdmin.id,
      name: superAdmin.name,
      email: superAdmin.email,
      role: superAdmin.role,
    });

    await t.step("Draft And Submit", async (step) => {
      await step.test("should create daycare draft successfully", async () => {
        const result = await daycareAdminService.createDaycareDraft({
          name: "Mami Daycare Kemang",
          description: "Daycare keluarga kecil",
          address: "Jl. Kemang No. 1",
          city: "Jakarta Selatan",
          legalDocuments: [
            {
              type: "NIB",
              url: "https://example.com/nib.pdf",
            },
          ],
        }, ownerContext as any);

        assertExists(result.id);
        assertEquals(result.approval.status, "DRAFT");
      });

      await step.test("should submit registration from draft", async () => {
        const daycare = await DaycareModel.findOne({ name: "Mami Daycare Kemang" }).exec();
        const submitted = await daycareAdminService.submitDaycareRegistration(daycare!.id, ownerContext as any);

        assertEquals(submitted.approval.status, "SUBMITTED");
        assertExists(submitted.submittedAt);
      });
    });

    await t.step("System Admin Review", async (step) => {
      await step.test("should list system daycares for super admin", async () => {
        const result = await daycareAdminService.listSystemDaycares({}, superAdminContext as any);

        assertEquals(Array.isArray(result.items), true);
        assertEquals(result.total, 1);
      });

      await step.test("should move submitted daycare to in review", async () => {
        const daycare = await DaycareModel.findOne({ name: "Mami Daycare Kemang" }).exec();
        const updated = await daycareAdminService.updateDaycareApprovalStatus(daycare!.id, {
          status: "IN_REVIEW",
          note: "Dokumen sedang diverifikasi",
        }, superAdminContext as any);

        assertEquals(updated.approval.status, "IN_REVIEW");
      });

      await step.test("should approve daycare from in review", async () => {
        const daycare = await DaycareModel.findOne({ name: "Mami Daycare Kemang" }).exec();
        const updated = await daycareAdminService.updateDaycareApprovalStatus(daycare!.id, {
          status: "APPROVED",
        }, superAdminContext as any);

        assertEquals(updated.approval.status, "APPROVED");
        assertEquals(updated.isActive, true);
        assertExists(updated.approvedAt);
      });
    });

    await t.step("Permission And Transition Checks", async (step) => {
      await step.test("should reject invalid draft to approved transition", async () => {
        const draftDaycare = await new DaycareModel({
          name: "Draft Only Daycare",
          address: "Jl. Draft No. 2",
          city: "Bandung",
          owner: {
            userId: owner.id,
            name: owner.name,
            email: owner.email,
            phone: owner.phone,
          },
          approval: {
            status: "DRAFT",
            history: [],
          },
        }).save();

        await assertRejects(
          async () => await daycareAdminService.updateDaycareApprovalStatus(draftDaycare.id, {
            status: "APPROVED",
          }, superAdminContext as any),
          Error,
          "Transisi status tidak valid",
        );
      });

      await step.test("should reject non admin system query", async () => {
        await assertRejects(
          async () => await daycareAdminService.listSystemDaycares({}, ownerContext as any),
          Error,
          "Akses dilarang",
        );
      });
    });

    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

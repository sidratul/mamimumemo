/**
 * Unit Tests for Daycare Admin Module
 *
 * Run with: deno test -A src/daycare/daycare.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "@std/assert";

import { DaycareService } from "./daycare.service.ts";
import { DaycareApprovalStatus } from "./daycare.enum.ts";
import DaycareModel from "./daycare.schema.ts";
import AuthModel from "@/auth/auth.schema.ts";
import {
  clearTestDatabase,
  connectTestDatabase,
  teardownTestDatabase,
  createContextFromUser,
} from "../../tests/test-utils.ts";
import { UserRole } from "#shared/enums/enum.ts";

const daycareService = new DaycareService();

Deno.test({
  name: "Daycare Admin Module",
  fn: async (t) => {
    await connectTestDatabase();
    await clearTestDatabase();

    const superAdmin = await new AuthModel({
      name: "Super Admin",
      email: "super.admin@example.com",
      password: "hashed-password",
      phone: "081200000002",
      role: UserRole.SUPER_ADMIN,
    }).save();

    const superAdminContext = createContextFromUser(superAdmin);

    await t.step("Registration", async (step) => {
      await step.step("should register daycare with owner successfully", async () => {
        const result = await daycareService.registerDaycare({
          owner: {
            name: "Owner Daycare",
            email: "owner.daycare@example.com",
            password: "password123",
            phone: "081200000001",
          },
          daycare: {
            name: "Mami Daycare Kemang",
            description: "Daycare keluarga kecil",
            address: "Jl. Kemang No. 1",
            city: "Jakarta Selatan",
            legalDocuments: [],
          },
        }, superAdminContext);

        assertExists(result.id);
        assertEquals(result.message, "Registrasi daycare berhasil dikirim.");

        const daycare = await DaycareModel.findById(result.id).exec();
        assertEquals(daycare?.approval.status, DaycareApprovalStatus.SUBMITTED);
        assertExists(daycare?.submittedAt);
      });
    });

    const owner = await AuthModel.findOne({ email: "owner.daycare@example.com" }).exec();
    if (!owner) {
      throw new Error("Owner should exist after registration");
    }

    const ownerContext = createContextFromUser(owner);

    await t.step("System Admin Review", async (step) => {
      await step.step("should list system daycares for super admin", async () => {
        const result = await daycareService.listDaycares({
          statuses: [DaycareApprovalStatus.SUBMITTED],
          sort: {
            sortBy: "createdAt",
            sortType: "DESC",
          },
          page: 1,
          limit: 10,
        }, superAdminContext);
        const total = await daycareService.countDaycares({
          statuses: [DaycareApprovalStatus.SUBMITTED],
        }, superAdminContext);

        assertEquals(Array.isArray(result), true);
        assertEquals(result.length, 1);
        assertEquals(total, 1);
      });

      await step.step("should move submitted daycare to in review", async () => {
        const daycare = await DaycareModel.findOne({ name: "Mami Daycare Kemang" }).exec();
        const updated = await daycareService.updateDaycareApprovalStatus(daycare!._id.toString(), {
          status: DaycareApprovalStatus.IN_REVIEW,
          note: "Dokumen sedang diverifikasi",
        }, superAdminContext);

        assertEquals(updated.message, `Status daycare berhasil diubah ke ${DaycareApprovalStatus.IN_REVIEW}.`);
      });

      await step.step("should approve daycare from in review", async () => {
        const daycare = await DaycareModel.findOne({ name: "Mami Daycare Kemang" }).exec();
        const updated = await daycareService.updateDaycareApprovalStatus(daycare!._id.toString(), {
          status: DaycareApprovalStatus.APPROVED,
        }, superAdminContext);

        assertEquals(updated.message, `Status daycare berhasil diubah ke ${DaycareApprovalStatus.APPROVED}.`);

        const approvedDaycare = await DaycareModel.findById(daycare!._id).exec();
        assertEquals(approvedDaycare?.approval.status, DaycareApprovalStatus.APPROVED);
        assertEquals(approvedDaycare?.isActive, true);
        assertExists(approvedDaycare?.approvedAt);
      });
    });

    await t.step("Owner Documents", async (step) => {
      await step.step("should update daycare documents during review flow", async () => {
        const daycare = await DaycareModel.findOne({ name: "Mami Daycare Kemang" }).exec();
        const result = await daycareService.updateDaycareDocuments(daycare!._id.toString(), {
          legalDocuments: [
            {
              type: "NIB",
              url: "https://example.com/nib-final.pdf",
              verified: false,
            },
            {
              type: "SIUP",
              url: "https://example.com/siup.pdf",
              verified: false,
            },
          ],
        }, ownerContext);

        assertEquals(result.message, "Dokumen daycare berhasil diperbarui.");

        const updatedDaycare = await DaycareModel.findById(daycare!._id).exec();
        assertEquals(updatedDaycare?.legalDocuments.length, 2);
      });
    });

    await t.step("Permission And Transition Checks", async (step) => {
      await step.step("should reject invalid submitted to approved transition", async () => {
        const submittedDaycare = await new DaycareModel({
          name: "Submitted Only Daycare",
          address: "Jl. Draft No. 2",
          city: "Bandung",
          owner: {
            _id: owner.id,
            name: owner.name,
            email: owner.email,
            phone: owner.phone,
          },
          submittedAt: new Date(),
          approval: {
            status: DaycareApprovalStatus.SUBMITTED,
            history: [],
          },
        }).save();

        await assertRejects(
          async () => await daycareService.updateDaycareApprovalStatus(submittedDaycare._id.toString(), {
            status: DaycareApprovalStatus.APPROVED,
          }, superAdminContext),
          Error,
          "Transisi status tidak valid",
        );
      });

      await step.step("should reject non admin system query", async () => {
        await assertRejects(
          async () => await daycareService.listDaycares({}, ownerContext),
          Error,
          "Akses dilarang",
        );
      });

      await step.step("should reject duplicate owner email registration", async () => {
        await assertRejects(
          async () => await daycareService.registerDaycare({
            owner: {
              name: "Owner Daycare",
              email: "owner.daycare@example.com",
              password: "password123",
              phone: "081200000001",
            },
            daycare: {
              name: "Mami Daycare Pondok Indah",
              description: "Daycare kedua",
              address: "Jl. Pondok Indah No. 2",
              city: "Jakarta Selatan",
            },
          }, superAdminContext),
          Error,
          "sudah terdaftar",
        );
      });

      await step.step("should soft delete daycare and hide it from default queries", async () => {
        const daycare = await DaycareModel.findOne({ name: "Mami Daycare Kemang" }).exec();
        const result = await daycareService.deleteDaycare(daycare!._id.toString(), superAdminContext);

        assertEquals(result.message, "Daycare berhasil dihapus.");

        await assertRejects(
          async () => await daycareService.getDaycare(daycare!._id.toString(), superAdminContext),
          Error,
          "tidak ditemukan",
        );

        const total = await daycareService.countDaycares({}, superAdminContext);
        assertEquals(total, 1);
      });

      await step.step("should purge daycare and owner permanently", async () => {
        const purgeOwner = await new AuthModel({
          name: "Purge Owner",
          email: "purge.owner@example.com",
          password: "hashed-password",
          phone: "081200000003",
          role: UserRole.DAYCARE_OWNER,
        }).save();

        const purgeDaycare = await new DaycareModel({
          name: "Purge Daycare",
          address: "Jl. Hapus No. 1",
          city: "Depok",
          owner: {
            _id: purgeOwner.id,
            name: purgeOwner.name,
            email: purgeOwner.email,
            phone: purgeOwner.phone,
          },
          submittedAt: new Date(),
          approval: {
            status: DaycareApprovalStatus.SUBMITTED,
            history: [],
          },
        }).save();

        const result = await daycareService.purgeDaycare(
          purgeDaycare._id.toString(),
          { deleteOwner: true },
          superAdminContext,
        );

        assertEquals(result.message, "Daycare dan owner berhasil dihapus permanen.");

        const deletedDaycare = await DaycareModel.findById(purgeDaycare._id).exec();
        const deletedOwner = await AuthModel.findOne({ email: purgeOwner.email }).exec();

        assertEquals(deletedDaycare, null);
        assertEquals(deletedOwner, null);
      });
    });

    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

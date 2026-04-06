import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";
import AuthModel from "@/auth/auth.schema.ts";
import { DaycareAdminRepository } from "./daycare_admin.repository.ts";
import {
  createDaycareDraftInput,
  updateDaycareApprovalInput,
  daycareApprovalStatusEnum,
} from "./daycare_admin.validation.ts";
import { z } from "zod";

const repository = new DaycareAdminRepository();

const ADMIN_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ["IN_REVIEW"],
  IN_REVIEW: ["APPROVED", "NEEDS_REVISION", "REJECTED"],
  APPROVED: ["SUSPENDED"],
  SUSPENDED: ["APPROVED"],
};

export class DaycareAdminService {
  async listSystemDaycares(
    params: { status?: string; search?: string; limit?: number; offset?: number },
    context: AppContext,
  ) {
    this.requireSuperAdmin(context);
    return await repository.list(params);
  }

  async getSystemDaycare(id: string, context: AppContext) {
    this.requireSuperAdmin(context);
    const daycare = await repository.findById(id);
    if (!daycare) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }
    return daycare;
  }

  async getMyDaycareRegistration(context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const daycare = await repository.findByOwnerUserId(context.user.id);
    if (!daycare) {
      return null;
    }

    return daycare;
  }

  async createDaycareDraft(input: typeof createDaycareDraftInput._type, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const owner = await AuthModel.findById(context.user.id).exec();
    if (!owner) {
      throw new GraphQLError(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    return await repository.create({
      ...input,
      owner: {
        userId: owner.id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone || "",
      },
      isActive: false,
      approval: {
        status: "DRAFT",
        note: "",
        history: [
          {
            status: "DRAFT",
            note: "Draft daycare dibuat.",
            changedBy: {
              userId: owner.id,
              name: owner.name,
            },
            changedAt: new Date(),
          },
        ],
      },
    });
  }

  async submitDaycareRegistration(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const daycare = await repository.findById(id);
    if (!daycare) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const isOwner = daycare.owner.userId.toString() === context.user.id;
    const isSuperAdmin = context.user.role === UserRole.SUPER_ADMIN;
    if (!isOwner && !isSuperAdmin) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const currentStatus = daycare.approval.status;
    if (!["DRAFT", "NEEDS_REVISION"].includes(currentStatus)) {
      throw new GraphQLError("Status daycare tidak dapat disubmit dari kondisi saat ini");
    }

    daycare.approval.status = "SUBMITTED";
    daycare.approval.note = currentStatus === "NEEDS_REVISION"
      ? "Registrasi dikirim ulang setelah revisi."
      : "Pendaftaran daycare dikirim owner.";
    daycare.submittedAt = new Date();
    daycare.approval.reviewedBy = undefined;
    daycare.approval.reviewedAt = undefined;
    daycare.approval.history.unshift({
      status: "SUBMITTED",
      note: daycare.approval.note,
      changedBy: {
        userId: daycare.owner.userId,
        name: daycare.owner.name,
      },
      changedAt: new Date(),
    });

    return await repository.save(daycare);
  }

  async updateDaycareApprovalStatus(
    id: string,
    input: typeof updateDaycareApprovalInput._type,
    context: AppContext,
  ) {
    this.requireSuperAdmin(context);
    const daycare = await repository.findById(id);
    if (!daycare) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const currentStatus = daycare.approval.status;
    const nextStatus = input.status as z.infer<typeof daycareApprovalStatusEnum>;
    const allowedNextStatuses = ADMIN_TRANSITIONS[currentStatus] || [];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new GraphQLError(`Transisi status tidak valid: ${currentStatus} -> ${nextStatus}`);
    }

    if (["NEEDS_REVISION", "REJECTED", "SUSPENDED"].includes(nextStatus) && !input.note?.trim()) {
      throw new GraphQLError("Catatan wajib diisi untuk status ini");
    }

    const reviewNote = input.note?.trim() || this.defaultStatusNote(nextStatus);
    daycare.approval.status = nextStatus;
    daycare.approval.note = reviewNote;
    daycare.approval.reviewedBy = {
      userId: context.user!.id,
      name: context.user!.name,
    };
    daycare.approval.reviewedAt = new Date();

    if (nextStatus === "APPROVED") {
      daycare.isActive = true;
      daycare.approvedAt = new Date();
    } else if (nextStatus === "SUSPENDED") {
      daycare.isActive = false;
    } else if (["IN_REVIEW", "NEEDS_REVISION", "REJECTED"].includes(nextStatus)) {
      daycare.isActive = false;
    }

    daycare.approval.history.unshift({
      status: nextStatus,
      note: reviewNote,
      changedBy: {
        userId: context.user!.id,
        name: context.user!.name,
      },
      changedAt: new Date(),
    });

    return await repository.save(daycare);
  }

  private requireSuperAdmin(context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }
    if (context.user.role !== UserRole.SUPER_ADMIN) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }
  }

  private defaultStatusNote(status: string) {
    switch (status) {
      case "IN_REVIEW":
        return "Dokumen sedang direview admin system.";
      case "APPROVED":
        return "Daycare disetujui dan diaktifkan.";
      case "SUSPENDED":
        return "Operasional daycare disuspensi sementara.";
      default:
        return "Status daycare diperbarui.";
    }
  }
}

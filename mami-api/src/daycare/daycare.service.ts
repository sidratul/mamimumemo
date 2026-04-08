import { GraphQLError } from "graphql";

import { AppContext } from "#shared/config/context.ts";
import { runInTransaction } from "#shared/database/transaction.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { ObjectId } from "#shared/types/objectid.type.ts";
import UsersService from "@/users/users.service.ts";
import DaycareMembershipsService from "@/daycare_memberships/daycare_memberships.service.ts";
import { DaycareApprovalStatus } from "./daycare.enum.ts";
import { DaycareDocShape, DaycareFilter, DaycareQueryOptions } from "./daycare.d.ts";
import { DaycareRepository } from "./daycare.repository.ts";
import { ProjectionType } from "mongoose";
import {
  purgeDaycareInput,
  registerDaycareInput,
  updateDaycareDocumentsInput,
  updateDaycareApprovalInput,
} from "./daycare.validation.ts";

const repository = new DaycareRepository();
const usersService = new UsersService();
const daycareMembershipsService = new DaycareMembershipsService();

const REVIEW_REQUIRED_STATUSES = [
  DaycareApprovalStatus.NEEDS_REVISION,
  DaycareApprovalStatus.REJECTED,
  DaycareApprovalStatus.SUSPENDED,
];

const INACTIVE_STATUSES = [
  DaycareApprovalStatus.IN_REVIEW,
  DaycareApprovalStatus.NEEDS_REVISION,
  DaycareApprovalStatus.REJECTED,
];

const ADMIN_TRANSITIONS: Partial<Record<DaycareApprovalStatus, DaycareApprovalStatus[]>> = {
  [DaycareApprovalStatus.SUBMITTED]: [DaycareApprovalStatus.IN_REVIEW],
  [DaycareApprovalStatus.IN_REVIEW]: [
    DaycareApprovalStatus.APPROVED,
    DaycareApprovalStatus.NEEDS_REVISION,
    DaycareApprovalStatus.REJECTED,
  ],
  [DaycareApprovalStatus.APPROVED]: [DaycareApprovalStatus.SUSPENDED],
  [DaycareApprovalStatus.SUSPENDED]: [DaycareApprovalStatus.APPROVED],
};

export class DaycareService {
  async listDaycares(
    options: DaycareQueryOptions,
    projection?: ProjectionType<DaycareDocShape>,
  ) {
    return await repository.list(options, projection);
  }

  async countDaycares(
    filter: DaycareFilter | undefined,
  ) {
    return await repository.count(filter);
  }

  async getDaycare(id: ObjectId, projection?: ProjectionType<DaycareDocShape>) {
    const daycare = await repository.findViewById(id, projection);
    if (!daycare) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }
    return daycare;
  }

  async getMyDaycare(context: AppContext) {
    const user = context.user;
    if (!user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const daycareId = user.daycareId;
    if (!daycareId) {
      return null;
    }

    const daycare = await repository.findViewById(daycareId);
    if (!daycare) {
      return null;
    }

    return daycare;
  }

  async registerDaycare(input: typeof registerDaycareInput._type, context: AppContext) {
    return await runInTransaction(context, async (session) => {
      const owner = await usersService.createUser({
        name: input.owner.name,
        email: input.owner.email,
        password: input.owner.password,
        phone: input.owner.phone,
        role: UserRole.DAYCARE_OWNER,
      }, { session });

      const daycare = await repository.create({
        name: input.daycare.name,
        description: input.daycare.description,
        address: input.daycare.address,
        city: input.daycare.city,
        legalDocuments: this.mapLegalDocuments(input.daycare.legalDocuments),
        owner: {
          _id: owner.id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone || "",
        },
        isActive: false,
        submittedAt: new Date(),
        approval: {
          status: DaycareApprovalStatus.SUBMITTED,
          note: "Registrasi daycare berhasil dikirim. Tim kami akan menghubungi owner.",
          history: [
            {
              status: DaycareApprovalStatus.SUBMITTED,
              note: "Registrasi daycare berhasil dikirim.",
              changedBy: {
                userId: owner.id,
                name: owner.name,
              },
              changedAt: new Date(),
            },
          ],
        },
      }, { session });

      await daycareMembershipsService.createOwnerMembership({
        user: {
          _id: owner._id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone || "",
        },
        daycare: {
          _id: daycare._id,
          name: daycare.name,
        },
      }, { session });

      return {
        id: daycare._id.toString(),
        message: "Registrasi daycare berhasil dikirim.",
      };
    });
  }

  async updateDaycareDocuments(
    id: ObjectId,
    input: typeof updateDaycareDocumentsInput._type,
  ) {
    const daycare = await repository.findByIdForUpdate(id);
    if (!daycare) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    daycare.set("legalDocuments", this.mapLegalDocuments(input.legalDocuments));

    await daycare.save();

    return {
      id: daycare._id.toString(),
      message: "Dokumen daycare berhasil diperbarui.",
    };
  }

  async updateDaycareApprovalStatus(
    id: ObjectId,
    input: typeof updateDaycareApprovalInput._type,
    context: AppContext,
  ) {
    const daycare = await repository.findByIdForUpdate(id);
    if (!daycare) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const currentStatus = daycare.approval.status;
    const nextStatus = input.status as DaycareApprovalStatus;
    const allowedNextStatuses = ADMIN_TRANSITIONS[currentStatus] || [];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new GraphQLError(`Transisi status tidak valid: ${currentStatus} -> ${nextStatus}`);
    }

    if (REVIEW_REQUIRED_STATUSES.includes(nextStatus) && !input.note?.trim()) {
      throw new GraphQLError("Catatan wajib diisi untuk status ini");
    }

    const reviewNote = input.note?.trim() || this.defaultStatusNote(nextStatus);
    daycare.approval.status = nextStatus;
    daycare.approval.note = reviewNote;
    daycare.approval.reviewedBy = {
      userId: context.user!._id,
      name: context.user!.name,
    };
    daycare.approval.reviewedAt = new Date();

    if (nextStatus === DaycareApprovalStatus.APPROVED) {
      daycare.isActive = true;
      daycare.approvedAt = new Date();
    } else if (nextStatus === DaycareApprovalStatus.SUSPENDED) {
      daycare.isActive = false;
    } else if (INACTIVE_STATUSES.includes(nextStatus)) {
      daycare.isActive = false;
    }

    daycare.approval.history.unshift({
      status: nextStatus,
      note: reviewNote,
      changedBy: {
        userId: context.user!._id,
        name: context.user!.name,
      },
      changedAt: new Date(),
    });

    await daycare.save();

    return {
      id: daycare._id.toString(),
      message: `Status daycare berhasil diubah ke ${nextStatus}.`,
    };
  }

  async deleteDaycare(
    id: ObjectId,
    context: AppContext,
  ) {
    const daycare = await repository.findByIdIncludingDeletedForUpdate(id);
    if (!daycare || daycare.deletedAt) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    daycare.deletedAt = new Date();
    daycare.deletedBy = {
      userId: context.user!._id,
      name: context.user!.name,
    };
    daycare.isActive = false;

    await daycare.save();

    return {
      id: daycare._id.toString(),
      message: "Daycare berhasil dihapus.",
    };
  }

  async purgeDaycare(
    id: ObjectId,
    input: typeof purgeDaycareInput.shape.input._type,
  ) {
    const daycare = await repository.findByIdIncludingDeletedForUpdate(id);
    if (!daycare) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const ownerId = daycare.owner._id;
    const ownerEmail = daycare.owner.email;
    await daycareMembershipsService.deleteMembershipsByDaycareId(id);
    await repository.hardDeleteById(id);

    if (input?.deleteOwner) {
      await daycareMembershipsService.deleteMembershipsByUserId(ownerId);
      await usersService.deleteUserByIdOrEmail({
        id: ownerId,
        email: ownerEmail,
      });
    }

    return {
      id,
      message: input?.deleteOwner
        ? "Daycare dan owner berhasil dihapus permanen."
        : "Daycare berhasil dihapus permanen.",
    };
  }

  private defaultStatusNote(status: DaycareApprovalStatus) {
    switch (status) {
      case DaycareApprovalStatus.IN_REVIEW:
        return "Dokumen sedang direview admin system.";
      case DaycareApprovalStatus.APPROVED:
        return "Daycare disetujui dan diaktifkan.";
      case DaycareApprovalStatus.SUSPENDED:
        return "Operasional daycare disuspensi sementara.";
      default:
        return "Status daycare diperbarui.";
    }
  }

  private mapLegalDocuments(
    documents?: typeof updateDaycareDocumentsInput._type["legalDocuments"],
  ) {
    return (documents ?? []).map((document) => ({
      type: document.type,
      url: document.url,
      verified: document.verified ?? false,
    }));
  }
}

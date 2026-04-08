import { GraphQLError } from "graphql";
import { ClientSession } from "mongoose";
import { AppContext } from "#shared/config/context.ts";
import { runInTransaction } from "#shared/database/transaction.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { AuthorizationError } from "#shared/errors/custom-errors.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { ObjectId } from "#shared/types/objectid.type.ts";
import { ProjectionType } from "mongoose";
import UsersService from "@/users/users.service.ts";
import { DaycareRepository } from "@/daycare/daycare.repository.ts";
import { addUserToDaycareInput } from "./daycare_memberships.validation.ts";
import { DaycareMembershipsRepository } from "./daycare_memberships.repository.ts";
import { DaycareMembershipDocShape } from "./daycare_memberships.d.ts";
import { DaycareMembershipPersona, DaycareMembershipStatus } from "./daycare_memberships.enum.ts";

const usersService = new UsersService();
const daycareRepository = new DaycareRepository();
const repository = new DaycareMembershipsRepository();

function mapPersonaToUserRole(persona: DaycareMembershipPersona): UserRole {
  switch (persona) {
    case DaycareMembershipPersona.OWNER:
      return UserRole.DAYCARE_OWNER;
    case DaycareMembershipPersona.ADMIN:
      return UserRole.DAYCARE_ADMIN;
    case DaycareMembershipPersona.SITTER:
      return UserRole.DAYCARE_SITTER;
  }
}

export class DaycareMembershipsService {
  async getActiveMembershipByUserId(userId: ObjectId) {
    return await repository.findActiveByUserId(userId);
  }

  async listDaycareMemberships(
    daycareId: ObjectId,
    context: AppContext,
    projection?: ProjectionType<DaycareMembershipDocShape>,
  ) {
    this.requireManageDaycare(daycareId, context);
    return await repository.listByDaycareId(daycareId, projection);
  }

  async createOwnerMembership(
    input: {
      user: { _id: ObjectId; name: string; email: string; phone?: string };
      daycare: { _id: ObjectId; name: string };
    },
    options?: { session?: ClientSession },
  ) {
    return await repository.create({
      user: {
        _id: input.user._id,
        name: input.user.name,
        email: input.user.email,
        phone: input.user.phone || "",
      },
      daycare: {
        _id: input.daycare._id,
        name: input.daycare.name,
      },
      persona: DaycareMembershipPersona.OWNER,
      status: DaycareMembershipStatus.ACTIVE,
      joinedAt: new Date(),
      notes: "",
    }, options);
  }

  async addUserToDaycare(input: typeof addUserToDaycareInput._type, context: AppContext) {
    this.requireManageDaycare(input.daycareId, context);
    const daycare = await daycareRepository.findViewById(input.daycareId);
    if (!daycare) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    if (input.userId) {
      const user = await usersService.findUserById(input.userId);
      if (!user) {
        throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
      }

      return await this.createMembershipForUser({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
        },
        daycare: {
          _id: daycare._id,
          name: daycare.name,
        },
        persona: input.persona,
        notes: input.notes,
      });
    }

    if (!input.userData) {
      throw new GraphQLError("userData wajib diisi jika userId tidak ada.");
    }

    const userData = input.userData;

    return await runInTransaction(context, async (session) => {
      const createdUser = await usersService.createUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: mapPersonaToUserRole(input.persona),
      }, { session });

      return await this.createMembershipForUser({
        user: {
          _id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          phone: createdUser.phone || "",
        },
        daycare: {
          _id: daycare._id,
          name: daycare.name,
        },
        persona: input.persona,
        notes: input.notes,
      }, { session });
    });
  }

  async deactivateDaycareMembership(id: ObjectId, context: AppContext) {
    const membership = await repository.findViewById(id);
    if (!membership) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    this.requireManageDaycare(membership.daycare._id, context);
    const deactivated = await repository.deactivate(id);
    if (!deactivated) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return {
      id: deactivated._id.toString(),
      message: "Membership daycare berhasil dinonaktifkan.",
    };
  }

  async deleteMembershipsByDaycareId(daycareId: ObjectId, options?: { session?: ClientSession }) {
    return await repository.deleteByDaycareId(daycareId, options);
  }

  async deleteMembershipsByUserId(userId: ObjectId, options?: { session?: ClientSession }) {
    return await repository.deleteByUserId(userId, options);
  }

  private async createMembershipForUser(
    input: {
      user: { _id: ObjectId; name: string; email: string; phone?: string };
      daycare: { _id: ObjectId; name: string };
      persona: DaycareMembershipPersona;
      notes?: string;
    },
    options?: { session?: ClientSession },
  ) {
    const existingMembership = await repository.findActiveByUserAndDaycare(input.user._id, input.daycare._id);
    if (existingMembership) {
      throw new GraphQLError("Pengguna sudah memiliki membership aktif di daycare ini.");
    }

    const membership = await repository.create({
      user: {
        _id: input.user._id,
        name: input.user.name,
        email: input.user.email,
        phone: input.user.phone || "",
      },
      daycare: {
        _id: input.daycare._id,
        name: input.daycare.name,
      },
      persona: input.persona,
      status: DaycareMembershipStatus.ACTIVE,
      joinedAt: new Date(),
      notes: input.notes || "",
    }, options);

    return {
      id: membership._id.toString(),
      message: "Pengguna berhasil ditambahkan ke daycare.",
    };
  }

  private requireManageDaycare(daycareId: ObjectId, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (context.user.role === UserRole.SUPER_ADMIN) {
      return;
    }

    const hasSameDaycare = context.user.daycareId?.toString() === daycareId.toString();
    const allowedRoles = [UserRole.DAYCARE_OWNER, UserRole.DAYCARE_ADMIN];
    if (!hasSameDaycare || !context.user.role || !allowedRoles.includes(context.user.role)) {
      throw new AuthorizationError();
    }
  }
}

export default DaycareMembershipsService;

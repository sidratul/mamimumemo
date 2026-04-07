import { ChildrenRepository } from "./children.repository.ts";
import { createChildInput, updateChildInput, addGuardianInput, removeGuardianInput } from "./children.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";
import UserModel from "@/auth/auth.schema.ts";

const childrenRepository = new ChildrenRepository();

export class ChildrenService {
  async getMyChildren(context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await childrenRepository.findByOwnerId(context.user.id);
  }

  async getChild(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const hasAccess = await childrenRepository.userHasAccess(id, context.user.id);
    if (!hasAccess) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return await childrenRepository.findById(id);
  }

  async getChildrenWhereIGuard(context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await childrenRepository.findByGuardianId(context.user.id);
  }

  async createChild(input: typeof createChildInput._type, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Add owner as first guardian by default
    const ownerUser = await UserModel.findById(context.user.id).exec();
    if (!ownerUser) {
      throw new GraphQLError(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const guardians = input.guardians || [];
    
    // Add owner as guardian if not already added
    const ownerAsGuardian = {
      user: {
        userId: context.user.id,
        name: ownerUser.name,
        email: ownerUser.email,
        phone: ownerUser.phone || "",
        role: "parent" as const,
      },
      relation: "father" as const, // Will be updated by user if needed
      permissions: [
        "view_reports",
        "input_activity",
        "input_health",
        "enroll_daycare",
        "edit_profile",
        "manage_guardians",
      ],
      sharedAt: new Date(),
      sharedBy: {
        userId: context.user.id,
        name: ownerUser.name,
        relation: "owner",
      },
      active: true,
    };

    const childData = {
      ownerId: context.user.id,
      profile: input.profile,
      medical: input.medical || {},
      guardians: [ownerAsGuardian, ...guardians],
    };

    return await childrenRepository.create(childData);
  }

  async updateChild(
    id: string,
    input: typeof updateChildInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    const user = context.user;
    if (!user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const hasAccess = await childrenRepository.userHasAccess(id, user.id);
    if (!hasAccess) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Check if user has edit_profile permission
    const child = await childrenRepository.findById(id);
    if (!child) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const isOwner = child.ownerId.toString() === user.id;
    const guardian = child.guardians.find((g) => g.user.userId.toString() === user.id);

    if (!isOwner && !guardian?.permissions?.includes("edit_profile")) {
      throw new GraphQLError("You don't have permission to edit this child's profile");
    }

    return await childrenRepository.update(id, input);
  }

  async addGuardian(
    childId: string,
    input: typeof addGuardianInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const child = await childrenRepository.findById(childId);
    if (!child) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Only owner can add guardians
    if (child.ownerId.toString() !== context.user.id) {
      throw new GraphQLError("Only the child's owner can add guardians");
    }

    // Check if guardian already exists
    const existingGuardian = child.guardians.find(
      (g: any) => g.user.userId.toString() === input.userId
    );

    if (existingGuardian) {
      throw new GraphQLError("Guardian already exists for this child");
    }

    // Get guardian user info
    const guardianUser = await UserModel.findById(input.userId).exec();
    if (!guardianUser) {
      throw new GraphQLError(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const guardianData = {
      user: {
        userId: input.userId,
        name: guardianUser.name,
        email: guardianUser.email,
        phone: guardianUser.phone || "",
        role: guardianUser.role === UserRole.PARENT ? "parent" : "guardian",
      },
      relation: input.relation,
      permissions: input.permissions,
      sharedAt: new Date(),
      sharedBy: {
        userId: context.user.id,
        name: context.user.name,
        relation: "owner",
      },
      active: true,
    };

    return await childrenRepository.addGuardian(childId, guardianData);
  }

  async removeGuardian(
    childId: string,
    input: typeof removeGuardianInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const child = await childrenRepository.findById(childId);
    if (!child) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Only owner can remove guardians
    if (child.ownerId.toString() !== context.user.id) {
      throw new GraphQLError("Only the child's owner can remove guardians");
    }

    return await childrenRepository.removeGuardian(childId, input.guardianUserId);
  }
}

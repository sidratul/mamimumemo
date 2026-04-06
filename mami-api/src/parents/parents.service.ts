import { ParentsRepository } from "./parents.repository.ts";
import { createParentInput, updateParentInput } from "./parents.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const parentsRepository = new ParentsRepository();

function normalizeParentUserRole<T extends { role: string }>(user: T): T & { role: UserRole.PARENT } {
  return {
    ...user,
    role: UserRole.PARENT,
  };
}

export class ParentsService {
  private readonly daycareStaffRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];

  async getDaycareParents(daycareId: string, active: boolean | undefined, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    this.requireDaycareStaff(context);

    return await parentsRepository.findByDaycareId(daycareId, active);
  }

  async getParent(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const parent = await parentsRepository.findById(id);
    if (!parent) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Check access
    if (!this.daycareStaffRoles.includes(context.user.role as UserRole)) {
      // Allow if it's the parent themselves
      if (parent.user.userId.toString() !== context.user.id) {
        throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
      }
    }

    return parent;
  }

  async getParentByUser(daycareId: string, userId: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (!this.daycareStaffRoles.includes(context.user.role as UserRole) && context.user.id !== userId) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await parentsRepository.findByUserIdAndDaycare(daycareId, userId);
  }

  async createParent(
    input: typeof createParentInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can create parents
    this.requireDaycareStaff(context);

    // Check if parent already exists for this daycare
    const existingParent = await parentsRepository.findByUserIdAndDaycare(
      input.daycareId,
      input.user.userId
    );

    if (existingParent) {
      if (existingParent.active) {
        throw new GraphQLError("Parent already exists for this daycare");
      }
      // Reactivate existing parent
      return await parentsRepository.update(existingParent.id, {
        active: true,
        user: normalizeParentUserRole(input.user),
        customData: input.customData,
      });
    }

    const parentData = {
      daycareId: input.daycareId,
      user: normalizeParentUserRole(input.user),
      customData: input.customData || {},
      childrenIds: input.childrenIds || [],
    };

    return await parentsRepository.create(parentData);
  }

  async updateParent(
    id: string,
    input: typeof updateParentInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const parent = await parentsRepository.findById(id);
    if (!parent) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Check permissions
    const isSelf = parent.user.userId.toString() === context.user.id;
    
    if (!this.daycareStaffRoles.includes(context.user.role as UserRole) && !isSelf) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await parentsRepository.update(id, input);
  }

  async deactivateParent(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can deactivate parents
    this.requireDaycareStaff(context);

    return await parentsRepository.deactivate(id);
  }

  private requireDaycareStaff(context: AppContext) {
    if (!context.user || !this.daycareStaffRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }
  }
}

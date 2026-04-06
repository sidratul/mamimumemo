import { ChildrenDaycareRepository } from "./children_daycare.repository.ts";
import { createChildrenDaycareInput, updateChildrenDaycareInput } from "./children_daycare.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const childrenDaycareRepository = new ChildrenDaycareRepository();

export class ChildrenDaycareService {
  private readonly daycareReadRoles = [
    UserRole.DAYCARE_ADMIN,
    UserRole.DAYCARE_OWNER,
    UserRole.SUPER_ADMIN,
    UserRole.DAYCARE_SITTER,
  ];

  private readonly daycareWriteRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];

  async getDaycareChildren(daycareId: string, active: boolean | undefined, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    this.requireReadAccess(context);

    return await childrenDaycareRepository.findByDaycareId(daycareId, active);
  }

  async getChildrenDaycare(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const child = await childrenDaycareRepository.findById(id);
    if (!child) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    this.requireReadAccess(context);

    return child;
  }

  async getChildByGlobalId(daycareId: string, globalChildId: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    this.requireReadAccess(context);

    return await childrenDaycareRepository.findByGlobalChildIdAndDaycare(daycareId, globalChildId);
  }

  async getParentChildren(daycareId: string, parentId: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    this.requireReadAccess(context);

    return await childrenDaycareRepository.findByParentIdAndDaycare(daycareId, parentId);
  }

  async createChildrenDaycare(
    input: typeof createChildrenDaycareInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can create children
    this.requireWriteAccess(context);

    // Check if child already exists for this daycare
    if (input.globalChildId) {
      const existingChild = await childrenDaycareRepository.findByGlobalChildIdAndDaycare(
        input.daycareId,
        input.globalChildId
      );

      if (existingChild && existingChild.active) {
        throw new GraphQLError("Child already exists for this daycare");
      }
    }

    const childData = {
      daycareId: input.daycareId,
      parentId: input.parentId,
      globalChildId: input.globalChildId,
      profile: input.profile,
      medical: input.medical || {},
      preferences: input.preferences || {},
      customData: input.customData || {},
    };

    return await childrenDaycareRepository.create(childData);
  }

  async updateChildrenDaycare(
    id: string,
    input: typeof updateChildrenDaycareInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const child = await childrenDaycareRepository.findById(id);
    if (!child) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Check permissions
    this.requireWriteAccess(context);

    return await childrenDaycareRepository.update(id, input);
  }

  async deactivateChildrenDaycare(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can deactivate children
    this.requireWriteAccess(context);

    return await childrenDaycareRepository.deactivate(id);
  }

  private requireReadAccess(context: AppContext) {
    if (!context.user || !this.daycareReadRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }
  }

  private requireWriteAccess(context: AppContext) {
    if (!context.user || !this.daycareWriteRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }
  }
}

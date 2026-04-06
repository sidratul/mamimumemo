import { ParentsService } from "./parents.service.ts";
import { createParentInput, updateParentInput } from "./parents.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const parentsService = new ParentsService();

export const resolvers = {
  Parent: {
    childrenIds: (parent: { childrenIds?: Array<{ id?: string; _id?: string } | string> }) => {
      return (parent.childrenIds || []).map((child) => {
        if (typeof child === "string") {
          return child;
        }

        return child.id || child._id || child;
      });
    },
  },
  ParentUser: {
    role: (parentUser: { role?: string }) => {
      if (!parentUser.role) {
        return "PARENT";
      }

      return parentUser.role.toUpperCase() === "PARENT" ? "PARENT" : parentUser.role;
    },
  },
  Query: {
    daycareParents: (
      _: unknown,
      { daycareId, active }: { daycareId: string; active?: boolean },
      context: AppContext
    ) => {
      return parentsService.getDaycareParents(daycareId, active, context);
    },
    parent: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return parentsService.getParent(id, context);
    },
    parentByUser: (
      _: unknown,
      { daycareId, userId }: { daycareId: string; userId: string },
      context: AppContext
    ) => {
      return parentsService.getParentByUser(daycareId, userId, context);
    },
  },
  Mutation: {
    createParent: (
      _: unknown,
      { input }: { input: typeof createParentInput._type },
      context: AppContext
    ) => {
      createParentInput.parse(input);
      return parentsService.createParent(input, context);
    },
    updateParent: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateParentInput._type },
      context: AppContext
    ) => {
      updateParentInput.parse(input);
      return parentsService.updateParent(id, input, context);
    },
    deactivateParent: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return parentsService.deactivateParent(id, context);
    },
  },
};

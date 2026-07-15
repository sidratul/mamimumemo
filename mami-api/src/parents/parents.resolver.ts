import { ParentsService } from "./parents.service.ts";
import {
  createParentAccountInput,
  createParentInput,
  updateParentAccountInput,
  updateParentInput,
} from "./parents.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const parentsService = new ParentsService();

type MongoRefValue = string | null | undefined | {
  _id?: unknown;
  id?: unknown;
  toHexString?: () => string;
};

function resolveObjectIdRef(value: MongoRefValue): unknown {
  if (!value || typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && typeof value.toHexString === "function") {
    return value;
  }

  if (typeof value === "object" && value._id) {
    return resolveObjectIdRef(value._id as MongoRefValue);
  }

  if (typeof value === "object" && typeof value.id === "string") {
    return value.id;
  }

  return value;
}

export const resolvers = {
  Parent: {
    childrenIds: (parent: { childrenIds?: MongoRefValue[] }) =>
      (parent.childrenIds || []).map(resolveObjectIdRef),
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
    createParentAccount: (
      _: unknown,
      { input }: { input: typeof createParentAccountInput._type },
      context: AppContext,
    ) => {
      createParentAccountInput.parse(input);
      return parentsService.createParentAccount(input, context);
    },
    updateParent: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateParentInput._type },
      context: AppContext
    ) => {
      updateParentInput.parse(input);
      return parentsService.updateParent(id, input, context);
    },
    updateParentAccount: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateParentAccountInput._type },
      context: AppContext,
    ) => {
      updateParentAccountInput.parse(input);
      return parentsService.updateParentAccount(id, input, context);
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

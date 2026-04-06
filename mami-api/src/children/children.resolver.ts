import { ChildrenService } from "./children.service.ts";
import { createChildInput, updateChildInput, addGuardianInput, removeGuardianInput } from "./children.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const childrenService = new ChildrenService();

export const resolvers = {
  Query: {
    myChildren: (_: unknown, __: unknown, context: AppContext) => {
      return childrenService.getMyChildren(context);
    },
    child: (_: unknown, { id }: { id: string }, context: AppContext) => {
      return childrenService.getChild(id, context);
    },
    childrenWhereIGuard: (_: unknown, __: unknown, context: AppContext) => {
      return childrenService.getChildrenWhereIGuard(context);
    },
  },
  Mutation: {
    createChild: (
      _: unknown,
      { input }: { input: typeof createChildInput._type },
      context: AppContext
    ) => {
      createChildInput.parse(input);
      return childrenService.createChild(input, context);
    },
    updateChild: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateChildInput._type },
      context: AppContext
    ) => {
      updateChildInput.parse(input);
      return childrenService.updateChild(id, input, context);
    },
    addGuardian: (
      _: unknown,
      { childId, input }: { childId: string; input: typeof addGuardianInput._type },
      context: AppContext
    ) => {
      addGuardianInput.parse(input);
      return childrenService.addGuardian(childId, input, context);
    },
    removeGuardian: (
      _: unknown,
      { childId, input }: { childId: string; input: typeof removeGuardianInput._type },
      context: AppContext
    ) => {
      removeGuardianInput.parse(input);
      return childrenService.removeGuardian(childId, input, context);
    },
  },
};

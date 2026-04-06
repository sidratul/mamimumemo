import { ChildrenDaycareService } from "./children_daycare.service.ts";
import { createChildrenDaycareInput, updateChildrenDaycareInput } from "./children_daycare.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const childrenDaycareService = new ChildrenDaycareService();

export const resolvers = {
  ChildrenDaycare: {
    parentId: (child: { parentId?: { id?: string; _id?: string } | string }) => {
      if (!child.parentId || typeof child.parentId === "string") {
        return child.parentId;
      }

      return child.parentId.id || child.parentId._id || child.parentId;
    },
    globalChildId: (child: { globalChildId?: { id?: string; _id?: string } | string | null }) => {
      if (!child.globalChildId || typeof child.globalChildId === "string") {
        return child.globalChildId;
      }

      return child.globalChildId.id || child.globalChildId._id || child.globalChildId;
    },
  },
  ChildProfile: {
    gender: (profile: { gender?: string }) => {
      if (!profile.gender) {
        return "MALE";
      }

      return profile.gender.toUpperCase();
    },
  },
  Query: {
    daycareChildren: (
      _: unknown,
      { daycareId, active }: { daycareId: string; active?: boolean },
      context: AppContext
    ) => {
      return childrenDaycareService.getDaycareChildren(daycareId, active, context);
    },
    childrenDaycare: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return childrenDaycareService.getChildrenDaycare(id, context);
    },
    childByGlobalId: (
      _: unknown,
      { daycareId, globalChildId }: { daycareId: string; globalChildId: string },
      context: AppContext
    ) => {
      return childrenDaycareService.getChildByGlobalId(daycareId, globalChildId, context);
    },
    parentChildren: (
      _: unknown,
      { daycareId, parentId }: { daycareId: string; parentId: string },
      context: AppContext
    ) => {
      return childrenDaycareService.getParentChildren(daycareId, parentId, context);
    },
  },
  Mutation: {
    createChildrenDaycare: (
      _: unknown,
      { input }: { input: typeof createChildrenDaycareInput._type },
      context: AppContext
    ) => {
      createChildrenDaycareInput.parse(input);
      return childrenDaycareService.createChildrenDaycare(input, context);
    },
    updateChildrenDaycare: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateChildrenDaycareInput._type },
      context: AppContext
    ) => {
      updateChildrenDaycareInput.parse(input);
      return childrenDaycareService.updateChildrenDaycare(id, input, context);
    },
    deactivateChildrenDaycare: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return childrenDaycareService.deactivateChildrenDaycare(id, context);
    },
  },
};

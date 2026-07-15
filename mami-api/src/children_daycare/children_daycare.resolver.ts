import { ChildrenDaycareService } from "./children_daycare.service.ts";
import { createChildrenDaycareInput, updateChildrenDaycareInput } from "./children_daycare.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const childrenDaycareService = new ChildrenDaycareService();

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
  ChildrenDaycare: {
    parentId: (child: { parentId?: MongoRefValue }) => resolveObjectIdRef(child.parentId),
    globalChildId: (child: { globalChildId?: MongoRefValue }) => resolveObjectIdRef(child.globalChildId),
  },
  ChildProfile: {
    gender: (profile: { gender?: string }) => {
      if (!profile.gender) {
        return "MALE";
      }

      return profile.gender.toUpperCase();
    },
  },
  ChildMedical: {
    allergies: (medical: { allergies?: string[] | null }) => medical.allergies ?? [],
    medications: (medical: { medications?: unknown[] | null }) => medical.medications ?? [],
  },
  ChildPreferences: {
    favoriteFoods: (preferences: { favoriteFoods?: string[] | null }) => preferences.favoriteFoods ?? [],
    favoriteActivities: (preferences: { favoriteActivities?: string[] | null }) => preferences.favoriteActivities ?? [],
    comfortItems: (preferences: { comfortItems?: string[] | null }) => preferences.comfortItems ?? [],
  },
  ChildCustomData: {
    strengths: (customData: { strengths?: string[] | null }) => customData.strengths ?? [],
    weaknesses: (customData: { weaknesses?: string[] | null }) => customData.weaknesses ?? [],
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
      const parsedInput = createChildrenDaycareInput.parse(input);
      return childrenDaycareService.createChildrenDaycare(parsedInput, context);
    },
    updateChildrenDaycare: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateChildrenDaycareInput._type },
      context: AppContext
    ) => {
      const parsedInput = updateChildrenDaycareInput.parse(input);
      return childrenDaycareService.updateChildrenDaycare(id, parsedInput, context);
    },
    deactivateChildrenDaycare: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return childrenDaycareService.deactivateChildrenDaycare(id, context);
    },
    purgeChildrenDaycare: (
      _: unknown,
      { id }: { id: string },
      context: AppContext,
    ) => {
      return childrenDaycareService.purgeChildrenDaycare(id, context);
    },
  },
};

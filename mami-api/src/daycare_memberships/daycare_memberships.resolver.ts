import { AppContext } from "#shared/config/context.ts";
import { AuthGuard } from "#shared/guards/auth.guard.ts";
import { ObjectId } from "#shared/types/objectid.type.ts";
import { getMongoProjection } from "#shared/graphql/projection.ts";
import { GraphQLResolveInfo } from "graphql";
import DaycareMembershipsService from "./daycare_memberships.service.ts";
import {
  addUserToDaycareInput,
  daycareMembershipsByDaycareInput,
  deactivateDaycareMembershipInput,
} from "./daycare_memberships.validation.ts";

const daycareMembershipsService = new DaycareMembershipsService();

export const resolvers = {
  Query: {
    daycareMemberships: async (
      _: unknown,
      { daycareId }: { daycareId: ObjectId },
      context: AppContext,
      info: GraphQLResolveInfo,
    ) => {
      await AuthGuard(context);
      daycareMembershipsByDaycareInput.parse({ daycareId });
      return daycareMembershipsService.listDaycareMemberships(daycareId, context, getMongoProjection(info));
    },
  },
  Mutation: {
    addUserToDaycare: async (
      _: unknown,
      { input }: { input: typeof addUserToDaycareInput._type },
      context: AppContext,
    ) => {
      await AuthGuard(context);
      addUserToDaycareInput.parse(input);
      return daycareMembershipsService.addUserToDaycare(input, context);
    },
    deactivateDaycareMembership: async (_: unknown, { id }: { id: ObjectId }, context: AppContext) => {
      await AuthGuard(context);
      deactivateDaycareMembershipInput.parse({ id });
      return daycareMembershipsService.deactivateDaycareMembership(id, context);
    },
  },
};

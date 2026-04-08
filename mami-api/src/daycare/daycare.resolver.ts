import { AppContext } from "#shared/config/context.ts";
import { AdminGuard, AuthGuard } from "#shared/guards/auth.guard.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { AuthorizationError } from "#shared/errors/custom-errors.ts";
import { ObjectId } from "#shared/types/objectid.type.ts";
import { getMongoProjection } from "#shared/graphql/projection.ts";
import { GraphQLResolveInfo } from "graphql";
import {
  deleteDaycareInput,
  purgeDaycareInput,
  registerDaycareInput,
  updateDaycareDocumentsInput,
  listDaycaresInput,
  daycareCountInput,
  updateDaycareApprovalInput,
} from "./daycare.validation.ts";
import { DaycareService } from "./daycare.service.ts";
import { DaycareFilter } from "./daycare.d.ts";
import { PaginationOptions, SortInput } from "#shared/index.ts";

const daycareService = new DaycareService();

export const resolvers = {
  Query: {
    daycares: async (
      _: unknown,
      args: {
        filter?: DaycareFilter;
        sort?: SortInput;
        pagination?: PaginationOptions;
      },
      context: AppContext,
      info: GraphQLResolveInfo,
    ) => {
      await AdminGuard(context);
      listDaycaresInput.parse(args);
      const options = {
        ...(args.filter ?? {}),
        ...(args.sort ? { sort: args.sort } : {}),
        ...(args.pagination ?? {}),
      };
      return daycareService.listDaycares(options, getMongoProjection(info));
    },
    daycareCount: async (
      _: unknown,
      args: { filter?: DaycareFilter },
      context: AppContext,
    ) => {
      await AdminGuard(context);
      daycareCountInput.parse(args);
      return daycareService.countDaycares(args.filter);
    },
    daycare: async (_: unknown, { id }: { id: ObjectId }, context: AppContext, info: GraphQLResolveInfo) => {
      await AdminGuard(context);
      return daycareService.getDaycare(id, getMongoProjection(info));
    },
    myDaycare: async (_: unknown, __: unknown, context: AppContext) => {
      await AuthGuard(context);
      return daycareService.getMyDaycare(context);
    },
  },
  Mutation: {
    registerDaycare: (
      _: unknown,
      { input }: { input: typeof registerDaycareInput._type },
      context: AppContext,
    ) => {
      registerDaycareInput.parse(input);
      return daycareService.registerDaycare(input, context);
    },
    updateDaycareDocuments: async (
      _: unknown,
      { id, input }: { id: ObjectId; input: typeof updateDaycareDocumentsInput._type },
      context: AppContext,
    ) => {
      await AuthGuard(context);
      updateDaycareDocumentsInput.parse(input);
      if (context.user?.role !== UserRole.SUPER_ADMIN && context.user?.daycareId?.toString() !== id.toString()) {
        throw new AuthorizationError();
      }
      return daycareService.updateDaycareDocuments(id, input);
    },
    updateDaycareApprovalStatus: async (
      _: unknown,
      { id, input }: { id: ObjectId; input: typeof updateDaycareApprovalInput._type },
      context: AppContext,
    ) => {
      await AdminGuard(context);
      updateDaycareApprovalInput.parse(input);
      return daycareService.updateDaycareApprovalStatus(id, input, context);
    },
    deleteDaycare: async (
      _: unknown,
      { id }: { id: ObjectId },
      context: AppContext,
    ) => {
      await AdminGuard(context);
      deleteDaycareInput.parse({ id });
      return daycareService.deleteDaycare(id, context);
    },
    purgeDaycare: async (
      _: unknown,
      {
        id,
        input,
      }: { id: ObjectId; input?: typeof purgeDaycareInput.shape.input._type },
      context: AppContext,
    ) => {
      await AdminGuard(context);
      purgeDaycareInput.parse({ id, input });
      return daycareService.purgeDaycare(id, input);
    },
  },
};

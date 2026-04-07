import { AppContext } from "#shared/config/context.ts";
import { Types } from "mongoose";
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
const normalizeObjectId = (value: Types.ObjectId) => value.toString();

export const resolvers = {
  Query: {
    daycares: (
      _: unknown,
      args: {
        filter?: DaycareFilter;
        sort?: SortInput;
        pagination?: PaginationOptions;
      },
      context: AppContext,
    ) => {
      listDaycaresInput.parse(args);
      const options = {
        ...(args.filter ?? {}),
        ...(args.sort ? { sort: args.sort } : {}),
        ...(args.pagination ?? {}),
      };
      return daycareService.listDaycares(options, context);
    },
    daycareCount: (
      _: unknown,
      args: { filter?: DaycareFilter },
      context: AppContext,
    ) => {
      daycareCountInput.parse(args);
      return daycareService.countDaycares(args.filter, context);
    },
    daycare: (_: unknown, { id }: { id: string }, context: AppContext) => {
      return daycareService.getDaycare(id, context);
    },
    myDaycareRegistration: (_: unknown, __: unknown, context: AppContext) => {
      return daycareService.getMyDaycareRegistration(context);
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
    updateDaycareDocuments: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateDaycareDocumentsInput._type },
      context: AppContext,
    ) => {
      updateDaycareDocumentsInput.parse(input);
      return daycareService.updateDaycareDocuments(id, input, context);
    },
    updateDaycareApprovalStatus: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateDaycareApprovalInput._type },
      context: AppContext,
    ) => {
      updateDaycareApprovalInput.parse(input);
      return daycareService.updateDaycareApprovalStatus(id, input, context);
    },
    deleteDaycare: (
      _: unknown,
      { id }: { id: Types.ObjectId },
      context: AppContext,
    ) => {
      deleteDaycareInput.parse({ id });
      return daycareService.deleteDaycare(normalizeObjectId(id), context);
    },
    purgeDaycare: (
      _: unknown,
      {
        id,
        input,
      }: { id: Types.ObjectId; input?: typeof purgeDaycareInput.shape.input._type },
      context: AppContext,
    ) => {
      purgeDaycareInput.parse({ id, input });
      return daycareService.purgeDaycare(normalizeObjectId(id), input, context);
    },
  },
};

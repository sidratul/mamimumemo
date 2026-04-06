import { AppContext } from "#shared/config/context.ts";
import {
  createDaycareDraftInput,
  listSystemDaycaresInput,
  updateDaycareApprovalInput,
} from "./daycare_admin.validation.ts";
import { DaycareAdminService } from "./daycare_admin.service.ts";

const daycareAdminService = new DaycareAdminService();

export const resolvers = {
  Query: {
    systemDaycares: (
      _: unknown,
      args: { status?: string; search?: string; limit?: number; offset?: number },
      context: AppContext,
    ) => {
      listSystemDaycaresInput.parse(args);
      return daycareAdminService.listSystemDaycares(args, context);
    },
    systemDaycare: (_: unknown, { id }: { id: string }, context: AppContext) => {
      return daycareAdminService.getSystemDaycare(id, context);
    },
    myDaycareRegistration: (_: unknown, __: unknown, context: AppContext) => {
      return daycareAdminService.getMyDaycareRegistration(context);
    },
  },
  Mutation: {
    createDaycareDraft: (
      _: unknown,
      { input }: { input: typeof createDaycareDraftInput._type },
      context: AppContext,
    ) => {
      createDaycareDraftInput.parse(input);
      return daycareAdminService.createDaycareDraft(input, context);
    },
    submitDaycareRegistration: (_: unknown, { id }: { id: string }, context: AppContext) => {
      return daycareAdminService.submitDaycareRegistration(id, context);
    },
    updateDaycareApprovalStatus: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateDaycareApprovalInput._type },
      context: AppContext,
    ) => {
      updateDaycareApprovalInput.parse(input);
      return daycareAdminService.updateDaycareApprovalStatus(id, input, context);
    },
  },
  Daycare: {
    approvalStatus: (daycare: { approval?: { status?: string } }) => daycare.approval?.status,
    approvalNote: (daycare: { approval?: { note?: string } }) => daycare.approval?.note || "",
    ownerName: (daycare: { owner: { name: string } }) => daycare.owner.name,
    ownerEmail: (daycare: { owner: { email: string } }) => daycare.owner.email,
  },
};

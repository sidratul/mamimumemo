import { StaffPaymentsService } from "./staff_payments.service.ts";
import {
  createStaffPaymentInput,
  updateStaffPaymentInput,
  markStaffPaymentAsPaidInput,
} from "./staff_payments.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const staffPaymentsService = new StaffPaymentsService();

export const resolvers = {
  Query: {
    daycareStaffPayments: (
      _: unknown,
      { daycareId, status }: { daycareId: string; status?: string },
      context: AppContext
    ) => {
      return staffPaymentsService.getDaycareStaffPayments(daycareId, status, context);
    },
    staffPayments: (
      _: unknown,
      { staffId, status }: { staffId: string; status?: string },
      context: AppContext
    ) => {
      return staffPaymentsService.getStaffPayments(staffId, status, context);
    },
    staffPayment: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return staffPaymentsService.getStaffPayment(id, context);
    },
    pendingStaffPayments: (
      _: unknown,
      { daycareId }: { daycareId: string },
      context: AppContext
    ) => {
      return staffPaymentsService.getPendingStaffPayments(daycareId, context);
    },
  },
  Mutation: {
    createStaffPayment: (
      _: unknown,
      { input }: { input: typeof createStaffPaymentInput._type },
      context: AppContext
    ) => {
      createStaffPaymentInput.parse(input);
      return staffPaymentsService.createStaffPayment(input, context);
    },
    updateStaffPayment: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateStaffPaymentInput._type },
      context: AppContext
    ) => {
      updateStaffPaymentInput.parse(input);
      return staffPaymentsService.updateStaffPayment(id, input, context);
    },
    markStaffPaymentAsPaid: (
      _: unknown,
      { id, input }: { id: string; input: typeof markStaffPaymentAsPaidInput._type },
      context: AppContext
    ) => {
      markStaffPaymentAsPaidInput.parse(input);
      return staffPaymentsService.markStaffPaymentAsPaid(id, input, context);
    },
    cancelStaffPayment: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return staffPaymentsService.cancelStaffPayment(id, context);
    },
  },
};

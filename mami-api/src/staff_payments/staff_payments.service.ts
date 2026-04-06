import { StaffPaymentsRepository } from "./staff_payments.repository.ts";
import {
  createStaffPaymentInput,
  updateStaffPaymentInput,
  markStaffPaymentAsPaidInput,
} from "./staff_payments.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const staffPaymentsRepository = new StaffPaymentsRepository();

export class StaffPaymentsService {
  async getDaycareStaffPayments(
    daycareId: string,
    status: string | undefined,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await staffPaymentsRepository.findByDaycareId(daycareId, status);
  }

  async getStaffPayments(
    staffId: string,
    status: string | undefined,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Allow if user is the staff member or daycare admin
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    const isStaff = context.user.id === staffId;
    
    if (!allowedRoles.includes(context.user.role as UserRole) && !isStaff) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await staffPaymentsRepository.findByStaffId(staffId, status);
  }

  async getStaffPayment(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const payment = await staffPaymentsRepository.findById(id);
    if (!payment) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return payment;
  }

  async getPendingStaffPayments(daycareId: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await staffPaymentsRepository.findPending(daycareId);
  }

  async createStaffPayment(
    input: typeof createStaffPaymentInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    // Validate dates
    if (new Date(input.period.end) <= new Date(input.period.start)) {
      throw new GraphQLError("Period end must be after start");
    }

    const paymentData = {
      ...input,
      period: {
        start: new Date(input.period.start),
        end: new Date(input.period.end),
      },
      deductions: input.deductions || [],
      status: "pending",
    };

    return await staffPaymentsRepository.create(paymentData);
  }

  async updateStaffPayment(
    id: string,
    input: typeof updateStaffPaymentInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const payment = await staffPaymentsRepository.findById(id);
    if (!payment) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    // Can't update paid or cancelled payments
    if (payment.status === "paid" || payment.status === "cancelled") {
      throw new GraphQLError("Cannot update paid or cancelled payment");
    }

    return await staffPaymentsRepository.update(id, input);
  }

  async markStaffPaymentAsPaid(
    id: string,
    input: typeof markStaffPaymentAsPaidInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const payment = await staffPaymentsRepository.findById(id);
    if (!payment) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    if (payment.status === "cancelled") {
      throw new GraphQLError("Cannot mark cancelled payment as paid");
    }

    return await staffPaymentsRepository.markAsPaid(id, input.paidAt ? new Date(input.paidAt) : undefined);
  }

  async cancelStaffPayment(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const payment = await staffPaymentsRepository.findById(id);
    if (!payment) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    if (payment.status === "paid") {
      throw new GraphQLError("Cannot cancel paid payment");
    }

    return await staffPaymentsRepository.cancel(id);
  }
}

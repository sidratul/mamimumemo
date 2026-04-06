import { InvoicesRepository } from "./invoices.repository.ts";
import {
  createInvoiceInput,
  updateInvoiceInput,
  markAsPaidInput,
} from "./invoices.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const invoicesRepository = new InvoicesRepository();

export class InvoicesService {
  async getDaycareInvoices(
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

    return await invoicesRepository.findByDaycareId(daycareId, status);
  }

  async getParentInvoices(
    parentId: string,
    status: string | undefined,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Allow if user is the parent or daycare staff
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    const isParent = context.user.id === parentId;
    
    if (!allowedRoles.includes(context.user.role as UserRole) && !isParent) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await invoicesRepository.findByParentId(parentId, status);
  }

  async getInvoice(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const invoice = await invoicesRepository.findById(id);
    if (!invoice) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return invoice;
  }

  async getOverdueInvoices(daycareId: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    // Update overdue status first
    await invoicesRepository.updateOverdueStatus();
    
    return await invoicesRepository.findOverdue(daycareId);
  }

  async createInvoice(
    input: typeof createInvoiceInput._type,
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

    if (new Date(input.dueDate) <= new Date(input.period.start)) {
      throw new GraphQLError("Due date must be after period start");
    }

    const invoiceData = {
      ...input,
      period: {
        start: new Date(input.period.start),
        end: new Date(input.period.end),
      },
      dueDate: new Date(input.dueDate),
      status: "pending",
    };

    return await invoicesRepository.create(invoiceData);
  }

  async updateInvoice(
    id: string,
    input: typeof updateInvoiceInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const invoice = await invoicesRepository.findById(id);
    if (!invoice) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    // Can't update paid or cancelled invoices
    if (invoice.status === "paid" || invoice.status === "cancelled") {
      throw new GraphQLError("Cannot update paid or cancelled invoice");
    }

    return await invoicesRepository.update(id, input);
  }

  async markInvoiceAsPaid(
    id: string,
    input: typeof markAsPaidInput._type,
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

    const invoice = await invoicesRepository.findById(id);
    if (!invoice) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    if (invoice.status === "cancelled") {
      throw new GraphQLError("Cannot mark cancelled invoice as paid");
    }

    return await invoicesRepository.markAsPaid(id, input.paidAt ? new Date(input.paidAt) : undefined);
  }

  async cancelInvoice(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const invoice = await invoicesRepository.findById(id);
    if (!invoice) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    if (invoice.status === "paid") {
      throw new GraphQLError("Cannot cancel paid invoice");
    }

    return await invoicesRepository.cancel(id);
  }
}

import { InvoicesService } from "./invoices.service.ts";
import {
  createInvoiceInput,
  updateInvoiceInput,
  markAsPaidInput,
} from "./invoices.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const invoicesService = new InvoicesService();

export const resolvers = {
  Query: {
    daycareInvoices: (
      _: unknown,
      { daycareId, status }: { daycareId: string; status?: string },
      context: AppContext
    ) => {
      return invoicesService.getDaycareInvoices(daycareId, status, context);
    },
    parentInvoices: (
      _: unknown,
      { parentId, status }: { parentId: string; status?: string },
      context: AppContext
    ) => {
      return invoicesService.getParentInvoices(parentId, status, context);
    },
    invoice: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return invoicesService.getInvoice(id, context);
    },
    overdueInvoices: (
      _: unknown,
      { daycareId }: { daycareId: string },
      context: AppContext
    ) => {
      return invoicesService.getOverdueInvoices(daycareId, context);
    },
  },
  Mutation: {
    createInvoice: (
      _: unknown,
      { input }: { input: typeof createInvoiceInput._type },
      context: AppContext
    ) => {
      createInvoiceInput.parse(input);
      return invoicesService.createInvoice(input, context);
    },
    updateInvoice: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateInvoiceInput._type },
      context: AppContext
    ) => {
      updateInvoiceInput.parse(input);
      return invoicesService.updateInvoice(id, input, context);
    },
    markInvoiceAsPaid: (
      _: unknown,
      { id, input }: { id: string; input: typeof markAsPaidInput._type },
      context: AppContext
    ) => {
      markAsPaidInput.parse(input);
      return invoicesService.markInvoiceAsPaid(id, input, context);
    },
    cancelInvoice: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return invoicesService.cancelInvoice(id, context);
    },
  },
};

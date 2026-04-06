import InvoiceModel from "./invoices.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class InvoicesRepository {
  async findByDaycareId(daycareId: string, status?: string) {
    const query: any = { daycareId };
    if (status) {
      query.status = status;
    }
    return await InvoiceModel.find(query)
      .populate("contractId")
      .exec();
  }

  async findByParentId(parentId: string, status?: string) {
    const query: any = { "parent.userId": parentId };
    if (status) {
      query.status = status;
    }
    return await InvoiceModel.find(query).exec();
  }

  async findById(id: string) {
    return await InvoiceModel.findById(id)
      .populate("contractId")
      .exec();
  }

  async findOverdue(daycareId: string) {
    const now = new Date();
    return await InvoiceModel.find({
      daycareId,
      status: "pending",
      dueDate: { $lt: now },
    }).exec();
  }

  async create(data: any) {
    const invoice = new InvoiceModel(data);
    return await invoice.save();
  }

  async update(id: string, data: any) {
    return await InvoiceModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async markAsPaid(id: string, paidAt?: Date) {
    return await InvoiceModel.findByIdAndUpdate(
      id,
      { 
        status: "paid",
        paidAt: paidAt || new Date(),
      },
      { new: true }
    ).exec();
  }

  async cancel(id: string) {
    return await InvoiceModel.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    ).exec();
  }

  async updateOverdueStatus() {
    const now = new Date();
    return await InvoiceModel.updateMany(
      {
        status: "pending",
        dueDate: { $lt: now },
      },
      { status: "overdue" }
    ).exec();
  }
}

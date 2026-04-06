import StaffPaymentModel from "./staff_payments.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class StaffPaymentsRepository {
  async findByDaycareId(daycareId: string, status?: string) {
    const query: any = { daycareId };
    if (status) {
      query.status = status;
    }
    return await StaffPaymentModel.find(query).exec();
  }

  async findByStaffId(staffId: string, status?: string) {
    const query: any = { "staff.userId": staffId };
    if (status) {
      query.status = status;
    }
    return await StaffPaymentModel.find(query).exec();
  }

  async findById(id: string) {
    return await StaffPaymentModel.findById(id).exec();
  }

  async findPending(daycareId: string) {
    return await StaffPaymentModel.find({
      daycareId,
      status: "pending",
    }).exec();
  }

  async create(data: any) {
    const payment = new StaffPaymentModel(data);
    return await payment.save();
  }

  async update(id: string, data: any) {
    return await StaffPaymentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async markAsPaid(id: string, paidAt?: Date) {
    return await StaffPaymentModel.findByIdAndUpdate(
      id,
      { 
        status: "paid",
        paidAt: paidAt || new Date(),
      },
      { new: true }
    ).exec();
  }

  async cancel(id: string) {
    return await StaffPaymentModel.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    ).exec();
  }
}

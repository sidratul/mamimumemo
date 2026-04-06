import { Types } from "mongoose";
import { InvoiceStatus } from "#shared/types/enums.ts";

export interface IInvoice {
  _id: Types.ObjectId;
  daycareId: Types.ObjectId;
  contractId: Types.ObjectId;
  parent: IParentRef;
  period: IInvoicePeriod;
  items: IInvoiceItem[];
  total: number;
  status: InvoiceStatus;
  dueDate: Date;
  paidAt?: Date;
  notes?: string;
  isOverdue: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IParentRef {
  userId?: Types.ObjectId;
  name: string;
  email: string;
}

export interface IInvoicePeriod {
  start: Date;
  end: Date;
}

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

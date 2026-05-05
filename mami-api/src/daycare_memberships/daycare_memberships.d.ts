import { HydratedDocument } from "mongoose";
import { ObjectId } from "#shared/index.ts";
import type { UserSubDoc } from "@/auth/auth.d.ts";
import { DaycareMembershipAccess, DaycareMembershipStatus } from "./daycare_memberships.enum.ts";

export type DaycareMembershipDaycareSubDoc = {
  _id: ObjectId;
  name: string;
};

export type DaycareMembershipDocShape = {
  user: UserSubDoc;
  daycare: DaycareMembershipDaycareSubDoc;
  access: DaycareMembershipAccess;
  status: DaycareMembershipStatus;
  joinedAt: Date;
  endedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DaycareMembershipRecord = DaycareMembershipDocShape & {
  _id: ObjectId;
};

export type DaycareMembershipDoc = HydratedDocument<DaycareMembershipDocShape>;

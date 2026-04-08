import { z } from "zod";
import { Types } from "mongoose";
import { DaycareMembershipPersona } from "./daycare_memberships.enum.ts";

const membershipPersonaEnum = z.nativeEnum(DaycareMembershipPersona);
const objectIdSchema = z.instanceof(Types.ObjectId);

export const daycareMembershipUserDataInput = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export const addUserToDaycareInput = z.object({
  daycareId: objectIdSchema,
  persona: membershipPersonaEnum,
  userId: objectIdSchema.optional(),
  userData: daycareMembershipUserDataInput.optional(),
  notes: z.string().optional(),
}).refine((value) => (value.userId ? 1 : 0) + (value.userData ? 1 : 0) === 1, {
  message: "Exactly one of userId or userData is required",
});

export const daycareMembershipsByDaycareInput = z.object({
  daycareId: objectIdSchema,
});

export const deactivateDaycareMembershipInput = z.object({
  id: objectIdSchema,
});

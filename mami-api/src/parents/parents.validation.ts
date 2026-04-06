import { z } from "zod";

export const emergencyContactInput = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  relation: z.string().min(1, "Relation is required"),
});

export const pickupAuthorizationInput = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  relation: z.string().min(1, "Relation is required"),
});

export const parentCustomDataInput = z.object({
  deskripsi: z.string().optional(),
  emergencyContact: emergencyContactInput.optional(),
  pickupAuthorization: z.array(pickupAuthorizationInput).optional(),
  notes: z.string().optional(),
});

export const parentUserInput = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  role: z.enum(["PARENT", "parent"]).transform((value) => value.toUpperCase() as "PARENT"),
});

export const createParentInput = z.object({
  daycareId: z.string(),
  user: parentUserInput,
  customData: parentCustomDataInput.optional(),
  childrenIds: z.array(z.string()).optional(),
});

export const updateParentInput = z.object({
  customData: parentCustomDataInput.optional(),
  childrenIds: z.array(z.string()).optional(),
  active: z.boolean().optional(),
});

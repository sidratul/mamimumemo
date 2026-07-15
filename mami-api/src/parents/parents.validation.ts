import { z } from "zod";

const objectIdString = z.preprocess(
  (value) =>
    value && typeof value === "object" && "toString" in value
      ? value.toString()
      : value,
  z.string(),
);

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
  userId: objectIdString,
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  role: z.enum(["PARENT", "parent"]).transform((value) => value.toUpperCase() as "PARENT"),
});

export const createParentInput = z.object({
  daycareId: objectIdString,
  user: parentUserInput,
  customData: parentCustomDataInput.optional(),
  childrenIds: z.array(objectIdString).optional(),
});

export const createParentAccountInput = z.object({
  daycareId: objectIdString,
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  notes: z.string().optional(),
});

export const updateParentInput = z.object({
  customData: parentCustomDataInput.optional(),
  childrenIds: z.array(objectIdString).optional(),
  active: z.boolean().optional(),
});

export const updateParentAccountInput = z.object({
  name: z.string().trim().min(1, "Name is required"),
  notes: z.string().nullable().optional(),
});

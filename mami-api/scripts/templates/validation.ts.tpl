import { z } from "zod";

export const create__NAME__Schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot be longer than 100 characters")
    .trim(),
});

export const update__NAME__Schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot be longer than 100 characters")
    .trim()
    .optional(),
});

export type Create__NAME__Input = z.infer<typeof create__NAME__Schema>;
export type Update__NAME__Input = z.infer<typeof update__NAME__Schema>;

import { z } from "zod";
import { objectIdString } from "#shared/validation/object-id.validation.ts";

export const uploadedByInput = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
});

export const createGalleryInput = z.object({
  daycareId: objectIdString,
  childName: z.string().optional(),
  photos: z.array(z.string().url("Must be a valid URL")),
  caption: z.string().optional(),
  date: z.string().or(z.date()),
  event: z.string().optional(),
});

export const updateGalleryInput = z.object({
  photos: z.array(z.string().url()).optional(),
  caption: z.string().optional(),
  event: z.string().optional(),
});

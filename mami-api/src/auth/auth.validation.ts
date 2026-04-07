import { z } from "zod";
import { UserRole } from "#shared/enums/enum.ts";

export const registerInput = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export const loginInput = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenInput = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

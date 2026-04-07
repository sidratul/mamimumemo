import { z } from "zod";

export const loginInput = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenInput = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

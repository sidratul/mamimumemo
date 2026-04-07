import { z } from "zod";
import { UserRole } from "#shared/enums/enum.ts";

const userRoleEnum = z.nativeEnum(UserRole);

export const createUserInput = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: userRoleEnum.optional(),
});

export const updateUserInput = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  role: userRoleEnum.optional(),
});

export const updateUserPasswordInput = z.object({
  currentPassword: z.string().min(1).optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const userFilterInput = z.object({
  search: z.string().optional(),
  roles: z.array(userRoleEnum).optional(),
});

export const userSortInput = z.object({
  sortBy: z.string().optional(),
  sortType: z.enum(["ASC", "DESC"]).optional(),
});

export const userPaginationInput = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export const listUsersInput = z.object({
  filter: userFilterInput.optional(),
  sort: userSortInput.optional(),
  pagination: userPaginationInput.optional(),
});

export const userCountInput = z.object({
  filter: userFilterInput.optional(),
});

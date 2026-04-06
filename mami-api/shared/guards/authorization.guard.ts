import { AppContext } from "#shared/config/context.ts";
import { AuthorizationError, AuthenticationError } from "#shared/errors/custom-errors.ts";
import { RoleType } from "#shared/enums/enum.ts";

/**
 * Checks if user is authenticated
 */
export function isAuthenticated(context: AppContext): boolean {
  if (!context.user) {
    throw new AuthenticationError();
  }
  return true;
}

/**
 * Checks if user has specific role
 */
export function hasRole(context: AppContext, roles: RoleType[]): boolean {
  isAuthenticated(context);
  if (!context.user || !roles.includes(context.user.role || "USER")) {
    throw new AuthorizationError();
  }
  return true;
}

/**
 * Higher-order function to create role-based authorization guard
 */
export function requireRole(roles: RoleType[]) {
  return (context: AppContext) => hasRole(context, roles);
}

/**
 * Owner check - verifies if the user is the owner of a resource
 */
export function isOwner(context: AppContext, ownerId: string): boolean {
  isAuthenticated(context);
  if (!context.user || context.user._id.toString() !== ownerId.toString()) {
    throw new AuthorizationError("You can only access your own resources");
  }
  return true;
}
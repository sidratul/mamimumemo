import { AppContext } from "#shared/config/context.ts";
import { AuthorizationError, AuthenticationError } from "#shared/errors/custom-errors.ts";
import { UserRole } from "#shared/enums/enum.ts";

/**
 * A sample guard function to check for an authenticated user.
 * In a real application, this would involve token verification.
 * @param context The GraphQL context, which should include the user.
 */
export const AuthGuard = (context: AppContext) => {
  if (!context.user) {
    throw new AuthenticationError("Authentication required. You must be logged in.");
  }
};

/**
 * A sample guard function to check if the user is an admin.
 * @param context The GraphQL context.
 */
export const AdminGuard = (context: AppContext) => {
  AuthGuard(context); // First, ensure the user is authenticated.
  if (context.user?.role !== UserRole.SUPER_ADMIN) {
    throw new AuthorizationError("Authorization failed. Admin role required.");
  }
};

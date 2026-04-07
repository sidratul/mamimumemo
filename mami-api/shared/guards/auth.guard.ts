import { AppContext } from "#shared/config/context.ts";

/**
 * A sample guard function to check for an authenticated user.
 * In a real application, this would involve token verification.
 * @param context The GraphQL context, which should include the user.
 */
export const AuthGuard = (context: AppContext) => {
  if (!context.user) {
    throw new Error("Authentication required. You must be logged in.");
  }
};

/**
 * A sample guard function to check if the user is an admin.
 * @param context The GraphQL context.
 */
export const AdminGuard = (context: AppContext) => {
  AuthGuard(context); // First, ensure the user is authenticated.
  if (context.user?.role !== "SUPER_ADMIN") {
    throw new Error("Authorization failed. Admin role required.");
  }
};

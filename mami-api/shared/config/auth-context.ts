import { verifyAccessToken } from "#shared/utils/jwt.ts";
import { YogaInitialContext } from "graphql-yoga";
import { Types } from "mongoose";
import { AuthDoc } from "@/auth/auth.d.ts";
import UsersService from "@/users/users.service.ts";

const usersService = new UsersService();

/**
 * Creates the application context for each GraphQL request with authentication.
 * This function handles JWT verification and user retrieval.
 */
export async function createAuthContext({ request }: YogaInitialContext) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  let user;

  if (token) {
    try {
      const payload = verifyAccessToken(token) as { _id?: string };
      const userId = payload._id && Types.ObjectId.isValid(payload._id)
        ? new Types.ObjectId(payload._id)
        : null;
      const userOrNull = userId ? await usersService.findUserById(userId) : null;
      // Hanya gunakan user jika ditemukan
      user = userOrNull || undefined;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("JWT verification failed:", error.message);
      } else {
        console.error("JWT verification failed:", error);
      }
    }
  }

  // Kembalikan user dengan tipe yang sesuai
  return { user: user as AuthDoc | undefined };
}

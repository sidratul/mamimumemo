import { verifyAccessToken } from "#shared/utils/jwt.ts";
import { YogaInitialContext } from "graphql-yoga";
import { Types } from "mongoose";
import { UserRole } from "#shared/enums/enum.ts";
import { AuthenticatedUser } from "#shared/config/context.ts";
import { DaycareRepository } from "@/daycare/daycare.repository.ts";
import UsersService from "@/users/users.service.ts";

const usersService = new UsersService();
const daycareRepository = new DaycareRepository();

/**
 * Creates the application context for each GraphQL request with authentication.
 * This function handles JWT verification and user retrieval.
 */
export async function createAuthContext({ request }: YogaInitialContext) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  let user: AuthenticatedUser | undefined;

  if (token) {
    try {
      const payload = verifyAccessToken(token) as { _id?: string };
      const userId = payload._id && Types.ObjectId.isValid(payload._id)
        ? new Types.ObjectId(payload._id)
        : null;
      const userOrNull = userId ? await usersService.findUserById(userId) : null;
      if (userOrNull) {
        const authenticatedUser = userOrNull as AuthenticatedUser;
        if (authenticatedUser.role === UserRole.DAYCARE_OWNER) {
          const daycareOrNull = await daycareRepository.findViewByOwnerId(authenticatedUser._id);
          authenticatedUser.daycareId = daycareOrNull?._id;
        }
        user = authenticatedUser;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("JWT verification failed:", error.message);
      } else {
        console.error("JWT verification failed:", error);
      }
    }
  }

  // Kembalikan user dengan tipe yang sesuai
  return { user };
}

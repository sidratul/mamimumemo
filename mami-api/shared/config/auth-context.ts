import { verifyAccessToken } from "#shared/utils/jwt.ts";
import { YogaInitialContext } from "graphql-yoga";
import { Types } from "mongoose";
import { AuthenticatedUser } from "#shared/config/context.ts";
import { UserRole } from "#shared/enums/enum.ts";
import DaycareMembershipsService from "@/daycare_memberships/daycare_memberships.service.ts";
import { DaycareMembershipAccess } from "@/daycare_memberships/daycare_memberships.enum.ts";
import UsersService from "@/users/users.service.ts";

const usersService = new UsersService();
const daycareMembershipsService = new DaycareMembershipsService();

function mapMembershipAccessToUserRole(access: DaycareMembershipAccess): UserRole {
  switch (access) {
    case DaycareMembershipAccess.OWNER:
      return UserRole.DAYCARE_OWNER;
    case DaycareMembershipAccess.ADMIN:
      return UserRole.DAYCARE_ADMIN;
    case DaycareMembershipAccess.SITTER:
      return UserRole.DAYCARE_SITTER;
  }
}

export async function getAuthenticatedUserFromRequest(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  let user: AuthenticatedUser | undefined;

  if (token) {
    try {
      const payload = verifyAccessToken(token) as {
        _id?: string;
        daycareId?: string;
        daycare?: {
          _id?: string;
          name?: string;
        };
        daycareMembership?: {
          _id?: string;
          access?: string;
          daycare?: {
            _id?: string;
            name?: string;
          };
        };
      };
      const userId = payload._id && Types.ObjectId.isValid(payload._id)
        ? new Types.ObjectId(payload._id)
        : null;
      const userOrNull = userId ? await usersService.findUserById(userId) : null;
      if (userOrNull) {
        const authenticatedUser = userOrNull as AuthenticatedUser;
        if (
          payload.daycareMembership?._id &&
          Types.ObjectId.isValid(payload.daycareMembership._id) &&
          payload.daycareMembership.daycare?._id &&
          Types.ObjectId.isValid(payload.daycareMembership.daycare._id)
        ) {
          authenticatedUser.daycareMembershipId = new Types.ObjectId(payload.daycareMembership._id);
          authenticatedUser.daycareAccess = payload.daycareMembership.access;
          if (
            authenticatedUser.role !== UserRole.SUPER_ADMIN &&
            payload.daycareMembership.access
          ) {
            authenticatedUser.role = mapMembershipAccessToUserRole(
              payload.daycareMembership.access as DaycareMembershipAccess,
            );
          }
          authenticatedUser.daycareId = new Types.ObjectId(payload.daycareMembership.daycare._id);
          authenticatedUser.daycare = {
            _id: authenticatedUser.daycareId,
            name: payload.daycareMembership.daycare.name || "",
          };
        } else if (payload.daycare?._id && Types.ObjectId.isValid(payload.daycare._id)) {
          authenticatedUser.daycareId = new Types.ObjectId(payload.daycare._id);
          authenticatedUser.daycare = {
            _id: authenticatedUser.daycareId,
            name: payload.daycare.name || "",
          };
        } else if (payload.daycareId && Types.ObjectId.isValid(payload.daycareId)) {
          authenticatedUser.daycareId = new Types.ObjectId(payload.daycareId);
        } else {
          const membershipOrNull = await daycareMembershipsService.getActiveMembershipByUserId(authenticatedUser._id);
          authenticatedUser.daycareMembershipId = membershipOrNull?._id;
          authenticatedUser.daycareAccess = membershipOrNull?.access;
          if (authenticatedUser.role !== UserRole.SUPER_ADMIN && membershipOrNull?.access) {
            authenticatedUser.role = mapMembershipAccessToUserRole(membershipOrNull.access);
          }
          authenticatedUser.daycareId = membershipOrNull?.daycare._id;
          if (membershipOrNull?.daycare._id) {
            authenticatedUser.daycare = {
              _id: membershipOrNull.daycare._id,
              name: membershipOrNull.daycare.name,
            };
          }
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

  return user;
}

/**
 * Creates the application context for each GraphQL request with authentication.
 * This function handles JWT verification and user retrieval.
 */
export async function createAuthContext({ request }: YogaInitialContext) {
  const user = await getAuthenticatedUserFromRequest(request);
  return { user };
}

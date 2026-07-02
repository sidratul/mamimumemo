import { loginInput, refreshTokenInput } from "./auth.validation.ts";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "#shared/utils/jwt.ts";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { SystemRole, UserRole } from "#shared/enums/enum.ts";
import UsersService from "@/users/users.service.ts";
import DaycareMembershipsService from "@/daycare_memberships/daycare_memberships.service.ts";
import { DaycareMembershipAccess } from "@/daycare_memberships/daycare_memberships.enum.ts";
import { ParentsRepository } from "@/parents/parents.repository.ts";

const usersService = new UsersService();
const daycareMembershipsService = new DaycareMembershipsService();
const parentsRepository = new ParentsRepository();

function mapMembershipAccessToUserRole(
  access: DaycareMembershipAccess,
): UserRole {
  switch (access) {
    case DaycareMembershipAccess.OWNER:
      return UserRole.DAYCARE_OWNER;
    case DaycareMembershipAccess.ADMIN:
      return UserRole.DAYCARE_ADMIN;
    case DaycareMembershipAccess.SITTER:
      return UserRole.DAYCARE_SITTER;
  }
}

export class AuthService {
  private async buildAccessTokenPayload(user: {
    _id: { toString(): string };
    email: string;
    systemRole?: string | null;
    name: string;
  }) {
    let daycareMembership:
      | {
        _id: string;
        access: string;
        daycare: {
          _id: string;
          name: string;
        };
      }
      | undefined;

    const membershipOrNull = await daycareMembershipsService
      .getActiveMembershipByUserId(
        new Types.ObjectId(user._id.toString()),
      );
    if (membershipOrNull) {
      daycareMembership = {
        _id: membershipOrNull._id.toString(),
        access: membershipOrNull.access,
        daycare: {
          _id: membershipOrNull.daycare._id.toString(),
          name: membershipOrNull.daycare.name,
        },
      };
    }

    const isParent = await parentsRepository.existsActiveByUserId(
      user._id.toString(),
    );
    const effectiveRole = user.systemRole === SystemRole.SUPER_ADMIN
      ? UserRole.SUPER_ADMIN
      : daycareMembership
      ? mapMembershipAccessToUserRole(
        daycareMembership.access as DaycareMembershipAccess,
      )
      : isParent
      ? UserRole.PARENT
      : undefined;

    return {
      _id: user._id.toString(),
      email: user.email,
      systemRole: user.systemRole ?? null,
      role: effectiveRole,
      name: user.name,
      daycareMembership,
    };
  }

  async login(input: typeof loginInput._type) {
    console.log(`[Auth] Attempting login for email: ${input.email}`);
    loginInput.parse(input);
    const userOrNull = await usersService.findUserByEmail(input.email);

    if (!userOrNull) {
      console.error(
        `[Auth] Login failed: User with email ${input.email} not found.`,
      );
      throw new GraphQLError(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    console.log(
      `[Auth] User found: ${userOrNull.name} (System role: ${
        userOrNull.systemRole || "none"
      })`,
    );

    const isPasswordValid = await bcrypt.compare(
      input.password,
      userOrNull.password,
    );
    if (!isPasswordValid) {
      console.error(
        `[Auth] Login failed: Password mismatch for user ${input.email}.`,
      );
      console.log(
        `[Auth] Debug - Input password length: ${input.password.length}`,
      );
      console.log(
        `[Auth] Debug - Stored hash prefix: ${
          userOrNull.password.substring(0, 7)
        }...`,
      );
      throw new GraphQLError(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    console.log(
      `[Auth] Login successful for ${input.email}. Building token...`,
    );
    const tokenPayload = await this.buildAccessTokenPayload(userOrNull);
    const accessToken = createAccessToken(tokenPayload);
    const refreshToken = createRefreshToken({
      _id: userOrNull._id.toString(),
      tokenType: "refresh",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(input: typeof refreshTokenInput._type) {
    refreshTokenInput.parse(input);
    let payload: string | { _id?: string; tokenType?: string };

    try {
      payload = verifyRefreshToken(input.refreshToken) as {
        _id?: string;
        tokenType?: string;
      };
    } catch {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (
      typeof payload === "string" || !payload._id ||
      payload.tokenType !== "refresh"
    ) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(payload._id)) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const userOrNull = await usersService.findUserById(
      new Types.ObjectId(payload._id),
    );
    if (!userOrNull) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return {
      accessToken: createAccessToken(
        await this.buildAccessTokenPayload(userOrNull),
      ),
      refreshToken: createRefreshToken({
        _id: userOrNull._id.toString(),
        tokenType: "refresh",
      }),
    };
  }

  getProfile(context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Return user profile without sensitive information, and always expose `_id`
    const userObject = context.user.toObject();
    const { password: _password, _id, id, ...profile } = userObject as {
      password?: string;
      _id?: { toString(): string } | string;
      id?: string;
      name: string;
      email: string;
      phone?: string;
      systemRole?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      _id: _id
        ? _id.toString()
        : context.user._id?.toString?.() || context.user.id || id,
      ...profile,
    };
  }
}

export default AuthService;

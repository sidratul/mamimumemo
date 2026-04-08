import { loginInput, refreshTokenInput } from "./auth.validation.ts";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "#shared/utils/jwt.ts";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";
import UsersService from "@/users/users.service.ts";
import DaycareMembershipsService from "@/daycare_memberships/daycare_memberships.service.ts";
import { DaycareMembershipPersona } from "@/daycare_memberships/daycare_memberships.enum.ts";

const usersService = new UsersService();
const daycareMembershipsService = new DaycareMembershipsService();

function mapMembershipPersonaToUserRole(persona: DaycareMembershipPersona): UserRole {
  switch (persona) {
    case DaycareMembershipPersona.OWNER:
      return UserRole.DAYCARE_OWNER;
    case DaycareMembershipPersona.ADMIN:
      return UserRole.DAYCARE_ADMIN;
    case DaycareMembershipPersona.SITTER:
      return UserRole.DAYCARE_SITTER;
  }
}

export class AuthService {
  private async buildAccessTokenPayload(user: {
    _id: { toString(): string };
    email: string;
    role?: string;
    name: string;
  }) {
    let daycareMembership:
      | {
        _id: string;
        persona: string;
        daycare: {
          _id: string;
          name: string;
        };
      }
      | undefined;

    const membershipOrNull = await daycareMembershipsService.getActiveMembershipByUserId(
      new Types.ObjectId(user._id.toString()),
    );
    if (membershipOrNull) {
      daycareMembership = {
        _id: membershipOrNull._id.toString(),
        persona: membershipOrNull.persona,
        daycare: {
          _id: membershipOrNull.daycare._id.toString(),
          name: membershipOrNull.daycare.name,
        },
      };
    }

    const effectiveRole = user.role === UserRole.SUPER_ADMIN
      ? user.role
      : daycareMembership
      ? mapMembershipPersonaToUserRole(daycareMembership.persona as DaycareMembershipPersona)
      : user.role;

    return {
      _id: user._id.toString(),
      email: user.email,
      role: effectiveRole,
      name: user.name,
      daycareMembership,
    };
  }

  async login(input: typeof loginInput._type) {
    loginInput.parse(input);
    const userOrNull = await usersService.findUserByEmail(input.email);
    if (!userOrNull) {
      throw new GraphQLError(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(input.password, userOrNull.password);
    if (!isPasswordValid) {
      throw new GraphQLError(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

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
      payload = verifyRefreshToken(input.refreshToken) as { _id?: string; tokenType?: string };
    } catch {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (typeof payload === "string" || !payload._id || payload.tokenType !== "refresh") {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(payload._id)) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const userOrNull = await usersService.findUserById(new Types.ObjectId(payload._id));
    if (!userOrNull) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return {
      accessToken: createAccessToken(await this.buildAccessTokenPayload(userOrNull)),
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
      role?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      _id: (_id ? _id.toString() : context.user._id?.toString?.() || context.user.id || id),
      ...profile,
      role: profile.role,
    };
  }
}

export default AuthService;

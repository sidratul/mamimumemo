import { loginInput, refreshTokenInput } from "./auth.validation.ts";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "#shared/utils/jwt.ts";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import UsersService from "@/users/users.service.ts";

const usersService = new UsersService();

export class AuthService {
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

    const tokenPayload = {
      _id: userOrNull._id.toString(),
      email: userOrNull.email,
      role: userOrNull.role,
      name: userOrNull.name,
    };
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
      accessToken: createAccessToken({
        _id: userOrNull._id.toString(),
        email: userOrNull.email,
        role: userOrNull.role,
        name: userOrNull.name,
      }),
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

import AuthModel from "./auth.schema.ts";
import { registerInput, loginInput, refreshTokenInput } from "./auth.validation.ts";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "#shared/utils/jwt.ts";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class AuthService {
  async register(input: typeof registerInput._type) {
    const existingUserOrNull = await AuthModel.findOne({ email: input.email }).exec();
    if (existingUserOrNull) {
      throw new GraphQLError(MESSAGES.AUTH.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10); // 10 is the salt rounds
    const user = new AuthModel({
      ...input,
      password: hashedPassword,
      role: input.role || UserRole.PARENT, // Default role is PARENT
    });
    await user.save();

    return {
      id: user.id,
      message: MESSAGES.AUTH.REGISTER_SUCCESS,
    };
  }

  async login(input: typeof loginInput._type) {
    const userOrNull = await AuthModel.findOne({ email: input.email }).exec();
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
    let payload: string | { _id?: string; tokenType?: string };

    try {
      payload = verifyRefreshToken(input.refreshToken) as { _id?: string; tokenType?: string };
    } catch {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (typeof payload === "string" || !payload._id || payload.tokenType !== "refresh") {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const userOrNull = await AuthModel.findById(payload._id).exec();
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
    };
  }
}

export default AuthService;

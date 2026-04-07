import { AuthService } from "./auth.service.ts";
import { loginInput, refreshTokenInput } from "./auth.validation.ts";
import { AppContext } from "#shared/config/context.ts";
import { AuthGuard } from "#shared/guards/auth.guard.ts";

const authService = new AuthService();

export const resolvers = {
  Query: {
    profile: async (_: unknown, __: unknown, context: AppContext) => {
      await AuthGuard(context);
      return authService.getProfile(context);
    },
  },
  Mutation: {
    login: (_: unknown, { input }: { input: typeof loginInput._type }) => {
      loginInput.parse(input);
      return authService.login(input);
    },
    refreshToken: (_: unknown, { input }: { input: typeof refreshTokenInput._type }) => {
      refreshTokenInput.parse(input);
      return authService.refreshToken(input);
    },
  },
};

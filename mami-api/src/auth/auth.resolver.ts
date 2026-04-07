import { AuthService } from "./auth.service.ts";
import { loginInput, refreshTokenInput } from "./auth.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const authService = new AuthService();

export const resolvers = {
  Query: {
    profile: (_: unknown, __: unknown, context: AppContext) => {
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

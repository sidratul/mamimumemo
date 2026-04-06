import { AuthService } from "./auth.service.ts";
import { registerInput, loginInput, refreshTokenInput } from "./auth.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const authService = new AuthService();

export const resolvers = {
  Query: {
    profile: (_: unknown, __: unknown, context: AppContext) => {
      return authService.getProfile(context);
    },
  },
  Mutation: {
    register: (_: unknown, { input }: { input: typeof registerInput._type }) => {
      registerInput.parse(input);
      return authService.register(input);
    },
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

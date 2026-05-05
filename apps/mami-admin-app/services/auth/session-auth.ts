import { createRefreshSessionHandler } from '@mami/graphql';

import { env } from '../../config/env';
import { clearSessionToken, getRefreshToken, setSessionToken } from '../storage/session';

export const refreshAdminSession = createRefreshSessionHandler({
  graphqlUrl: env.graphqlUrl,
  session: {
    getAccessToken: async () => null,
    getRefreshToken,
    setTokens: async (tokens) => {
      await setSessionToken(tokens.accessToken, tokens.refreshToken);
    },
    clearSession: clearSessionToken,
  },
});

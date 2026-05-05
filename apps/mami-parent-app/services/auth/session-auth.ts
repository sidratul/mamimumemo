import { createRefreshSessionHandler } from '@mami/graphql';

import { env } from '../../config/env';
import { clearSession, getRefreshToken, updateSessionTokens } from '../storage/session';

export const refreshParentSession = createRefreshSessionHandler({
  graphqlUrl: env.graphqlUrl,
  session: {
    getAccessToken: async () => null,
    getRefreshToken,
    setTokens: async (tokens) => {
      await updateSessionTokens(tokens.accessToken, tokens.refreshToken);
    },
    clearSession,
  },
});

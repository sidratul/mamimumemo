import { createRefreshSessionHandler } from '@mami/graphql';

import { env } from '../../config/env';
import { clearDaycareSession, getDaycareSession, updateDaycareSessionTokens } from '../storage/session';

export const refreshDaycareSession = createRefreshSessionHandler({
  graphqlUrl: env.graphqlUrl,
  session: {
    getAccessToken: async () => null,
    getRefreshToken: async () => (await getDaycareSession())?.refreshToken ?? null,
    setTokens: async (tokens) => {
      await updateDaycareSessionTokens(tokens.accessToken, tokens.refreshToken);
    },
    clearSession: clearDaycareSession,
  },
});

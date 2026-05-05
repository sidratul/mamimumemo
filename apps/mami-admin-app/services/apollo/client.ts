import { createApolloGraphqlClient } from '@mami/graphql';

import { env } from '../../config/env';
import { clearSessionToken, getSessionToken } from '../storage/session';
import { refreshAdminSession } from '../auth/session-auth';
export const apolloClient = createApolloGraphqlClient({
  graphqlUrl: env.graphqlUrl,
  session: {
    getAccessToken: getSessionToken,
    clearSession: clearSessionToken,
  },
  refreshSession: refreshAdminSession,
  onUnauthorized: async () => {
    await clearSessionToken();
  },
  onOperationError: (payload) => {
    console.error('[Apollo] GraphQL operation failed', payload);
  },
});

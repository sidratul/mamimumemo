import { createApolloGraphqlClient } from '@mami/graphql';

import { env } from '../../config/env';
import { clearSessionToken, getSessionToken } from '../../shared/storage';
import { refreshAdminSession } from '../auth';

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
  // @ts-ignore - graphql helper might not have this in type but Apollo does
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    }
  },
});

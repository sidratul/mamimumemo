import { createGraphqlRequester } from '@mami/graphql';

import { env } from '../../config/env';
import { clearDaycareSession } from '../storage/session';
import { refreshDaycareSession } from '../auth/session-auth';
import { getDaycareSession } from '../storage/session';

export const graphqlRequest = createGraphqlRequester({
  graphqlUrl: env.graphqlUrl,
  session: {
    getAccessToken: async () => (await getDaycareSession())?.token ?? null,
    clearSession: clearDaycareSession,
  },
  refreshSession: refreshDaycareSession,
  onUnauthorized: async () => {
    await clearDaycareSession();
  },
});

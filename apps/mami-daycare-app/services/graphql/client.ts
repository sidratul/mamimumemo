import { createGraphqlRequester } from '@mami/graphql';

import { refreshDaycareSession } from '../auth/session-auth';
import { clearDaycareSession, getDaycareSession } from '../storage/session';
import { getConfiguredGraphqlUrl } from '../app-config';

export const graphqlRequest = createGraphqlRequester({
  graphqlUrl: getConfiguredGraphqlUrl,
  session: {
    getAccessToken: async () => (await getDaycareSession())?.token ?? null,
    clearSession: clearDaycareSession,
  },
  refreshSession: refreshDaycareSession,
  onUnauthorized: async () => {
    await clearDaycareSession();
  },
});

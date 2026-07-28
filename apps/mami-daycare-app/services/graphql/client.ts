import { createGraphqlRequester } from '@mami/graphql';

import { refreshDaycareSession } from '../auth/session-auth';
import { clearDaycareSession, getDaycareSession } from '../storage/session';
import { getConfiguredGraphqlUrl } from '../app-config';
import { normalizeObjectId } from '../operations/object-id';

function sanitizeGraphqlVariables<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeGraphqlVariables(item)) as T;
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const entries = Object.entries(value as Record<string, unknown>).map(([key, currentValue]) => {
    if ((key === 'daycareId' || key === 'parentId' || key === 'childId' || key === 'masterActivityId' || key === 'categoryId' || key === 'id') && typeof currentValue !== 'string') {
      return [key, normalizeObjectId(currentValue)];
    }

    return [key, sanitizeGraphqlVariables(currentValue)];
  });

  return Object.fromEntries(entries) as T;
}

const rawGraphqlRequest = createGraphqlRequester({
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

export async function graphqlRequest<
  TResponse,
  TVariables extends Record<string, unknown> | undefined = Record<string, unknown>,
>(
  query: string,
  variables?: TVariables,
  token?: string,
) {
  return await rawGraphqlRequest<TResponse, TVariables>(
    query,
    variables ? sanitizeGraphqlVariables(variables) : variables,
    token,
  );
}

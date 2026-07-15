import type { SessionStorageAdapter, UnauthorizedHandler } from './types';

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

async function performGraphqlFetch<TData>(
  graphqlUrl: string,
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
) {
  return fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
}

type GraphqlUrlResolver = string | (() => string | Promise<string>);

async function resolveGraphqlUrl(graphqlUrl: GraphqlUrlResolver) {
  const resolved = typeof graphqlUrl === 'function' ? await graphqlUrl() : graphqlUrl;

  if (!resolved) {
    throw new Error('URL GraphQL belum dikonfigurasi.');
  }

  return resolved;
}

export function createGraphqlRequester({
  graphqlUrl,
  session,
  refreshSession,
  onUnauthorized,
}: {
  graphqlUrl: GraphqlUrlResolver;
  session: Pick<SessionStorageAdapter, 'getAccessToken' | 'clearSession'>;
  refreshSession: () => Promise<{ accessToken: string } | null>;
  onUnauthorized?: UnauthorizedHandler;
}) {
  return async function graphqlRequest<TData, TVariables extends Record<string, unknown> | undefined = undefined>(
    query: string,
    variables?: TVariables,
    tokenOverride?: string,
  ) {
    const requestUrl = await resolveGraphqlUrl(graphqlUrl);
    const accessToken = tokenOverride ?? (await session.getAccessToken()) ?? undefined;
    let response = await performGraphqlFetch<TData>(requestUrl, query, variables, accessToken ?? undefined);

    if (response.status === 401) {
      const nextTokens = await refreshSession();

      if (!nextTokens?.accessToken) {
        await session.clearSession();
        await onUnauthorized?.();
        throw new Error('Sesi berakhir. Silakan masuk lagi.');
      }

      response = await performGraphqlFetch<TData>(requestUrl, query, variables, nextTokens.accessToken);

      if (response.status === 401) {
        await session.clearSession();
        await onUnauthorized?.();
        throw new Error('Sesi berakhir. Silakan masuk lagi.');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} saat menghubungi GraphQL API.`);
    }

    const payload = (await response.json()) as GraphQLResponse<TData>;

    if (payload.errors?.length) {
      throw new Error(payload.errors[0]?.message || 'GraphQL request gagal.');
    }

    if (!payload.data) {
      throw new Error('GraphQL response kosong.');
    }

    return payload.data;
  };
}

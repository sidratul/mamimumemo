import { env } from '../../config/env';
import { clearDaycareSession } from '../storage/session';
import { refreshDaycareSession } from '../auth/session-auth';

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

async function performGraphqlFetch<TData>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string
) {
  const response = await fetch(env.graphqlUrl, {
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

  return response;
}

export async function graphqlRequest<TData, TVariables extends Record<string, unknown> | undefined = undefined>(
  query: string,
  variables?: TVariables,
  token?: string
) {
  let response = await performGraphqlFetch<TData>(query, variables, token);

  if (response.status === 401 && token) {
    const nextTokens = await refreshDaycareSession();

    if (!nextTokens?.accessToken) {
      await clearDaycareSession();
      throw new Error('Sesi berakhir. Silakan masuk lagi.');
    }

    response = await performGraphqlFetch<TData>(query, variables, nextTokens.accessToken);

    if (response.status === 401) {
      await clearDaycareSession();
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
}

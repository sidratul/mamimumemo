import type { SessionStorageAdapter, SessionTokens, UnauthorizedHandler } from './types';

type GraphQLPayload<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

type RefreshMutationResponse = {
  refreshToken: SessionTokens;
};

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export function createRefreshSessionHandler({
  graphqlUrl,
  session,
  onUnauthorized,
}: {
  graphqlUrl: string;
  session: SessionStorageAdapter;
  onUnauthorized?: UnauthorizedHandler;
}) {
  let refreshPromise: Promise<SessionTokens | null> | null = null;

  return async function refreshSession(): Promise<SessionTokens | null> {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshToken = await session.getRefreshToken();
        if (!refreshToken) {
          await session.clearSession();
          await onUnauthorized?.();
          return null;
        }

        try {
          const response = await fetch(graphqlUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: REFRESH_TOKEN_MUTATION,
              variables: {
                input: {
                  refreshToken,
                },
              },
            }),
          });

          if (!response.ok) {
            await session.clearSession();
            await onUnauthorized?.();
            return null;
          }

          const payload = (await response.json()) as GraphQLPayload<RefreshMutationResponse>;
          const nextTokens = payload.data?.refreshToken;

          if (payload.errors?.length || !nextTokens?.accessToken || !nextTokens.refreshToken) {
            await session.clearSession();
            await onUnauthorized?.();
            return null;
          }

          await session.setTokens(nextTokens);
          return nextTokens;
        } catch {
          await session.clearSession();
          await onUnauthorized?.();
          return null;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    return refreshPromise;
  };
}

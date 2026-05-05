import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { Observable } from '@apollo/client/utilities';
import type { ErrorResponse } from '@apollo/client/link/error';

import type { SessionStorageAdapter, UnauthorizedHandler } from './types';

export function createApolloGraphqlClient({
  graphqlUrl,
  session,
  refreshSession,
  onUnauthorized,
  onOperationError,
}: {
  graphqlUrl: string;
  session: Pick<SessionStorageAdapter, 'getAccessToken' | 'clearSession'>;
  refreshSession: () => Promise<{ accessToken: string } | null>;
  onUnauthorized?: UnauthorizedHandler;
  onOperationError?: (payload: {
    operationName: string;
    variables: Record<string, unknown> | undefined;
    graphQLErrors?: Array<{ message: string; path?: readonly (string | number)[]; code?: string }>;
    networkError?: { name: string; message: string; statusCode?: number };
    response?: unknown;
  }) => void;
}) {
  const authLink = setContext(async (_, prevContext) => {
    const accessToken = await session.getAccessToken();

    return {
      headers: {
        ...(prevContext.headers ?? {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward, response }: ErrorResponse) => {
    const hasUnauthorizedGraphqlError = Boolean(
      graphQLErrors?.some((item) => item.extensions?.code === 'UNAUTHENTICATED')
    );

    const statusCode =
      networkError && typeof networkError === 'object' && 'statusCode' in networkError
        ? Number((networkError as { statusCode?: number }).statusCode)
        : undefined;

    if (graphQLErrors?.length || statusCode) {
      onOperationError?.({
        operationName: operation.operationName,
        variables: operation.variables as Record<string, unknown> | undefined,
        graphQLErrors: graphQLErrors?.map((item) => ({
          message: item.message,
          path: item.path,
          code: typeof item.extensions?.code === 'string' ? item.extensions.code : undefined,
        })),
        networkError: networkError
          ? {
              name: networkError.name,
              message: networkError.message,
              statusCode,
            }
          : undefined,
        response,
      });
    }

    if (hasUnauthorizedGraphqlError || statusCode === 401) {
      const alreadyRetried = Boolean(operation.getContext().alreadyRetried);
      if (alreadyRetried) {
        void session.clearSession();
        void onUnauthorized?.();
        return;
      }

      return new Observable((observer) => {
        void refreshSession()
          .then((tokens) => {
            if (!tokens?.accessToken) {
              void session.clearSession();
              void onUnauthorized?.();
              observer.error(new Error('Sesi berakhir. Silakan masuk lagi.'));
              return;
            }

            operation.setContext({
              alreadyRetried: true,
              headers: {
                ...(operation.getContext().headers ?? {}),
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });

            const subscription = forward(operation).subscribe(observer);
            return () => subscription.unsubscribe();
          })
          .catch((refreshError) => {
            void session.clearSession();
            void onUnauthorized?.();
            observer.error(refreshError);
          });
      });
    }

    return undefined;
  });

  const httpLink = new HttpLink({
    uri: graphqlUrl,
  });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
      mutate: {
        fetchPolicy: 'no-cache',
      },
    },
  });
}

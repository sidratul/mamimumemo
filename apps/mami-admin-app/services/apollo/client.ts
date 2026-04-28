import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import { env } from '../../config/env';
import { clearSessionToken, getSessionToken } from '../storage/session';
import { refreshAdminSession } from '../auth/session-auth';

async function authenticatedFetch(uri: RequestInfo | URL, options?: RequestInit) {
  let response: Response;

  try {
    response = await fetch(uri, options);
  } catch (error) {
    console.error('[Apollo:fetch] network request failed', {
      uri: String(uri),
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  if (response.status !== 401) {
    if (!response.ok) {
      console.error('[Apollo:fetch] non-OK response', {
        uri: String(uri),
        status: response.status,
        statusText: response.statusText,
      });
    }
    return response;
  }

  const nextTokens = await refreshAdminSession();
  if (!nextTokens?.accessToken) {
    await clearSessionToken();
    return response;
  }

  const retryHeaders = new Headers(options?.headers);
  retryHeaders.set('Authorization', `Bearer ${nextTokens.accessToken}`);

  const retriedResponse = await fetch(uri, {
    ...options,
    headers: retryHeaders,
  });

  if (retriedResponse.status === 401) {
    await clearSessionToken();
  }

  return retriedResponse;
}

const httpLink = new HttpLink({
  uri: env.graphqlUrl,
  fetch: authenticatedFetch,
});

const authLink = setContext(async (_, context) => {
  const token = await getSessionToken();

  return {
    headers: {
      ...context.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ operation, graphQLErrors, networkError, response }) => {
  if (!graphQLErrors?.length && !networkError) {
    return;
  }

  console.error('[Apollo] GraphQL operation failed', {
    operationName: operation.operationName,
    variables: operation.variables,
    graphQLErrors: graphQLErrors?.map((item) => ({
      message: item.message,
      path: item.path,
      code: item.extensions?.code,
    })),
    networkError: networkError
      ? {
          name: networkError.name,
          message: networkError.message,
          statusCode: 'statusCode' in networkError ? (networkError as { statusCode?: number }).statusCode : undefined,
        }
      : undefined,
    response,
  });
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
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

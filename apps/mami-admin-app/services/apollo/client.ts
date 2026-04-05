import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { env } from '../../config/env';
import { clearSessionToken, getSessionToken } from '../storage/session';
import { refreshAdminSession } from '../auth/session-auth';

async function authenticatedFetch(uri: RequestInfo | URL, options?: RequestInit) {
  const response = await fetch(uri, options);

  if (response.status !== 401) {
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

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

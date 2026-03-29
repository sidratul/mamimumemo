import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { env } from '../../config/env';
import { getSessionToken } from '../storage/session';

const httpLink = new HttpLink({
  uri: env.graphqlUrl,
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

import type { ApolloClient } from '@apollo/client';

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export type SessionStorageAdapter = {
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  setTokens: (tokens: SessionTokens) => Promise<void>;
  clearSession: () => Promise<void>;
};

export type UnauthorizedHandler = () => void | Promise<void>;

export type ApolloClientFactoryResult = {
  apolloClient: ApolloClient<unknown>;
};

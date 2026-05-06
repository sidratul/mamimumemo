import { createRefreshSessionHandler } from '@mami/graphql';
import { env } from '../config/env';
import { clearSessionToken, getRefreshToken, setSessionToken } from '../shared/storage';

export const refreshAdminSession = createRefreshSessionHandler({
  graphqlUrl: env.graphqlUrl,
  session: {
    getAccessToken: async () => null,
    getRefreshToken,
    setTokens: async (tokens) => {
      await setSessionToken(tokens.accessToken, tokens.refreshToken);
    },
    clearSession: clearSessionToken,
  },
});

type LoginResult = {
  accessToken: string;
  refreshToken: string;
  profile: { _id: string; name: string; email: string; role: string; };
};

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) { accessToken refreshToken }
  }
`;

const PROFILE_QUERY = `
  query GetProfile {
    profile { _id name email role }
  }
`;

async function requestGQL<T>(query: string, vars?: any, token?: string) {
  const res = await fetch(env.graphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query, variables: vars }),
  });
  const payload = await res.json();
  if (payload.errors) throw new Error(payload.errors[0].message);
  return payload.data as T;
}

export async function loginAsAdmin(email: string, password: string): Promise<LoginResult> {
  const { login } = await requestGQL<{ login: any }>(LOGIN_MUTATION, { input: { email, password } });
  const { profile } = await requestGQL<{ profile: any }>(PROFILE_QUERY, undefined, login.accessToken);
  if (profile.role !== 'SUPER_ADMIN') throw new Error('Akses ditolak: Hanya SUPER_ADMIN yang diizinkan.');
  return { accessToken: login.accessToken, refreshToken: login.refreshToken, profile };
}

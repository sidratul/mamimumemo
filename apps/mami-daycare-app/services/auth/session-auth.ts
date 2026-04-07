import { env } from '../../config/env';
import { clearDaycareSession, getDaycareSession, updateDaycareSessionTokens } from '../storage/session';

type RefreshMutationResponse = {
  refreshToken: {
    accessToken: string;
    refreshToken: string;
  };
};

type GraphQLPayload<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export async function refreshDaycareSession() {
  const session = await getDaycareSession();
  if (!session?.refreshToken) {
    await clearDaycareSession();
    return null;
  }

  try {
    const response = await fetch(env.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: REFRESH_TOKEN_MUTATION,
        variables: {
          input: {
            refreshToken: session.refreshToken,
          },
        },
      }),
    });

    if (!response.ok) {
      await clearDaycareSession();
      return null;
    }

    const payload = (await response.json()) as GraphQLPayload<RefreshMutationResponse>;
    const nextTokens = payload.data?.refreshToken;

    if (payload.errors?.length || !nextTokens?.accessToken || !nextTokens.refreshToken) {
      await clearDaycareSession();
      return null;
    }

    await updateDaycareSessionTokens(nextTokens.accessToken, nextTokens.refreshToken);
    return nextTokens;
  } catch {
    await clearDaycareSession();
    return null;
  }
}

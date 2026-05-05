import { env } from '../../config/env';

type LoginResult = {
  accessToken: string;
  refreshToken: string;
  profile: {
    id: string;
    name: string;
    email: string;
    role: 'PARENT';
  };
};

type GraphQLPayload<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

type RequestStep = 'login' | 'profile';

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

const PROFILE_QUERY = `
  query GetProfile {
    profile {
      _id
      name
      email
      role
    }
  }
`;

async function requestGraphQL<TData>(
  step: RequestStep,
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
  timeoutMs = 15000
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;

  try {
    response = await fetch(env.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(step === 'login' ? 'Timeout saat login ke GraphQL API.' : 'Timeout saat mengambil profile parent.');
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(
      step === 'login'
        ? `HTTP ${response.status} saat login ke GraphQL API.`
        : `HTTP ${response.status} saat mengambil profile parent.`
    );
  }

  const payload = (await response.json()) as GraphQLPayload<TData>;

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message || 'GraphQL request gagal.');
  }

  if (!payload.data) {
    throw new Error('GraphQL response kosong.');
  }

  return payload.data;
}

export async function loginAsParent(email: string, password: string): Promise<LoginResult> {
  const loginData = await requestGraphQL<{
    login: {
      accessToken: string;
      refreshToken: string;
    };
  }>('login', LOGIN_MUTATION, {
    input: {
      email,
      password,
    },
  });

  const accessToken = loginData.login.accessToken;
  const refreshToken = loginData.login.refreshToken;

  const profileData = await requestGraphQL<{
    profile: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
  }>('profile', PROFILE_QUERY, undefined, accessToken);

  if (profileData.profile.role !== 'PARENT') {
    throw new Error('Akun ini bukan PARENT dan tidak bisa mengakses aplikasi parent.');
  }

  return {
    accessToken,
    refreshToken,
    profile: {
      id: profileData.profile._id,
      name: profileData.profile.name,
      email: profileData.profile.email,
      role: 'PARENT',
    },
  };
}

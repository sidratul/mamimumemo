import { graphqlRequest } from '../graphql/client';

export type DaycareRegistrationInput = {
  daycareName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
  city: string;
  address: string;
  description: string;
};

export type DaycareRegistrationResult = {
  id: string;
  status: 'SUBMITTED';
  message: string;
  token: string;
  refreshToken?: string;
  ownerEmail: string;
  ownerName: string;
};

export type DaycareLoginResult = {
  token: string;
  refreshToken?: string;
  ownerEmail: string;
  ownerName: string;
  daycareId: string;
};

type RegisterDaycareMutationResponse = {
  registerDaycare: {
    id: string;
    message: string;
  };
};

type LoginMutationResponse = {
  login: {
    accessToken: string;
    refreshToken: string;
  };
};

type ProfileQueryResponse = {
  profile: {
    _id: string;
    name: string;
    email: string;
    accesses: string[];
  };
};

type MyDaycareQueryResponse = {
  myDaycare: {
    _id: string;
    id: string;
    name: string;
  } | null;
};

const REGISTER_DAYCARE_MUTATION = `
  mutation RegisterDaycare($input: RegisterDaycareInput!) {
    registerDaycare(input: $input) {
      id
      message
    }
  }
`;

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

const PROFILE_QUERY = `
  query Profile {
    profile {
      _id
      name
      email
      accesses
    }
  }
`;

const MY_DAYCARE_QUERY = `
  query MyDaycare {
    myDaycare {
      _id
      id
      name
    }
  }
`;

export async function submitDaycareRegistration(input: DaycareRegistrationInput): Promise<DaycareRegistrationResult> {
  const registration = await graphqlRequest<RegisterDaycareMutationResponse, {
    input: {
      owner: {
        name: string;
        email: string;
        password: string;
        phone: string;
      };
      daycare: {
        name: string;
        description: string;
        address: string;
        city: string;
      };
    };
  }>(REGISTER_DAYCARE_MUTATION, {
    input: {
      owner: {
        name: input.ownerName,
        email: input.ownerEmail.trim().toLowerCase(),
        password: input.password,
        phone: input.ownerPhone,
      },
      daycare: {
        name: input.daycareName,
        description: input.description,
        address: input.address,
        city: input.city,
      },
    },
  });

  const loginResult = await graphqlRequest<LoginMutationResponse, {
    input: {
      email: string;
      password: string;
    };
  }>(LOGIN_MUTATION, {
    input: {
      email: input.ownerEmail.trim().toLowerCase(),
      password: input.password,
    },
  });

  const token = loginResult.login.accessToken;
  const refreshToken = loginResult.login.refreshToken;

  return {
    id: registration.registerDaycare.id,
    status: 'SUBMITTED',
    message: registration.registerDaycare.message,
    token,
    refreshToken,
    ownerEmail: input.ownerEmail,
    ownerName: input.ownerName,
  };
}

export async function signInDaycareOwner(input: { email: string; password: string }) {
  const loginResult = await graphqlRequest<LoginMutationResponse, {
    input: {
      email: string;
      password: string;
    };
  }>(LOGIN_MUTATION, {
    input: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  });

  const token = loginResult.login.accessToken;
  const refreshToken = loginResult.login.refreshToken;

  const profileResult = await graphqlRequest<ProfileQueryResponse>(PROFILE_QUERY, undefined, token);

  if (!profileResult.profile.accesses.includes('OWNER')) {
    throw new Error('Akun ini bukan akun owner daycare.');
  }

  const daycareResult = await graphqlRequest<MyDaycareQueryResponse>(MY_DAYCARE_QUERY, undefined, token);
  const daycareId = daycareResult.myDaycare?.id || daycareResult.myDaycare?._id || '';

  return {
    token,
    refreshToken,
    ownerEmail: profileResult.profile.email,
    ownerName: profileResult.profile.name,
    daycareId,
  } satisfies DaycareLoginResult;
}

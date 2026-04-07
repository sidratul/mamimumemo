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

type RegisterMutationResponse = {
  register: {
    id?: string;
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
    role: string;
  };
};

type CreateDaycareDraftMutationResponse = {
  createDaycareDraft: {
    id: string;
    approvalStatus: string;
  };
};

type SubmitDaycareRegistrationMutationResponse = {
  submitDaycareRegistration: {
    id: string;
    approvalStatus: 'SUBMITTED';
  };
};

const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
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
      role
    }
  }
`;

const CREATE_DAYCARE_DRAFT_MUTATION = `
  mutation CreateDaycareDraft($input: CreateDaycareDraftInput!) {
    createDaycareDraft(input: $input) {
      id
      approvalStatus
    }
  }
`;

const SUBMIT_DAYCARE_REGISTRATION_MUTATION = `
  mutation SubmitDaycareRegistration($id: ObjectId!) {
    submitDaycareRegistration(id: $id) {
      id
      approvalStatus
    }
  }
`;

export async function submitDaycareRegistration(input: DaycareRegistrationInput): Promise<DaycareRegistrationResult> {
  await graphqlRequest<RegisterMutationResponse, {
    input: {
      name: string;
      email: string;
      password: string;
      phone: string;
      role: 'DAYCARE_OWNER';
    };
  }>(REGISTER_MUTATION, {
    input: {
      name: input.ownerName,
      email: input.ownerEmail,
      password: input.password,
      phone: input.ownerPhone,
      role: 'DAYCARE_OWNER',
    },
  });

  const loginResult = await graphqlRequest<LoginMutationResponse, {
    input: {
      email: string;
      password: string;
    };
  }>(LOGIN_MUTATION, {
    input: {
      email: input.ownerEmail,
      password: input.password,
    },
  });

  const token = loginResult.login.accessToken;
  const refreshToken = loginResult.login.refreshToken;

  const draftResult = await graphqlRequest<CreateDaycareDraftMutationResponse, {
    input: {
      name: string;
      description: string;
      address: string;
      city: string;
    };
  }>(
    CREATE_DAYCARE_DRAFT_MUTATION,
    {
      input: {
        name: input.daycareName,
        description: input.description,
        address: input.address,
        city: input.city,
      },
    },
    token
  );

  const daycareId = draftResult.createDaycareDraft.id;

  const submitResult = await graphqlRequest<SubmitDaycareRegistrationMutationResponse, { id: string }>(
    SUBMIT_DAYCARE_REGISTRATION_MUTATION,
    { id: daycareId },
    token
  );

  return {
    id: submitResult.submitDaycareRegistration.id,
    status: submitResult.submitDaycareRegistration.approvalStatus,
    message: 'Registrasi daycare berhasil dikirim dan menunggu review admin system.',
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

  if (profileResult.profile.role !== 'DAYCARE_OWNER') {
    throw new Error('Akun ini bukan akun owner daycare.');
  }

  return {
    token,
    refreshToken,
    ownerEmail: profileResult.profile.email,
    ownerName: profileResult.profile.name,
    daycareId: '',
  } satisfies DaycareLoginResult;
}

import { graphqlRequest } from '../graphql/client';

export type StaffAccess = 'ADMIN' | 'SITTER';

export type StaffMembership = {
  _id: string;
  access: 'OWNER' | StaffAccess;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string | null;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
};

type MembershipsResponse = {
  daycareMemberships: StaffMembership[];
};

type ActionResponse = {
  id: string;
  message: string;
};

const MEMBERSHIPS_QUERY = `
  query StaffMemberships($daycareId: ObjectId!) {
    daycareMemberships(daycareId: $daycareId) {
      _id
      access
      status
      notes
      user {
        _id
        name
        email
        phone
      }
    }
  }
`;

const ADD_USER_MUTATION = `
  mutation AddUserToDaycare($input: AddUserToDaycareInput!) {
    addUserToDaycare(input: $input) {
      id
      message
    }
  }
`;

const DEACTIVATE_MEMBERSHIP_MUTATION = `
  mutation DeactivateMembership($id: ObjectId!) {
    deactivateDaycareMembership(id: $id) {
      id
      message
    }
  }
`;

export async function getStaffMemberships(token: string, daycareId: string) {
  const result = await graphqlRequest<MembershipsResponse, { daycareId: string }>(
    MEMBERSHIPS_QUERY,
    { daycareId },
    token,
  );
  return result.daycareMemberships.filter(
    (membership) => membership.status === 'ACTIVE' && membership.access !== 'OWNER',
  );
}

export async function createStaffUser(
  token: string,
  input: {
    daycareId: string;
    access: StaffAccess;
    name: string;
    email: string;
    password: string;
    phone?: string;
    notes?: string;
  },
) {
  return await graphqlRequest<
    { addUserToDaycare: ActionResponse },
    { input: Record<string, unknown> }
  >(
    ADD_USER_MUTATION,
    {
      input: {
        daycareId: input.daycareId,
        access: input.access,
        notes: input.notes,
        userData: {
          name: input.name,
          email: input.email,
          password: input.password,
          phone: input.phone,
        },
      },
    },
    token,
  );
}

export async function addExistingStaffByEmail(
  token: string,
  input: {
    daycareId: string;
    access: StaffAccess;
    email: string;
    notes?: string;
  },
) {
  return await graphqlRequest<
    { addUserToDaycare: ActionResponse },
    { input: Record<string, unknown> }
  >(
    ADD_USER_MUTATION,
    {
      input: {
        daycareId: input.daycareId,
        access: input.access,
        notes: input.notes,
        userEmail: input.email,
      },
    },
    token,
  );
}

export async function deactivateStaffMembership(token: string, id: string) {
  return await graphqlRequest<
    { deactivateDaycareMembership: ActionResponse },
    { id: string }
  >(
    DEACTIVATE_MEMBERSHIP_MUTATION,
    { id },
    token,
  );
}

import { gql } from '@apollo/client';

import { apolloClient } from '../apollo';
import { invalidateDaycareData } from '../daycare-admin';
import { invalidateUserData } from '../users';

export type DaycareMembershipPersona = 'OWNER' | 'ADMIN' | 'SITTER';
export type DaycareMembershipStatus = 'ACTIVE' | 'INACTIVE';

export type DaycareMembershipRecord = {
  id: string;
  persona: DaycareMembershipPersona;
  status: DaycareMembershipStatus;
  notes?: string;
  daycare: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
};

type ActionResponse = {
  id: string;
  message: string;
};

type AddUserToDaycareResponse = {
  addUserToDaycare: ActionResponse;
};

type DeactivateDaycareMembershipResponse = {
  deactivateDaycareMembership: ActionResponse;
};

type DaycareMembershipsResponse = {
  daycareMemberships: Array<{
    _id: string;
    persona: DaycareMembershipPersona;
    status: DaycareMembershipStatus;
    notes?: string | null;
    daycare: {
      _id: string;
      name: string;
    };
    user: {
      _id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
  }>;
};

let daycareMembershipDataVersion = 0;

function invalidateDaycareMembershipData() {
  daycareMembershipDataVersion += 1;
}

export function getDaycareMembershipDataVersion() {
  return daycareMembershipDataVersion;
}

const ADD_USER_TO_DAYCARE_MUTATION = gql`
  mutation AddUserToDaycare($input: AddUserToDaycareInput!) {
    addUserToDaycare(input: $input) {
      id
      message
    }
  }
`;

const DEACTIVATE_DAYCARE_MEMBERSHIP_MUTATION = gql`
  mutation DeactivateDaycareMembership($id: ObjectId!) {
    deactivateDaycareMembership(id: $id) {
      id
      message
    }
  }
`;

const DAYCARE_MEMBERSHIPS_QUERY = gql`
  query DaycareMemberships($daycareId: ObjectId!) {
    daycareMemberships(daycareId: $daycareId) {
      _id
      persona
      status
      notes
      daycare {
        _id
        name
      }
      user {
        _id
        name
        email
        phone
      }
    }
  }
`;

function mapMembership(node: DaycareMembershipsResponse['daycareMemberships'][number]): DaycareMembershipRecord {
  return {
    id: node._id,
    persona: node.persona,
    status: node.status,
    notes: node.notes ?? '',
    daycare: {
      id: node.daycare._id,
      name: node.daycare.name,
    },
    user: {
      id: node.user._id,
      name: node.user.name,
      email: node.user.email,
      phone: node.user.phone ?? '',
    },
  };
}

export async function getDaycareMemberships(daycareId: string) {
  const response = await apolloClient.query<DaycareMembershipsResponse>({
    query: DAYCARE_MEMBERSHIPS_QUERY,
    variables: { daycareId },
    fetchPolicy: 'network-only',
  });

  return response.data.daycareMemberships.map(mapMembership);
}

export async function addExistingUserToDaycare(input: {
  daycareId: string;
  userId: string;
  persona: DaycareMembershipPersona;
  notes?: string;
}) {
  const response = await apolloClient.mutate<AddUserToDaycareResponse>({
    mutation: ADD_USER_TO_DAYCARE_MUTATION,
    variables: {
      input,
    },
  });

  if (!response.data?.addUserToDaycare) {
    throw new Error('Gagal menambahkan user ke daycare.');
  }

  invalidateUserData();
  invalidateDaycareMembershipData();
  invalidateDaycareData();
  return response.data.addUserToDaycare;
}

export async function deactivateDaycareMembership(id: string) {
  const response = await apolloClient.mutate<DeactivateDaycareMembershipResponse>({
    mutation: DEACTIVATE_DAYCARE_MEMBERSHIP_MUTATION,
    variables: { id },
  });

  if (!response.data?.deactivateDaycareMembership) {
    throw new Error('Gagal menonaktifkan membership daycare.');
  }

  invalidateUserData();
  invalidateDaycareMembershipData();
  invalidateDaycareData();
  return response.data.deactivateDaycareMembership;
}

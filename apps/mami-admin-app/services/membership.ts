import { gql } from '@apollo/client';
import { apolloClient } from './apollo';
import { invalidateDaycareData } from './daycare';
import { invalidateUserData } from './user';

export type DaycareMembershipAccess = 'OWNER' | 'ADMIN' | 'SITTER';
export type DaycareMembershipStatus = 'ACTIVE' | 'INACTIVE';
export type AddUserToDaycareInput = {
  daycareId: string;
  access: DaycareMembershipAccess;
  notes?: string;
} & (
  | { userId: string; userData?: never }
  | { userEmail: string; userId?: never; userData?: never }
  | {
      userId?: never;
      userData: {
        name: string;
        email: string;
        password: string;
        phone?: string;
      };
    }
);

export type DaycareMembershipRecord = {
  _id: string;
  access: DaycareMembershipAccess;
  status: DaycareMembershipStatus;
  joinedAt?: string | null;
  endedAt?: string | null;
  notes?: string | null;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  daycare: {
    _id: string;
    name: string;
  };
};

export async function getDaycareMemberships(daycareId: string) {
  const res = await apolloClient.query<{ daycareMemberships: DaycareMembershipRecord[] }>({
    query: gql`
      query GetDaycareMemberships($daycareId: ObjectId!) {
        daycareMemberships(daycareId: $daycareId) {
          _id access status joinedAt endedAt notes
          user { _id name email phone }
          daycare { _id name }
        }
      }
    `,
    variables: { daycareId }
  });
  return { ...res, items: res.data?.daycareMemberships || [] };
}

export async function addUserToDaycare(input: AddUserToDaycareInput) {
  const res = await apolloClient.mutate({
    mutation: gql`
      mutation AddUserToDaycare($input: AddUserToDaycareInput!) {
        addUserToDaycare(input: $input) { id message }
      }
    `,
    variables: { input },
  });
  invalidateUserData();
  invalidateDaycareData();
  return res;
}

export const addExistingUserToDaycare = addUserToDaycare;

export async function deactivateDaycareMembership(id: string) {
  const res = await apolloClient.mutate({
    mutation: gql`
      mutation DeactivateDaycareMembership($id: ObjectId!) {
        deactivateDaycareMembership(id: $id) { id message }
      }
    `,
    variables: { id }
  });
  invalidateUserData();
  invalidateDaycareData();
  return res;
}

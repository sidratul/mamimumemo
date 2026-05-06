import { gql } from '@apollo/client';
import { apolloClient } from './apollo';
import { mapUser } from '../shared/user/logic';
import { USER_FIELDS } from '../shared/user/fragments';
import { UserRecord, UserAccess, UserRole, UserDaycareMembership } from '../shared/user/types';

let v = 0;
export const getUserDataVersion = () => v;
export const invalidateUserData = () => { v += 1; };

export async function listUsers(input: { access?: UserAccess | 'ALL', search?: string, page?: number, limit?: number } = {}) {
  try {
    const res = await apolloClient.query<{ users: UserRecord[], userCount: number }>({
      query: gql`
        query ListUsers($filter: UserFilterInput, $sort: SortInput, $pagination: PaginationInput) {
          users(filter: $filter, sort: $sort, pagination: $pagination) { ...UserFields }
          userCount(filter: $filter)
        }
        ${USER_FIELDS}
      `,
      variables: {
        filter: { 
          accesses: input.access === 'ALL' ? undefined : (input.access ? [input.access] : undefined), 
          search: input.search?.trim() || undefined 
        },
        sort: { sortBy: 'createdAt', sortType: 'DESC' },
        pagination: { page: input.page || 1, limit: input.limit || 20 },
      }
    });
    return { 
      items: res.data?.users || [], 
      total: res.data?.userCount || 0,
      loading: res.loading,
      error: res.error,
    };
  } catch (error) {
    return { items: [], total: 0, loading: false, error: error as Error };
  }
}

export async function getUserById(id: string) {
  try {
    const res = await apolloClient.query<{ user: UserRecord | null }>({
      query: gql`query GetUser($id: ObjectId!) { user(id: $id) { ...UserFields } } ${USER_FIELDS}`,
      variables: { id }
    });
    return { data: res.data?.user || null, loading: res.loading, error: res.error };
  } catch (error) {
    return { data: null, loading: false, error: error as Error };
  }
}

export async function createUser(input: { name: string, email: string, password: string, phone?: string, role: UserRole }) {
  const res = await apolloClient.mutate<{ createUser: { _id: string, message: string } }>({
    mutation: gql`mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { _id: id message } }`,
    variables: { input }
  });
  invalidateUserData();
  return { data: res.data?.createUser, errors: res.errors };
}

export async function updateUser(id: string, input: { name?: string, email?: string, phone?: string, role?: UserRole }) {
  const res = await apolloClient.mutate<{ updateUser: { _id: string, message: string } }>({
    mutation: gql`mutation UpdateUser($id: ObjectId!, $input: UpdateUserInput!) { updateUser(id: $id, input: $input) { _id: id message } }`,
    variables: { id, input }
  });
  invalidateUserData();
  return { data: res.data?.updateUser, errors: res.errors };
}

export async function updateUserPassword(id: string, input: { currentPassword?: string, newPassword: string }) {
  const res = await apolloClient.mutate<{ updateUserPassword: { _id: string, message: string } }>({
    mutation: gql`mutation UpdateUserPassword($id: ObjectId!, $input: UpdateUserPasswordInput!) { updateUserPassword(id: $id, input: $input) { _id: id message } }`,
    variables: { id, input }
  });
  return { data: res.data?.updateUserPassword, errors: res.errors };
}

export async function deleteUser(id: string) {
  const res = await apolloClient.mutate<{ deleteUser: { _id: string, message: string } }>({
    mutation: gql`mutation DeleteUser($id: ObjectId!) { deleteUser(id: $id) { id message } }`,
    variables: { id }
  });
  invalidateUserData();
  return { data: res.data?.deleteUser, errors: res.errors };
}

export async function getUserDaycareMemberships(userId: string) {
  try {
    const res = await apolloClient.query<{ userDaycareMemberships: UserDaycareMembership[] }>({
      query: gql`
        query UserDaycareMemberships($userId: ObjectId!) {
          userDaycareMemberships(userId: $userId) {
            _id access status joinedAt endedAt notes
            daycare { _id name }
          }
        }
      `,
      variables: { userId }
    });
    return { items: res.data?.userDaycareMemberships || [], loading: res.loading, error: res.error };
  } catch (error) {
    return { items: [], loading: false, error: error as Error };
  }
}

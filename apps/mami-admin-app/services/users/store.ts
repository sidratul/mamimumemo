import { gql } from '@apollo/client';
import { getUserRoleLabel as getSharedUserRoleLabel } from '@mami/core';

import { apolloClient } from '../apollo';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'DAYCARE_OWNER'
  | 'DAYCARE_ADMIN'
  | 'DAYCARE_SITTER'
  | 'PARENT';

export type UserPersona =
  | 'SUPER_ADMIN'
  | 'PARENT'
  | 'OWNER'
  | 'DAYCARE_ADMIN'
  | 'DAYCARE_SITTER';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  personas: UserPersona[];
  createdAt?: string;
  updatedAt?: string;
};

export type UserDaycareMembership = {
  id: string;
  persona: 'OWNER' | 'ADMIN' | 'SITTER';
  status: 'ACTIVE' | 'INACTIVE';
  joinedAt?: string;
  endedAt?: string;
  notes?: string;
  daycare: {
    id: string;
    name: string;
  };
};

type ListUsersInput = {
  persona?: UserPersona | 'ALL';
  search?: string;
  page?: number;
  limit?: number;
};

type UsersResponse = {
  users: UserApiNode[];
};

type UserCountResponse = {
  userCount: number;
};

type UserDetailResponse = {
  user: UserApiNode | null;
};

type ActionResponse = {
  id: string;
  message: string;
};

type CreateUserResponse = {
  createUser: ActionResponse;
};

type UpdateUserResponse = {
  updateUser: ActionResponse;
};

type UpdateUserPasswordResponse = {
  updateUserPassword: ActionResponse;
};

type DeleteUserResponse = {
  deleteUser: ActionResponse;
};

type UserDaycareMembershipsResponse = {
  userDaycareMemberships: Array<{
    _id: string;
    persona: 'OWNER' | 'ADMIN' | 'SITTER';
    status: 'ACTIVE' | 'INACTIVE';
    joinedAt?: string | null;
    endedAt?: string | null;
    notes?: string | null;
    daycare: {
      _id: string;
      name: string;
    };
  }>;
};

type UserApiNode = {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: UserRole | null;
  personas?: UserPersona[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

let userDataVersion = 0;

export function getUserDataVersion() {
  return userDataVersion;
}

export function invalidateUserData() {
  userDataVersion += 1;
}

const USER_FIELDS = gql`
  fragment UserFields on User {
    _id
    name
    email
    phone
    role
    personas
    createdAt
    updatedAt
  }
`;

const LIST_USERS_QUERY = gql`
  query ListUsers($filter: UserFilterInput, $sort: SortInput, $pagination: PaginationInput) {
    users(filter: $filter, sort: $sort, pagination: $pagination) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

const USER_COUNT_QUERY = gql`
  query UserCount($filter: UserFilterInput) {
    userCount(filter: $filter)
  }
`;

const GET_USER_QUERY = gql`
  query GetUser($id: ObjectId!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      message
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ObjectId!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      message
    }
  }
`;

const UPDATE_USER_PASSWORD_MUTATION = gql`
  mutation UpdateUserPassword($id: ObjectId!, $input: UpdateUserPasswordInput!) {
    updateUserPassword(id: $id, input: $input) {
      id
      message
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ObjectId!) {
    deleteUser(id: $id) {
      id
      message
    }
  }
`;

const USER_DAYCARE_MEMBERSHIPS_QUERY = gql`
  query UserDaycareMemberships($userId: ObjectId!) {
    userDaycareMemberships(userId: $userId) {
      _id
      persona
      status
      joinedAt
      endedAt
      notes
      daycare {
        _id
        name
      }
    }
  }
`;

function mapUser(node: UserApiNode): AdminUser {
  return {
    id: node._id,
    name: node.name,
    email: node.email,
    phone: node.phone ?? '',
    role: node.role ?? 'PARENT',
    personas: node.personas ?? [],
    createdAt: node.createdAt ?? '',
    updatedAt: node.updatedAt ?? '',
  };
}

export async function listUsers({ persona = 'ALL', search = '', page = 1, limit = 20 }: ListUsersInput = {}) {
  const response = await apolloClient.query<UsersResponse>({
    query: LIST_USERS_QUERY,
    variables: {
      filter: {
        personas: persona === 'ALL' ? undefined : [persona],
        search: search.trim() || undefined,
      },
      sort: {
        sortBy: 'createdAt',
        sortType: 'DESC',
      },
      pagination: {
        page,
        limit,
      },
    },
    fetchPolicy: 'network-only',
  });

  return response.data.users.map(mapUser);
}

export async function getUserCount({ persona = 'ALL', search = '' }: ListUsersInput = {}) {
  const response = await apolloClient.query<UserCountResponse>({
    query: USER_COUNT_QUERY,
    variables: {
      filter: {
        personas: persona === 'ALL' ? undefined : [persona],
        search: search.trim() || undefined,
      },
    },
    fetchPolicy: 'network-only',
  });

  return response.data.userCount;
}

export async function getUserById(id: string) {
  const response = await apolloClient.query<UserDetailResponse>({
    query: GET_USER_QUERY,
    variables: { id },
    fetchPolicy: 'network-only',
  });

  if (!response.data.user) {
    throw new Error('User tidak ditemukan.');
  }

  return mapUser(response.data.user);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}) {
  const response = await apolloClient.mutate<CreateUserResponse>({
    mutation: CREATE_USER_MUTATION,
    variables: { input },
  });

  if (!response.data?.createUser) {
    throw new Error('Gagal membuat user.');
  }

  invalidateUserData();
  return response.data.createUser;
}

export async function updateUser(
  id: string,
  input: {
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
  }
) {
  const response = await apolloClient.mutate<UpdateUserResponse>({
    mutation: UPDATE_USER_MUTATION,
    variables: { id, input },
  });

  if (!response.data?.updateUser) {
    throw new Error('Gagal memperbarui user.');
  }

  invalidateUserData();
  return response.data.updateUser;
}

export async function updateUserPassword(
  id: string,
  input: {
    currentPassword?: string;
    newPassword: string;
  }
) {
  const response = await apolloClient.mutate<UpdateUserPasswordResponse>({
    mutation: UPDATE_USER_PASSWORD_MUTATION,
    variables: { id, input },
  });

  if (!response.data?.updateUserPassword) {
    throw new Error('Gagal memperbarui password.');
  }

  invalidateUserData();
  return response.data.updateUserPassword;
}

export async function deleteUser(id: string) {
  const response = await apolloClient.mutate<DeleteUserResponse>({
    mutation: DELETE_USER_MUTATION,
    variables: { id },
  });

  if (!response.data?.deleteUser) {
    throw new Error('Gagal menghapus user.');
  }

  invalidateUserData();
  return response.data.deleteUser;
}

export async function getUserDaycareMemberships(userId: string): Promise<UserDaycareMembership[]> {
  const response = await apolloClient.query<UserDaycareMembershipsResponse>({
    query: USER_DAYCARE_MEMBERSHIPS_QUERY,
    variables: { userId },
    fetchPolicy: 'network-only',
  });

  return response.data.userDaycareMemberships.map((membership) => ({
    id: membership._id,
    persona: membership.persona,
    status: membership.status,
    joinedAt: membership.joinedAt ?? '',
    endedAt: membership.endedAt ?? '',
    notes: membership.notes ?? '',
    daycare: {
      id: membership.daycare._id,
      name: membership.daycare.name,
    },
  }));
}

export function getUserRoleLabel(role: UserRole) {
  return getSharedUserRoleLabel(role);
}

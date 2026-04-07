import { gql } from '@apollo/client';

import { apolloClient } from '../apollo';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'DAYCARE_OWNER'
  | 'DAYCARE_ADMIN'
  | 'DAYCARE_SITTER'
  | 'PARENT';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

type ListUsersInput = {
  role?: UserRole | 'ALL';
  search?: string;
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

type UserApiNode = {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: UserRole | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const USER_FIELDS = gql`
  fragment UserFields on User {
    _id
    name
    email
    phone
    role
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

function mapUser(node: UserApiNode): AdminUser {
  return {
    id: node._id,
    name: node.name,
    email: node.email,
    phone: node.phone ?? '',
    role: node.role ?? 'PARENT',
    createdAt: node.createdAt ?? '',
    updatedAt: node.updatedAt ?? '',
  };
}

export async function listUsers({ role = 'ALL', search = '' }: ListUsersInput = {}) {
  const response = await apolloClient.query<UsersResponse>({
    query: LIST_USERS_QUERY,
    variables: {
      filter: {
        roles: role === 'ALL' ? undefined : [role],
        search: search.trim() || undefined,
      },
      sort: {
        sortBy: 'createdAt',
        sortType: 'DESC',
      },
      pagination: {
        page: 1,
        limit: 50,
      },
    },
    fetchPolicy: 'network-only',
  });

  return response.data.users.map(mapUser);
}

export async function getUserCount({ role = 'ALL', search = '' }: ListUsersInput = {}) {
  const response = await apolloClient.query<UserCountResponse>({
    query: USER_COUNT_QUERY,
    variables: {
      filter: {
        roles: role === 'ALL' ? undefined : [role],
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

  return response.data.deleteUser;
}

export function getUserRoleLabel(role: UserRole) {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';
    case 'DAYCARE_OWNER':
      return 'Daycare Owner';
    case 'DAYCARE_ADMIN':
      return 'Daycare Admin';
    case 'DAYCARE_SITTER':
      return 'Daycare Sitter';
    case 'PARENT':
      return 'Parent';
    default:
      return role;
  }
}

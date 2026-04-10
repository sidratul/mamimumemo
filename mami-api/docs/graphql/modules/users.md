# Users Module

Modul ini menangani manajemen user oleh `SUPER_ADMIN`.

Source utama:

- `src/users/users.typedef.ts`
- `src/users/users.validation.ts`
- `src/users/users.service.ts`

## Queries

### `users`

```graphql
query Users(
  $filter: UserFilterInput
  $sort: SortInput
  $pagination: PaginationInput
) {
  users(filter: $filter, sort: $sort, pagination: $pagination) {
    _id
    name
    email
    phone
    role
    personas
    createdAt
    updatedAt
  }
}
```

`personas` adalah gabungan identitas akun dan membership aktif user, misalnya:

- `SUPER_ADMIN`
- `PARENT`
- `OWNER`
- `DAYCARE_ADMIN`
- `DAYCARE_SITTER`

Catatan:

- hanya `SUPER_ADMIN`

### `userCount`

```graphql
query UserCount($filter: UserFilterInput) {
  userCount(filter: $filter)
}
```

### `user`

```graphql
query User($id: ObjectId!) {
  user(id: $id) {
    _id
    name
    email
    phone
    role
    personas
    createdAt
    updatedAt
  }
}
```

Catatan:

- hanya `SUPER_ADMIN`

## Mutations

### `createUser`

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    message
  }
}
```

Contoh variables:

```json
{
  "input": {
    "name": "Owner Baru",
    "email": "owner.baru@example.com",
    "password": "password123",
    "phone": "081200000001",
    "role": "SUPER_ADMIN"
  }
}
```

Catatan:

- field `role` sekarang sebaiknya dipakai untuk identitas akun global
- persona daycare seperti `OWNER`, `DAYCARE_ADMIN`, dan `DAYCARE_SITTER` berasal dari `daycare_memberships`

### `updateUser`

```graphql
mutation UpdateUser($id: ObjectId!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    message
  }
}
```

Catatan:

- `SUPER_ADMIN` bisa update semua field
- user biasa hanya bisa update dirinya sendiri, dan field dibatasi service

### `updateUserPassword`

```graphql
mutation UpdateUserPassword($id: ObjectId!, $input: UpdateUserPasswordInput!) {
  updateUserPassword(id: $id, input: $input) {
    id
    message
  }
}
```

Catatan:

- `SUPER_ADMIN` bisa reset password user mana pun
- user biasa hanya bisa ganti password dirinya sendiri dan wajib mengirim `currentPassword`

### `deleteUser`

```graphql
mutation DeleteUser($id: ObjectId!) {
  deleteUser(id: $id) {
    id
    message
  }
}
```

Catatan:

- hanya `SUPER_ADMIN`

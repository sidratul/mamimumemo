# Users

Manajemen user global, filter access/persona, reset password, dan delete user.

Source schema: `src/users/users.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- List/count/create/delete hanya `SUPER_ADMIN`.
- Detail/update/password dapat dilakukan `SUPER_ADMIN` atau user itu sendiri sesuai service guard.
- Filter memakai `accesses` di schema GraphQL saat ini.

## Queries

- `users(filter: UserFilterInput, sort: SortInput, pagination: PaginationInput): [User!]!`
- `userCount(filter: UserFilterInput): Int!`
- `user(id: ObjectId!): User`

## Mutations

- `createUser(input: CreateUserInput!): ActionResponse!`
- `updateUser(id: ObjectId!, input: UpdateUserInput!): ActionResponse!`
- `updateUserPassword(id: ObjectId!, input: UpdateUserPasswordInput!): ActionResponse!`
- `deleteUser(id: ObjectId!): ActionResponse!`

## Schema Definitions

Types:

- `User`

Inputs:

- `CreateUserInput`
- `UpdateUserInput`
- `UpdateUserPasswordInput`
- `UserFilterInput`

Enums:

- `SystemRole`
- `UserAccess`
- `UserRole`

Scalars:

- Tidak ada.

## Notes

- `systemRole` hanya untuk role tingkat sistem dan saat ini hanya menerima `SUPER_ADMIN`.
- Akses daycare berasal dari `daycare_memberships`; akses parent berasal dari record `parents` aktif.
- `ActionResponse` hanya mengembalikan `id` dan `message`.

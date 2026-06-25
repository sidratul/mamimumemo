# Auth

Login, refresh token, dan profile user aktif.

Source schema: `src/auth/auth.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- `login` dan `refreshToken` publik.
- `profile` butuh token Bearer valid.

## Queries

- `profile: User!`

## Mutations

- `login(input: LoginInput!): AuthResponse!`
- `refreshToken(input: RefreshTokenInput!): AuthResponse!`

## Schema Definitions

Types:

- `AuthResponse`

Inputs:

- `LoginInput`
- `RefreshTokenInput`

Enums:

- Tidak ada.

Scalars:

- Tidak ada.

## Notes

- Role efektif dapat berasal dari membership daycare aktif, kecuali `SUPER_ADMIN`.

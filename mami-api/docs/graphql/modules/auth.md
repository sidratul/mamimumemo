# Auth Module

Modul auth dipakai untuk register, login, refresh token, dan ambil profile user aktif.

Source utama:

- `src/auth/auth.typedef.ts`
- `src/auth/auth.validation.ts`
- `src/auth/auth.service.ts`

## Enum

```graphql
enum UserRole {
  SUPER_ADMIN
  DAYCARE_OWNER
  DAYCARE_ADMIN
  DAYCARE_SITTER
  PARENT
}
```

## Queries

### `profile`

Ambil profile user dari access token aktif.

```graphql
query GetProfile {
  profile {
    _id
    name
    email
    phone
    role
    createdAt
    updatedAt
  }
}
```

Hak akses:

- harus login

Catatan:

- backend menormalkan role legacy `ADMIN` menjadi `SUPER_ADMIN`

Contoh response:

```json
{
  "data": {
    "profile": {
      "_id": "67f31c9d2d62a66531f09ff2",
      "name": "System Super Admin",
      "email": "admin@mami.com",
      "phone": "0812-3456-7896",
      "role": "SUPER_ADMIN",
      "createdAt": "2026-04-07T01:50:00.000Z",
      "updatedAt": "2026-04-07T01:50:00.000Z"
    }
  }
}
```

## Mutations

### `register`

Mendaftarkan user baru.

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    message
  }
}
```

Contoh variables:

```json
{
  "input": {
    "name": "Ibu Budi",
    "email": "ibu@example.com",
    "password": "password123",
    "phone": "081234567890",
    "role": "PARENT"
  }
}
```

Validasi backend:

- `name` wajib
- `email` harus valid
- `password` minimal 6 karakter
- `role` optional

Default role:

- jika `role` tidak diisi, backend memakai `PARENT`

Kemungkinan error:

- `Pengguna dengan email ini sudah terdaftar`

Contoh response:

```json
{
  "data": {
    "register": {
      "id": "67f31f912d62a66531f0a0a9",
      "message": "Registrasi berhasil"
    }
  }
}
```

### `login`

Login dengan email dan password.

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
  }
}
```

Contoh variables:

```json
{
  "input": {
    "email": "admin@mami.com",
    "password": "admin123"
  }
}
```

Validasi backend:

- `email` harus valid
- `password` wajib

Kemungkinan error:

- `Kredensial tidak valid`

Contoh response:

```json
{
  "data": {
    "login": {
      "accessToken": "<ACCESS_TOKEN>",
      "refreshToken": "<REFRESH_TOKEN>"
    }
  }
}
```

### `refreshToken`

Menukar refresh token menjadi pasangan token baru.

```graphql
mutation RefreshToken($input: RefreshTokenInput!) {
  refreshToken(input: $input) {
    accessToken
    refreshToken
  }
}
```

Contoh variables:

```json
{
  "input": {
    "refreshToken": "<REFRESH_TOKEN>"
  }
}
```

Kemungkinan error:

- `Akses tidak sah`

Contoh response:

```json
{
  "data": {
    "refreshToken": {
      "accessToken": "<NEW_ACCESS_TOKEN>",
      "refreshToken": "<NEW_REFRESH_TOKEN>"
    }
  }
}
```

## Header Auth

Untuk query/mutation yang butuh login:

```json
{
  "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

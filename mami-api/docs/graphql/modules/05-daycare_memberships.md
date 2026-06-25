# Daycare Memberships

Relasi user ke daycare sebagai owner, admin, atau sitter.

Source schema: `src/daycare_memberships/daycare_memberships.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Semua operasi butuh login.
- `SUPER_ADMIN` dapat membaca/mengelola semua daycare membership.
- `DAYCARE_OWNER` dan `DAYCARE_ADMIN` dapat membaca/menambah user pada daycare yang sama.
- `deactivateDaycareMembership` hanya `SUPER_ADMIN`.

## Queries

- `daycareMemberships(daycareId: ObjectId!): [DaycareMembership!]!`
- `userDaycareMemberships(userId: ObjectId!): [DaycareMembership!]!`

## Mutations

- `addUserToDaycare(input: AddUserToDaycareInput!): ActionResponse!`
- `deactivateDaycareMembership(id: ObjectId!): ActionResponse!`

## Schema Definitions

Types:

- `DaycareMembership`
- `DaycareMembershipDaycare`

Inputs:

- `AddUserToDaycareInput`
- `DaycareMembershipUserDataInput`

Enums:

- `DaycareMembershipAccess`
- `DaycareMembershipStatus`

Scalars:

- Tidak ada.

## Notes

- `AddUserToDaycareInput` wajib mengisi tepat salah satu dari `userId` atau `userData`.

# Daycare Memberships

Relasi user ke daycare sebagai owner, admin, atau sitter.

Source schema: `src/daycare_memberships/daycare_memberships.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Semua operasi butuh login.
- `SUPER_ADMIN` dapat membaca/mengelola semua daycare membership.
- `DAYCARE_OWNER` dapat menambah/menonaktifkan `ADMIN` dan `SITTER` pada daycare yang sama.
- `DAYCARE_ADMIN` hanya dapat menambah/menonaktifkan `SITTER` pada daycare yang sama.
- Membership `OWNER` hanya dapat dikelola `SUPER_ADMIN`.

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

- `AddUserToDaycareInput` wajib mengisi tepat salah satu dari `userId`, `userEmail`, atau `userData`.

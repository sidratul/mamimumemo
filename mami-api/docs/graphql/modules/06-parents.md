# Parents

Data parent dalam konteks daycare, custom data, emergency contact, pickup authorization, dan anak terkait.

Source schema: `src/parents/parents.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Daycare staff/admin (`SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`) dapat mengelola parent.
- Parent dapat membaca/update data miliknya sendiri pada beberapa operasi.

## Queries

- `daycareParents(daycareId: ObjectId!, active: Boolean): [Parent!]!`
- `parent(id: ObjectId!): Parent`
- `parentByUser(daycareId: ObjectId!, userId: ObjectId!): Parent`

## Mutations

- `createParent(input: CreateParentInput!): Parent!`
- `updateParent(id: ObjectId!, input: UpdateParentInput!): Parent!`
- `deactivateParent(id: ObjectId!): Parent!`

## Schema Definitions

Types:

- `EmergencyContact`
- `Parent`
- `ParentCustomData`
- `ParentUser`
- `PickupAuthorization`

Inputs:

- `CreateParentInput`
- `EmergencyContactInput`
- `ParentCustomDataInput`
- `ParentUserInput`
- `PickupAuthorizationInput`
- `UpdateParentInput`

Enums:

- Tidak ada.

Scalars:

- Tidak ada.

## Notes

- Role pada `ParentUserInput` dinormalisasi ke `PARENT`.

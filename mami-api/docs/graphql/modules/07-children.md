# Children

Data anak global milik parent dan guardian sharing.

Source schema: `src/children/children.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Semua operasi butuh user login.
- Owner child dapat update dan kelola guardian.
- Guardian hanya bisa membaca child yang dibagikan.

## Queries

- `myChildren: [Child!]!`
- `child(id: ObjectId!): Child`
- `childrenWhereIGuard: [Child!]!`

## Mutations

- `createChild(input: CreateChildInput!): Child!`
- `updateChild(id: ObjectId!, input: UpdateChildInput!): Child!`
- `addGuardian(childId: ObjectId!, input: AddGuardianInput!): Child!`
- `removeGuardian(childId: ObjectId!, input: RemoveGuardianInput!): Child!`

## Schema Definitions

Types:

- `Child`
- `ChildMedical`
- `ChildProfile`
- `Guardian`
- `Medication`
- `SharedBy`
- `UserRef`

Inputs:

- `AddGuardianInput`
- `ChildMedicalInput`
- `ChildProfileInput`
- `CreateChildInput`
- `GuardianInput`
- `MedicationInput`
- `RemoveGuardianInput`
- `UpdateChildInput`

Enums:

- `Gender`
- `GuardianPermission`
- `Relation`
- `UserRole`

Scalars:

- Tidak ada.

## Notes

- Permission guardian memakai enum `GuardianPermission`.

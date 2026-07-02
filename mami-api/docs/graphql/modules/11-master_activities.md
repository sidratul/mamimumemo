# Master Activities

Master aktivitas daycare dan konfigurasi field per kategori.

Source schema: `src/master_activities/master_activities.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Query butuh login.
- Create/update/deactivate: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`.

## Queries

- `masterActivities(daycareId: ObjectId!, active: Boolean, category: String): [MasterActivity!]!`
- `masterActivity(id: ObjectId!): MasterActivity`
- `defaultFieldConfig(category: String!): FieldConfig!`

## Mutations

- `createMasterActivity(input: CreateMasterActivityInput!): MasterActivity!`
- `updateMasterActivity(id: ObjectId!, input: UpdateMasterActivityInput!): MasterActivity!`
- `deactivateMasterActivity(id: ObjectId!): MasterActivity!`

## Schema Definitions

Types:

- `CreatedBy`
- `FieldConfig`
- `MasterActivity`

Inputs:

- `CreateMasterActivityInput`
- `FieldConfigInput`
- `UpdateMasterActivityInput`

Enums:

- Tidak ada.

Scalars:

- Tidak ada.

## Notes

- `defaultFieldConfig` mengembalikan konfigurasi field default untuk kategori aktivitas.

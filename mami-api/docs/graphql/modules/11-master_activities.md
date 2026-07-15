# Master Activities

Katalog aktivitas global yang dikelola system admin.

Source schema: `src/master_activities/master_activities.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Query butuh login.
- Create/update/deactivate hanya `SUPER_ADMIN`.

## Queries

- `masterActivities(active: Boolean, category: String, isStarter: Boolean): [MasterActivity!]!`
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
- `isStarter` menentukan master yang otomatis diadopsi saat daycare disetujui.
- Update menaikkan `version`, tetapi tidak menimpa salinan tenant.

# Daycare Activities

Aktivitas milik tenant daycare, baik hasil adopsi katalog global maupun aktivitas custom.

Source schema: `src/daycare_activities/daycare_activities.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Query: user pada daycare terkait atau `SUPER_ADMIN`.
- Create/adopt/update/deactivate: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`.

## Queries

- `daycareActivities(daycareId: ObjectId!, active: Boolean): [DaycareActivity!]!`
- `daycareActivity(id: ObjectId!): DaycareActivity!`

## Mutations

- `createDaycareActivity(input: CreateDaycareActivityInput!): DaycareActivity!`
- `adoptMasterActivity(input: AdoptMasterActivityInput!): DaycareActivity!`
- `updateDaycareActivity(id: ObjectId!, input: UpdateDaycareActivityInput!): DaycareActivity!`
- `deactivateDaycareActivity(id: ObjectId!): DaycareActivity!`

## Schema Definitions

Types:

- `DaycareActivity`

Inputs:

- `AdoptMasterActivityInput`
- `CreateDaycareActivityInput`
- `UpdateDaycareActivityInput`

Enums:

- Tidak ada.

Scalars:

- Tidak ada.

## Notes

- `sourceMasterActivityId` kosong untuk aktivitas custom.
- Adopsi menyalin nilai master saat itu dan tidak ditimpa otomatis ketika master berubah.
- Satu master hanya dapat diadopsi sekali per daycare.

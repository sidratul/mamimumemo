# Daycare

Registrasi daycare, list/review oleh system admin, dokumen legal, approval, delete, dan purge.

Source schema: `src/daycare/daycare.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- List/count/detail global hanya `SUPER_ADMIN`.
- `registerDaycare` publik atau bisa dipakai admin.
- `myDaycare` butuh login.
- `updateDaycareDocuments` butuh login dan hanya `SUPER_ADMIN` atau user pada daycare terkait.
- Approval/delete/purge hanya `SUPER_ADMIN`.

## Queries

- `daycares(filter: DaycareFilterInput, sort: SortInput, pagination: PaginationInput): [Daycare!]!`
- `daycareCount(filter: DaycareFilterInput): Int!`
- `daycare(id: ObjectId!): Daycare`
- `myDaycare: Daycare`

## Mutations

- `registerDaycare(input: RegisterDaycareInput!): ActionResponse!`
- `updateDaycareDocuments(id: ObjectId!, input: UpdateDaycareDocumentsInput!): ActionResponse!`
- `updateDaycareApprovalStatus(id: ObjectId!, input: UpdateDaycareApprovalInput!): ActionResponse!`
- `deleteDaycare(id: ObjectId!): ActionResponse!`
- `purgeDaycare(id: ObjectId!, input: PurgeDaycareInput): ActionResponse!`

## Schema Definitions

Types:

- `Daycare`
- `DaycareApproval`
- `DaycareApprovalActor`
- `DaycareApprovalHistory`
- `DaycareLegalDocument`

Inputs:

- `DaycareFilterInput`
- `DaycareLegalDocumentInput`
- `PurgeDaycareInput`
- `RegisterDaycareDataInput`
- `RegisterDaycareInput`
- `RegisterDaycareOwnerInput`
- `UpdateDaycareApprovalInput`
- `UpdateDaycareDocumentsInput`

Enums:

- `DaycareApprovalStatus`

Scalars:

- Tidak ada.

## Notes

- `deleteDaycare` soft delete.
- `purgeDaycare` hard delete dan bisa ikut menghapus owner jika `deleteOwner = true`.

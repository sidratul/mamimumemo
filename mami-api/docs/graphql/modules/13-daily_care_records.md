# Daily Care Records

Catatan operasional harian daycare: attendance, planned activities, dan activity log per anak.

Source schema: `src/daily_care_records/daily_care_records.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Read/write umum untuk role daycare: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`, `DAYCARE_SITTER`.
- `applyScheduleTemplate` hanya role daycare non-parent.
- `DAYCARE_SITTER` dibatasi pada assignment terkait untuk beberapa operasi.

## Queries

- `dailyCareRecord(daycareId: ObjectId!, date: Date!): DailyCareRecord`
- `dailyCareRecords(daycareId: ObjectId!, startDate: Date!, endDate: Date!): [DailyCareRecord!]!`
- `childDailyRecords(childId: ObjectId!, startDate: Date!, endDate: Date!): [DailyCareRecord!]!`
- `todayDailyCare(daycareId: ObjectId!): DailyCareRecord`

## Mutations

- `createDailyCareRecord(input: CreateDailyCareRecordInput!): DailyCareRecord!`
- `updateDailyCareRecord(id: ObjectId!, input: UpdateDailyCareRecordInput!): DailyCareRecord!`
- `checkInChild(input: CheckInChildInput!): DailyCareRecord!`
- `checkOutChild(input: CheckOutChildInput!): DailyCareRecord!`
- `logDailyActivity(input: LogDailyActivityInput!): DailyCareRecord!`
- `applyScheduleTemplate(input: ApplyScheduleTemplateInput!): DailyCareRecord!`

## Schema Definitions

Types:

- `AppliedScheduleTemplate`
- `AssignedSitter`
- `Attendance`
- `CheckIn`
- `CheckOut`
- `ChildDailyRecord`
- `DailyActivity`
- `DailyCareRecord`
- `PlannedDailyActivity`
- `UserRef`

Inputs:

- `ApplyScheduleTemplateInput`
- `AssignedSitterInput`
- `AttendanceInput`
- `CheckInChildInput`
- `CheckInInput`
- `CheckOutChildInput`
- `CheckOutInput`
- `ChildDailyRecordInput`
- `CreateDailyCareRecordInput`
- `DailyActivityInput`
- `LogDailyActivityInput`
- `PlannedDailyActivityInput`
- `UpdateDailyCareRecordInput`
- `UserRefInput`

Enums:

- `AttendanceStatus`
- `ShiftType`

Scalars:

- Tidak ada.

## Notes

- Format jam memakai `HH:mm`.
- `createDailyCareRecord` bersifat create/update record pada tanggal terkait.

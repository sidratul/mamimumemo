# Weekly Schedules

Jadwal mingguan daycare, assignment sitter, dan schedule per child.

Source schema: `src/weekly_schedules/weekly_schedules.typedef.ts`

Status: **Belum exposed di GraphQL schema**

## Access

- Source module butuh login.
- Mutation dirancang untuk `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`.

## Queries

- `weeklySchedule(daycareId: ObjectId!, weekStart: Date!): WeeklySchedule`
- `currentWeekSchedule(daycareId: ObjectId!): WeeklySchedule`
- `scheduleForDate(daycareId: ObjectId!, date: Date!): WeeklyScheduleDay`
- `childSchedule(childId: ObjectId!, weekStart: Date!): WeeklySchedule`

## Mutations

- `createWeeklySchedule(input: CreateWeeklyScheduleInput!): WeeklySchedule!`
- `updateWeeklySchedule(id: ObjectId!, input: UpdateWeeklyScheduleInput!): WeeklySchedule!`
- `assignSitter(input: AssignSitterInput!): WeeklySchedule!`

## Schema Definitions

Types:

- `ChildAssignment`
- `SitterAssignment`
- `UserRef`
- `WeeklyActivity`
- `WeeklySchedule`
- `WeeklyScheduleDay`

Inputs:

- `AssignSitterInput`
- `ChildAssignmentInput`
- `CreateWeeklyScheduleInput`
- `SitterAssignmentInput`
- `UpdateWeeklyScheduleInput`
- `WeeklyActivityInput`
- `WeeklyScheduleDayInput`

Enums:

- Tidak ada.

Scalars:

- Tidak ada.

## Notes

- Module source ada di `src/weekly_schedules`, tetapi belum diregister di `main.ts`; endpoint GraphQL belum exposed sampai import resolver/typeDefs ditambahkan ke schema.

# Schedule Templates

Template jadwal daycare berdasarkan hari, rentang tanggal, atau tanggal spesifik.

Source schema: `src/schedule_templates/schedule_templates.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Query butuh login.
- Create/update/deactivate: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`.

## Queries

- `scheduleTemplates(daycareId: ObjectId!, active: Boolean): [ScheduleTemplate!]!`
- `scheduleTemplate(id: ObjectId!): ScheduleTemplate`
- `templatesForDay(daycareId: ObjectId!, dayOfWeek: Int!): [ScheduleTemplate!]!`

## Mutations

- `createScheduleTemplate(input: CreateScheduleTemplateInput!): ScheduleTemplate!`
- `updateScheduleTemplate(id: ObjectId!, input: UpdateScheduleTemplateInput!): ScheduleTemplate!`
- `deactivateScheduleTemplate(id: ObjectId!): ScheduleTemplate!`

## Schema Definitions

Types:

- `ScheduleTemplate`
- `TemplateActivity`

Inputs:

- `CreateScheduleTemplateInput`
- `TemplateActivityInput`
- `UpdateScheduleTemplateInput`

Enums:

- `ScheduleTemplateTargetType`
- `SitterRole`

Scalars:

- Tidak ada.

## Notes

- Jika target `DAY_OF_WEEK`, `dayOfWeek` wajib ada.
- Jika target `DATE_RANGE`, `startDate` dan `endDate` wajib ada.
- Jika target `SPECIFIC_DATE`, `specificDate` wajib ada.
- Aktivitas template menggunakan `daycareActivityId` dan harus dimiliki tenant yang sama.

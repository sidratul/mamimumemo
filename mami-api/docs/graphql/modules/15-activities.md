# Activities

Aktivitas anak yang dibuat parent/guardian/daycare, termasuk timeline gabungan dengan aktivitas daycare.

Source schema: `src/activities/activities.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Semua operasi butuh user login.
- Akses data divalidasi lewat relasi user terhadap child/daycare.

## Queries

- `childActivities(childId: ObjectId!, date: Date, category: String): [Activity!]!`
- `activity(id: ObjectId!): Activity`
- `activityTimeline(input: ActivityTimelineInput!): ActivityTimeline!`
- `myActivities(date: Date): [Activity!]!`

## Mutations

- `createActivity(input: CreateActivityInput!): Activity!`
- `updateActivity(id: ObjectId!, input: UpdateActivityInput!): Activity!`
- `deleteActivity(id: ObjectId!): Boolean!`

## Schema Definitions

Types:

- `Activity`
- `ActivityTimeline`
- `ActivityUser`
- `DaycareTimelineActivity`
- `LoggedBy`

Inputs:

- `ActivityTimelineInput`
- `CreateActivityInput`
- `LoggedByInput`
- `UpdateActivityInput`

Enums:

- `ActivitySource`
- `EatenAmount`
- `Intensity`
- `MealType`
- `Mood`
- `NapQuality`
- `ToiletingType`

Scalars:

- Tidak ada.

## Notes

- Format jam memakai `HH:mm`.
- Field dinamis tergantung kategori aktivitas.
- Referensi aktivitas tenant memakai `daycareActivityId`, bukan ID katalog global.

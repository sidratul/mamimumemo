# Activity Categories

Master kategori aktivitas global yang dikelola system admin dan di-resolve dengan override daycare.

Source schema: `src/activity_categories/activity_categories.typedef.ts`

Status: **Belum exposed di GraphQL schema**

## Access

- Query kategori membutuhkan login.
- Create/update kategori global hanya `SUPER_ADMIN`.

## Queries

- `activityCategories(daycareId: ObjectId, active: Boolean): [ActivityCategoryDefinition!]!`

## Mutations

- `createActivityCategory(input: CreateActivityCategoryDefinitionInput!): ActivityCategoryDefinition!`
- `updateActivityCategory(id: ObjectId!, input: UpdateActivityCategoryDefinitionInput!): ActivityCategoryDefinition!`

## Schema Definitions

Types:

- `ActivityCategoryDefinition`

Inputs:

- `CreateActivityCategoryDefinitionInput`
- `UpdateActivityCategoryDefinitionInput`

Enums:

- `ActivityCategoryBehaviorType`

Scalars:

- Tidak ada.

## Notes

- `code` adalah identifier stabil yang digunakan pada activity, master activity, dan schedule.
- Label efektif menggunakan override `daycare_configs` jika tersedia.

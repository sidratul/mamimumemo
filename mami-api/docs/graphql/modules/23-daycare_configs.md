# Daycare Configs

Konfigurasi multi-tenant daycare untuk branding, override kategori aktivitas, dan preferensi.

Source schema: `src/daycare_configs/daycare_configs.typedef.ts`

Status: **Belum exposed di GraphQL schema**

## Access

- `SUPER_ADMIN` dapat mengelola config semua daycare.
- `DAYCARE_OWNER` dan `DAYCARE_ADMIN` hanya dapat mengelola config daycare aktifnya.

## Queries

- `daycareConfig(daycareId: ObjectId!): DaycareConfig!`

## Mutations

- `updateDaycareBranding(daycareId: ObjectId!, input: UpdateDaycareBrandingInput!): DaycareConfig!`
- `updateDaycareActivityCategory(`
- `daycareId: ObjectId!`
- `categoryId: ObjectId!`
- `input: UpdateDaycareActivityCategoryInput!`

## Schema Definitions

Types:

- `DaycareActivityCategoryConfig`
- `DaycareBrandingConfig`
- `DaycareConfig`
- `DaycarePreferencesConfig`

Inputs:

- `UpdateDaycareActivityCategoryInput`
- `UpdateDaycareBrandingInput`

Enums:

- Tidak ada.

Scalars:

- Tidak ada.

## Notes

- Satu dokumen config per daycare dengan unique index pada `daycareId`.
- Override kategori tidak mengubah code atau behavior kategori global.

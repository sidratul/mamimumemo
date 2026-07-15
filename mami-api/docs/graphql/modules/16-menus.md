# Menus

Menu makanan daycare per tanggal dan rentang tanggal.

Source schema: `src/menus/menus.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Query butuh login.
- Create/update/delete: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`.

## Queries

- `menu(daycareId: ObjectId!, date: Date!): Menu`
- `menus(daycareId: ObjectId!, startDate: Date!, endDate: Date!): [Menu!]!`
- `todayMenu(daycareId: ObjectId!): Menu`

## Mutations

- `createMenu(input: CreateMenuInput!): Menu!`
- `updateMenu(id: ObjectId!, input: UpdateMenuInput!): Menu!`
- `deleteMenu(id: ObjectId!): Boolean!`

## Schema Definitions

Types:

- `Meal`
- `Menu`

Inputs:

- `CreateMenuInput`
- `MealInput`
- `UpdateMenuInput`

Enums:

- `MealType`

Scalars:

- Tidak ada.

## Notes

- `createMenu` membuat atau mengupdate menu untuk tanggal tertentu.

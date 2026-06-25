# Children Daycare

Data anak dalam konteks daycare, termasuk profil, medis, preferensi, dan status aktif.

Source schema: `src/children_daycare/children_daycare.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Read: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`, `DAYCARE_SITTER`.
- Write: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`.

## Queries

- `daycareChildren(daycareId: ObjectId!, active: Boolean): [ChildrenDaycare!]!`
- `childrenDaycare(id: ObjectId!): ChildrenDaycare`
- `childByGlobalId(daycareId: ObjectId!, globalChildId: ObjectId!): ChildrenDaycare`
- `parentChildren(daycareId: ObjectId!, parentId: ObjectId!): [ChildrenDaycare!]!`

## Mutations

- `createChildrenDaycare(input: CreateChildrenDaycareInput!): ChildrenDaycare!`
- `updateChildrenDaycare(id: ObjectId!, input: UpdateChildrenDaycareInput!): ChildrenDaycare!`
- `deactivateChildrenDaycare(id: ObjectId!): ChildrenDaycare!`

## Schema Definitions

Types:

- `ChildCustomData`
- `ChildMedical`
- `ChildPreferences`
- `ChildProfile`
- `ChildrenDaycare`
- `Medication`

Inputs:

- `ChildCustomDataInput`
- `ChildMedicalInput`
- `ChildPreferencesInput`
- `ChildProfileInput`
- `CreateChildrenDaycareInput`
- `MedicationInput`
- `UpdateChildrenDaycareInput`

Enums:

- Tidak ada.

Scalars:

- Tidak ada.

## Notes

- `deactivateChildrenDaycare` adalah soft delete dengan `active = false`.

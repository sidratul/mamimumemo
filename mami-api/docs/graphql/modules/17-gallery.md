# Gallery

Dokumentasi foto daycare, umum maupun per anak.

Source schema: `src/gallery/gallery.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Semua query butuh login.
- Create/update: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`, `DAYCARE_SITTER`.
- Delete: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`.

## Queries

- `gallery(daycareId: ObjectId!, childName: String, limit: Int): [Gallery!]!`
- `galleryItem(id: ObjectId!): Gallery`
- `generalGallery(daycareId: ObjectId!): [Gallery!]!`
- `childGallery(daycareId: ObjectId!, childName: String!): [Gallery!]!`

## Mutations

- `createGallery(input: CreateGalleryInput!): Gallery!`
- `updateGallery(id: ObjectId!, input: UpdateGalleryInput!): Gallery!`
- `deleteGallery(id: ObjectId!): Boolean!`

## Schema Definitions

Types:

- `Gallery`
- `UploadedBy`

Inputs:

- `CreateGalleryInput`
- `UpdateGalleryInput`
- `UploadedByInput`

Enums:

- Tidak ada.

Scalars:

- Tidak ada.

## Notes

- URL foto divalidasi sebagai URL.

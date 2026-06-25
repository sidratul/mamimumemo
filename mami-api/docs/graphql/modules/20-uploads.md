# Uploads

Upload file melalui REST endpoint.

Source schema: custom REST endpoint

Status: **Exposed sebagai REST endpoint**

## Access

- Butuh token Bearer valid.

## Queries

- Tidak ada.

## Mutations

- `POST /uploads multipart/form-data`

## Schema Definitions

Types:

- `UploadedFile`

Inputs:

- `file: File`
- `folder: String`
- `filename: String`
- `visibility: public | private`

Enums:

- `UploadVisibility`

Scalars:

- Tidak ada.

## Notes

- Field `file` dan `folder` wajib diisi.
- `visibility` default `public`; nilai selain `private` diperlakukan sebagai `public`.
- Response berasal dari `UploadsService.uploadFile`.

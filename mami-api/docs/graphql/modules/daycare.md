# Daycare Module

Modul ini menangani:

- registrasi owner + daycare dalam satu request
- pembuatan membership `OWNER` saat registrasi berhasil
- list, count, dan detail daycare untuk `SUPER_ADMIN`
- cek daycare milik owner yang sedang login
- update dokumen pendukung selama proses review
- update status approval daycare oleh `SUPER_ADMIN`

Source utama:

- `src/daycare/daycare.typedef.ts`
- `src/daycare/daycare.validation.ts`
- `src/daycare/daycare.service.ts`

## Shape

`Daycare` utama yang dipakai query sekarang berisi:

- `_id`, `id`, `name`, `logoUrl`, `description`, `address`, `city`
- `owner: User!`
- `legalDocuments`
- `submittedAt`, `approvedAt`, `isActive`
- `approval { status, note, reviewedBy, reviewedAt, history }`
- `createdAt`, `updatedAt`

Catatan penyimpanan file:

- `logoUrl` disimpan sebagai URL public
- `legalDocuments[].url` disimpan sebagai path private di storage
- saat query dibaca, backend mengubah path private dokumen menjadi signed URL sementara

## Queries

### `daycares`

Dipakai oleh `SUPER_ADMIN` untuk melihat daftar semua daycare.

```graphql
query Daycares(
  $filter: DaycareFilterInput
  $sort: SortInput
  $pagination: PaginationInput
) {
  daycares(filter: $filter, sort: $sort, pagination: $pagination) {
    _id
    id
    name
    logoUrl
    owner {
      _id
      name
      email
    }
    city
    address
    submittedAt
    approvedAt
    isActive
    approval {
      status
      note
    }
  }
}
```

Contoh variables:

```json
{
  "filter": {
    "statuses": ["SUBMITTED"],
    "search": "mami"
  },
  "sort": {
    "sortBy": "createdAt",
    "sortType": "DESC"
  },
  "pagination": {
    "page": 1,
    "limit": 20
  }
}
```

Catatan:

- hanya `SUPER_ADMIN`
- `filter`, `sort`, dan `pagination` semuanya optional

Contoh response:

```json
{
  "data": {
    "daycares": [
      {
        "id": "67f31d8b2d62a66531f0a001",
        "_id": "67f31d8b2d62a66531f0a001",
        "name": "Mami Daycare Kemang",
        "logoUrl": "https://example.com/daycare-logo.png",
        "city": "Jakarta Selatan",
        "address": "Jl. Kemang No. 1",
        "submittedAt": "2026-04-07T02:10:00.000Z",
        "approvedAt": null,
        "isActive": false,
        "approval": {
          "status": "SUBMITTED",
          "note": "Registrasi daycare berhasil dikirim. Tim kami akan menghubungi owner."
        },
        "owner": {
          "_id": "67f31d8b2d62a66531f0aff1",
          "name": "Owner Daycare",
          "email": "owner.daycare@example.com"
        }
      }
    ]
  }
}
```

### `daycareCount`

```graphql
query DaycareCount($filter: DaycareFilterInput) {
  daycareCount(filter: $filter)
}
```

Contoh variables:

```json
{
  "filter": {
    "statuses": ["SUBMITTED"],
    "search": "mami"
  }
}
```

Contoh response:

```json
{
  "data": {
    "daycareCount": 1
  }
}
```

### `daycare`

```graphql
query Daycare($id: ObjectId!) {
  daycare(id: $id) {
    _id
    id
    name
    logoUrl
    description
    address
    city
    owner {
      _id
      name
      email
      phone
    }
    legalDocuments {
      type
      url
      verified
    }
    submittedAt
    approvedAt
    isActive
    approval {
      status
      note
      reviewedBy {
        userId
        name
      }
      reviewedAt
      history {
        status
        note
        changedAt
        changedBy {
          userId
          name
        }
      }
    }
    createdAt
    updatedAt
  }
}
```

Catatan:

- hanya `SUPER_ADMIN`

### `myDaycare`

```graphql
query MyDaycare {
  myDaycare {
    _id
    id
    name
    logoUrl
    city
    submittedAt
    approvedAt
    isActive
    approval {
      status
      note
    }
    legalDocuments {
      type
      url
      verified
    }
  }
}
```

Catatan:

- semua user yang punya membership daycare aktif dapat mengakses query ini
- jika user tidak punya daycare aktif, backend mengembalikan `null`

## Mutations

### `registerDaycare`

```graphql
mutation RegisterDaycare($input: RegisterDaycareInput!) {
  registerDaycare(input: $input) {
    id
    message
  }
}
```

Contoh variables:

```json
{
  "input": {
    "owner": {
      "name": "Owner Daycare",
      "email": "owner.daycare@example.com",
      "password": "password123",
      "phone": "081200000001"
    },
    "daycare": {
      "name": "Mami Daycare Kemang",
      "logoUrl": "https://example.com/daycare-logo.png",
      "description": "Daycare keluarga kecil",
      "address": "Jl. Kemang No. 1",
      "city": "Jakarta Selatan",
      "legalDocuments": []
    }
  }
}
```

Catatan:

- registrasi membuat 3 data sekaligus: `users`, `daycares`, dan `daycare_memberships`
- membership yang dibuat saat registrasi memakai persona `OWNER`

Contoh response:

```json
{
  "data": {
    "registerDaycare": {
      "id": "67f31d8b2d62a66531f0a001",
      "message": "Registrasi daycare berhasil dikirim."
    }
  }
}
```

Catatan:

- membuat owner baru dengan role `DAYCARE_OWNER`
- membuat daycare baru dengan `approval.status = SUBMITTED`
- `legalDocuments` optional
- `logoUrl` optional

### `updateDaycareDocuments`

```graphql
mutation UpdateDaycareDocuments($id: ObjectId!, $input: UpdateDaycareDocumentsInput!) {
  updateDaycareDocuments(id: $id, input: $input) {
    id
    message
  }
}
```

Contoh variables:

```json
{
  "id": "67f31d8b2d62a66531f0a001",
  "input": {
    "legalDocuments": [
      {
        "type": "NIB",
        "url": "https://example.com/nib-final.pdf",
        "verified": false
      },
      {
        "type": "SIUP",
        "url": "https://example.com/siup.pdf",
        "verified": false
      }
    ]
  }
}
```

Catatan:

- `DAYCARE_OWNER` hanya bisa update daycare yang `id`-nya sama dengan `context.user.daycareId`
- `SUPER_ADMIN` bisa update daycare mana pun

Contoh response:

```json
{
  "data": {
    "updateDaycareDocuments": {
      "id": "67f31d8b2d62a66531f0a001",
      "message": "Dokumen daycare berhasil diperbarui."
    }
  }
}
```

### `updateDaycareApprovalStatus`

```graphql
mutation UpdateDaycareApprovalStatus($id: ObjectId!, $input: UpdateDaycareApprovalInput!) {
  updateDaycareApprovalStatus(id: $id, input: $input) {
    id
    message
  }
}
```

Contoh variables:

```json
{
  "id": "67f31d8b2d62a66531f0a001",
  "input": {
    "status": "IN_REVIEW",
    "note": "Dokumen sedang direview admin."
  }
}
```

Catatan:

- hanya `SUPER_ADMIN`
- transisi status valid:

- `SUBMITTED -> IN_REVIEW`
- `IN_REVIEW -> APPROVED`
- `IN_REVIEW -> NEEDS_REVISION`
- `IN_REVIEW -> REJECTED`
- `APPROVED -> SUSPENDED`
- `SUSPENDED -> APPROVED`
- status yang wajib punya `note`:

- `NEEDS_REVISION`
- `REJECTED`
- `SUSPENDED`

Contoh response:

```json
{
  "data": {
    "updateDaycareApprovalStatus": {
      "id": "67f31d8b2d62a66531f0a001",
      "message": "Status daycare berhasil diubah ke APPROVED."
    }
  }
}
```

### `deleteDaycare`

Dipakai `SUPER_ADMIN` untuk soft delete daycare. Data tidak dihapus fisik dari database, tetapi disembunyikan dari query normal.

```graphql
mutation DeleteDaycare($id: ObjectId!) {
  deleteDaycare(id: $id) {
    id
    message
  }
}
```

Contoh variables:

```json
{
  "id": "67f31d8b2d62a66531f0a001"
}
```

Contoh response:

```json
{
  "data": {
    "deleteDaycare": {
      "id": "67f31d8b2d62a66531f0a001",
      "message": "Daycare berhasil dihapus."
    }
  }
}
```

Hak akses:

- hanya `SUPER_ADMIN`

### `purgeDaycare`

Hard delete. Opsional bisa sekalian menghapus owner.

```graphql
mutation PurgeDaycare($id: ObjectId!, $input: PurgeDaycareInput) {
  purgeDaycare(id: $id, input: $input) {
    id
    message
  }
}
```

Contoh variables tanpa hapus owner:

```json
{
  "id": "69d47972a581f5c09e0bbb49"
}
```

Contoh variables sekalian hapus owner:

```json
{
  "id": "69d47972a581f5c09e0bbb49",
  "input": {
    "deleteOwner": true
  }
}
```

Catatan:

- `deleteDaycare` dan `purgeDaycare` hanya untuk `SUPER_ADMIN`
- `purgeDaycare` dipakai kalau memang ingin hapus permanen
- jika `input.deleteOwner = true`, backend akan menghapus user owner yang terhubung ke daycare tersebut juga

Contoh response tanpa hapus owner:

```json
{
  "data": {
    "purgeDaycare": {
      "id": "69d47972a581f5c09e0bbb49",
      "message": "Daycare berhasil dihapus permanen."
    }
  }
}
```

Contoh response sekalian hapus owner:

```json
{
  "data": {
    "purgeDaycare": {
      "id": "69d47972a581f5c09e0bbb49",
      "message": "Daycare dan owner berhasil dihapus permanen."
    }
  }
}
```

# Daycare Memberships Module

Modul ini menyimpan relasi user ke daycare sebagai persona operasional:
- `OWNER`
- `ADMIN`
- `SITTER`

Collection ini menjadi sumber kebenaran hubungan user dengan daycare. Context login akan mengambil membership aktif user secara otomatis, jadi tidak perlu query `myDaycareMemberships`.

## Query

### `daycareMemberships(daycareId: ObjectId!)`
Ambil semua membership untuk satu daycare.

## Mutation

### `addUserToDaycare`
Tambah user ke daycare dengan dua mode:
- kirim `userId` untuk user yang sudah ada
- kirim `userData` untuk membuat user baru lalu langsung membuat membership

```graphql
mutation AddUserToDaycare($input: AddUserToDaycareInput!) {
  addUserToDaycare(input: $input) {
    id
    message
  }
}
```

Contoh variables untuk user baru:

```json
{
  "input": {
    "daycareId": "69d5d00040a26b8ba5cf1e01",
    "persona": "ADMIN",
    "userData": {
      "name": "Siti Admin",
      "email": "siti.admin@example.com",
      "password": "password123",
      "phone": "081200000123"
    }
  }
}
```

Contoh variables untuk user existing:

```json
{
  "input": {
    "daycareId": "69d5d00040a26b8ba5cf1e01",
    "persona": "SITTER",
    "userId": "69d5d11140a26b8ba5cf1e99"
  }
}
```

Catatan:
- `userId` dan `userData` bersifat XOR
- tepat satu yang harus diisi

### `deactivateDaycareMembership`
Nonaktifkan membership daycare.

```graphql
mutation DeactivateDaycareMembership($id: ObjectId!) {
  deactivateDaycareMembership(id: $id) {
    id
    message
  }
}
```

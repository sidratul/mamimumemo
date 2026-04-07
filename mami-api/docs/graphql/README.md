# GraphQL Modules Docs

Dokumen di folder ini mendeskripsikan query dan mutation berdasarkan schema backend aktual di `mami-api/src`.

## Modul

- [`modules/auth.md`](./modules/auth.md) - Login, refresh token, dan profile
- [`modules/users.md`](./modules/users.md) - Manajemen user oleh super admin
- [`modules/daycare.md`](./modules/daycare.md) - Registrasi daycare, list daycare, count daycare, detail, myDaycare, dan approval update

## Prioritas Baca

Untuk flow registrasi daycare dan review admin, mulai dari:

1. `modules/auth.md`
2. `modules/users.md`
3. `modules/daycare.md`

## Catatan

- Dokumen ini mengikuti source code backend saat ini, bukan summary lama.
- Jika schema berubah, update dokumen ini di commit yang sama.
- Modul lain bisa ditambahkan bertahap dengan format yang sama per folder `src/<module>`.

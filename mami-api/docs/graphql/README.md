# GraphQL Modules Docs

Dokumen di folder ini mendeskripsikan query dan mutation berdasarkan schema backend aktual di `mami-api/src`.

## Modul

- [`modules/daycare.md`](./modules/daycare.md) - Registrasi daycare, list daycare, count daycare, detail, dan approval update
- [`modules/auth.md`](./modules/auth.md) - Register, login, refresh token, profile

## Prioritas Baca

Untuk flow registrasi daycare dan review admin, mulai dari:

1. `modules/auth.md`
2. `modules/daycare.md`

## Catatan

- Dokumen ini mengikuti source code backend saat ini, bukan summary lama.
- Jika schema berubah, update dokumen ini di commit yang sama.
- Modul lain bisa ditambahkan bertahap dengan format yang sama per folder `src/<module>`.

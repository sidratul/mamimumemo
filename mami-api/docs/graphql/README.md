# GraphQL Modules Docs

Dokumen ini mengikuti schema dan handler backend aktual di `mami-api/src` dan `mami-api/main.ts`.

GraphQL endpoint default: `/graphql`

REST endpoint tambahan:

- `POST /uploads` untuk upload file multipart.

## Shared Types

- `ObjectId` dan `Date` tersedia sebagai scalar shared.
- `SortInput`, `PaginationInput`, dan `ActionResponse` tersedia dari shared typedef.
- Request authenticated memakai header `Authorization: Bearer <accessToken>`.

## Exposed Modules

- [01. Health](./modules/01-health.md) - Pengecekan sederhana bahwa GraphQL API aktif.
- [02. Auth](./modules/02-auth.md) - Login, refresh token, dan profile user aktif.
- [03. Users](./modules/03-users.md) - Manajemen user global, filter access/persona, reset password, dan delete user.
- [04. Daycare](./modules/04-daycare.md) - Registrasi daycare, list/review oleh system admin, dokumen legal, approval, delete, dan purge.
- [05. Daycare Memberships](./modules/05-daycare_memberships.md) - Relasi user ke daycare sebagai owner, admin, atau sitter.
- [06. Parents](./modules/06-parents.md) - Data parent dalam konteks daycare, custom data, emergency contact, pickup authorization, dan anak terkait.
- [07. Children](./modules/07-children.md) - Data anak global milik parent dan guardian sharing.
- [08. Children Daycare](./modules/08-children_daycare.md) - Data anak dalam konteks daycare, termasuk profil, medis, preferensi, dan status aktif.
- [09. Medical Records](./modules/09-medical_records.md) - Rekam medis anak: sakit, cedera, alergi, medication, dan kondisi kronis.
- [10. Contracts](./modules/10-contracts.md) - Kontrak layanan daycare antara daycare, parent, dan anak.
- [11. Master Activities](./modules/11-master_activities.md) - Master aktivitas daycare dan konfigurasi field per kategori.
- [12. Schedule Templates](./modules/12-schedule_templates.md) - Template jadwal daycare berdasarkan hari, rentang tanggal, atau tanggal spesifik.
- [13. Daily Care Records](./modules/13-daily_care_records.md) - Catatan operasional harian daycare: attendance, planned activities, dan activity log per anak.
- [14. Activities](./modules/14-activities.md) - Aktivitas anak yang dibuat parent/guardian/daycare, termasuk timeline gabungan dengan aktivitas daycare.
- [15. Menus](./modules/15-menus.md) - Menu makanan daycare per tanggal dan rentang tanggal.
- [16. Gallery](./modules/16-gallery.md) - Dokumentasi foto daycare, umum maupun per anak.
- [17. Notifications](./modules/17-notifications.md) - Notifikasi user, unread count, mark read, dan notifikasi bulk oleh daycare/admin.
- [18. Invoices](./modules/18-invoices.md) - Tagihan daycare untuk parent berdasarkan kontrak dan periode.
- [19. Staff Payments](./modules/19-staff_payments.md) - Pembayaran staff daycare per periode kerja.
- [20. Uploads](./modules/20-uploads.md) - Upload file melalui REST endpoint.

## Source Exists But Not Mounted

- [21. Weekly Schedules](./modules/21-weekly_schedules.md) - Module source ada di `src/weekly_schedules`, tetapi belum diregister di `main.ts`; endpoint GraphQL belum exposed sampai import resolver/typeDefs ditambahkan ke schema.

## Maintenance

- Update docs saat typedef, resolver, service guard, atau `main.ts` berubah.
- Jalankan `deno run -A scripts/sync-graphql-docs.ts` dari folder `mami-api` untuk regenerate docs dari typedef saat ini.

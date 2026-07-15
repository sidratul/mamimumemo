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
- [11. Master Activities](./modules/11-master_activities.md) - Katalog aktivitas global yang dikelola system admin.
- [12. Daycare Activities](./modules/12-daycare_activities.md) - Aktivitas milik tenant daycare, baik hasil adopsi katalog global maupun aktivitas custom.
- [13. Schedule Templates](./modules/13-schedule_templates.md) - Template jadwal daycare berdasarkan hari, rentang tanggal, atau tanggal spesifik.
- [14. Daily Care Records](./modules/14-daily_care_records.md) - Catatan operasional harian daycare: attendance, planned activities, dan activity log per anak.
- [15. Activities](./modules/15-activities.md) - Aktivitas anak yang dibuat parent/guardian/daycare, termasuk timeline gabungan dengan aktivitas daycare.
- [16. Menus](./modules/16-menus.md) - Menu makanan daycare per tanggal dan rentang tanggal.
- [17. Gallery](./modules/17-gallery.md) - Dokumentasi foto daycare, umum maupun per anak.
- [18. Notifications](./modules/18-notifications.md) - Notifikasi user, unread count, mark read, dan notifikasi bulk oleh daycare/admin.
- [19. Invoices](./modules/19-invoices.md) - Tagihan daycare untuk parent berdasarkan kontrak dan periode.
- [20. Staff Payments](./modules/20-staff_payments.md) - Pembayaran staff daycare per periode kerja.
- [21. Uploads](./modules/21-uploads.md) - Upload file melalui REST endpoint.
- [22. Weekly Schedules](./modules/22-weekly_schedules.md) - Jadwal mingguan daycare, assignment sitter, dan schedule per child.
- [23. Activity Categories](./modules/23-activity_categories.md) - Master kategori aktivitas global yang dikelola system admin dan di-resolve dengan override daycare.
- [24. Daycare Configs](./modules/24-daycare_configs.md) - Konfigurasi multi-tenant daycare untuk branding, override kategori aktivitas, dan preferensi.

## Source Exists But Not Mounted

- Tidak ada.

## Maintenance

- Update docs saat typedef, resolver, service guard, atau `main.ts` berubah.
- Jalankan `deno run -A scripts/sync-graphql-docs.ts` dari folder `mami-api` untuk regenerate docs dari typedef saat ini.

# Mami API Modules

Dokumen ini merangkum modul yang ada di source code, bukan rencana lama.

## Modul Domain

| Module | Folder | Wired in `main.ts` | Test File Present |
|--------|--------|--------------------|-------------------|
| Health | `src/health` | Yes | Yes |
| Auth | `src/auth` | Yes | Yes |
| Children | `src/children` | Yes | Yes |
| Medical Records | `src/medical_records` | Yes | Yes |
| Activities | `src/activities` | Yes | Yes |
| Parents | `src/parents` | Yes | Yes |
| Children Daycare | `src/children_daycare` | Yes | No |
| Contracts | `src/contracts` | Yes | Yes |
| Master Activities | `src/master_activities` | Yes | Yes |
| Daily Care Records | `src/daily_care_records` | Yes | Yes |
| Schedule Templates | `src/schedule_templates` | Yes | Yes |
| Weekly Schedules | `src/weekly_schedules` | Yes | Yes |
| Invoices | `src/invoices` | Yes | Yes |
| Staff Payments | `src/staff_payments` | Yes | Yes |
| Menus | `src/menus` | Yes | Yes |
| Gallery | `src/gallery` | Yes | Yes |
| Notifications | `src/notifications` | Yes | Yes |

## Ringkasan

- Semua modul di tabel di atas sudah dipanggil dari `main.ts`
- Hampir semua modul memiliki file test tersendiri
- Pengecualian yang terlihat dari source tree saat ini adalah `children_daycare`, yang belum memiliki `*.test.ts`

## Catatan

- Kehadiran file test tidak otomatis berarti suite sudah diverifikasi ulang dalam sesi ini
- Untuk mengecek detail kontrak GraphQL, lihat `typedef`, `resolver`, dan `service` pada modul terkait

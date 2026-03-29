# TDD Index

Indeks ini merangkum dokumen TDD yang tersedia di repo saat ini dan menyamakan istilah status yang sebelumnya tersebar di beberapa file.

## Ringkasan

- Total modul bisnis utama: 16
- Tambahan modul admin system: 1
- Dokumen TDD tersedia untuk modul 1-17
- Kedalaman dokumen tidak seragam:
  - Modul 1-9 memiliki file TDD tersendiri
  - Modul 10-16 diringkas di `TDD_10-16_QUICK_REF.md`
  - Modul 17 tersedia sebagai draft khusus system admin

## Status Dokumen

| # | Module | File | Kedalaman |
|---|--------|------|-----------|
| 1 | Authentication | `TDD_01_AUTH.md` | Detailed |
| 2 | Children | `TDD_02_CHILDREN.md` | Detailed |
| 3 | Medical Records | `TDD_03_MEDICAL_RECORDS.md` | Detailed |
| 4 | Activities | `TDD_04_ACTIVITIES.md` | Detailed |
| 5 | Parents | `TDD_05_PARENTS.md` | Detailed |
| 6 | Children Daycare | `TDD_06_CHILDREN_DAYCARE.md` | Detailed |
| 7 | Contracts | `TDD_07_CONTRACTS.md` | Concise |
| 8 | Master Activities | `TDD_08_MASTER_ACTIVITIES.md` | Concise |
| 9 | Daily Care Records | `TDD_09_DAILY_CARE_RECORDS.md` | Concise |
| 10 | Schedule Templates | `TDD_10-16_QUICK_REF.md` | Quick reference |
| 11 | Weekly Schedules | `TDD_10-16_QUICK_REF.md` | Quick reference |
| 12 | Invoices | `TDD_10-16_QUICK_REF.md` | Quick reference |
| 13 | Staff Payments | `TDD_10-16_QUICK_REF.md` | Quick reference |
| 14 | Menus | `TDD_10-16_QUICK_REF.md` | Quick reference |
| 15 | Gallery | `TDD_10-16_QUICK_REF.md` | Quick reference |
| 16 | Notifications | `TDD_10-16_QUICK_REF.md` | Quick reference |
| 17 | Daycare Admin (System) | `TDD_17_DAYCARE_ADMIN.md` | Draft |

## File Pendukung

- `STATUS_AND_TEMPLATES.md` - Template dan panduan maintenance dokumen
- `COMPLETION_SUMMARY.md` - Ringkasan level dokumentasi
- `FINAL_STATUS.md` - Snapshot final cakupan TDD di repo ini
- `../TDD_TECHNICAL_DESIGN.md` - Dokumen gabungan lama yang masih relevan sebagai referensi implementasi
- `../TDD_PART2_MODULES_10-16.md` - Ringkasan tambahan modul 10-16

## Catatan Pemakaian

- Untuk implementasi frontend/backend harian, mulai dari file TDD modul terkait jika tersedia.
- Untuk modul 10-16, gunakan `TDD_10-16_QUICK_REF.md`, lalu cocokkan dengan schema dan resolver aktual di `mami-api/src`.
- Untuk fitur approval daycare di admin app, gunakan `TDD_17_DAYCARE_ADMIN.md`.

# Mami API

Backend GraphQL untuk sistem manajemen daycare dengan Deno, MongoDB, dan JWT.

## Stack

- Runtime: Deno
- API: GraphQL Yoga
- Database: MongoDB dengan Mongoose
- Validation: Zod
- Auth: JWT + bcrypt

## Struktur

- `src` - Modul domain aplikasi
- `shared` - Framework core, guards, scalars, config, utils
- `tests` - Test utilities
- `mocks` - Mock data pengujian
- `scripts` - Scaffolding module

## Modul yang Terpasang di Server

Server saat ini me-load modul berikut dari `main.ts`:

- `health`
- `auth`
- `children`
- `medical_records`
- `activities`
- `parents`
- `children_daycare`
- `contracts`
- `master_activities`
- `daily_care_records`
- `schedule_templates`
- `weekly_schedules`
- `invoices`
- `staff_payments`
- `menus`
- `gallery`
- `notifications`

## Status Implementasi

- Struktur modul sudah tersedia luas dan seluruh modul di atas sudah di-wire ke schema GraphQL utama.
- Kedalaman implementasi tiap modul bisa berbeda, jadi cek service/repository/test modul terkait sebelum menganggap fiturnya production-ready.
- File ringkasan lama di folder ini sebelumnya tidak konsisten; README ini sekarang menjadi gambaran status tingkat tinggi.

## Menjalankan Server

1. Buat `.env` dari `.env.example`
2. Isi minimal:

```bash
MONGO_URI=mongodb://localhost:27017/mami
JWT_SECRET=your-secret-key
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
PORT=8000
```

3. Jalankan:

```bash
deno task start
```

Endpoint GraphQL default: `http://localhost:8000/graphql`

## Testing

- `deno task test` untuk menjalankan seluruh test suite
- Test file tersedia untuk sebagian besar modul domain dan health check
- Lihat `TEST_SUMMARY.md` untuk ringkasan cakupan file test yang ada

## Dokumen Terkait

- `README_MODULES.md` - Ringkasan status modul dan test
- `../SPECIFICATION.md` - Spesifikasi sistem
- `../TDD_TECHNICAL_DESIGN.md` - Desain query/mutation gabungan

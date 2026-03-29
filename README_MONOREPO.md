# Daycare Monorepo

Monorepo ini berisi backend GraphQL berbasis Deno dan tiga target aplikasi mobile untuk sistem manajemen daycare.

## Struktur

- `mami-api` - Backend GraphQL (Deno + MongoDB + JWT)
- `apps/mami-admin-app` - App system admin, paling aktif saat ini
- `apps/mami-daycare-app` - App daycare, masih tahap bootstrap
- `apps/mami-owner-app` - App owner, masih placeholder
- `packages/core` - Role, session type, app resolver bersama
- `packages/ui` - Brand tokens dan helper UI bersama
- `packages/graphql` - Placeholder untuk generated GraphQL artifacts
- `tdd` - Dokumen TDD per modul dan ringkasan status

## Status Saat Ini

- Backend `mami-api` sudah memuat banyak modul domain dan seluruhnya sudah di-wire di `main.ts`.
- `mami-admin-app` sudah memiliki flow login, session storage, Apollo client, dashboard, daycare queue, detail approval, dan beberapa layar admin lain.
- `mami-admin-app` masih memakai mock/in-memory data untuk fitur daycare approval, jadi belum semuanya terhubung ke API nyata.
- `mami-daycare-app` baru memiliki flow registrasi daycare dasar dan submit simulatif.
- `mami-owner-app` masih placeholder.

## Commands

- `npm run admin:start` - Menjalankan admin app
- `npm run admin:check` - Lint + typecheck admin app
- `npm run owner:start` - Menjalankan owner app placeholder
- `npm run daycare:start` - Menjalankan daycare app
- `npm run build:packages` - Build shared packages

## Dokumen Acuan

- `SPECIFICATION.md` - Spesifikasi bisnis dan arsitektur produk
- `TDD_TECHNICAL_DESIGN.md` - TDD gabungan lintas modul
- `TDD_PART2_MODULES_10-16.md` - Ringkasan modul 10-16
- `tdd/INDEX.md` - Indeks status TDD yang dirapikan

## Catatan

- Status dokumentasi di repo ini sebelumnya tidak konsisten antar file. Dokumen ringkasan sekarang mengikuti isi source code yang ada di repo.
- Jika ingin satu sumber kebenaran untuk status implementasi, mulai dari `README_MONOREPO.md`, `tdd/INDEX.md`, dan `mami-api/README.md`.

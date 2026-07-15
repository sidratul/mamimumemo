# Daycare Monorepo

Monorepo ini berisi backend GraphQL berbasis Deno dan target aplikasi mobile untuk sistem manajemen daycare.

## Struktur

- `mami-api` - Backend GraphQL (Deno + MongoDB + JWT)
- `apps/mami-admin-app` - App system admin, paling aktif saat ini
- `apps/mami-daycare-app` - App daycare, masih tahap bootstrap
- `apps/mami-parent-app` - App parent, scaffold baseline
- `packages/core` - Role, session type, app resolver bersama
- `packages/ui` - Brand tokens dan helper UI bersama
- `packages/graphql` - Placeholder untuk generated GraphQL artifacts
- `tdd` - Dokumen TDD per modul dan ringkasan status

## Status Saat Ini

- Backend `mami-api` sudah memuat banyak modul domain dan seluruhnya sudah di-wire di `main.ts`.
- `mami-admin-app` sudah memiliki flow login, session storage, Apollo client, dashboard, daycare queue, detail approval, dan beberapa layar admin lain.
- `mami-admin-app` masih memakai mock/in-memory data untuk fitur daycare approval, jadi belum semuanya terhubung ke API nyata.
- `mami-daycare-app` baru memiliki flow registrasi daycare dasar dan submit simulatif.
- `mami-parent-app` sudah punya scaffold baseline untuk route groups, container per page, dan dynamic form shared.

## Commands

- `pnpm install` - Install dependency frontend workspace
- `pnpm admin:start` - Menjalankan admin app
- `pnpm admin:check` - Lint + typecheck admin app
- `pnpm parent:start` - Menjalankan parent app
- `pnpm daycare:start` - Menjalankan daycare app
- `pnpm daycare:desktop:dev` - Menjalankan daycare app sebagai desktop app Tauri
- `pnpm daycare:desktop:build` - Build installer desktop daycare app
- `pnpm build:packages` - Build shared packages

Backend `mami-api` tetap memakai Deno dan Docker Compose, bukan pnpm.

## Dokumen Acuan

- `SPECIFICATION.md` - Spesifikasi bisnis dan arsitektur produk
- `TDD_TECHNICAL_DESIGN.md` - TDD gabungan lintas modul
- `TDD_PART2_MODULES_10-16.md` - Ringkasan modul 10-16
- `tdd/INDEX.md` - Indeks status TDD yang dirapikan

## Catatan

- Status dokumentasi di repo ini sebelumnya tidak konsisten antar file. Dokumen ringkasan sekarang mengikuti isi source code yang ada di repo.
- Jika ingin satu sumber kebenaran untuk status implementasi, mulai dari `README_MONOREPO.md`, `tdd/INDEX.md`, dan `mami-api/README.md`.

# Mami Daycare App

App ini sekarang difokuskan untuk onboarding daycare, dimulai dari flow registrasi owner dan submit daycare ke admin system.

## Flow Yang Sudah Ada

- input profil daycare
- input akun owner
- register owner sebagai `DAYCARE_OWNER`
- login owner
- create daycare draft
- submit daycare registration ke queue admin system

## Konfigurasi

Gunakan `EXPO_PUBLIC_GRAPHQL_URL` agar app mengarah ke backend yang benar.

Contoh:

```bash
EXPO_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
```

Untuk desktop Tauri, nilai ini tetap dibaca oleh Expo saat development/export web.
Set env ini ke URL API cloud atau server lokal daycare sebelum menjalankan app.

## Desktop

Daycare app bisa dijalankan sebagai desktop app dengan Tauri.

Prerequisite desktop build:

- Rust/Cargo via rustup: https://rustup.rs/
- Xcode Command Line Tools di macOS

```bash
pnpm --filter @mami/daycare-app desktop:dev
```

Build installer desktop:

```bash
pnpm --filter @mami/daycare-app desktop:build
```

Perintah root yang setara:

```bash
pnpm daycare:desktop:dev
pnpm daycare:desktop:build
```

Fungsi desktop/web yang sudah tersedia:

- konfigurasi GraphQL URL dari panel `Server API` di menu settings
- tes koneksi GraphQL sebelum menyimpan server
- simpan konfigurasi server di storage lokal app
- reset server ke default dari `EXPO_PUBLIC_GRAPHQL_URL`
- otomatis keluar akun saat server API diganti agar token lama tidak dipakai ke server baru

## Catatan

- Dashboard operasional daycare masih placeholder
- Flow berikutnya yang disarankan: session owner, status registrasi, lalu modul operasional seperti children, attendance, dan daily care records

# Seed Super Admin

Script ini dipakai untuk menyiapkan akun `SUPER_ADMIN` agar `mami-admin-app` bisa login dan menjalankan flow approval secara penuh.

## Jalankan

```bash
deno run -A scripts/seed-admin.ts
```

## Default Credentials

- Email: `admin@mami.com`
- Password: `admin123`
- System role: `SUPER_ADMIN`

## Catatan

- Script ini melakukan upsert berdasarkan email, jadi aman dijalankan ulang
- Script menyimpan `systemRole: SUPER_ADMIN` dan menghapus field legacy `role`
- Ganti password default setelah first login

## Seed Daycare

Membuat atau memperbarui user owner, `Saldira Daycare`, dan membership
`OWNER` dalam satu command:

```bash
deno task seed:daycare
```

Default owner:

- Email: `admin@saldira.com`
- Password: `Admin@2026`

## Seed Activity Categories

Membuat atau memperbarui kategori aktivitas global:

```bash
deno task seed:categories
```

Dalam Docker Compose:

```bash
docker compose exec deno-app deno task seed:categories
```

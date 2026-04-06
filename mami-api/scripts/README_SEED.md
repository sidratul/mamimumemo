# Seed Super Admin

Script ini dipakai untuk menyiapkan akun `SUPER_ADMIN` agar `mami-admin-app` bisa login dan menjalankan flow approval secara penuh.

## Jalankan

```bash
deno run -A scripts/seed-admin.ts
```

## Default Credentials

- Email: `admin@mami.com`
- Password: `admin123`
- Role: `SUPER_ADMIN`

## Catatan

- Script ini melakukan upsert berdasarkan email, jadi aman dijalankan ulang
- Script ini sengaja membuat `SUPER_ADMIN`, bukan `ADMIN`, karena flow approval admin system saat ini mensyaratkan role `SUPER_ADMIN`
- Ganti password default setelah first login

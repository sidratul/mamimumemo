# Migrations

Simpan file migrasi Deno di folder ini.

Contoh nama file:

- `20260407_fix_admin_role.ts`
- `20260408_seed_super_admin.ts`

Buat file migration baru:

```bash
deno task migration:new fix_admin_role
```

Cara menjalankan:

```bash
deno task migrate migrations/20260407_fix_admin_role.ts
```

Jika file migrasi butuh environment variable dari `.env`, task `migrate` sudah memuatnya otomatis.

Template migration baru sudah menyiapkan:

- `mongoose`
- koneksi `MONGO_URI`
- `db` dari `mongoose.connection.db`

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

Jika env tidak diset, app akan fallback ke `http://localhost:8000/graphql`.

## Catatan

- Dashboard operasional daycare masih placeholder
- Flow berikutnya yang disarankan: session owner, status registrasi, lalu modul operasional seperti children, attendance, dan daily care records

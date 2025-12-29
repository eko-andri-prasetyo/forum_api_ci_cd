# Forum API — CI/CD + Security Pack (Dicoding)

Paket ini dibuat khusus menyesuaikan:
- Port app: **5000**
- `npm test` = `jest --setupFiles dotenv/config -i`
- Migrasi DB menggunakan **node-pg-migrate**.

## File yang disediakan
- `.github/workflows/ci.yml` → CI (PR ke master/main) + Postgres service container
- `.github/workflows/cd.yml` → CD (push ke master/main) via SSH (**skip jika secrets belum lengkap**)
- `nginx.conf` → rate limit 90 req/menit untuk `/threads` dan turunannya
- `.env.example`
- `scripts/deploy.sh` (opsional)
- File Postman: `Forum API V2 Test.postman_collection.json` + environment.

## Cara pakai
1. Copy semua file ke **root repo Forum API** Anda.
2. Commit dan push.

### Secrets minimum (CI)
Walau workflow sudah fallback, sebaiknya set:
- `ACCESS_TOKEN_KEY`
- `REFRESH_TOKEN_KEY`

### Secrets untuk CD (deploy SSH)
- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`
- `SERVER_SSH_PORT`

## Catatan penting
- CI membuat file `config/database/test.json` otomatis agar migrasi test DB pasti jalan.
- CI menjalankan migrasi:
  `npx node-pg-migrate up -f config/database/test.json`

## NGINX rate limit
Sudah membatasi:
- `/threads` dan semua path turunannya
- 90 request/menit per IP

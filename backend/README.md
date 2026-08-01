# HenWasteOil Backend

REST API backend untuk platform rantai pasok minyak jelantah PT Hijau Energi Nusantara (HEN): masyarakat menyetor minyak ke pengepul, pengepul membuat batch ke stakeholder, stakeholder melakukan lab review, validasi, dashboard, audit trail, dan integrasi ML.

## Teknologi

- Node.js + Express.js
- PostgreSQL
- Prisma ORM
- JWT authentication + RBAC
- Swagger UI/OpenAPI
- Docker Compose
- Nginx reverse proxy untuk deployment VPS

## Cara Menjalankan Lokal

1. Install dependencies:

```bash
npm install
```

2. Buat file `.env` dari `.env.example`, lalu sesuaikan `DATABASE_URL`, `JWT_SECRET`, dan `CORS_ORIGIN`.

3. Jalankan migration:

```bash
npx prisma migrate dev
```

4. Isi data dummy:

```bash
npm run prisma:seed
```

5. Jalankan server:

```bash
npm run dev
```

API berjalan di:

```text
http://localhost:3000
```

Swagger docs:

```text
http://localhost:3000/api-docs
```

Health check:

```text
GET /api/v1/health
```

## Cara Menjalankan Dengan Docker

Siapkan `.env` production, lalu jalankan:

```bash
docker compose up -d --build
```

Jalankan seed di container API:

```bash
docker compose exec api npm run prisma:seed
```

API container expose ke host di:

```text
127.0.0.1:3000
```

Untuk public domain, gunakan Nginx reverse proxy ke `http://127.0.0.1:3000`.

## Environment Penting

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:password@db:5432/henwasteoil?schema=public
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://eepis.web.id
ML_SERVICE_BASE_URL=https://ml.eepis.web.id
```

## Akun Demo

Semua akun demo memakai password:

```text
password123
```

Stakeholder:

```text
stakeholder@hen.test
stakeholder2@hen.test
stakeholder3@hen.test
```

Pengepul:

```text
collector1@hen.test
collector2@hen.test
collector3@hen.test
collector4@hen.test
collector5@hen.test
collector6@hen.test
```

Masyarakat:

```text
community1@hen.test sampai community30@hen.test
```

## Fitur Utama

- Auth register/login/logout dan RBAC 3 role.
- Profile per role: masyarakat, pengepul, stakeholder.
- Pencarian dan nearby collector berbasis koordinat.
- Pengajuan setoran masyarakat ke pengepul.
- Validasi setoran oleh pengepul: liter aktual, endapan, liter bersih, nominal bayar.
- Pengajuan batch pengepul ke stakeholder/HEN.
- CRUD hasil lab dan validasi final stakeholder.
- Dashboard stakeholder, collector, dan community.
- Audit trail untuk aksi penting.
- Integrasi ML service untuk prediksi dana dan clustering lokasi collector.
- Swagger API docs di `/api-docs`.

## Asumsi

- Jarak collector terdekat dihitung dengan haversine.
- Harga berjenjang: stakeholder menetapkan harga acuan, pengepul menetapkan harga beli ke masyarakat.
- Nominal pembayaran masyarakat dihitung dari `cleanLiter * buyPricePerLiter`.
- `cleanLiter = actualLiter - sedimentLiter`.
- Submission yang sudah diterima pengepul menjadi risiko operasional pengepul jika batch ditolak stakeholder.
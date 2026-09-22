# REVALUE

REVALUE adalah platform berbasis web yang menghubungkan masyarakat, pengepul atau bank sampah, industri daur ulang, dan pengolah kompos untuk menciptakan ekosistem pengelolaan sampah yang lebih terintegrasi, transparan, dan berkelanjutan.

Project ini menggabungkan frontend React, backend API Node.js, ORM Prisma, dan database MySQL yang di-host di Aiven. Frontend di-deploy melalui GitHub Pages, sedangkan backend API berjalan di Railway.

---

## Ringkasan Proyek

REVALUE dirancang untuk membantu:

- masyarakat menjual sampah atau bahan daur ulang,
- pengepul dan bank sampah mengelola transaksi,
- industri memperoleh kebutuhan material daur ulang,
- pengelola kompos memantau tren dan dampak lingkungan,
- semua pihak mengakses data secara lebih transparan.

---

## Fitur Utama

- autentikasi pengguna dengan register dan login,
- katalog sampah dan produk daur ulang,
- daftar drop-off location,
- dashboard dampak lingkungan,
- manajemen saldo wallet pengguna,
- skema data berbasis Prisma/MySQL.

---

## Arsitektur

```text
GitHub Pages  --->  Frontend React + Vite
      |
      v
Railway       --->  Backend Node.js API + Prisma
      |
      v
Aiven MySQL   --->  Database utama
```

Alur umum:

- Frontend memanggil backend melalui endpoint API.
- Backend mengakses database MySQL melalui Prisma.
- Semua konfigurasi sensitif disimpan di environment variable, bukan di source code.

---

## Stack Teknologi

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Prisma ORM
- MySQL
- Dotenv

### Platform Deployment

- GitHub Pages untuk frontend
- Railway untuk backend
- Aiven untuk MySQL

---

## Struktur Project

```text
REVALUE/
├── src/
│   ├── App.jsx
│   ├── components/
│   ├── assets/
│   └── index.css
├── public/
├── server/
│   └── index.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .github/
│   └── workflows/
├── package.json
├── vite.config.js
├── .env
├── .gitignore
├── README.md
└── index.html
```

---

## Persyaratan

Sebelum menjalankan project, pastikan perangkat Anda sudah memiliki:

- Node.js 18+
- npm
- akses ke database MySQL Aiven
- akses ke Railway dan GitHub Pages bila ingin deploy

---

## Setup Lokal

### 1. Clone repository

```bash
git clone git@github.com:Sub-Danzzilo/revalue-marketplace.git
cd revalue-marketplace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Siapkan environment variable

Buat file `.env` kemudian isi:

```env
DATABASE_URL="mysql://username:password@host-aiven:port/defaultdb?sslaccept=accept_invalid_certs"
FRONTEND_URL="http://localhost:5173"
API_PORT=3001
```

> Simpan secret di environment variable, bukan di source code. Pastikan credential valid dan aman.

### 4. Jalankan Prisma generate dan migrate

```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Jalankan backend API

```bash
npm run server
```

Backend akan berjalan di:

```text
http://localhost:3001
```

### 6. Jalankan frontend

Di terminal terpisah:

```bash
npm run dev
```

Frontend akan berjalan di:

```text
http://localhost:5173
```

---

## Build Production

Untuk build frontend untuk production:

```bash
npm run build
```

Untuk validasi kualitas kode:

```bash
npm run lint
```

---

## Prisma dan Database

Project ini menggunakan Prisma sebagai ORM untuk MySQL.

### Perintah umum

Generate client Prisma:

```bash
npx prisma generate
```

Apply migration yang sudah ada:

```bash
npx prisma migrate deploy
```

Buat migration baru saat mengubah schema:

```bash
npx prisma migrate dev --name nama_migration
```

### Catatan penting

- `DATABASE_URL` harus mengarah ke database yang valid.
- Migrasi hanya dijalankan di backend environment.
- Jangan menaruh credential database di frontend.

---

## Deployment

### Frontend (GitHub Pages)

Frontend di-deploy ke GitHub Pages dengan environment variable:

```env
VITE_API_URL=https://domain-backend-railway.up.railway.app/api
```

Workflow deployment berada di:

```text
.github/workflows/deploy-pages.yml
```

### Backend (Railway)

Backend API di-deploy di Railway dengan variable:

```env
DATABASE_URL="mysql://username:password@host-aiven:port/defaultdb?sslaccept=accept_invalid_certs"
FRONTEND_URL="https://username.github.io/revalue-marketplace/"
PORT=8080
```

Start command yang dipakai:

```bash
npm start
```

Di `package.json`, script start sudah diatur untuk mengeksekusi migrasi sebelum menjalankan API:

```json
"start": "npx prisma migrate deploy && npm run server"
```

---

## Endpoint API

### Health check

```http
GET /api/health
```

Response contoh:

```json
{
  "status": "ok",
  "message": "Revalue API aktif."
}
```

### Autentikasi

```http
POST /api/auth/register
POST /api/auth/login
GET /api/me
```

Body register/login biasanya berisi:

```json
{
  "name": "User",
  "email": "user@email.com",
  "password": "password123"
}
```

---

## Tim Pengembang

- Muhammad Riski - Backend
- Charis Philip Wibowo - Frontend

---

## Catatan

README ini dibuat untuk memudahkan pengembangan lokal, testing, dan deployment aplikasi secara konsisten. Semua konfigurasi sensitif harus disimpan sebagai environment variable dan tidak dipublikasikan ke repositori publik.

---

## Lisensi

Project ini dibuat untuk kebutuhan internal tim dan keperluan demo/pengembangan proyek. Silakan sesuaikan lisensi apabila project akan dipublikasikan secara luas.

# REVALUE

REVALUE adalah platform berbasis web yang menghubungkan masyarakat, pengepul atau bank sampah, industri daur ulang, dan pengolah kompos untuk menciptakan ekosistem pengelolaan sampah yang lebih terintegrasi, transparan, dan berkelanjutan.

---

## Status Proyek

Frontend React + Vite dan API autentikasi Node + Prisma sudah tersedia. Login dan register menyimpan pengguna ke MySQL melalui model `User` pada Prisma.

---

## Stack Teknologi

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend / Database

- Node.js
- Node.js HTTP API
- Prisma ORM
- MySQL di Aiven
- Dotenv

> Prisma dan MySQL sebaiknya digunakan di backend, bukan langsung dari frontend React.

---

## Cara Menjalankan Proyek

### 1. Clone repository

```bash
git clone git@github.com:Sub-Danzzilo/revalue-marketplace.git
cd revalue-marketplace
```

### 2. Install dependency

```bash
npm install
```

### 3. Jalankan frontend di mode development

```bash
npm run dev
```

Aplikasi akan berjalan di browser pada port default Vite, biasanya:

```text
http://localhost:5173
```

### 4. Konfigurasi database dan jalankan API

Salin `.env.example` menjadi `.env`, lalu isi `DATABASE_URL` MySQL Anda. Setelah itu jalankan:

```bash
npx prisma generate
npx prisma migrate deploy
npm run server
```

API berjalan di `http://localhost:3001`. Jalankan `npm run dev` di terminal lain. Vite otomatis meneruskan request `/api` ke API tersebut.

### 5. Build untuk production

```bash
npm run build
```

### 6. Cek kualitas kode

```bash
npm run lint
```

---

## Konfigurasi Environment

Gunakan `.env.example` sebagai template:

```env
DATABASE_URL="mysql://username:password@host-aiven:port/defaultdb"
API_PORT=3001
```

Catatan:

- `DATABASE_URL` digunakan untuk koneksi backend ke MySQL Aiven.
- Jangan menaruh koneksi database langsung di frontend.
- Gunakan variabel environment untuk backend saja.
- Minta file `.env` ke Muhammad Riski, karena isi `.env` diatas cuma contoh.

---

## Prisma + MySQL Aiven

Jika backend akan memakai Prisma, langkah umum adalah:

```bash
npx prisma generate
npx prisma migrate deploy
```

Untuk migrasi yang lebih rapi:

```bash
npx prisma migrate dev --name init_revalue_schema
```

Gunakan Prisma di backend, lalu frontend memanggil backend via API.

---

## Endpoint Autentikasi

- `POST /api/auth/register` dengan `name`, `email`, `password`
- `POST /api/auth/login` dengan `email`, `password`

Password di-hash menggunakan Node `scrypt` sebelum disimpan. Token sesi dikembalikan setelah login/register dan disimpan frontend di local storage.

## Struktur Project

```text
REVALUE/
├── src/
├── public/
├── package.json
├── vite.config.js
├── .env
├── prisma/
│   └── schema.prisma
├── server/
│   └── index.js
└── README.md
```

---

## Tim Pengembang

- Muhammad Riski - Backend
- Charis Philip Wibowo - Frontend

---

## Catatan

README ini menjelaskan frontend, API autentikasi, dan koneksi Prisma/MySQL untuk pengembangan lokal.

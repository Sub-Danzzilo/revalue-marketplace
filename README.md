# REVALUE

REVALUE adalah platform berbasis web yang menghubungkan masyarakat, pengepul atau bank sampah, industri daur ulang, dan pengolah kompos untuk menciptakan ekosistem pengelolaan sampah yang lebih terintegrasi, transparan, dan berkelanjutan.

---

## Status Proyek

Saat ini, repository ini berfokus pada frontend React + Vite. Backend dan koneksi database MySQL/Aiven dapat dikembangkan secara terpisah sesuai arsitektur yang dibutuhkan.

---

## Stack Teknologi

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend / Database Planning

- Node.js
- Express.js (opsional / dapat dibuat terpisah)
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

### 4. Build untuk production

```bash
npm run build
```

### 5. Cek kualitas kode

```bash
npm run lint
```

---

## Konfigurasi Environment

Buat file `.env` di root project jika nanti backend atau database digunakan.

Contoh:

```env
PORT=5000
DATABASE_URL="mysql://username:password@host-aiven:port/defaultdb"
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
npx prisma init
npx prisma generate
npx prisma db push
```

Untuk migrasi yang lebih rapi:

```bash
npx prisma migrate dev --name init_revalue_schema
```

Gunakan Prisma di backend, lalu frontend memanggil backend via API.

---

## Struktur Project yang Disarankan

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
│   └── app.js
└── README.md
```

---

## Tim Pengembang

- Muhammad Riski - Backend
- Charis Philip Wibowo - Frontend

---

## Catatan

README ini dibuat agar sesuai dengan kondisi repo yang saat ini ada: fokus frontend React/Vite, sementara Prisma dan MySQL/Aiven merupakan infrastruktur backend yang dapat ditambahkan sesuai kebutuhan ekosistem REVALUE.

# REVALUE — Marketplace & Pengelolaan Sampah Terintegrasi

REVALUE adalah platform berbasis web yang menghubungkan masyarakat, pengepul/bank sampah, industri daur ulang, dan pengolah kompos untuk menciptakan ekosistem pengelolaan sampah yang terintegrasi, transparan, dan mendukung ekonomi sirkular.

---

## 🛠️ Stack Teknologi & Library

Proyek ini dibangun menggunakan arsitektur modern **React.js** (Frontend) dan **Express.js** (Backend).

### Frontend

- **React.js** (Vite) — Core UI Library
- **React-Leaflet / Leaflet.js** — Peta interaktif peta lokasi titik *drop-off*
- **Chart.js / React-Chartjs-2** — Visualisasi data analitik & dampak karbon
- **Lucide React** — Icon set UI

### Backend & Database

- **Node.js & Express.js** — Web Framework & REST API
- **Prisma ORM (v6)** — Database Toolkit & Migration Management
- **Aiven Cloud MySQL** — Managed Cloud Database Server
- **CORS** — Middleware Cross-Origin Resource Sharing
- **Dotenv** — Pengelolaan variabel lingkungan (.env)
- **Nodemon** *(Dev)* — Auto-reload server saat pengembangan

---

## 🚀 Panduan Setup & Instalasi (Untuk Tim Developer)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di komputer lokal kamu:

### 1. Clone Repository

```bash
git clone git@github.com:Sub-Danzzilo/revalue-marketplace.git
cd revalue-marketplace
```

### 2. Install Dependencies

Jalankan perintah ini untuk menginstal seluruh paket pendukung frontend dan backend:

```bash
npm install

```

### 3. Konfigurasi Variable Environment (`.env`)

Buat file bernama `.env` di root folder proyek (sejajar dengan `package.json`), lalu isi dengan konfigurasi berikut:

```env
PORT=5000
DATABASE_URL="mysql://username:password@host-aiven-cloud.com:11787/defaultdb"

```

*> **Note:** Hubungi Muhammad Riski untuk mendapatkan kredensial string `DATABASE_URL` Aiven MySQL yang valid.*

### 4. Sinkronisasi Database (Prisma ORM)

Setelah file `.env` terisi, jalankan perintah ini untuk melakukan sinkronisasi skema database ke Prisma Client lokal kamu:

```bash
npx prisma generate

```

Jika ada perubahan skema database baru dari tim backend, perbarui database lokal dengan perintah:

```bash
npx prisma migrate dev

```

### 5. Jalankan Aplikasi

Jalankan server pengembangan (Frontend & Backend):

```bash
# Jalankan Backend Express
npm run dev

# Membuka Database GUI (Prisma Studio)
npx prisma studio

```

---

## 👥 Tim Pengembang

- **Muhammad Riski** - Backend
- **Charis Philip Wibowo** - Frontend

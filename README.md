# Panduan Instalasi YukKerja

Panduan langkah-demi-langkah untuk menginstal dan menjalankan proyek YukKerja dari awal.

---

## 1. Prasyarat Sistem

Pastikan perangkat Anda sudah terpasang:
- **Git**
- **Node.js**: versi 18 atau lebih baru ([Unduh Node.js](https://nodejs.org/))
- **PostgreSQL**: database server aktif (lokal atau cloud)
- **npm**

---

## 2. Langkah Instalasi

### Step 1: Clone Repository

Buka terminal / command prompt, lalu clone repository dan masuk ke foldernya:

```bash
git clone https://github.com/khaerulroh25/khaerul-fullstack-developer.git
cd khaerul-fullstack-developer
```

---

### Step 2: Setup Backend

1. **Masuk ke folder backend:**
   ```bash
   cd backend
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Buat file konfigurasi `.env`:**
   - Salin dari file `.env.example`:
     ```bash
     cp .env.example .env
     ```
     *(Pengguna Windows PowerShell: `Copy-Item .env.example .env`)*

   - Buka file `.env` dan sesuaikan koneksi database PostgreSQL Anda:
     ```env
     NODE_ENV=development
     PORT=5000
     DATABASE_URL="postgresql://postgres:postgres@localhost:5432/yukkerja_db?schema=public"
     JWT_SECRET="rahasia_jwt_key_anda"
     JWT_EXPIRES_IN="7d"
     CORS_ORIGIN="http://localhost:5173"
     ```

4. **Jalankan migrasi database:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Jalankan seed data awal:**
   *(Opsional, untuk mengisi data dummy akun, lowongan, dan perusahaan)*
   ```bash
   npm run prisma:seed
   ```

6. **Jalankan server backend:**
   ```bash
   npm run dev
   ```
   > Backend berjalan di: `http://localhost:5000`

---

### Step 3: Setup Frontend

1. **Buka tab/jendela terminal baru**, lalu masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
   *(Jika dari root project: `cd khaerul-fullstack-developer/frontend`)*

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Pastikan konfigurasi `.env`:**
   Buat file `.env` (jika belum ada) dan pastikan isinya:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Jalankan server frontend:**
   ```bash
   npm run dev
   ```
   > Frontend berjalan di: `http://localhost:5173`

---

## 3. Akun Default (Hasil Seeding)

Semua akun dummy menggunakan kata sandi: `Password123!`

- **Recruiter**: `recruiter.goto@yukkerja.id`
- **Pelamar**: `pelamar@yukkerja.id`

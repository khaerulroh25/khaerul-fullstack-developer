# Dokumentasi API — YukKerja

Dokumentasi RESTful API untuk platform rekrutmen digital **YukKerja**. Seluruh contoh request dan response di bawah ini menggunakan data nyata hasil seeder database PostgreSQL (`backend/src/seed/seedData.ts`).

---

## Informasi Dasar & Akses

- **Base URL**: `http://localhost:5000/api`
- **Content-Type**: `application/json`

### Header Autentikasi (Protected Endpoints)
Kirimkan token JWT hasil login pada header setiap request:
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Akun Demo Seeder (Siap Uji Coba)

| Peran (`Role`) | Email | Password | Nama Lengkap / Entitas |
| :--- | :--- | :--- | :--- |
| `JOB_SEEKER` | `pelamar@yukkerja.id` | `Password123!` | Khaerul Anam (Pencari Kerja Utama) |
| `JOB_SEEKER` | `ahmad.rizki@gmail.com` | `Password123!` | Ahmad Rizki Nugraha (Pencari Kerja) |
| `RECRUITER` | `recruiter.goto@yukkerja.id` | `Password123!` | Budi Raharja (Talent Acquisition GoTo) |
| `RECRUITER` | `recruiter.traveloka@yukkerja.id` | `Password123!` | Citra Dewi (People Operations Traveloka) |
| `RECRUITER` | `recruiter.mandiri@yukkerja.id` | `Password123!` | Agus Pratama (IT HR Bank Mandiri) |

---

## 1. Modul Autentikasi (`/api/auth`)

### 1.1 Login Pengguna
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Akses**: Publik
- **Request Body (Contoh Login Pencari Kerja)**:
```json
{
  "email": "pelamar@yukkerja.id",
  "password": "Password123!"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Autentikasi login berhasil",
  "data": {
    "user": {
      "id": "c1a2b3c4-5678-90ab-cdef-111111111111",
      "email": "pelamar@yukkerja.id",
      "fullName": "Khaerul Anam",
      "role": "JOB_SEEKER",
      "phone": "085712345678",
      "avatarUrl": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 Registrasi Pengguna Baru
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Akses**: Publik
- **Request Body**:
```json
{
  "email": "ahmad.rizki@gmail.com",
  "password": "Password123!",
  "fullName": "Ahmad Rizki Nugraha",
  "role": "JOB_SEEKER",
  "phone": "081398765432"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Registrasi akun berhasil",
  "data": {
    "user": {
      "id": "e5f6a7b8-1234-5678-90ab-222222222222",
      "email": "ahmad.rizki@gmail.com",
      "fullName": "Ahmad Rizki Nugraha",
      "role": "JOB_SEEKER",
      "phone": "081398765432"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Cek Profil Sesi Pengguna Aktif
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Akses**: `Bearer Token`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "c1a2b3c4-5678-90ab-cdef-111111111111",
    "email": "pelamar@yukkerja.id",
    "fullName": "Khaerul Anam",
    "role": "JOB_SEEKER",
    "phone": "085712345678",
    "avatarUrl": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
  }
}
```

---

## 2. Modul Perusahaan (`/api/companies`)

### 2.1 Mengambil Daftar Semua Perusahaan
Mengambil seluruh perusahaan mitra seeder beserta kalkulasi lowongan aktifnya.

- **Method**: `GET`
- **Endpoint**: `/api/companies`
- **Akses**: Publik
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "7cb90265-e2bb-4891-8c14-e545a6f12a88",
      "name": "GoTo Group (Gojek Tokopedia)",
      "industry": "Technology & E-Commerce / On-Demand",
      "location": "Jakarta Selatan, DKI Jakarta",
      "logoUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
      "website": "https://www.gotocompany.com",
      "description": "Ekosistem digital terbesar di Indonesia yang menggabungkan layanan on-demand transportasi, pesan-antar makanan, logistik, dan e-commerce.",
      "openJobsCount": 2
    },
    {
      "id": "9f1d2e3c-4b5a-6789-0123-456789abcdef",
      "name": "Traveloka",
      "industry": "Travel Tech & Lifestyle Superapp",
      "location": "BSD City, Tangerang",
      "logoUrl": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=200",
      "website": "https://www.traveloka.com",
      "description": "Platform perjalanan dan gaya hidup terdepan di Asia Tenggara.",
      "openJobsCount": 1
    },
    {
      "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "name": "Bank Mandiri (Digital Banking Hub)",
      "industry": "Banking & Financial Technology",
      "location": "Jakarta Pusat, DKI Jakarta",
      "logoUrl": "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=200",
      "website": "https://www.bankmandiri.co.id",
      "description": "Bank BUMN terdepan di Indonesia yang menggerakkan inovasi finansial digital melalui Livin by Mandiri.",
      "openJobsCount": 1
    }
  ]
}
```

---

### 2.2 Mengambil Detail Perusahaan Berdasarkan ID
- **Method**: `GET`
- **Endpoint**: `/api/companies/7cb90265-e2bb-4891-8c14-e545a6f12a88`
- **Akses**: Publik
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "7cb90265-e2bb-4891-8c14-e545a6f12a88",
    "name": "GoTo Group (Gojek Tokopedia)",
    "industry": "Technology & E-Commerce / On-Demand",
    "location": "Jakarta Selatan, DKI Jakarta",
    "website": "https://www.gotocompany.com",
    "description": "Ekosistem digital terbesar di Indonesia...",
    "openJobsCount": 2,
    "jobs": [
      {
        "id": "job-goto-1",
        "title": "Senior Fullstack TypeScript Engineer",
        "category": "Software Engineering",
        "jobType": "HYBRID",
        "salaryMin": 24000000,
        "salaryMax": 35000000
      }
    ]
  }
}
```

---

## 3. Modul Lowongan Pekerjaan (`/api/jobs`)

### 3.1 Mengambil Katalog Lowongan (Filter & Pagination)
- **Method**: `GET`
- **Endpoint**: `/api/jobs?category=Software+Engineering&jobType=HYBRID`
- **Akses**: Publik
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "b4c5d6e7-f8a9-0123-4567-89abcdef0123",
      "companyId": "7cb90265-e2bb-4891-8c14-e545a6f12a88",
      "title": "Senior Fullstack TypeScript Engineer",
      "category": "Software Engineering",
      "jobType": "HYBRID",
      "experienceLevel": "SENIOR",
      "location": "Jakarta Selatan (Hybrid 2x WFO)",
      "salaryMin": 24000000,
      "salaryMax": 35000000,
      "isSalaryDisclosed": true,
      "description": "Kami mencari Senior Fullstack Engineer yang mahir dalam ekosistem React.js, Node.js, TypeScript, dan PostgreSQL untuk memimpin pengembangan fitur core payment & order management.",
      "requirements": [
        "Pengalaman 4+ tahun membangun aplikasi web skala produksi dengan TypeScript",
        "Menguasai React.js (Hooks, Context, Performance Optimization), Node.js, & Express",
        "Pemahaman kuat pada PostgreSQL, Prisma / ORM, Database Indexing, dan Query Optimization",
        "Familiar dengan arsitektur microservices, Redis caching, dan unit/integration testing"
      ],
      "benefits": [
        "BPJS Kesehatan & Ketenagakerjaan + Asuransi Swasta Kelas 1 (Cover Keluarga)",
        "Tunjangan kerja Hybrid & Fasilitas Laptop Macbook Pro M3",
        "Annual Performance Bonus & Stock Options (ESOP)"
      ],
      "status": "ACTIVE",
      "company": {
        "id": "7cb90265-e2bb-4891-8c14-e545a6f12a88",
        "name": "GoTo Group (Gojek Tokopedia)",
        "logoUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
        "location": "Jakarta Selatan, DKI Jakarta"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 3.2 Mempublikasikan Lowongan Baru oleh Recruiter
- **Method**: `POST`
- **Endpoint**: `/api/jobs`
- **Akses**: `Bearer Token` (`RECRUITER` GoTo)
- **Request Body (Contoh Lowongan Baru)**:
```json
{
  "companyId": "7cb90265-e2bb-4891-8c14-e545a6f12a88",
  "title": "Senior Staff Cloud Architect",
  "category": "DevOps & Cloud",
  "jobType": "FULL_TIME",
  "experienceLevel": "LEAD",
  "location": "Jakarta Selatan, DKI Jakarta",
  "salaryMin": 35000000,
  "salaryMax": 50000000,
  "isSalaryDisclosed": true,
  "description": "Memimpin arsitektur multi-cloud skala enterprise dan microservices berkinerja tinggi.",
  "requirements": [
    "10+ tahun pengalaman Cloud & Kubernetes",
    "Sertifikasi AWS/GCP Professional Architect"
  ],
  "benefits": [
    "Asuransi Kesehatan Kelas 1",
    "Bonus Kinerja Tahunan"
  ],
  "status": "ACTIVE"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Lowongan pekerjaan berhasil diterbitkan",
  "data": {
    "id": "c0c6495b-b3c6-47b6-b36e-77c3ba17f1ff",
    "title": "Senior Staff Cloud Architect",
    "category": "DevOps & Cloud",
    "status": "ACTIVE",
    "createdAt": "2026-08-15T16:00:00.000Z"
  }
}
```

---

## 4. Modul Lamaran Kerja (`/api/applications`)

### 4.1 Mengajukan Berkas Lamaran Baru (Job Seeker)
- **Method**: `POST`
- **Endpoint**: `/api/applications`
- **Akses**: `Bearer Token` (`JOB_SEEKER` Khaerul Anam)
- **Request Body**:
```json
{
  "jobId": "b4c5d6e7-f8a9-0123-4567-89abcdef0123",
  "applicantName": "Khaerul Anam",
  "applicantEmail": "pelamar@yukkerja.id",
  "applicantPhone": "085712345678",
  "linkedinUrl": "https://linkedin.com/in/khaerul-anam",
  "portfolioUrl": "https://khaerul.dev",
  "resumeUrl": "https://storage.yukkerja.id/resumes/khaerul-anam-cv.pdf",
  "coverLetter": "Tertarik bergabung memimpin pengembangan frontend & backend TypeScript di GoTo.",
  "expectedSalary": 28000000,
  "noticePeriod": "Immediately"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Lamaran pekerjaan berhasil dikirim",
  "data": {
    "id": "9721cb37-81b2-4790-9bc5-61786651f436",
    "jobId": "b4c5d6e7-f8a9-0123-4567-89abcdef0123",
    "status": "SUBMITTED",
    "createdAt": "2026-08-15T16:05:00.000Z"
  }
}
```

---

### 4.2 Mengambil Daftar Lamaran (Tracker & ATS)
- **Method**: `GET`
- **Endpoint**: `/api/applications`
- **Akses**: `Bearer Token`
- **Response `200 OK` (Contoh Akun Pelamar Khaerul Anam)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "9721cb37-81b2-4790-9bc5-61786651f436",
      "applicantName": "Khaerul Anam",
      "applicantEmail": "pelamar@yukkerja.id",
      "applicantPhone": "085712345678",
      "resumeUrl": "https://storage.yukkerja.id/resumes/khaerul-anam-cv.pdf",
      "expectedSalary": 28000000,
      "status": "INTERVIEW",
      "recruiterNotes": "Kandidat memiliki rekam jejak solid di stack TypeScript & React. Diundang ke tahap User Interview.",
      "createdAt": "2026-08-13T09:00:00.000Z",
      "job": {
        "id": "b4c5d6e7-f8a9-0123-4567-89abcdef0123",
        "title": "Senior Fullstack TypeScript Engineer",
        "location": "Jakarta Selatan (Hybrid 2x WFO)",
        "company": {
          "name": "GoTo Group (Gojek Tokopedia)",
          "logoUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200"
        }
      }
    }
  ]
}
```

---

### 4.3 Memperbarui Status Seleksi Kandidat (ATS Pipeline & Audit Log)
- **Method**: `PATCH`
- **Endpoint**: `/api/applications/9721cb37-81b2-4790-9bc5-61786651f436/status`
- **Akses**: `Bearer Token` (`RECRUITER` GoTo)
- **Request Body**:
```json
{
  "status": "INTERVIEW",
  "comment": "CV sangat relevan. Undangan Technical Interview dikirim via email untuk posisi Senior Fullstack Engineer."
}
```
- **Response `200 OK` (Termasuk Audit History)**:
```json
{
  "success": true,
  "message": "Status lamaran berhasil diperbarui",
  "data": {
    "id": "9721cb37-81b2-4790-9bc5-61786651f436",
    "status": "INTERVIEW",
    "recruiterNotes": "CV sangat relevan. Undangan Technical Interview dikirim via email untuk posisi Senior Fullstack Engineer.",
    "logs": [
      {
        "id": "log-uuid-2",
        "previousStatus": "SCREENING",
        "newStatus": "INTERVIEW",
        "changedBy": "Budi Raharja (Talent Acquisition GoTo)",
        "comment": "CV sangat relevan. Undangan Technical Interview dikirim via email untuk posisi Senior Fullstack Engineer.",
        "timestamp": "2026-08-15T16:08:00.000Z"
      },
      {
        "id": "log-uuid-1",
        "previousStatus": "SUBMITTED",
        "newStatus": "SCREENING",
        "changedBy": "Budi Raharja (Talent Acquisition GoTo)",
        "comment": "Sedang meninjau portofolio GitHub dan kecocokan salary.",
        "timestamp": "2026-08-14T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 5. Format Standar Respon Kesalahan (Error Handling)

```json
{
  "success": false,
  "message": "Format email pelamar tidak valid",
  "errors": [
    {
      "field": "applicantEmail",
      "message": "Format email pelamar tidak valid"
    }
  ]
}
```

### Kode Status HTTP:
- `200 OK` — Permintaan berhasil diproses.
- `201 Created` — Resource baru berhasil dibuat.
- `400 Bad Request` — Validasi schema Zod gagal.
- `401 Unauthorized` — Token JWT tidak ada / tidak valid.
- `403 Forbidden` — Akses ditolak.
- `404 Not Found` — Data tidak ditemukan.
- `409 Conflict` — Duplikasi data lamaran kerja.

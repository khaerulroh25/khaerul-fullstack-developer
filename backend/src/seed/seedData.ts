import {
  PrismaClient,
  Role,
  JobType,
  ExperienceLevel,
  JobStatus,
  ApplicationStatus,
} from "@prisma/client";
import { hashPassword } from "../utils/password.util.js";
import { prisma } from "../config/prisma.js";

// Fungsi pengisian data awal (seeding) database sistem
export async function seedDatabase(client: PrismaClient = prisma) {
  console.log("🌱 Memulai proses Seeding Database YukKerja...");

  // Membersihkan data tabel yang ada sesuai urutan relasi foreign key
  await client.applicationLog.deleteMany();
  await client.application.deleteMany();
  await client.job.deleteMany();
  await client.company.deleteMany();
  await client.user.deleteMany();

  console.log("🧹 Database dibersihkan.");

  const defaultPassword = await hashPassword("Password123!");

  // Pembuatan akun pengguna awal (Job Seeker, Recruiter, Admin)
  const userRecruiterGoto = await client.user.create({
    data: {
      email: "recruiter.goto@yukkerja.id",
      passwordHash: defaultPassword,
      fullName: "Budi Raharja (Talent Acquisition GoTo)",
      role: Role.RECRUITER,
      phone: "081234567890",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
  });

  const userRecruiterTraveloka = await client.user.create({
    data: {
      email: "recruiter.traveloka@yukkerja.id",
      passwordHash: defaultPassword,
      fullName: "Citra Dewi (People Operations Traveloka)",
      role: Role.RECRUITER,
      phone: "081234567891",
      avatarUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    },
  });

  const userRecruiterMandiri = await client.user.create({
    data: {
      email: "recruiter.mandiri@yukkerja.id",
      passwordHash: defaultPassword,
      fullName: "Agus Pratama (IT HR Bank Mandiri)",
      role: Role.RECRUITER,
      phone: "081234567892",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
  });

  const userSeeker1 = await client.user.create({
    data: {
      email: "pelamar@yukkerja.id",
      passwordHash: defaultPassword,
      fullName: "Khaerul Anam",
      role: Role.JOB_SEEKER,
      phone: "085712345678",
      avatarUrl:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    },
  });

  const userSeeker2 = await client.user.create({
    data: {
      email: "ahmad.rizki@gmail.com",
      passwordHash: defaultPassword,
      fullName: "Ahmad Rizki Nugraha",
      role: Role.JOB_SEEKER,
      phone: "081398765432",
      avatarUrl:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200",
    },
  });

  console.log("👤 Akun demo berhasil dibuat:");
  console.log("   - Seeker:    pelamar@yukkerja.id / Password123!");
  console.log("   - Recruiter: recruiter.goto@yukkerja.id / Password123!");

  // Pembuatan data profil perusahaan (Company)
  const compGoto = await client.company.create({
    data: {
      userId: userRecruiterGoto.id,
      name: "GoTo Group (Gojek Tokopedia)",
      industry: "Technology & E-Commerce / On-Demand",
      location: "Jakarta Selatan, DKI Jakarta",
      logoUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
      website: "https://www.gotocompany.com",
      description:
        "Ekosistem digital terbesar di Indonesia yang menggabungkan layanan on-demand transportasi, pesan-antar makanan, logistik, dan e-commerce.",
    },
  });

  const compTraveloka = await client.company.create({
    data: {
      userId: userRecruiterTraveloka.id,
      name: "Traveloka",
      industry: "Travel Tech & Lifestyle Superapp",
      location: "BSD City, Tangerang",
      logoUrl:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=200",
      website: "https://www.traveloka.com",
      description:
        "Platform perjalanan dan gaya hidup terdepan di Asia Tenggara yang memudahkan jutaan pengguna menjelajahi dunia.",
    },
  });

  const compMandiri = await client.company.create({
    data: {
      userId: userRecruiterMandiri.id,
      name: "Bank Mandiri (Digital Banking Hub)",
      industry: "Banking & Financial Technology",
      location: "Jakarta Pusat, DKI Jakarta",
      logoUrl:
        "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=200",
      website: "https://www.bankmandiri.co.id",
      description:
        "Bank BUMN terdepan di Indonesia yang menggerakkan inovasi finansial digital melalui super app Livin by Mandiri dan Kopra.",
    },
  });

  const compBlibli = await client.company.create({
    data: {
      userId: userRecruiterGoto.id,
      name: "Blibli (PT Global Digital Niaga)",
      industry: "Omnichannel Commerce & Lifestyle Ecosystem",
      location: "Jakarta Barat, DKI Jakarta",
      logoUrl:
        "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=200",
      website: "https://www.blibli.com",
      description:
        "Pionir ekosistem perdagangan dan gaya hidup omnichannel terpercaya di Indonesia dengan layanan 24/7.",
    },
  });

  const compTelkom = await client.company.create({
    data: {
      userId: userRecruiterMandiri.id,
      name: "Telkom Indonesia (Digital Talent)",
      industry: "Telecommunications & Digital Services",
      location: "Bandung & Jakarta",
      logoUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200",
      website: "https://www.telkom.co.id",
      description:
        "BUMN telekomunikasi digital terbesar yang memimpin transformasi konektivitas, cloud, dan AI di Indonesia.",
    },
  });

  const compTiket = await client.company.create({
    data: {
      userId: userRecruiterTraveloka.id,
      name: "tiket.com",
      industry: "Online Travel Agent (OTA)",
      location: "Jakarta Pusat, DKI Jakarta",
      logoUrl:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200",
      website: "https://www.tiket.com",
      description:
        "Pelopor OTA di Indonesia yang menghadirkan kemudahan pemesanan tiket penerbangan, hotel, konser, dan atraksi wisata.",
    },
  });

  console.log("🏢 6 Perusahaan berhasil dibuat.");

  // Pembuatan data lowongan pekerjaan (Job Postings)
  const job1 = await client.job.create({
    data: {
      companyId: compGoto.id,
      title: "Senior Fullstack TypeScript Engineer",
      category: "Software Engineering",
      jobType: JobType.HYBRID,
      experienceLevel: ExperienceLevel.SENIOR,
      location: "Jakarta Selatan (Hybrid 2x WFO)",
      salaryMin: 24000000,
      salaryMax: 35000000,
      isSalaryDisclosed: true,
      description:
        "Kami mencari Senior Fullstack Engineer yang mahir dalam ekosistem React.js, Node.js, TypeScript, dan PostgreSQL untuk memimpin pengembangan fitur core payment & order management dengan throughput jutaan transaksi per hari.",
      requirements: [
        "Pengalaman 4+ tahun membangun aplikasi web skala produksi dengan TypeScript",
        "Menguasai React.js (Hooks, Context, Performance Optimization), Node.js, & Express",
        "Pemahaman kuat pada PostgreSQL, Prisma / ORM, Database Indexing, dan Query Optimization",
        "Familiar dengan arsitektur microservices, Redis caching, dan unit/integration testing",
        "Kemampuan komunikasi kolaboratif dalam tim agile lintas fungsi",
      ],
      benefits: [
        "BPJS Kesehatan & Ketenagakerjaan + Asuransi Swasta Kelas 1 (Cover Keluarga)",
        "Tunjangan kerja Hybrid & Fasilitas Laptop Macbook Pro M3",
        "Annual Performance Bonus & Stock Options (ESOP)",
        "Budget tahunan untuk sertifikasi & kursus teknologi profesional",
      ],
      status: JobStatus.ACTIVE,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const job2 = await client.job.create({
    data: {
      companyId: compTraveloka.id,
      title: "Frontend React Developer (Design System)",
      category: "Frontend Development",
      jobType: JobType.REMOTE,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      location: "Remote (Seluruh Indonesia)",
      salaryMin: 15000000,
      salaryMax: 22000000,
      isSalaryDisclosed: true,
      description:
        "Bergabunglah dengan tim UI Platform Traveloka untuk membangun dan memelihara library komponen desain berbasis React + TypeScript dengan aksesibilitas standar WCAG 2.1.",
      requirements: [
        "Pengalaman 2-4 tahun dengan React, TypeScript, CSS Variables, dan TailwindCSS",
        "Keahlian dalam membuat reusable components, Storybook documentation, dan visual regression testing",
        "Memahami web performance (Core Web Vitals) dan responsive design",
      ],
      benefits: [
        "100% Remote Work dengan fleksibilitas jam kerja",
        "Voucher diskon perjalanan dan hotel Traveloka tahunan",
        "Asuransi kesehatan rawat inap dan rawat jalan",
      ],
      status: JobStatus.ACTIVE,
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    },
  });

  const job3 = await client.job.create({
    data: {
      companyId: compMandiri.id,
      title: "Backend Node.js & Microservices Architect",
      category: "Backend & Cloud",
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.LEAD,
      location: "Plaza Mandiri, Jakarta Selatan (On-site)",
      salaryMin: 32000000,
      salaryMax: 45000000,
      isSalaryDisclosed: true,
      description:
        "Memimpin arsitektur backend perbankan digital untuk super app Livin by Mandiri. Mengembangkan layanan berkinerja tinggi, toleransi kesalahan tinggi, dan keamanan setingkat PCI-DSS.",
      requirements: [
        "Pengalaman 6+ tahun dalam perancangan backend Node.js, Go, atau Java",
        "Penguasaan mendalam mengenai PostgreSQL, Kafka event streaming, dan Kubernetes",
        "Pemahaman mendalam mengenai enkripsi data, OAuth 2.0, JWT, dan API Security",
      ],
      benefits: [
        "Paket remunerasi perbankan BUMN papan atas & Bonus tahunan signifikan",
        "Asuransi kesehatan eksekutif termasuk tanggungan gigi & kacamata",
        "Peluang jenjang karir manajerial IT BUMN",
      ],
      status: JobStatus.ACTIVE,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
  });

  const job4 = await client.job.create({
    data: {
      companyId: compBlibli.id,
      title: "Product Designer (UI/UX - Mobile & Web)",
      category: "Product Design & UI/UX",
      jobType: JobType.HYBRID,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      location: "Jakarta Barat (Hybrid)",
      salaryMin: 14000000,
      salaryMax: 20000000,
      isSalaryDisclosed: true,
      description:
        "Merancang alur checkout, loyalty program, dan katalog e-commerce yang intuitif bagi jutaan pengguna Blibli dengan riset pengguna kuantitatif & kualitatif.",
      requirements: [
        "Portofolio UI/UX yang kuat mendemonstrasikan user journey & design system di Figma",
        "Pengalaman 2+ tahun di produk digital e-commerce atau fintech",
        "Kemampuan berkolaborasi erat dengan Product Manager dan Frontend Engineers",
      ],
      benefits: [
        "Voucher belanja Blibli bulanan",
        "Program kesehatan mental & konsultasi psikolog gratis",
        "Lingkungan kerja inklusif dan modern",
      ],
      status: JobStatus.ACTIVE,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    },
  });

  const job5 = await client.job.create({
    data: {
      companyId: compTelkom.id,
      title: "DevOps & Site Reliability Engineer (SRE)",
      category: "DevOps & Infrastructure",
      jobType: JobType.HYBRID,
      experienceLevel: ExperienceLevel.SENIOR,
      location: "Bandung / Jakarta",
      salaryMin: 22000000,
      salaryMax: 30000000,
      isSalaryDisclosed: false,
      description:
        "Mengelola infrastruktur cloud berskala nasional, pipeline CI/CD otomatis, serta sistem monitoring ketersediaan 99.99% untuk produk digital Telkom Indonesia.",
      requirements: [
        "Pengalaman 3+ tahun dengan AWS / Google Cloud Platform, Terraform, dan Docker",
        "Mahir mengonfigurasi Prometheus, Grafana, ELK Stack, dan incident response",
      ],
      benefits: [
        "Tunjangan transportasi dan komunikasi",
        "Fasilitas pelatihan bersertifikasi AWS / GCP Solutions Architect",
      ],
      status: JobStatus.ACTIVE,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
  });

  const job6 = await client.job.create({
    data: {
      companyId: compTiket.id,
      title: "Junior QA Automation Engineer",
      category: "Quality Assurance",
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.JUNIOR,
      location: "Jakarta Pusat",
      salaryMin: 8000000,
      salaryMax: 12000000,
      isSalaryDisclosed: true,
      description:
        "Membangun skrip otomasi pengujian end-to-end (Playwright / Cypress) dan pengujian API (Postman / Jest) untuk memastikan kualitas aplikasi pemesanan tiket.",
      requirements: [
        "Familiar dengan JavaScript / TypeScript dan konsep REST API testing",
        "Teliti dalam membuat test cases dan bug tracking di Jira",
        "Lulusan baru (fresh graduate) atau pengalaman 1 tahun di QA dipersilakan melamar",
      ],
      benefits: [
        "Mentorship intensif dari Senior QA Engineer",
        "Fasilitas gym membership & snack bar harian",
      ],
      status: JobStatus.ACTIVE,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("💼 6 Lowongan pekerjaan realistis berhasil dibuat.");

  // Pembuatan data berkas lamaran dan riwayat audit log (Applications & Logs)
  const app1 = await client.application.create({
    data: {
      jobId: job1.id,
      userId: userSeeker1.id,
      applicantName: userSeeker1.fullName,
      applicantEmail: userSeeker1.email,
      applicantPhone: userSeeker1.phone || "085712345678",
      linkedinUrl: "https://linkedin.com/in/khaerul-anam",
      portfolioUrl: "https://khaerul.dev",
      resumeUrl: "https://storage.yukkerja.id/resumes/khaerul-anam-cv.pdf",
      coverLetter:
        "Saya memiliki pengalaman 5+ tahun dalam pengembangan fullstack modern menggunakan React dan Node.js, serta berpengalaman dalam arsitektur data PostgreSQL skala besar.",
      expectedSalary: 28000000,
      noticePeriod: "1 Bulan (30 Hari)",
      status: ApplicationStatus.INTERVIEW,
      recruiterNotes:
        "Kandidat memiliki portofolio dan pemahaman TypeScript & Database yang sangat solid. Jadwalkan Technical Interview pada hari Kamis jam 14:00 WIB.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await client.applicationLog.createMany({
    data: [
      {
        applicationId: app1.id,
        previousStatus: ApplicationStatus.SUBMITTED,
        newStatus: ApplicationStatus.SUBMITTED,
        changedBy: "SYSTEM",
        comment: "Berkas lamaran berhasil diajukan ke sistem YukKerja",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        applicationId: app1.id,
        previousStatus: ApplicationStatus.SUBMITTED,
        newStatus: ApplicationStatus.SCREENING,
        changedBy: "Budi Raharja",
        comment: "Berkas CV dan portofolio lolos peninjauan awal tim HR.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        applicationId: app1.id,
        previousStatus: ApplicationStatus.SCREENING,
        newStatus: ApplicationStatus.INTERVIEW,
        changedBy: "Budi Raharja",
        comment:
          "Undangan Technical Interview dikirim via email untuk posisi Senior Fullstack Engineer.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  const app2 = await client.application.create({
    data: {
      jobId: job2.id,
      userId: userSeeker1.id,
      applicantName: userSeeker1.fullName,
      applicantEmail: userSeeker1.email,
      applicantPhone: userSeeker1.phone || "085712345678",
      linkedinUrl: "https://linkedin.com/in/khaerul-anam",
      portfolioUrl: "https://khaerul.dev",
      resumeUrl: "https://storage.yukkerja.id/resumes/khaerul-anam-cv.pdf",
      coverLetter:
        "Tertarik mendalami pengembangan design system dan web performance di Traveloka.",
      expectedSalary: 18000000,
      noticePeriod: "Immediately",
      status: ApplicationStatus.SCREENING,
      recruiterNotes:
        "Pengalaman frontend sangat cocok dengan kebutuhan tim UI Platform.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  await client.applicationLog.createMany({
    data: [
      {
        applicationId: app2.id,
        previousStatus: ApplicationStatus.SUBMITTED,
        newStatus: ApplicationStatus.SUBMITTED,
        changedBy: "SYSTEM",
        comment: "Berkas lamaran berhasil masuk ke sistem YukKerja",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        applicationId: app2.id,
        previousStatus: ApplicationStatus.SUBMITTED,
        newStatus: ApplicationStatus.SCREENING,
        changedBy: "Citra Dewi",
        comment:
          "Sedang meninjau kesesuaian pengalaman Storybook & Accessibility.",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ],
  });

  const app3 = await client.application.create({
    data: {
      jobId: job1.id,
      userId: userSeeker2.id,
      applicantName: userSeeker2.fullName,
      applicantEmail: userSeeker2.email,
      applicantPhone: userSeeker2.phone || "081398765432",
      linkedinUrl: "https://linkedin.com/in/ahmad-rizki",
      resumeUrl: "https://storage.yukkerja.id/resumes/ahmad-rizki-cv.pdf",
      coverLetter:
        "Melamar posisi Senior Fullstack Engineer dengan fokus Node.js & React.",
      expectedSalary: 26000000,
      noticePeriod: "1 Bulan",
      status: ApplicationStatus.SUBMITTED,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  });

  await client.applicationLog.create({
    data: {
      applicationId: app3.id,
      previousStatus: ApplicationStatus.SUBMITTED,
      newStatus: ApplicationStatus.SUBMITTED,
      changedBy: "SYSTEM",
      comment: "Berkas lamaran berhasil diajukan ke sistem YukKerja",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Seeding database selesai dengan sukses!");
}

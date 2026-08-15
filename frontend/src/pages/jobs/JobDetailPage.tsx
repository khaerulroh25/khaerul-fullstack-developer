import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  Gift,
  ExternalLink,
  ArrowRight,
  Briefcase,
  Building2,
  Sparkles,
} from 'lucide-react';
import type { Job } from '../../types/index.js';
import { formatSalary, getJobTypeLabel, getExperienceLevelLabel, formatDateID } from '../../utils/formatters.js';

/**
 * Kontrak Properti untuk Komponen JobDetailPage
 */
interface JobDetailPageProps {
  /** Objek data entitas lowongan kerja yang dipilih */
  job: Job | null;
  /** Status apakah pengguna saat ini telah melamar pekerjaan ini */
  hasApplied: boolean;
  /** Callback untuk kembali ke halaman katalog utama */
  onNavigateBack: () => void;
  /** Callback untuk melanjutkan ke formulir pengajuan lamaran */
  onNavigateToApply: (job: Job) => void;
}

/**
 * Komponen Halaman Rincian Lowongan Kerja (JobDetailPage)
 *
 * Menampilkan informasi mendalam mengenai posisi lowongan kerja (rentang gaji,
 * tipe & level pengalaman, penempatan, deskripsi lengkap, persyaratan, benefit,
 * serta profil perusahaan mitra perekrut).
 * Dioptimalkan dengan React.memo, integrasi formatter utils, dan styling Tailwind CSS responsif.
 */
export const JobDetailPage: React.FC<JobDetailPageProps> = React.memo(({
  job,
  hasApplied,
  onNavigateBack,
  onNavigateToApply,
}) => {
  const [logoError, setLogoError] = useState(false);

  // State ketika data lowongan tidak ditemukan atau null
  if (!job) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 max-w-md shadow-sm">
          <Briefcase className="mx-auto mb-4 h-12 w-12 text-slate-400" />
          <h2 className="text-xl font-bold text-slate-900">Lowongan Tidak Ditemukan</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Lowongan yang Anda cari mungkin sudah ditutup atau tidak tersedia lagi.
          </p>
          <button
            onClick={onNavigateBack}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Katalog Lowongan</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 pb-24 text-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Tombol Navigasi Kembali */}
        <div className="mb-6">
          <button
            onClick={onNavigateBack}
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Semua Lowongan</span>
          </button>

          {/* Bar Header Utama Lowongan Kerja */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
            <div className="flex items-start sm:items-center gap-5">
              {logoError || !job.company.logoUrl ? (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 shadow-sm">
                  <Building2 className="h-8 w-8" />
                </div>
              ) : (
                <img
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  loading="lazy"
                  onError={() => setLogoError(true)}
                  className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 object-cover shadow-sm bg-white"
                />
              )}

              <div>
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    {job.category}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                    {getJobTypeLabel(job.jobType)}
                  </span>
                  {job.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-950">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {job.title}
                </h1>

                <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-slate-500">
                  <strong className="font-bold text-slate-900">{job.company.name}</strong>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span className="font-bold text-amber-600">
                    {formatSalary(job.salaryMin, job.salaryMax, job.isSalaryDisclosed)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tombol Aksi Cepat Lamar Sisi Atas */}
            <div className="flex w-full md:w-auto items-center gap-3">
              {hasApplied ? (
                <div className="w-full sm:w-auto rounded-xl border border-emerald-300 bg-emerald-50 px-6 py-3 text-center text-xs sm:text-sm font-bold text-emerald-800 shadow-sm">
                  ✓ Lamaran Sudah Terkirim
                </div>
              ) : (
                <button
                  onClick={() => onNavigateToApply(job)}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-400 px-7 py-3 text-sm font-extrabold text-slate-950 shadow-md transition hover:bg-amber-300 active:scale-95"
                >
                  <span>Lamar Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Layout Dua Kolom: Rincian Pekerjaan (Kiri) & Sidebar Aksi Perusahaan (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Kolom Kiri: Spesifikasi & Deskripsi Pekerjaan */}
          <div className="space-y-6">
            {/* Kartu Ringkasan Metrik Cepat */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 font-black text-sm">
                  Rp
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500">Rentang Gaji</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {formatSalary(job.salaryMin, job.salaryMax, job.isSalaryDisclosed)}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500">Tipe & Pengalaman</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {getExperienceLevelLabel(job.experienceLevel)}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500">Penempatan Kerja</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {job.location}
                  </strong>
                </div>
              </div>
            </div>

            {/* Kotak Deskripsi Pekerjaan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-base sm:text-lg font-extrabold text-slate-900">
                <Briefcase className="h-5 w-5 text-amber-600" />
                <span>Deskripsi Pekerjaan</span>
              </h2>
              <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700">
                {job.description}
              </p>
            </div>

            {/* Kotak Kualifikasi & Persyaratan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="mb-5 border-b border-slate-100 pb-3 text-base sm:text-lg font-extrabold text-slate-900">
                Kualifikasi & Persyaratan
              </h2>
              <div className="space-y-3">
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-xs sm:text-sm leading-relaxed text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kotak Benefit & Fasilitas Perusahaan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="mb-5 border-b border-slate-100 pb-3 text-base sm:text-lg font-extrabold text-slate-900">
                Benefit & Fasilitas Perusahaan
              </h2>
              <div className="space-y-3">
                {job.benefits.map((ben, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Gift className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span className="text-xs sm:text-sm leading-relaxed text-slate-700">{ben}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Panel Tindakan & Profil Perusahaan */}
          <div className="space-y-6">
            {/* Kotak Ajakan Melamar */}
            <div className="rounded-2xl border-2 border-amber-400 bg-white p-6 shadow-md">
              <h3 className="mb-1 text-base sm:text-lg font-extrabold text-slate-900">
                Tertarik dengan Posisi Ini?
              </h3>
              <p className="mb-5 text-xs sm:text-sm leading-relaxed text-slate-600">
                Kirimkan berkas lamaran Anda sebelum batas waktu penutupan penerimaan kandidat.
              </p>

              {hasApplied ? (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-center text-xs sm:text-sm font-bold text-emerald-800 shadow-sm">
                  ✓ Lamaran Sudah Terkirim
                </div>
              ) : (
                <button
                  onClick={() => onNavigateToApply(job)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-slate-950 shadow-md transition hover:bg-amber-300 active:scale-95"
                >
                  <span>Lamar Pekerjaan Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {/* Indikator Batas Waktu Lamaran */}
              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                <Calendar className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  Batas Lamaran:{' '}
                  <strong className="text-slate-800">
                    {job.deadline ? formatDateID(job.deadline) : 'Aktif Sepanjang Tahun'}
                  </strong>
                </span>
              </div>
            </div>

            {/* Kotak Rincian Profil Perusahaan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3.5 flex items-center gap-3.5">
                <img
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  loading="lazy"
                  className="h-12 w-12 rounded-xl border border-slate-200 object-cover shadow-sm"
                />
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {job.company.name}
                  </h4>
                  <span className="text-xs font-medium text-slate-500">
                    {job.company.industry}
                  </span>
                </div>
              </div>

              <p className="mb-4 text-xs leading-relaxed text-slate-600">
                {job.company.description}
              </p>

              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  <span>Kunjungi Website Resmi</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

JobDetailPage.displayName = 'JobDetailPage';

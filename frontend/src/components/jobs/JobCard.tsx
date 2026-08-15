import React, { useState } from 'react';
import { MapPin, Clock, Sparkles, ArrowUpRight, Building2 } from 'lucide-react';
import type { Job } from '../../types/index.js';
import { formatSalary, getJobTypeLabel } from '../../utils/formatters.js';

/**
 * Kontrak Properti untuk Komponen JobCard
 */
interface JobCardProps {
  /** Objek data entitas lowongan kerja */
  job: Job;
  /** Callback untuk melihat rincian lengkap lowongan */
  onViewDetail: (job: Job) => void;
  /** Callback untuk membuka formulir pengajuan lamaran */
  onApply: (job: Job) => void;
  /** Indikator apakah pengguna aktif sudah pernah melamar pada lowongan ini */
  hasApplied?: boolean;
}

/**
 * Komponen Kartu Lowongan Kerja (JobCard)
 *
 * Menampilkan ringkasan informasi lowongan (perusahaan, posisi, lokasi, tipe kerja,
 * level pengalaman, estimasi gaji, dan cuplikan deskripsi).
 * Dioptimalkan dengan React.memo, utilitas eksternal, penanganan error gambar logo,
 * serta styling berbasis Tailwind CSS.
 */
export const JobCard: React.FC<JobCardProps> = React.memo(({
  job,
  onViewDetail,
  onApply,
  hasApplied = false,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
        job.isFeatured
          ? 'border-2 border-brandyellow bg-gradient-to-b from-amber-50/20 to-white'
          : 'border border-slate-200'
      }`}
    >
      {/* Lencana Unggulan (Featured Badge) */}
      {job.isFeatured && (
        <div className="absolute -top-3 right-5 inline-flex items-center gap-1 rounded-full bg-brandyellow px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm">
          <Sparkles className="h-3 w-3" />
          Featured
        </div>
      )}

      <div>
        {/* Header Perusahaan: Logo, Nama Perusahaan & Industri */}
        <div className="mb-4 flex items-center gap-3.5">
          {imageError || !job.company.logoUrl ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400">
              <Building2 className="h-6 w-6" />
            </div>
          ) : (
            <img
              src={job.company.logoUrl}
              alt={job.company.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
            />
          )}
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-slate-700">{job.company.name}</h4>
            <span className="truncate text-xs text-slate-400">{job.company.industry}</span>
          </div>
        </div>

        {/* Judul Posisi Pekerjaan */}
        <h3
          onClick={() => onViewDetail(job)}
          className="mb-2.5 cursor-pointer text-lg font-bold leading-snug text-slate-900 transition-colors duration-150 hover:text-amber-600 group-hover:text-amber-600"
        >
          {job.title}
        </h3>

        {/* Lencana Metadata (Lokasi, Tipe Kerja, Pengalaman) */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            {job.location}
          </span>

          <span className="inline-flex items-center gap-1 rounded-md bg-brandyellow-surface px-2 py-1 text-xs font-semibold text-brandyellow-text">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            {getJobTypeLabel(job.jobType)}
          </span>

          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
            {job.experienceLevel}
          </span>
        </div>

        {/* Kisaran Gaji */}
        <div className="mb-4 flex items-center gap-1.5 text-sm font-bold text-slate-900">
          <span className="text-xs font-extrabold text-amber-600">Rp</span>
          <span>{formatSalary(job.salaryMin, job.salaryMax, job.isSalaryDisclosed)}</span>
        </div>

        {/* Cuplikan Ringkasan Deskripsi Pekerjaan */}
        <p className="mb-5 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {job.description}
        </p>
      </div>

      {/* Tombol Aksi (Detail & Lamar) */}
      <div className="flex items-center gap-2.5 border-t border-slate-100 pt-4">
        <button
          onClick={() => onViewDetail(job)}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
        >
          <span>Detail</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
        </button>

        {hasApplied ? (
          <button
            disabled
            className="inline-flex flex-[1.2] cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500"
          >
            ✓ Terkirim
          </button>
        ) : (
          <button
            onClick={() => onApply(job)}
            className="inline-flex flex-[1.2] items-center justify-center rounded-lg bg-brandyellow px-3 py-2 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-brandyellow-dark active:scale-95"
          >
            Lamar Sekarang
          </button>
        )}
      </div>
    </div>
  );
});

JobCard.displayName = 'JobCard';

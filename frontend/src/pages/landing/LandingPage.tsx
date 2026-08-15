import React, { useState, useMemo } from 'react';
import { Briefcase, Frown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Job, JobFilterState } from '../../types/index.js';

// Komponen Sub-Seksi Landing Page
import { HeroSection } from '../../components/landing/HeroSection.js';
import { StatsSection } from '../../components/landing/StatsSection.js';
import { CategorySection } from '../../components/landing/CategorySection.js';
import { CompanySpotlight } from '../../components/landing/CompanySpotlight.js';
import { CtaBanner } from '../../components/landing/CtaBanner.js';
import { JobFilter } from '../../components/jobs/JobFilter.js';
import { JobCard } from '../../components/jobs/JobCard.js';

import type { DynamicCategory } from '../../hooks/useJobFilters.js';

/**
 * Kontrak Properti untuk Komponen LandingPage
 */
interface LandingPageProps {
  /** Daftar lowongan yang telah melalui proses penyaringan data */
  filteredJobs: Job[];
  /** Status memuat data lowongan dari backend */
  isLoading?: boolean;
  /** Daftar kategori dinamis yang diekstrak dari database */
  availableCategories?: DynamicCategory[];
  /** State parameter penyaringan aktif (kata kunci, kategori, tipe kerja, dll) */
  filters: JobFilterState;
  /** Callback untuk memperbarui kriteria filter */
  onFilterChange: (newFilters: Partial<JobFilterState>) => void;
  /** Callback untuk mereset seluruh parameter filter ke kondisi awal */
  onResetFilters: () => void;
  /** Callback pencarian cepat dari Hero Banner */
  onHeroSearch: (keyword: string, location: string, category: string) => void;
  /** Callback ketika pengguna memilih kategori tertentu */
  onSelectCategory: (category: string) => void;
  /** Callback ketika pengguna memilih profil perusahaan */
  onSelectCompany: (companyName: string) => void;
  /** Callback untuk membuka rincian deskripsi lowongan kerja */
  onViewJobDetail: (job: Job) => void;
  /** Callback untuk inisiasi proses melamar pekerjaan */
  onApplyJob: (job: Job) => void;
  /** Evaluasi status lamaran pengguna terhadap ID pekerjaan spesifik */
  hasUserApplied: (jobId: string) => boolean;
  /** Fungsi navigasi gulir otomatis (smooth scroll) menuju katalog lowongan */
  onScrollToJobs: () => void;
}

/**
 * Komponen Skeleton Loading untuk Kartu Lowongan Kerja
 */
const JobCardSkeleton: React.FC = () => (
  <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm border border-slate-200 animate-pulse">
    <div>
      <div className="mb-4 flex items-center gap-3.5">
        <div className="h-12 w-12 rounded-lg bg-slate-200" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-20 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="h-5 w-3/4 bg-slate-200 rounded mb-3" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-slate-200 rounded" />
        <div className="h-6 w-20 bg-slate-200 rounded" />
      </div>
      <div className="h-4 w-28 bg-slate-200 rounded mb-4" />
      <div className="space-y-1.5 mb-5">
        <div className="h-3 w-full bg-slate-200 rounded" />
        <div className="h-3 w-4/5 bg-slate-200 rounded" />
      </div>
    </div>
    <div className="flex gap-2.5 border-t border-slate-100 pt-4">
      <div className="h-8 flex-1 bg-slate-200 rounded-lg" />
      <div className="h-8 flex-[1.2] bg-slate-200 rounded-lg" />
    </div>
  </div>
);

/**
 * Komponen Utama Halaman Depan (Landing Page)
 */
export const LandingPage: React.FC<LandingPageProps> = React.memo(({
  filteredJobs,
  isLoading = false,
  availableCategories = [],
  filters,
  onFilterChange,
  onResetFilters,
  onHeroSearch,
  onSelectCategory,
  onSelectCompany,
  onViewJobDetail,
  onApplyJob,
  hasUserApplied,
  onScrollToJobs,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;

  const categoryNames = useMemo(
    () => availableCategories.map((c) => c.name),
    [availableCategories]
  );

  const popularTags = useMemo(() => {
    if (!filteredJobs || filteredJobs.length === 0) return [];
    const titles = Array.from(
      new Set(filteredJobs.map((j) => j.title.trim()).filter(Boolean))
    );
    return titles.slice(0, 5);
  }, [filteredJobs]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const catalogElem = document.getElementById('jobs-catalog');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="flex-1 bg-slate-50">
      {/* Seksi Pencarian Utama (Hero Section) */}
      <HeroSection
        onSearch={onHeroSearch}
        onSelectCategory={onSelectCategory}
        categories={categoryNames}
        popularTags={popularTags}
      />

      {/* Seksi Ringkasan Metrik & Statistik Platform */}
      <StatsSection />

      {/* Seksi Eksplorasi Kategori Industri */}
      <CategorySection
        selectedCategory={filters.category}
        onSelectCategory={onSelectCategory}
        categories={availableCategories}
      />

      {/* Seksi Katalog Lowongan Kerja & Sidebar Filter Interaktif */}
      <section id="jobs-catalog" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Seksi Katalog */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Katalog Lowongan Kerja
              </span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Peluang Karier Terbaru Hari Ini
            </h2>
          </div>

          {/* Tata Letak Dua Kolom: Sidebar Filter (Kiri) & Grid Kartu Lowongan (Kanan) */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Kolom Kiri: Panel Filter Interaktif */}
            <aside className="w-full">
              <JobFilter
                filters={filters}
                onFilterChange={onFilterChange}
                onResetFilters={onResetFilters}
                totalJobs={filteredJobs.length}
                categories={categoryNames}
              />
            </aside>

            {/* Kolom Kanan: Daftar Kartu Lowongan & Kontrol Navigasi Paginasi */}
            <div className="min-w-0">
              {isLoading ? (
                /* Skeleton Loading State Saat Fetching Data dari API */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <JobCardSkeleton key={idx} />
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                /* State Kosong (Empty State) */
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
                  <Frown className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Tidak Ada Lowongan yang Sesuai
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                    Coba sesuaikan kata kunci pencarian atau ubah filter tipe pekerjaan dan lokasi Anda.
                  </p>
                  <button
                    onClick={onResetFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-95"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : (
                <>
                  {/* Grid Kartu Lowongan Responsif */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {paginatedJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onViewDetail={onViewJobDetail}
                        onApply={onApplyJob}
                        hasApplied={hasUserApplied(job.id)}
                      />
                    ))}
                  </div>

                  {/* Panel Navigasi Paginasi */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
                      <div className="text-xs text-slate-500">
                        Menampilkan halaman <span className="font-semibold text-slate-900">{currentPage}</span> dari{' '}
                        <span className="font-semibold text-slate-900">{totalPages}</span> (Total {filteredJobs.length} lowongan)
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                          disabled={currentPage === 1}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>Sebelumnya</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`h-8 w-8 rounded-lg text-xs font-bold transition ${
                                currentPage === pageNum
                                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <span>Selanjutnya</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Seksi Profil & Sorotan Mitra Perusahaan */}
      <CompanySpotlight onSelectCompany={onSelectCompany} />

      {/* Seksi Ajakan Bertindak (Call to Action / CTA Banner) */}
      <CtaBanner onScrollToJobs={onScrollToJobs} />
    </main>
  );
});

LandingPage.displayName = 'LandingPage';

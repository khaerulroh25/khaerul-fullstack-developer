import React, { useState, useEffect, useMemo } from 'react';
import { Filter, RotateCcw, MapPin, Search, X } from 'lucide-react';
import type { JobFilterState } from '../../types/index.js';
import { CATEGORIES_LIST } from '../../data/dummyData.js';

/**
 * Daftar opsi statis untuk tipe pekerjaan (Job Types)
 * Didefinisikan di level modul untuk mencegah re-alokasi memori saat re-render
 */
const JOB_TYPE_OPTIONS = [
  { value: '', label: 'Semua Tipe' },
  { value: 'FULL_TIME', label: 'Full-Time' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'REMOTE', label: '100% Remote' },
  { value: 'CONTRACT', label: 'Kontrak' },
  { value: 'PART_TIME', label: 'Part-Time' },
  { value: 'INTERNSHIP', label: 'Magang (Internship)' },
] as const;

/**
 * Daftar opsi statis untuk tingkat pengalaman kerja
 */
const EXPERIENCE_LEVEL_OPTIONS = [
  { value: '', label: 'Semua Level' },
  { value: 'ENTRY_LEVEL', label: 'Entry Level / Fresh Grad' },
  { value: 'JUNIOR', label: 'Junior (1-2 Tahun)' },
  { value: 'MID_LEVEL', label: 'Mid-Level (2-4 Tahun)' },
  { value: 'SENIOR', label: 'Senior (4+ Tahun)' },
  { value: 'LEAD', label: 'Lead / Manager (5+ Tahun)' },
] as const;

/**
 * Kontrak Properti untuk Komponen JobFilter
 */
interface JobFilterProps {
  /** Nilai kriteria filter yang sedang aktif */
  filters: JobFilterState;
  /** Callback untuk memperbarui kriteria filter sebagian (partial) */
  onFilterChange: (filters: Partial<JobFilterState>) => void;
  /** Callback untuk mengembalikan seluruh filter ke nilai default */
  onResetFilters: () => void;
  /** Total kuantitas lowongan yang lolos penyaringan */
  totalJobs: number;
}

/**
 * Komponen Panel Penyaringan Lowongan Kerja (JobFilter Sidebar)
 *
 * Menyediakan antarmuka multi-filter komprehensif (kata kunci, tipe pekerjaan, level pengalaman,
 * kategori industri, lokasi kerja dengan mekanisme debounce, dan toggle remote).
 * Dioptimalkan dengan React.memo, debounce timer mandiri, dan styling Tailwind CSS sticky sidebar.
 */
export const JobFilter: React.FC<JobFilterProps> = React.memo(({
  filters,
  onFilterChange,
  onResetFilters,
  totalJobs,
}) => {
  // State lokal untuk input teks agar pengetikan instan dan lancar
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [localLocation, setLocalLocation] = useState(filters.location || '');

  // Sinkronisasi state lokal saat props filter dari luar berubah
  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    setLocalLocation(filters.location || '');
  }, [filters.location]);

  // Mekanisme debounce input teks (300ms) untuk mencegah eksekusi filter berlebih per keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== (filters.search || '')) {
        onFilterChange({ search: localSearch });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, onFilterChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localLocation !== (filters.location || '')) {
        onFilterChange({ location: localLocation });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localLocation, filters.location, onFilterChange]);

  // Menghitung jumlah filter yang sedang aktif
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.jobType) count++;
    if (filters.experienceLevel) count++;
    if (filters.location) count++;
    if (filters.isRemoteOnly) count++;
    return count;
  }, [filters]);

  return (
    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header Panel Filter & Tombol Reset */}
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">
            Filter Lowongan
            {activeFiltersCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                {activeFiltersCount}
              </span>
            )}
          </h3>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 transition hover:text-amber-700"
            title="Reset seluruh parameter filter"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Daftar Kolom Formulir Penyaringan */}
      <div className="space-y-4">
        {/* Filter Kata Kunci Pencarian */}
        <div>
          <label htmlFor="filter-search" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Kata Kunci / Posisi
          </label>
          <div className="relative">
            <input
              id="filter-search"
              type="text"
              placeholder="Cari judul, skill, perusahaan..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-7 text-xs font-medium text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  onFilterChange({ search: '' });
                }}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tipe Pekerjaan */}
        <div>
          <label htmlFor="filter-job-type" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Tipe Pekerjaan
          </label>
          <select
            id="filter-job-type"
            value={filters.jobType}
            onChange={(e) => onFilterChange({ jobType: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          >
            {JOB_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tingkat Pengalaman */}
        <div>
          <label htmlFor="filter-exp-level" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Tingkat Pengalaman
          </label>
          <select
            id="filter-exp-level"
            value={filters.experienceLevel}
            onChange={(e) => onFilterChange({ experienceLevel: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          >
            {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Kategori Industri */}
        <div>
          <label htmlFor="filter-category" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Kategori Industri
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          >
            <option value="">Semua Kategori</option>
            {CATEGORIES_LIST.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Lokasi Kerja */}
        <div>
          <label htmlFor="filter-location" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Lokasi Kerja
          </label>
          <div className="relative">
            <input
              id="filter-location"
              type="text"
              placeholder="Contoh: Jakarta, Bandung..."
              value={localLocation}
              onChange={(e) => setLocalLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-7 text-xs font-medium text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
            <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            {localLocation && (
              <button
                type="button"
                onClick={() => {
                  setLocalLocation('');
                  onFilterChange({ location: '' });
                }}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Toggle Khusus Lowongan Remote */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            type="checkbox"
            id="remoteOnly"
            checked={filters.isRemoteOnly || false}
            onChange={(e) => onFilterChange({ isRemoteOnly: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-amber-500 accent-amber-500 focus:ring-amber-400"
          />
          <label
            htmlFor="remoteOnly"
            className="cursor-pointer select-none text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Hanya Lowongan Remote
          </label>
        </div>
      </div>

      {/* Footer Info Total Lowongan Terfilter */}
      <div className="mt-5 border-t border-slate-100 pt-3.5 text-center text-xs text-slate-500">
        Menampilkan <strong className="font-bold text-slate-800">{totalJobs}</strong> lowongan relevan
      </div>
    </div>
  );
});

JobFilter.displayName = 'JobFilter';

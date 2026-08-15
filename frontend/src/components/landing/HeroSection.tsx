import React, { useState } from 'react';
import { Search, MapPin, Briefcase, ArrowRight, TrendingUp } from 'lucide-react';

/**
 * Kontrak Properti untuk Komponen HeroSection
 */
interface HeroSectionProps {
  /** Callback untuk menjalankan pencarian berdasarkan kata kunci, lokasi, dan kategori */
  onSearch: (keyword: string, location: string, category: string) => void;
  /** Callback ketika pengguna memilih kategori tertentu */
  onSelectCategory?: (category: string) => void;
  /** Daftar kategori unik dinamis dari database */
  categories?: string[];
  /** Tag pencarian populer yang diekstrak dinamis dari data lowongan di database */
  popularTags?: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({
  onSearch,
  categories = [],
  popularTags = [],
}) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  // Handler pengiriman form pencarian utama
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword.trim(), location.trim(), category);
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 py-16 sm:py-20 text-white">
      {/* Efek Visual Latar Belakang (Ambient Glows) */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Lencana Informasi Platform */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-amber-300">
              #1 Platform Rekrutmen Terpercaya di Indonesia
            </span>
          </div>

          {/* Judul Utama (Headline) */}
          <h1 className="mb-5 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
            Temukan Karier Impian & Rekrut{' '}
            <span className="text-amber-400">Talenta Terbaik</span> di Indonesia
          </h1>

          <p className="mx-auto mb-9 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            Akses ribuan lowongan kerja terverifikasi dari startup teknologi terkemuka,
            korporasi multinasional, hingga BUMN dengan transparansi gaji dan proses rekrutmen live.
          </p>

          {/* Formulir Pencarian Multi-Kriteria */}
          <form
            onSubmit={handleFormSubmit}
            className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-2 rounded-2xl bg-white p-2.5 shadow-2xl"
          >
            {/* Input Kata Kunci / Posisi */}
            <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 border-b md:border-b-0 md:border-r border-slate-100">
              <Search className="h-5 w-5 text-amber-500 shrink-0" />
              <input
                type="text"
                placeholder="Posisi, skill, perusahaan..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>

            {/* Input Lokasi Kerja */}
            <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 border-b md:border-b-0 md:border-r border-slate-100">
              <MapPin className="h-5 w-5 text-amber-500 shrink-0" />
              <input
                type="text"
                placeholder="Semua Lokasi (cth: Jakarta)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>

            {/* Dropdown Kategori Industri */}
            <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5">
              <Briefcase className="h-5 w-5 text-amber-500 shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full cursor-pointer bg-transparent text-xs sm:text-sm font-medium text-slate-800 outline-none"
              >
                <option value="">Semua Kategori</option>
                {categories.map((catName) => (
                  <option key={catName} value={catName} className="text-slate-900">
                    {catName}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Eksekusi Pencarian */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-md transition hover:bg-amber-300 active:scale-95"
            >
              <span>Cari Lowongan</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Tag Pintasan Pencarian Populer Dinamis */}
          {popularTags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                <span>Populer:</span>
              </div>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setKeyword(tag);
                    onSearch(tag, location.trim(), category);
                  }}
                  className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300 transition hover:border-amber-400 hover:text-amber-400 active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

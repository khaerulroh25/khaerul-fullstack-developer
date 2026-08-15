import React, { useMemo } from 'react';
import {
  Code,
  Briefcase,
  Server,
  Palette,
  BarChart3,
  CreditCard,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { DynamicCategory } from '../../hooks/useJobFilters.js';

/**
 * Kontrak Properti untuk Komponen CategorySection
 */
interface CategorySectionProps {
  /** Nama kategori yang sedang aktif/terpilih pada filter */
  selectedCategory: string;
  /** Callback untuk memilih atau membatalkan pilihan kategori */
  onSelectCategory: (category: string) => void;
  /** Daftar kategori dinamis dari database */
  categories: DynamicCategory[];
}

/**
 * Pemetaan Ikon Kategori Dinamis
 */
const renderCategoryIcon = (categoryName: string) => {
  const lower = categoryName.toLowerCase();
  if (lower.includes('software') || lower.includes('engineer') || lower.includes('developer') || lower.includes('tech')) {
    return <Code className="h-6 w-6" />;
  }
  if (lower.includes('product') || lower.includes('project') || lower.includes('management')) {
    return <Briefcase className="h-6 w-6" />;
  }
  if (lower.includes('devops') || lower.includes('cloud') || lower.includes('infra') || lower.includes('system')) {
    return <Server className="h-6 w-6" />;
  }
  if (lower.includes('design') || lower.includes('creative') || lower.includes('ui') || lower.includes('ux')) {
    return <Palette className="h-6 w-6" />;
  }
  if (lower.includes('data') || lower.includes('analytics') || lower.includes('bi')) {
    return <BarChart3 className="h-6 w-6" />;
  }
  if (lower.includes('bank') || lower.includes('finance') || lower.includes('keuangan')) {
    return <CreditCard className="h-6 w-6" />;
  }
  return <Layers className="h-6 w-6" />;
};

/**
 * Komponen Seksi Eksplorasi Kategori Industri
 * Menampilkan 4 Kategori Teratas dengan jumlah lowongan terbanyak di platform
 */
export const CategorySection: React.FC<CategorySectionProps> = React.memo(({
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  // Ambil hanya Top 4 kategori dengan jumlah lowongan terbanyak
  const topCategories = useMemo(() => {
    if (!categories || categories.length === 0) {
      return [];
    }
    // Filter kategori yang memiliki lowongan dan ambil 4 teratas
    const filtered = categories.filter((c) => c.count > 0);
    return (filtered.length > 0 ? filtered : categories).slice(0, 4);
  }, [categories]);

  if (topCategories.length === 0) {
    return null;
  }

  return (
    <section id="categories" className="border-b border-slate-200 bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Seksi Kategori */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Paling Banyak Dicari
              </span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Kategori Terpopuler Saat Ini
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-slate-500">
            Kategori pekerjaan dengan peluang karier dan jumlah lowongan aktif terbanyak.
          </p>
        </div>

        {/* Grid Kartu Kategori Teratas (Top 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topCategories.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`group flex items-center gap-4 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 active:scale-95 ${
                  isSelected
                    ? 'border-2 border-amber-400 bg-slate-950 text-white shadow-lg ring-2 ring-amber-400/20'
                    : 'border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-amber-300 hover:shadow-md'
                }`}
              >
                {/* Ikon Kategori */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-amber-50 text-amber-600 group-hover:bg-amber-100'
                  }`}
                >
                  {renderCategoryIcon(cat.name)}
                </div>

                {/* Judul & Total Lowongan */}
                <div className="min-w-0 flex-1">
                  <h4 className={`truncate text-sm font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {cat.name}
                  </h4>
                  <div
                    className={`mt-1 flex items-center gap-1 text-xs font-semibold ${
                      isSelected ? 'text-amber-300' : 'text-slate-500'
                    }`}
                  >
                    <span>{cat.count} Lowongan Aktif</span>
                    <ArrowRight className="h-3 w-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
});

CategorySection.displayName = 'CategorySection';

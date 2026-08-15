import React from 'react';
import {
  Code,
  Briefcase,
  Server,
  Palette,
  BarChart3,
  CreditCard,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES_LIST } from '../../data/dummyData.js';

/**
 * Kontrak Properti untuk Komponen CategorySection
 */
interface CategorySectionProps {
  /** Nama kategori yang sedang aktif/terpilih pada filter */
  selectedCategory: string;
  /** Callback untuk memilih atau membatalkan pilihan kategori */
  onSelectCategory: (category: string) => void;
}

/**
 * Pemetaan Ikon Kategori Statis
 * Didefinisikan di luar komponen untuk mencegah re-evaluasi fungsi pada setiap render
 */
const renderCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case 'Software Engineering':
      return <Code className="h-6 w-6" />;
    case 'Product Management':
      return <Briefcase className="h-6 w-6" />;
    case 'DevOps & Cloud':
      return <Server className="h-6 w-6" />;
    case 'Design & Creative':
      return <Palette className="h-6 w-6" />;
    case 'Data & Analytics':
      return <BarChart3 className="h-6 w-6" />;
    case 'Banking & Finance':
      return <CreditCard className="h-6 w-6" />;
    default:
      return <Layers className="h-6 w-6" />;
  }
};

/**
 * Komponen Seksi Eksplorasi Kategori Industri
 *
 * Menampilkan kartu kategori pekerjaan populer beserta jumlah lowongan aktif.
 * Mengaktifkan penyaringan cepat hanya dengan satu kali klik.
 * Dioptimalkan dengan React.memo dan styling Tailwind CSS responsif.
 */
export const CategorySection: React.FC<CategorySectionProps> = React.memo(({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="border-b border-slate-200 bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Seksi Kategori */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Eksplorasi Industri
              </span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Kategori Lowongan Terpopuler
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-slate-500">
            Temukan lowongan yang sesuai dengan minat dan spesialisasi keahlian karier Anda.
          </p>
        </div>

        {/* Grid Kartu Kategori */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`flex flex-col justify-between rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 active:scale-95 ${
                  isSelected
                    ? 'border-2 border-amber-400 bg-slate-950 text-white shadow-lg'
                    : 'border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-amber-300 hover:shadow-md'
                }`}
              >
                {/* Ikon Kategori */}
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-amber-50 text-amber-600 group-hover:bg-amber-100'
                  }`}
                >
                  {renderCategoryIcon(cat.name)}
                </div>

                {/* Judul & Total Lowongan */}
                <div>
                  <h4 className={`text-sm font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {cat.name}
                  </h4>
                  <div
                    className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                      isSelected ? 'text-amber-300' : 'text-slate-500'
                    }`}
                  >
                    <span>{cat.count} Lowongan</span>
                    <ArrowRight className="h-3 w-3" />
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

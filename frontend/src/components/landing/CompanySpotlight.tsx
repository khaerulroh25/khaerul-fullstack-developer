import React from 'react';
import { Building, Star, ArrowUpRight } from 'lucide-react';
import { DUMMY_COMPANIES } from '../../data/dummyData.js';

/**
 * Kontrak Properti untuk Komponen CompanySpotlight
 */
interface CompanySpotlightProps {
  /** Callback saat pengguna memilih perusahaan untuk menyaring lowongan terkait */
  onSelectCompany: (companyName: string) => void;
}

/**
 * Komponen Seksi Profil & Sorotan Mitra Perusahaan
 *
 * Menampilkan perusahaan terkemuka beserta rating kepuasan, lokasi, dan total posisi aktif.
 * Mengarahkan pencarian otomatis sesuai nama perusahaan yang diklik.
 * Dioptimalkan dengan React.memo dan styling Tailwind CSS responsif.
 */
export const CompanySpotlight: React.FC<CompanySpotlightProps> = React.memo(({
  onSelectCompany,
}) => {
  return (
    <section id="companies" className="border-b border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Seksi Sorotan Perusahaan */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Mitra Perusahaan
              </span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Perusahaan Terkemuka yang Sedang Merekrut
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-slate-500">
            Temukan kultur kerja terbaik dan jenjang karier mapan bersama perusahaan idaman.
          </p>
        </div>

        {/* Grid Kartu Profil Perusahaan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_COMPANIES.map((company) => (
            <div
              key={company.id}
              onClick={() => onSelectCompany(company.name)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-md cursor-pointer"
            >
              <div>
                {/* Header Profil Perusahaan (Logo, Nama, Rating) */}
                <div className="mb-4 flex items-center gap-3.5">
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {company.name}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-0.5 font-bold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        <span>{company.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{company.location.split(',')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Singkat Profil Perusahaan */}
                <p className="mb-5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {company.description}
                </p>
              </div>

              {/* Footer Kartu & Indikator Lowongan Aktif */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                  {company.openJobsCount} Lowongan Aktif
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-amber-600 transition-colors">
                  <span>Lihat Posisi</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

CompanySpotlight.displayName = 'CompanySpotlight';
